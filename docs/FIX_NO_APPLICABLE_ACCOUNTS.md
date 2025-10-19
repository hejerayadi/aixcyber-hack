# Fix: "No applicable accounts" Error in HashPack

## 🔴 Problem

When you click "Connect HashPack", the popup shows:
- "No applicable accounts"
- "Please select an account to pair"

This means HashPack doesn't have any accounts set up on the **Testnet** network.

## ✅ Solution: Create/Import a Testnet Account

### Option 1: Create a New Testnet Account (Recommended)

1. **Open HashPack Extension**
   - Click the HashPack icon in your browser

2. **Make Sure You're on Testnet**
   - Look at the top of HashPack
   - Should say "Testnet" (if not, see "Switch to Testnet" section below)

3. **Add a New Account**
   - Click the **"+"** button or **"Add Account"**
   - Select **"Create New Account"**
   - Give it a name (e.g., "Testnet Account")
   - Click **"Create"**

4. **Verify Account is Created**
   - You should see your new account with ID like `0.0.xxxxx`
   - Balance will be 0 HBAR

5. **Try Connecting Again**
   - Go back to your app (`http://localhost:3000/wallet`)
   - Click "Connect HashPack"
   - Your new account should appear in the list!

---

### Option 2: Import Existing Testnet Account

If you already have a testnet account:

1. **Open HashPack**
2. **Switch to Testnet** (see below)
3. **Click "+" → "Import Account"**
4. **Enter your private key or recovery phrase**
5. **Save the account**

---

## 🔄 How to Switch HashPack to Testnet

**IMPORTANT**: Your app is configured for Testnet, so HashPack must be on Testnet too!

### Steps:

1. **Open HashPack Extension**
   
2. **Click Settings (⚙️ gear icon)**
   
3. **Click "Network"**
   
4. **Select "Testnet"**
   - ○ Mainnet
   - ● Testnet ← **Select this!**
   - ○ Previewnet
   
5. **Confirm/Save**

6. **Verify the Change**
   - Top of HashPack should show **"Testnet"** (usually in orange)

---

## 💰 Get Free Testnet HBAR (Optional)

After creating your testnet account, you can get free test HBAR:

### Method 1: Hedera Portal Faucet

1. Go to **https://portal.hedera.com/**
2. Sign up for a free account
3. Navigate to **"Testnet Access"** or **"Faucet"**
4. Enter your testnet account ID (from HashPack)
5. Click **"Submit"** or **"Request HBAR"**
6. Wait a few seconds
7. Check HashPack - you should see HBAR!

### Method 2: Hedera Faucet (if available)

1. Go to **https://testnet.hedera.com/faucet** (if available)
2. Enter your account ID
3. Request testnet HBAR

---

## 📋 Step-by-Step Solution

### Complete Walkthrough:

```
┌─────────────────────────────────────┐
│ Step 1: Open HashPack               │
│ ↓                                   │
│ Click HashPack icon in browser      │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│ Step 2: Check Network               │
│ ↓                                   │
│ Top should say "Testnet"            │
│ If not: Settings → Network → Testnet│
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│ Step 3: Add Account                 │
│ ↓                                   │
│ Click "+" or "Add Account"          │
│ → "Create New Account"              │
│ → Name it (e.g., "Test Account")    │
│ → Click "Create"                    │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│ Step 4: Verify Account              │
│ ↓                                   │
│ Should see: 0.0.xxxxx               │
│ Balance: 0 HBAR (testnet)           │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│ Step 5: Connect to App              │
│ ↓                                   │
│ Go to http://localhost:3000/wallet  │
│ Click "Connect HashPack"            │
│ Select your account                 │
│ Click "Pair"                        │
└─────────────────────────────────────┘
           ↓
        SUCCESS! 🎉
```

---

## 🔍 Troubleshooting

### Issue: "Still says 'No applicable accounts'"

**Checklist**:
- [ ] HashPack is on **Testnet** (not Mainnet)
- [ ] You created/imported an account **while on Testnet**
- [ ] HashPack is unlocked (not showing password screen)
- [ ] You refreshed your app page after creating account

**Try**:
1. Close HashPack popup (click "Reject")
2. Verify HashPack shows "Testnet" at top
3. Verify you see at least one account in HashPack
4. Try clicking "Connect HashPack" again

### Issue: "Created account but it's not showing"

**Cause**: You might have created it on Mainnet, not Testnet

**Solution**:
1. In HashPack, switch to **Mainnet** temporarily
2. Check if your account appears there
3. If yes, you created it on the wrong network
4. Switch back to **Testnet**
5. Create a **new** account on Testnet

### Issue: "Account shows on Mainnet but not Testnet"

**Explanation**: Accounts are network-specific in HashPack's display. If you created an account while on Mainnet, it won't appear when you switch to Testnet.

**Solution**: Create a new account specifically on Testnet

---

## ⚠️ Important Notes

1. **Network Must Match**: 
   - Your app is configured for **Testnet**
   - HashPack must be on **Testnet**
   - Account must exist on **Testnet**

2. **Multiple Networks**:
   - HashPack can have different accounts on different networks
   - Switch networks in HashPack to see different accounts

3. **Testnet vs Mainnet**:
   - **Testnet**: Free test HBAR, for development
   - **Mainnet**: Real HBAR with real value
   - Always use Testnet for development!

---

## 🎯 Quick Checklist

Before trying to connect:

- [ ] HashPack extension is installed
- [ ] HashPack is unlocked (password entered)
- [ ] HashPack shows **"Testnet"** at the top
- [ ] At least one account exists in HashPack
- [ ] Account was created while on Testnet network
- [ ] App is running (`npm run dev`)
- [ ] Browser page refreshed after creating account

---

## 📸 What Success Looks Like

When you click "Connect HashPack" after fixing:

```
┌─────────────────────────────────────┐
│ Connect with AtlasWealth            │
│ http://localhost:3000               │
│ Testnet                             │
│                                     │
│ Please select account to connect:  │
│                                     │
│ ✓ 0.0.12345 (Test Account)         │  ← Your account appears!
│   0 HBAR                            │
│                                     │
│ [Reject]  [Pair]                    │
└─────────────────────────────────────┘
```

Select your account and click **"Pair"** → Success! 🎉

---

## 🆘 Still Having Issues?

### Check Browser Console

1. Press **F12**
2. Go to **Console** tab
3. Click "Connect HashPack"
4. Look for errors or messages

### Common Console Messages

✅ **Good**:
```
HashConnect initialized successfully
Found wallet extensions: [{name: "HashPack", ...}]
```

❌ **Problem**:
```
Error: No accounts available
```
→ Create account on Testnet

### Get More Help

- Check: `docs/SWITCH_TO_TESTNET.md`
- Check: `docs/HASHPACK_TESTNET_SETUP.md`
- Check: `docs/HASHCONNECT_API_TROUBLESHOOTING.md`

---

## 📝 Summary

The "No applicable accounts" error means:
- HashPack is on Testnet ✓
- But you don't have any accounts on Testnet ✗

**Fix**: Create a new account in HashPack while on Testnet network!

---

**Last Updated**: October 19, 2025
