# Quick Start: HashPack Wallet Integration

## 🚀 Get Started in 5 Minutes

### Step 1: Install HashPack Extension

1. Go to [https://www.hashpack.app/](https://www.hashpack.app/)
2. Click "Download" and install the browser extension (Chrome/Brave/Edge)
3. Open HashPack and create a new account or import an existing one
4. **Important**: Switch to **Testnet** in HashPack settings:
   - Click the HashPack icon
   - Go to Settings → Network
   - Select "Testnet"

### Step 2: Install Dependencies (Already Done)

The required packages are already installed:
- `hashconnect@^3.0.14`
- `@hashgraph/sdk@^2.75.0`

### Step 3: Configure Environment (Optional)

If you want to use a custom WalletConnect project ID:

1. Visit [https://cloud.walletconnect.com/](https://cloud.walletconnect.com/)
2. Sign up and create a new project
3. Copy your Project ID
4. Update `.env.local`:
   ```
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_actual_project_id
   ```

For now, the demo project ID will work fine.

### Step 4: Start the Development Server

```bash
npm run dev
```

### Step 5: Test the Connection

1. Open your browser to `http://localhost:3000/wallet`
2. You should see a "HashPack Wallet" card with a "Connect HashPack" button
3. Click "Connect HashPack"
4. HashPack extension popup should appear
5. Approve the connection
6. Your account ID should now be displayed!

## ✅ Verification Checklist

- [ ] HashPack extension is installed
- [ ] HashPack is on Testnet network
- [ ] Development server is running (`npm run dev`)
- [ ] Navigate to `/wallet` page
- [ ] Click "Connect HashPack" button
- [ ] HashPack popup appears
- [ ] Connection approved
- [ ] Account ID displays in the UI

## 🐛 Troubleshooting

### "HashPack extension not found"
- **Solution**: Install HashPack extension and refresh the page

### "Initializing..." button stays disabled
- **Solution**: Check browser console for errors, might need to restart dev server

### Connection gets rejected
- **Solution**: Make sure you click "Approve" in the HashPack popup

### Nothing happens when clicking "Connect"
- **Solution**: 
  1. Open browser DevTools (F12)
  2. Check Console for error messages
  3. Make sure HashPack is unlocked
  4. Try refreshing the page

### "Wrong network" error
- **Solution**: In HashPack, go to Settings → Network → Select "Testnet"

## 📁 Key Files

- **`src/components/wallet/HashConnectProvider.tsx`** - Core HashConnect logic
- **`src/components/wallet/HashpackConnect.tsx`** - UI component
- **`src/app/wallet/page.tsx`** - Example usage page
- **`.env.local`** - Environment configuration

## 🎯 Next Steps

1. **Customize the UI**: Edit `HashpackConnect.tsx` to match your design
2. **Add Transaction Support**: See `docs/HASHPACK_INTEGRATION.md` for examples
3. **Get Account Balance**: Fetch and display HBAR balance
4. **Deploy**: Switch to mainnet when ready for production

## 📚 Learn More

- [Full Integration Guide](./HASHPACK_INTEGRATION.md)
- [HashPack Documentation](https://docs.hashpack.app/)
- [Hedera Documentation](https://docs.hedera.com/)

---

Need help? Check the [Full Integration Guide](./HASHPACK_INTEGRATION.md) or open an issue on GitHub.
