"use client";

import { useEffect, useState } from "react";
import { useHash } from "./HashConnectProvider";

type AccountInfo = {
  accountId: string;
  balanceTINYBars?: number;
};

export default function HashpackConnect({ onConnect }: { onConnect?: (acct: AccountInfo) => void }) {
  const hash = useHash();
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (hash?.connected && hash.accountId) {
      onConnect?.({ accountId: hash.accountId });
      setError(null);
    }
  }, [hash?.connected, hash?.accountId, onConnect]);

  if (!hash) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
        <h4 className="font-semibold mb-2">HashPack Wallet</h4>
        <div className="text-sm text-red-500">
          HashConnect provider not initialized. Wrap your app with <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">HashProvider</code>.
        </div>
      </div>
    );
  }

  const handleConnect = async () => {
    setError(null);
    setIsConnecting(true);
    
    try {
      if (!hash.initialized) {
        setError("HashConnect is still initializing. Please wait...");
        return;
      }
      
      await hash.connect();
      // Connection success will be handled by the useEffect hook
    } catch (e: unknown) {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const err = e as any;
      /* eslint-enable @typescript-eslint/no-explicit-any */
      let msg = String(err?.message || err || "Connection failed");
      
      // Provide helpful error messages
      if (msg.includes("extension")) {
        msg = "HashPack extension not found. Please install HashPack from the Chrome Web Store.";
      } else if (msg.includes("rejected") || msg.includes("denied")) {
        msg = "Connection was rejected. Please approve the connection in HashPack.";
      }
      
      console.error("HashPack connection error:", err);
      setError(msg);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h4 className="font-semibold mb-2 flex items-center gap-2">
        <span>HashPack Wallet</span>
        {hash.initialized && (
          <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">
            Ready
          </span>
        )}
      </h4>
      
      {hash.connected && hash.accountId ? (
        <div className="space-y-3">
          <div className="p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
            <div className="text-xs text-gray-600 dark:text-gray-400">Connected Account</div>
            <div className="text-sm font-mono font-medium text-green-700 dark:text-green-300 break-all">
              {hash.accountId}
            </div>
          </div>
          <button 
            className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors" 
            onClick={() => hash.disconnect()}
          >
            Disconnect
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Connect your HashPack wallet to interact with the Hedera network.
          </div>
          <button
            className="w-full px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded transition-colors flex items-center justify-center gap-2"
            disabled={!hash.initialized || isConnecting}
            onClick={handleConnect}
          >
            {isConnecting ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connecting...
              </>
            ) : hash.initialized ? (
              "Connect HashPack"
            ) : (
              "Initializing..."
            )}
          </button>
          
          {!hash.initialized && (
            <div className="text-xs text-gray-500">
              Please wait while HashConnect initializes...
            </div>
          )}
        </div>
      )}
      
      {error && (
        <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
          <div className="text-xs text-red-700 dark:text-red-300">{error}</div>
        </div>
      )}
      
      {!hash.connected && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500">
            Don&apos;t have HashPack?{" "}
            <a 
              href="https://www.hashpack.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Install it here
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
