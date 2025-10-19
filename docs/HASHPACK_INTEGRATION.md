# HashPack Wallet Integration Guide

This guide explains how to integrate HashPack wallet into your Next.js application using HashConnect v3.

## Prerequisites

1. **Install HashPack Browser Extension**
   - Visit [https://www.hashpack.app/](https://www.hashpack.app/)
   - Install the HashPack extension for Chrome/Brave/Edge
   - Create or import a Hedera account
   - Make sure you're on the Testnet network

2. **Get a WalletConnect Project ID** (Recommended)
   - Visit [https://cloud.walletconnect.com/](https://cloud.walletconnect.com/)
   - Sign up and create a new project
   - Copy your Project ID
   - Add it to your `.env.local` file:
     ```
     NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
     ```

## Installation

The required packages are already installed:

```bash
npm install hashconnect@^3.0.14 @hashgraph/sdk@^2.75.0
```

## Project Structure

```
src/
  components/
    wallet/
      HashConnectProvider.tsx  # Context provider for HashConnect
      ClientHashProvider.tsx   # Client-side wrapper
      HashpackConnect.tsx      # UI component for connection
  app/
    wallet/
      page.tsx                 # Wallet page using the components
```

## How It Works

### 1. HashConnectProvider (`HashConnectProvider.tsx`)

This is the core context provider that:
- Initializes HashConnect with Hedera testnet
- Manages connection state (connected, accountId, pairingData)
- Handles pairing events and disconnection
- Persists pairing data in localStorage
- Provides `connect()` and `disconnect()` methods

Key features:
- **Dynamic Import**: HashConnect is imported dynamically to avoid SSR issues
- **Event Listeners**: Listens to pairing and disconnection events
- **LocalStorage**: Saves pairing data for session persistence
- **Error Handling**: Catches and logs initialization errors

### 2. ClientHashProvider (`ClientHashProvider.tsx`)

A thin wrapper that ensures the HashProvider only runs on the client side.

### 3. HashpackConnect (`HashpackConnect.tsx`)

The UI component that:
- Shows connection status
- Displays connected account ID
- Provides connect/disconnect buttons
- Shows helpful error messages
- Links to HashPack installation

## Usage

### Basic Usage in a Page

```tsx
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import HashpackConnect from "@/components/wallet/HashpackConnect";

const ClientHashProvider = dynamic(() => import("@/components/wallet/ClientHashProvider"), { ssr: false });

export default function WalletPage() {
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);

  return (
    <ClientHashProvider>
      <div className="p-6">
        <h1>My Wallet</h1>
        <HashpackConnect 
          onConnect={(acct) => setConnectedAccount(acct.accountId)} 
        />
        {connectedAccount && <p>Connected: {connectedAccount}</p>}
      </div>
    </ClientHashProvider>
  );
}
```

### Global Provider (Optional)

If you want HashConnect available across your entire app, you can add it to your root layout:

```tsx
// app/layout.tsx
import ClientHashProvider from "@/components/wallet/ClientHashProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientHashProvider>
          {children}
        </ClientHashProvider>
      </body>
    </html>
  );
}
```

### Using the Hook

Access the HashConnect context in any component:

```tsx
"use client";

import { useHash } from "@/components/wallet/HashConnectProvider";

export default function MyComponent() {
  const hash = useHash();

  if (!hash) return null;

  return (
    <div>
      {hash.connected ? (
        <p>Connected to {hash.accountId}</p>
      ) : (
        <button onClick={() => hash.connect()}>Connect</button>
      )}
    </div>
  );
}
```

## API Reference

### HashContext Type

```typescript
type HashContextType = {
  connected: boolean;           // Whether wallet is connected
  accountId: string | null;     // Connected Hedera account ID (e.g., "0.0.12345")
  pairingData: any | null;      // Full pairing data from HashConnect
  initialized: boolean;         // Whether HashConnect is ready
  connect: () => Promise<void>; // Function to initiate connection
  disconnect: () => void;       // Function to disconnect wallet
};
```

### Methods

**`connect()`**
- Initiates connection to HashPack wallet
- Opens HashPack extension for user approval
- Throws error if HashConnect not initialized or connection fails

**`disconnect()`**
- Disconnects the wallet
- Clears localStorage
- Resets connection state

## Troubleshooting

### 1. "HashConnect not initialized"

**Cause**: Trying to connect before HashConnect finishes initialization.

**Solution**: Check `hash.initialized` before calling `connect()`:
```tsx
<button 
  disabled={!hash.initialized} 
  onClick={() => hash.connect()}
>
  {hash.initialized ? "Connect" : "Initializing..."}
</button>
```

### 2. "HashPack extension not found"

**Cause**: HashPack browser extension is not installed.

**Solution**: 
- Install HashPack from [https://www.hashpack.app/](https://www.hashpack.app/)
- Refresh the page after installation

### 3. Connection rejected

**Cause**: User rejected the connection in HashPack.

**Solution**: Click "Connect" again and approve in the HashPack popup.

### 4. Server-side rendering errors

**Cause**: HashConnect can't run on the server.

**Solution**: Always use dynamic import with `ssr: false`:
```tsx
const ClientHashProvider = dynamic(
  () => import("@/components/wallet/ClientHashProvider"), 
  { ssr: false }
);
```

### 5. "Module not found" errors

**Cause**: Missing dependencies.

**Solution**: Install required packages:
```bash
npm install hashconnect @hashgraph/sdk
```

## Network Configuration

The current setup uses **Hedera Testnet**. To switch networks:

### Testnet (Current)
```typescript
new HashConnect(LedgerId.TESTNET, projectId, appMetadata, true)
```

### Mainnet
```typescript
new HashConnect(LedgerId.MAINNET, projectId, appMetadata, false)
```

## Testing

1. **Install HashPack**: Make sure the HashPack extension is installed
2. **Switch to Testnet**: In HashPack, go to Settings → Network → Testnet
3. **Open your app**: Navigate to `/wallet` page
4. **Click Connect**: Should open HashPack popup
5. **Approve**: Approve the connection in HashPack
6. **Verify**: Account ID should appear in the UI

## Advanced Usage

### Sending Transactions

Once connected, you can send transactions using the paired account:

```typescript
import { useHash } from "@/components/wallet/HashConnectProvider";
import { TransferTransaction, Hbar } from "@hashgraph/sdk";

const hash = useHash();

// Create a transaction
const transaction = new TransferTransaction()
  .addHbarTransfer(hash.accountId!, new Hbar(-1))
  .addHbarTransfer("0.0.98", new Hbar(1));

// Sign and execute through HashPack
const response = await hash.hc.sendTransaction(hash.accountId!, transaction);
```

### Signing Messages

```typescript
const message = "Sign this message";
const signature = await hash.hc.signMessage(hash.accountId!, message);
```

## Security Best Practices

1. **Never expose private keys**: HashPack handles all key management
2. **Verify transactions**: Always show users what they're signing
3. **Use environment variables**: Store project IDs in `.env.local`
4. **Enable debug mode during development**: Set 4th parameter to `true`
5. **Validate account IDs**: Always check account format before transactions

## Resources

- [HashPack Official Website](https://www.hashpack.app/)
- [HashConnect Documentation](https://github.com/Hashpack/hashconnect)
- [Hedera SDK Documentation](https://docs.hedera.com/hedera/sdks-and-apis/sdks)
- [WalletConnect Cloud](https://cloud.walletconnect.com/)

## Support

If you encounter issues:
1. Check browser console for error messages
2. Ensure HashPack extension is installed and on correct network
3. Clear localStorage and try reconnecting
4. Check that all dependencies are installed correctly

---

Last updated: October 2025
