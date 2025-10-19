"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import HashpackConnect from "@/components/wallet/HashpackConnect";

// Dynamically import the client-only wrapper so hashconnect is never required during SSR
const ClientHashProvider = dynamic(() => import("@/components/wallet/ClientHashProvider"), { ssr: false });

export default function WalletPage() {
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);

  return (
    <ClientHashProvider>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Digital Wallet</h1>
          <div className="text-sm text-gray-500">{connectedAccount ? `Connected: ${connectedAccount}` : "Not connected"}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div className="md:col-span-2 p-4 bg-white dark:bg-gray-800 rounded shadow">
            <div className="text-sm text-gray-500">Available balance</div>
            <div className="text-3xl font-semibold">— TND</div>

            <div className="mt-4 flex gap-2">
              <button className="px-4 py-2 bg-green-600 text-white rounded">Top-up</button>
              <button className="px-4 py-2 border rounded">Transfer</button>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-2">Recent activity</h3>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>No recent activity</li>
              </ul>
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-gray-800 rounded shadow space-y-4">
            <HashpackConnect onConnect={(acct) => setConnectedAccount(acct.accountId)} />

            <div>
              <h3 className="font-semibold mb-2">Quick links</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-indigo-600">View statements</a></li>
                <li><a href="#" className="text-indigo-600">Manage payment methods</a></li>
                <li><a href="#" className="text-indigo-600">Withdraw funds</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ClientHashProvider>
  );
}
