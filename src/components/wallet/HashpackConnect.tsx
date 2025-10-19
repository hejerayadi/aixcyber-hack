"use client";

import { useEffect, useState } from "react";
import { useHash } from "./HashConnectProvider";

type AccountInfo = {
  accountId: string;
  balanceTINYBars?: number;
};

export default function HashpackConnect({ onConnect }: { onConnect?: (acct: AccountInfo) => void }) {
  // Hooks must be called unconditionally at top-level
  const hash = useHash();

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hash?.connected && hash.accountId) {
      onConnect?.({ accountId: hash.accountId });
    }
  }, [hash?.connected, hash?.accountId, onConnect]);

  if (!hash) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
        <h4 className="font-semibold mb-2">HashPack (HashConnect)</h4>
        <div className="text-sm text-gray-500">HashConnect provider not initialized. Wrap your app with <code>HashProvider</code>.</div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h4 className="font-semibold mb-2">HashPack (HashConnect)</h4>
      {hash.connected && hash.accountId ? (
        <div className="space-y-2">
          <div className="text-sm">Connected: <span className="font-medium">{hash.accountId}</span></div>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={() => hash.disconnect()}>Disconnect</button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="text-sm text-gray-500">Connect to your HashPack wallet.</div>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-indigo-600 text-white rounded disabled:opacity-50"
              disabled={!hash.initialized}
              onClick={async () => {
                try {
                  if (!hash.initialized) {
                    setError("HashConnect initializing — please wait");
                    return;
                  }
                  await hash.connect();
                } catch (e: unknown) {
                  // present diagnostic info if available
                  const err: any = e as any;
                  let msg = String(err?.message || err || "Connect failed");
                  if (err?.inner) msg += ` | inner: ${String(err.inner)}`;
                  setError(msg);
                }
              }}
            >
              {hash.initialized ? "Connect HashPack" : "Initializing..."}
            </button>
          </div>
        </div>
      )}
      {error && <div className="text-xs text-red-500 mt-2">{error}</div>}
    </div>
  );
}
