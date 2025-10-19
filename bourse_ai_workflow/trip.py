"""
stock_search_agent_with_together.py

Requirements:
  pip install requests beautifulsoup4 playwright nest_asyncio
  python -m playwright install

Environment variables (required):
  SERPER_API_KEY    - Serper (google.serper.dev) API key
  TOGETHER_API_KEY  - Together AI API key (SDK dependent)

This module defines:
 - TogetherChat: a small wrapper for the Together chat API (sync + async)
 - Serper search helper
 - fetch_text: Playwright dynamic scrape with requests fallback
 - generate_subqueries: ask the LLM for 3-4 focused queries
 - summarize_with_llm: ask the LLM to produce a machine-readable summary
 - search_agent_stock: orchestrator that returns summaries for each top link
"""

import os
import asyncio
import logging
import nest_asyncio
import requests
from typing import List, Dict, Any, Optional
from bs4 import BeautifulSoup
from dotenv import load_dotenv
load_dotenv()

# allow nested event loops (useful in Jupyter)
nest_asyncio.apply()

# Optional: import Playwright for dynamic scraping
try:
    from playwright.async_api import async_playwright
    PLAYWRIGHT_AVAILABLE = True
except Exception:
    PLAYWRIGHT_AVAILABLE = False

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("stock_search_agent")

# === CONFIG: read API keys from env (DO NOT hard-code keys) ===
SERPER_API_KEY = os.environ.get("SERPER_API_KEY")
TOGETHER_API_KEY = os.environ.get("TOGETHER_API_KEY")

if not SERPER_API_KEY:
    logger.warning("SERPER_API_KEY is not set. Serper searches will fail unless you set this env var.")

if not TOGETHER_API_KEY:
    logger.warning("TOGETHER_API_KEY is not set. Together LLM calls will fail unless you set this env var.")

# === Together SDK wrapper (may need adjustment if SDK differs) ===
try:
    from together import Together  # type: ignore
except Exception as e:
    Together = None
    logger.warning(
        "Couldn't import Together SDK (from together import Together). "
        "Install the SDK or adjust the import per Together docs. Error: %s", e
    )

class TogetherChat:
    """
    Thin wrapper around Together chat API.
    - reads API key from env or accepts client via constructor
    - provides sync _call_ and async aget methods
    """
    def __init__(self, model: str = "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo", client: Optional[Any] = None):
        self.model = model
        if client is not None:
            self.client = client
        else:
            if Together is None:
                raise RuntimeError("Together SDK not available. Install it and/or provide a client.")
            # try to initialize - SDKs differ; some accept api_key param:
            try:
                self.client = Together(api_key=TOGETHER_API_KEY)
            except TypeError:
                # fallback - SDK reads env var internally
                self.client = Together()

    def _format_messages(self, messages: List[Dict[str, str]]) -> List[Dict[str, str]]:
        """Normalize messages: accept {'type':..} or {'role':..} and return [{'role','content'}]."""
        formatted = []
        for m in messages:
            role = m.get("role") or m.get("type") or "user"
            role = role.lower()
            formatted.append({"role": role, "content": m.get("content", "")})
        return formatted

    def __call__(self, messages: List[Dict[str, str]]) -> str:
        """Synchronous API call. Returns assistant text."""
        formatted = self._format_messages(messages)
        resp = self.client.chat.completions.create(model=self.model, messages=formatted, stream=False)
        # defensive extraction depending on SDK response shape:
        try:
            return resp.choices[0].message.content.strip()
        except Exception:
            # try alternative shapes
            try:
                return str(resp).strip()
            except Exception:
                return ""

    async def aget(self, messages: List[Dict[str, str]]) -> str:
        """Async wrapper that runs sync call in a threadpool."""
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, self.__call__, messages)

# === Serper search helper (uses env key) ===
def search_serper(query: str, api_key: Optional[str] = None, num_results: int = 10) -> List[str]:
    """Return a list of organic links from Serper (google.serper.dev)."""
    api_key = api_key or SERPER_API_KEY
    if not api_key:
        logger.error("SERPER_API_KEY missing; search_serper will return [].")
        return []
    url = "https://google.serper.dev/search"
    headers = {"X-API-KEY": api_key, "Content-Type": "application/json"}
    payload = {"q": query, "num": num_results}
    try:
        resp = requests.post(url, headers=headers, json=payload, timeout=15)
        resp.raise_for_status()
        data = resp.json()
        organic = data.get("organic", [])
        links = [item.get("link") for item in organic if item.get("link")]
        logger.info("Serper returned %d links for query: %s", len(links), query)
        return links
    except Exception as e:
        logger.warning("Serper search failed for query '%s': %s", query, e)
        return []

# === fetch_text: Playwright dynamic fetch with requests fallback ===
async def fetch_text(url: str, use_playwright: bool = True, timeout: int = 60) -> str:
    """Return visible text extracted from URL. Uses Playwright (async) if available else requests."""
    try:
        if use_playwright and PLAYWRIGHT_AVAILABLE:
            try:
                async with async_playwright() as p:
                    browser = await p.chromium.launch(headless=True)
                    page = await browser.new_page()
                    await page.goto(url, timeout=timeout * 1000)
                    html = await page.content()
                    await browser.close()
                return BeautifulSoup(html, "html.parser").get_text(separator="\n", strip=True)
            except Exception as e_play:
                logger.debug("Playwright fetch failed for %s: %s", url, e_play)
                # fall through to requests fallback
        # fallback
        resp = requests.get(url, timeout=10, headers={"User-Agent": "Mozilla/5.0"})
        resp.raise_for_status()
        return BeautifulSoup(resp.text, "html.parser").get_text(separator="\n", strip=True)
    except Exception as e:
        logger.warning("Failed to fetch text from %s: %s", url, e)
        return ""

# === small LLM helper to support sync/async callables ===
async def _call_llm(llm_callable, messages: List[Dict[str, str]]) -> str:
    """Call llm_callable which can be sync (callable) or async (coroutine function)."""
    if asyncio.iscoroutinefunction(llm_callable):
        return await llm_callable(messages)
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, llm_callable, messages)

# === parse simple list output from LLM ===
def parse_list_text(text: str, max_items: int = 4) -> List[str]:
    lines = []
    for raw in text.splitlines():
        s = raw.strip().lstrip("-•*0123456789. ")
        if s:
            lines.append(s)
    if len(lines) < max_items:
        for part in text.split(";"):
            s = part.strip()
            if s and s not in lines:
                lines.append(s)
            if len(lines) >= max_items:
                break
    return lines[:max_items]
# === generate 3-4 focused subqueries in English ===
async def generate_subqueries(llm_callable, user_topic: str, n: int = 4) -> List[str]:
    system = {"role": "system", "content": "You are a financial assistant. Generate concise search queries in English."}
    user = {
        "role": "user",
        "content": (
            f"The user wants the latest information about: {user_topic}\n"
            "Produce a short list (one line per item) of 3-4 focused web queries covering: "
            "company performance, economic factors, political events, market psychology, external shocks, social media, and today's news."
        )
    }
    raw = await _call_llm(llm_callable, [system, user])
    queries = parse_list_text(raw, max_items=n)
    if not queries:
        # fallback naive queries in English
        queries = [
            f"{user_topic} company performance today",
            f"{user_topic} economic news today",
            f"{user_topic} social media reactions today",
        ][:n]
    logger.info("Generated %d subqueries", len(queries))
    return queries

# === ask LLM to summarize in English and return structured text ===
async def summarize_with_llm(llm_callable, subquery: str, url: str, text: str, max_chars: int = 15000) -> str:
    excerpt = text[:max_chars]
    system = {"role": "system", "content": "You are a market analyst assistant. Produce machine-readable summaries in English."}
    user = {
        "role": "user",
        "content": (
            f"Query: {subquery}\nSource: {url}\n\nWeb content (truncated):\n{excerpt}\n\n"
            "Produce a concise, machine-readable summary with these fields: "
            "title, date (YYYY-MM-DD or empty if unknown), stock symbols (comma-separated), companies, "
            "key facts (3-6 bullets), sentiment (bullish/neutral/bearish) with short explanation, "
            "impact score (float between -1.0 and 1.0). Keep output short and analyzable."
        )
    }
    raw = await _call_llm(llm_callable, [system, user])
    return raw

# === orchestration: generate subqueries, search, scrape, summarize ===
async def search_agent_stock(user_topic: str, llm_callable, serper_api_key: Optional[str] = None,
                             max_links: int = 3, n_subqueries: int = 4) -> List[Dict[str, Any]]:
    serper_api_key = serper_api_key or SERPER_API_KEY
    subqueries = await generate_subqueries(llm_callable, user_topic, n=n_subqueries)
    results: List[Dict[str, Any]] = []
    for sub in subqueries:
        links = search_serper(sub, api_key=serper_api_key, num_results=10)
        if not links:
            logger.info("No links for subquery: %s", sub)
            continue
        for link in links[:max_links]:
            logger.info("Fetching %s for subquery: %s", link, sub)
            content = await fetch_text(link)
            if not content:
                logger.info("No content from %s", link)
                continue
            summary = await summarize_with_llm(llm_callable, sub, link, content)
            results.append({"query": sub, "link": link, "summary": summary})
    return results

# === orchestration: generate subqueries, search, scrape, summarize (English) ===
if __name__ == "__main__":
    async def main_demo():
        try:
            llm = TogetherChat()           # sync callable via llm.__call__
        except Exception as e:
            logger.error("TogetherChat initialization failed: %s", e)
            return

        llm_async = llm.aget
        topic = "IBM stock performance and recent news"
        results = await search_agent_stock(topic, llm_async, serper_api_key=SERPER_API_KEY, max_links=2, n_subqueries=3)

        for r in results:
            print("=== SUBQUERY ===")
            print("Query:", r["query"])
            print("Link:", r["link"])
            print("Summary (raw from LLM):\n", r["summary"])
            print()

    asyncio.run(main_demo())
    print("hello world")
