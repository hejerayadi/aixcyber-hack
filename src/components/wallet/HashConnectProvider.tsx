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
        // Dynamic import for browser-only runtime
        const { HashConnect } = await import("hashconnect");
        const { LedgerId } = await import("@hashgraph/sdk");

        const appMetadata = {
          name: "AtlasWealth",
          description: "AtlasWealth dApp - Decentralized Investment Platform",
          icons: ["https://www.hashpack.app/img/logo.svg"],
          url: typeof window !== "undefined" ? window.location.origin : "http://localhost:3000",
        };

        // Get WalletConnect project ID from environment or use default
        const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "atlaswealth-demo-project";
        
        // Determine network (testnet or mainnet)
        const network = process.env.NEXT_PUBLIC_HEDERA_NETWORK === "mainnet" 
          ? LedgerId.MAINNET 
          : LedgerId.TESTNET;

        console.log("Initializing HashConnect with network:", network);
        console.log("Project ID:", projectId);

        // Initialize HashConnect
        const hashconnect = new HashConnect(
          network,
          projectId,
          appMetadata,
          true // debug mode - set to false in production
        );

        if (!mounted) return;

        // Initialize the connection
        await hashconnect.init();
        
        // Debug: Log available methods
        console.log("HashConnect initialized successfully");
        console.log("HashConnect version info:", hashconnect.constructor?.name);
        const hcAny = hashconnect as any;
        console.log("Available methods:", Object.keys(hcAny).filter((k: string) => typeof hcAny[k] === 'function'));
        
        setHc(hashconnect);

        // Set up event listeners for pairing
        hashconnect.pairingEvent.on((pairingData) => {
          console.log("Pairing event:", pairingData);
          setPairingData(pairingData);
          
          if (pairingData.accountIds && pairingData.accountIds.length > 0) {
            setConnected(true);
            setAccountId(pairingData.accountIds[0]);
            
            // Save pairing data to localStorage
            try {
              localStorage.setItem("hashconnect_pairing", JSON.stringify(pairingData));
            } catch (err) {
              console.warn("Failed to save pairing data", err);
            }
          }
        });

        // Set up event listener for disconnection
        hashconnect.disconnectionEvent.on(() => {
          console.log("Disconnected from wallet");
          setConnected(false);
          setAccountId(null);
          setPairingData(null);
          localStorage.removeItem("hashconnect_pairing");
        });

        // Restore previous pairing if exists
        const savedPairing = localStorage.getItem("hashconnect_pairing");
        if (savedPairing) {
          try {
            const parsed = JSON.parse(savedPairing);
            setPairingData(parsed);
            if (parsed.accountIds && parsed.accountIds.length > 0) {
              setConnected(true);
              setAccountId(parsed.accountIds[0]);
            }
          } catch (err) {
            console.warn("Failed to parse saved pairing", err);
            localStorage.removeItem("hashconnect_pairing");
          }
        }

        setInitialized(true);
      } catch (err) {
        console.error("HashConnect initialization error:", err);
        setInitialized(true); // Set to true even on error so UI can show error state
      }
    };

    initHashConnect();

    return () => {
      mounted = false;
    };
  }, []);

  const connect = async () => {
    if (!hc) {
      throw new Error("HashConnect not initialized");
    }

    try {
      console.log("Attempting to connect to HashPack...");
      console.log("HashConnect instance methods:", Object.keys(hc).filter(k => typeof hc[k] === 'function'));
      
      // Try multiple connection strategies for HashConnect v3.x
      
      // Strategy 1: Try openPairingModal (most reliable for v3)
      if (typeof hc.openPairingModal === 'function') {
        console.log("Using pairing modal method...");
        await hc.openPairingModal();
        return;
      }
      
      // Strategy 2: Try connectToLocalWallet
      if (typeof hc.connectToLocalWallet === 'function') {
        console.log("Using connectToLocalWallet method...");
        await hc.connectToLocalWallet();
        return;
      }
      
      // Strategy 3: Find extensions and connect
      if (typeof hc.findLocalWallets === 'function') {
        const extensions = await hc.findLocalWallets();
        console.log("Found wallet extensions:", extensions);
        
        if (extensions && extensions.length > 0) {
          console.log("Connecting to extension:", extensions[0]);
          
          if (typeof hc.connectToExtension === 'function') {
            await hc.connectToExtension(extensions[0].id);
            return;
          } else if (typeof hc.connect === 'function') {
            await hc.connect(extensions[0].id);
            return;
          }
        } else {
          console.warn("No extensions found, trying alternative methods...");
        }
      }
      
      // Strategy 4: Try basic connect method
      if (typeof hc.connect === 'function') {
        console.log("Using basic connect method...");
        await hc.connect();
        return;
      }
      
      // Strategy 5: Try pair method
      if (typeof hc.pair === 'function') {
        console.log("Using pair method...");
        await hc.pair();
        return;
      }
      
      // If all strategies fail, show available methods
      const availableMethods = Object.keys(hc).filter(k => typeof hc[k] === 'function');
      throw new Error(
        `Unable to find a working connection method. Available methods: ${availableMethods.join(', ')}. ` +
        `Please make sure HashPack extension is installed and unlocked.`
      );
    } catch (err) {
      console.error("Connection error:", err);
      throw err;
    }
  };

  const disconnect = () => {
    if (hc) {
      hc.disconnect();
    }
    setConnected(false);
    setAccountId(null);
    setPairingData(null);
    localStorage.removeItem("hashconnect_pairing");
  };

  return (
    <HashContext.Provider value={{ connected, accountId, pairingData, initialized, connect, disconnect }}>
      {children}
    </HashContext.Provider>
  );
};
