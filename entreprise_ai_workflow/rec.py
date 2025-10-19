import os
import json
import pandas as pd
import nest_asyncio
from together import Together

# === Setup ===
nest_asyncio.apply()

os.environ["TOGETHER_API_KEY"] = "003654e5a64747799856bf5ae54779e595f8a50b042240299dc5f2f5486fb40f"
together_client = Together()

# === Simple LLM wrapper ===
class TogetherChat:
    def __init__(self, model="meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo"):
        self.model = model

    def __call__(self, system_prompt, user_prompt):
        try:
            resp = together_client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                stream=False,
                max_tokens=250,
                temperature=0.6,
            )
            return resp.choices[0].message.content.strip()
        except Exception as e:
            return f"(⚠️ LLM unavailable — fallback summary). Error: {e}"


# === Portfolio-based Recommender ===
class PortfolioRecommender:
    def __init__(self, csv_path, investor_profile, portfolio):
        self.df = pd.read_csv(csv_path)
        self.profile = investor_profile
        self.portfolio = portfolio
        self.llm = TogetherChat()
        self.prepare_data()

    def prepare_data(self):
        df = self.df.copy()
        # Compute key ratios
        df["ebitda_margin"] = df["ebitda"] / df["revenue"]
        df["net_margin"] = df["net_income"] / df["revenue"]
        df["debt_ratio"] = df["total_liabilities"] / df["total_assets"]
        df["gross_margin"] = df["gross_margin_pct"] / 100

        # Financial scoring
        df["growth_score"] = (df["gross_margin"] + df["ebitda_margin"] + df["net_margin"]).fillna(0)
        df["stability_score"] = (1 - df["debt_ratio"]).clip(0, 1)
        df["runway_score"] = (df["runway_months"] / 12).clip(0, 1)
        self.df = df

    def filter_data(self):
        """Keep only startups in the same sector(s) and region(s) as the investor's portfolio."""
        sectors = [p["sector"] for p in self.portfolio]
        countries = [p["country"] for p in self.portfolio]

        # ✅ Keep startups that match sector AND country
        df = self.df[
            (self.df["sector"].isin(sectors)) &
            (self.df["country"].isin(countries))
        ]
        return df

    def recommend(self):
        df = self.filter_data().copy()

        if df.empty:
            return pd.DataFrame(), "(No startups found in the same sector and region.)"

        # Quantitative scoring (same)
        df["score_total"] = (
            0.5 * df["growth_score"] +
            0.3 * df["stability_score"] +
            0.2 * df["runway_score"]
        )

        top3 = df.sort_values("score_total", ascending=False).head(3)

        system_prompt = "You are a professional financial analyst. Summarize clearly."
        user_prompt = f"""
    Investor profile:
    {json.dumps(self.profile, indent=2)}

    Current portfolio:
    {json.dumps(self.portfolio, indent=2)}

    Top 3 recommended startups (same sector and region):
    {top3[['name','sector','country','score_total']].to_string(index=False)}

    Explain in 2-3 sentences why these startups are aligned with the investor’s focus 
    on the same sector and region, considering risk and growth potential.
    """
        summary = self.llm(system_prompt, user_prompt)

        return top3[["name", "sector", "country", "score_total"]], summary



# === Example run ===
if __name__ == "__main__":
    investor_profile = {
        "name": "Marie Dupont",
        "risk_tolerance": "Balanced",
        "preferred_sectors": ["Fintech", "HealthTech"],
        "total_capital": 1_000_000
    }

    portfolio = [
        {"name": "Stripe", "sector": "Fintech", "country": "US", "allocation_pct": 30},
    ]

    agent = PortfolioRecommender(r"./startups_financials.csv", investor_profile, portfolio)
    top3, summary = agent.recommend()

    # === Print results nicely ===
    print("\n=== 🧠 TOP 3 STARTUP RECOMMENDATIONS ===")
    print(top3.to_string(index=False, formatters={
        "score_total": "{:.3f}".format,
        "expected_return_pct": "{:.1f}%".format,
        "suggested_allocation_pct": "{:.1f}%".format,
    }))
    print("\n📊 AI Portfolio Summary:\n")
    print(summary)
