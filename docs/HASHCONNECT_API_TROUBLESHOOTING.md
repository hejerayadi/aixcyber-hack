# HashConnect API Troubleshooting Guide

## Common Error: "hc.connectToLocalWallet is not a function"

### Problem
You're seeing an error like:
```
TypeError: hc.connectToLocalWallet is not a function
```

### Why This Happens
HashConnect v3.x has a different API than previous versions. The methods available depend on the exact version and how HashConnect is initialized.

### Solution Applied

The code has been updated to:
1. **Auto-detect available methods** at runtime
2. **Try multiple connection strategies** in order of preference
3. **Provide helpful error messages** when methods aren't available

### How It Works Now

When you click "Connect HashPack", the code will:

1. ✅ Find local wallet extensions (like HashPack)
2. ✅ Attempt to connect using available methods
3. ✅ Log useful debug information to console
4. ✅ Show clear error messages if something fails

### Testing Your Connection

1. **Open Browser Console** (Press F12, go to Console tab)

2. **Navigate to `/wallet` page**

3. **Look for initialization message**:
   ```
   HashConnect initialized successfully
   HashConnect version info: HashConnect
   Available methods: [list of methods]
   ```

4. **Click "Connect HashPack" button**

5. **Check console for**:
   ```
   Attempting to connect to HashPack...
   HashConnect instance methods: [...]
   Found wallet extensions: [...]
   ```

### Expected Flow

#### ✅ **Success Path**:
```
1. "Attempting to connect to HashPack..."
2. "Found wallet extensions: [{name: 'HashPack', id: '...'}]"
3. "Connecting to extension: {name: 'HashPack', ...}"
4. HashPack popup appears
5. You approve connection
6. "Pairing event: {...}"
7. Connection successful!
```

#### ❌ **Error Paths**:

**Error 1: Extension Not Found**
```
Error: HashPack extension not found. 
Please install HashPack from https://www.hashpack.app/ 
and make sure it's unlocked.
```
**Solution**: 
- Install HashPack browser extension
- Make sure it's unlocked (not password-protected screen)
- Refresh your app page

**Error 2: No Connect Methods Available**
```
Error: Unable to connect. HashConnect API methods not found. 
Please ensure you have hashconnect v3+ installed.
```
**Solution**:
```bash
npm install hashconnect@latest @hashgraph/sdk@latest
```

**Error 3: HashConnect Not Initialized**
```
Error: HashConnect not initialized
```
**Solution**: 
- Wait a few seconds for initialization
- Check if "Ready" badge appears
- Look for console errors during init

### Debug Checklist

When connection fails, check:

- [ ] **Browser console is open** (F12)
- [ ] **HashPack extension is installed**
  - Go to `chrome://extensions`
  - Look for "HashPack" in the list
  
- [ ] **HashPack is unlocked**
  - Click HashPack icon
  - Should show your account, not password screen
  
- [ ] **Console shows initialization message**
  - Should see "HashConnect initialized successfully"
  
- [ ] **Console shows available methods**
  - Should list methods like: `findLocalWallets`, `connectToExtension`, etc.
  
- [ ] **No errors in console**
  - Red error messages indicate a problem
  
- [ ] **Correct network selected in HashPack**
  - Should be on Testnet (see top of HashPack)

### Manual Testing Commands

You can test HashConnect directly in the browser console:

```javascript
// 1. Check if HashConnect is available globally
console.log(window);

// 2. Try importing dynamically
import('hashconnect').then(mod => {
  console.log('HashConnect module:', mod);
  console.log('HashConnect class:', mod.HashConnect);
});

// 3. Check what's in localStorage
console.log(localStorage.getItem('hashconnect_pairing'));
```

### Common Solutions

#### Solution 1: Clear Cache & Restart
```bash
# Stop dev server (Ctrl+C)
# Clear .next folder
Remove-Item -Recurse -Force .next

# Clear browser cache
# In browser: Ctrl+Shift+Delete → Clear cache

# Restart dev server
npm run dev
```

#### Solution 2: Reinstall Dependencies
```bash
npm uninstall hashconnect @hashgraph/sdk
npm install hashconnect@latest @hashgraph/sdk@latest
npm run dev
```

#### Solution 3: Update HashPack Extension
1. Go to `chrome://extensions`
2. Find HashPack
3. Click "Update" if available
4. Or reinstall from https://www.hashpack.app/

#### Solution 4: Check Environment Variables
```env
# In .env.local
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=atlaswealth-demo-project
NEXT_PUBLIC_HEDERA_NETWORK=testnet
```

### Advanced Debugging

If you're still having issues, add this to your code temporarily:

```tsx
// In HashConnectProvider.tsx, after init
console.log("Full HashConnect object:", hc);
console.log("Prototype methods:", Object.getOwnPropertyNames(Object.getPrototypeOf(hc)));
```

This will show ALL available properties and methods on the HashConnect instance.

### API Methods in HashConnect v3

Based on HashConnect v3 documentation, these methods should be available:

- ✅ `init()` - Initialize HashConnect
- ✅ `findLocalWallets()` - Find browser extension wallets
- ✅ `connectToExtension(id)` - Connect to specific extension
- ✅ `openPairingModal()` - Open QR code/pairing modal
- ✅ `disconnect()` - Disconnect wallet
- ✅ `pairingEvent` - Event emitter for pairing
- ✅ `disconnectionEvent` - Event emitter for disconnection

### Version-Specific Issues

#### If you have hashconnect v2.x:
Upgrade to v3:
```bash
npm install hashconnect@^3.0.0
```

#### If you have hashconnect v3.0.0-3.0.10:
Update to latest patch:
```bash
npm install hashconnect@latest
```

### Still Not Working?

1. **Check package versions**:
```bash
npm list hashconnect
npm list @hashgraph/sdk
```

2. **Expected versions**:
   - `hashconnect@^3.0.14` or later
   - `@hashgraph/sdk@^2.75.0` or later

3. **Create a minimal test**:
```tsx
"use client";
import { useEffect } from 'react';

export default function TestPage() {
  useEffect(() => {
    (async () => {
      const { HashConnect } = await import('hashconnect');
      const { LedgerId } = await import('@hashgraph/sdk');
      
      const hc = new HashConnect(
        LedgerId.TESTNET,
        'test-id',
        { name: 'Test', description: 'Test', icons: [], url: '' },
        true
      );
      
      await hc.init();
      console.log('Methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(hc)));
      
      const wallets = await hc.findLocalWallets();
      console.log('Wallets:', wallets);
    })();
  }, []);
  
  return <div>Check console</div>;
}
```

### Get Help

If nothing works:

1. **Share console output** with:
   - Initialization messages
   - Available methods list
   - Full error message

2. **Check versions**:
   ```bash
   node --version
   npm --version
   npm list hashconnect
   ```

3. **Check GitHub Issues**:
   - https://github.com/Hashpack/hashconnect/issues

4. **HashPack Discord**:
   - Join for community support

---

**Last Updated**: October 19, 2025  
**HashConnect Version**: 3.0.14+
