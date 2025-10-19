"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useEffect, useState } from "react";

type HashContextType = {
  connected: boolean;
  accountId: string | null;
  pairingData: any | null;
  initialized: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
};

const HashContext = createContext<HashContextType | undefined>(undefined);

export const useHash = () => useContext(HashContext);

export const HashProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hc, setHc] = useState<any | null>(null);
  const [pairingData, setPairingData] = useState<any | null>(null);
  const [connected, setConnected] = useState(false);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initHashConnect = async () => {
      try {
        // dynamic-import both packages in the browser-only runtime
        const [mod, sdk] = await Promise.all([import("hashconnect"), import("@hashgraph/sdk")]);
        const HashConnect = (mod as any).HashConnect || (mod as any).default || null;
        if (!HashConnect) return;

        const LedgerId = (sdk as any).LedgerId || (sdk as any).ledgerId || null;
        // choose testnet by default; fall back to string if LedgerId not available
        const ledger = LedgerId?.TESTNET || (sdk as any).Testnet || "testnet";

        const metadata = {
          name: "AtlasWealth",
          description: "AtlasWealth dApp",
          icons: ["/images/logo/logo-icon.svg"],
          url: typeof window !== "undefined" ? window.location.origin : "",
        };

        // projectId should be set for WalletConnect; use a safe default
        const projectId = "atlaswealth-demo";

        const hashconnect = new HashConnect(ledger, projectId, metadata, false);

        // Try init in a compatibility-friendly way
        try {
          if (typeof hashconnect.init === "function") await hashconnect.init();
        } catch {
          try {
            // some versions accept metadata in init
            if (typeof hashconnect.init === "function") await hashconnect.init(metadata);
          } catch {
            // ignore
          }
        }

        if (!mounted) return;
        setHc(hashconnect);

        // restore saved pairing if present
        const saved = localStorage.getItem("hashconnect_pairings");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setPairingData(parsed);
            if (parsed?.topic && parsed?.accountIds?.length) {
              setConnected(true);
              setAccountId(parsed.accountIds[0]);
            }
          } catch (err) {
            console.warn("Failed to parse saved HashConnect pairing", err);
          }
        }

        // listen for pairing events
        if (hashconnect.pairingEvent && typeof hashconnect.pairingEvent.on === "function") {
          hashconnect.pairingEvent.on((pairing: any) => {
            setConnected(true);
            if (pairing.accountIds && pairing.accountIds.length) {
              setAccountId(pairing.accountIds[0]);
              try {
                localStorage.setItem("hashconnect_pairings", JSON.stringify(pairing));
                setPairingData(pairing);
              } catch {}
            }
          });
        }
      } catch (err) {
        console.warn("HashConnect init error", err);
      }
    };

    (async () => {
      try {
        await initHashConnect();
      } finally {
        if (mounted) setInitialized(true);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const connect = async () => {
    if (!hc) throw new Error("HashConnect not initialized");

    // Try a variety of method names used across hashconnect versions
    const tryMethods = [
      "connect",
      "connectToLocalWallet",
      "connectToExtension",
      "initiatePairing",
      "pair",
      "pairing",
      "createPairing",
      "startPairing",
      // pairing helpers
      "generatePairingString",
      "openPairingModal",
      "openModal",
      "open",
      "findLocalWallets",
      "_connectToIframeParent",
    ];

    let lastError: any = null;

    for (const name of tryMethods) {
      const fn = (hc as any)[name];
      if (typeof fn === "function") {
        try {
          // some methods return pairing data
          const res = await fn.call(hc);

          // Special-case: generatePairingString/openPairingModal/openModal may return a pairing URI
          if (name === "generatePairingString" || name === "createPairing") {
            // res often has { uri, approval } or { pairingString }
            if (res && typeof res === "object") {
              const uri = (res as any).uri || (res as any).pairingString || (res as any).pairingUri;
              if (uri && typeof window !== "undefined") {
                try {
                  // Open pairing URI in a new tab/window to trigger wallet apps
                  window.open(uri, "_blank");
                } catch {}
              }
              // persist what we can
              try {
                localStorage.setItem("hashconnect_pairings", JSON.stringify(res));
              } catch {}
              setPairingData(res as any);
            }
            return;
          }

          if (name === "openPairingModal" || name === "openModal" || name === "open") {
            // these methods usually open a modal handled by the library
            // call and return
            await fn.call(hc);
            return;
          }

          // Generic handling: If the method returned pairing info, persist it and update state
          if (res && typeof res === "object") {
            const pairing = (res.pairing || res || null) as any;
            try {
              if (pairing && (pairing.topic || pairing.accountIds || pairing.pairingString)) {
                try {
                  localStorage.setItem("hashconnect_pairings", JSON.stringify(pairing));
                } catch {}
                setPairingData(pairing);
                if (pairing.accountIds && pairing.accountIds.length) {
                  setConnected(true);
                  setAccountId(pairing.accountIds[0]);
                }
              }
            } catch {}
          }
          return;
        } catch (err) {
          lastError = err;
          // try next method
        }
      }
    }

    // If none of the known methods existed or succeeded, provide diagnostics
    const available = Object.keys(hc || {}).filter((k) => typeof (hc as any)[k] === "function");
    const msg = `No connect/pair method available on HashConnect instance. Available methods: ${available.join(", ")}`;
    const e = new Error(msg);
    // attach lastError for debugging
    (e as any).inner = lastError;
    throw e;
  };

  const disconnect = () => {
    setConnected(false);
    setAccountId(null);
    localStorage.removeItem("hashconnect_pairings");
  };

  return (
    <HashContext.Provider value={{ connected, accountId, pairingData, initialized, connect, disconnect }}>
      {children}
    </HashContext.Provider>
  );
};
