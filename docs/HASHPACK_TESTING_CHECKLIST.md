# HashPack Integration Testing Checklist

## Pre-requisites ✓

- [ ] HashPack browser extension installed
- [ ] HashPack account created/imported  
- [ ] HashPack set to **Testnet** network
- [ ] Dependencies installed (`npm install` completed)
- [ ] Development server running (`npm run dev`)

## Basic Connection Tests

### Test 1: Initial Load
- [ ] Navigate to `/wallet` page
- [ ] HashPack Wallet card is visible
- [ ] "Ready" badge appears (green badge next to "HashPack Wallet")
- [ ] "Connect HashPack" button is enabled (not grayed out)
- [ ] No errors in browser console (F12 → Console tab)

### Test 2: Successful Connection
- [ ] Click "Connect HashPack" button
- [ ] HashPack popup window appears
- [ ] Extension shows connection request
- [ ] Click "Approve" in HashPack popup
- [ ] Popup closes automatically
- [ ] Account ID appears in the UI (format: 0.0.xxxxx)
- [ ] Account ID is displayed in green box
- [ ] "Disconnect" button is visible and red
- [ ] No error messages displayed

### Test 3: Connection Persistence
- [ ] Connection successful (account ID visible)
- [ ] Refresh the page (F5)
- [ ] Account ID still appears (no need to reconnect)
- [ ] "Disconnect" button still visible
- [ ] Connection persists after refresh

### Test 4: Disconnection
- [ ] Click "Disconnect" button
- [ ] Account ID disappears
- [ ] "Connect HashPack" button reappears
- [ ] No errors displayed
- [ ] Can reconnect successfully

### Test 5: Rejected Connection
- [ ] Click "Connect HashPack"
- [ ] HashPack popup appears
- [ ] Click "Reject" or close popup
- [ ] Error message appears (explaining rejection)
- [ ] Can try connecting again
- [ ] Second attempt works if approved

## Advanced Tests

### Test 6: Extension Not Installed
- [ ] Disable HashPack extension temporarily
- [ ] Refresh page
- [ ] Click "Connect HashPack"
- [ ] Helpful error message appears
- [ ] Error suggests installing extension
- [ ] Link to install HashPack is present

### Test 7: Wrong Network
- [ ] In HashPack, switch to Mainnet
- [ ] Try to connect
- [ ] Note: Should still work, but for testing use Testnet
- [ ] Switch back to Testnet in HashPack
- [ ] Reconnect successfully

### Test 8: Multiple Tabs
- [ ] Open `/wallet` in two browser tabs
- [ ] Connect in first tab
- [ ] Refresh second tab
- [ ] Second tab should show connected state
- [ ] Disconnect in first tab
- [ ] Refresh second tab
- [ ] Second tab should show disconnected

### Test 9: Browser Console Check
- [ ] Open DevTools (F12) → Console tab
- [ ] Connect wallet
- [ ] Look for "Pairing event:" log
- [ ] Verify pairing data is logged
- [ ] No red error messages
- [ ] Disconnect wallet
- [ ] Look for "Disconnected from wallet" log

### Test 10: LocalStorage Verification
- [ ] Open DevTools (F12) → Application tab
- [ ] Go to Local Storage → your domain
- [ ] Connect wallet
- [ ] Find `hashconnect_pairing` key
- [ ] Value should contain account ID
- [ ] Disconnect wallet
- [ ] `hashconnect_pairing` should be removed

## Component Integration Tests

### Test 11: Using in Custom Component
```tsx
// Create a test component
"use client";
import { useHash } from "@/components/wallet/HashConnectProvider";

export default function TestComponent() {
  const hash = useHash();
  return <div>Connected: {hash?.connected ? "Yes" : "No"}</div>;
}
```
- [ ] Component shows "Connected: No" initially
- [ ] Connect wallet
- [ ] Component updates to "Connected: Yes"
- [ ] No errors in console

### Test 12: onConnect Callback
- [ ] In `/wallet` page, connected account state updates
- [ ] Account ID appears at top of page
- [ ] Callback fires correctly on connection
- [ ] State management works as expected

## Error Handling Tests

### Test 13: Rapid Clicking
- [ ] Rapidly click "Connect HashPack" multiple times
- [ ] Should not cause errors
- [ ] Only one popup should appear
- [ ] Connection works normally

### Test 14: Connection Timeout
- [ ] Click "Connect HashPack"
- [ ] Wait without approving (don't click Approve/Reject)
- [ ] Close popup manually
- [ ] No crashes or errors
- [ ] Can try connecting again

### Test 15: HashPack Locked
- [ ] Lock HashPack wallet (if possible)
- [ ] Try to connect
- [ ] HashPack prompts for password
- [ ] Unlock and approve
- [ ] Connection succeeds

## Performance Tests

### Test 16: Load Time
- [ ] Navigate to `/wallet` page
- [ ] Page loads within 2 seconds
- [ ] "Ready" badge appears within 3 seconds
- [ ] No long initialization delays

### Test 17: Memory Leaks
- [ ] Connect and disconnect 5 times
- [ ] No browser slowdown
- [ ] Console has no memory warnings
- [ ] Page remains responsive

## UI/UX Tests

### Test 18: Visual States
- [ ] Loading state shows spinning icon
- [ ] Disabled state has grayed appearance
- [ ] Connected state is clearly visible
- [ ] Error messages are readable
- [ ] All text is legible in light mode
- [ ] All text is legible in dark mode

### Test 19: Responsive Design
- [ ] Test on mobile viewport
- [ ] Test on tablet viewport
- [ ] Test on desktop
- [ ] UI adapts appropriately
- [ ] Buttons are clickable on all sizes

### Test 20: Accessibility
- [ ] Tab through interface with keyboard
- [ ] Can focus on Connect button
- [ ] Can activate with Enter/Space
- [ ] Screen reader friendly (if using screen reader)

## Environment Tests

### Test 21: Different Browsers
- [ ] Test in Chrome
- [ ] Test in Brave
- [ ] Test in Edge
- [ ] Works in all supported browsers

### Test 22: Development vs Production Build
- [ ] Works in dev mode (`npm run dev`)
- [ ] Build succeeds (`npm run build`)
- [ ] Works in production mode (`npm start`)
- [ ] No console errors in production

## Documentation Tests

### Test 23: Quick Start Guide
- [ ] Follow `HASHPACK_QUICKSTART.md` step-by-step
- [ ] All steps work as described
- [ ] Can connect successfully following guide
- [ ] No missing steps

### Test 24: Code Examples
- [ ] Code examples in docs compile without errors
- [ ] Examples work when copy-pasted
- [ ] TypeScript types are correct

---

## Final Checklist

### Before Marking as "Complete"
- [ ] All basic connection tests pass
- [ ] No console errors during normal usage
- [ ] Connection persists across refreshes
- [ ] Disconnect works properly
- [ ] Error messages are helpful
- [ ] Documentation is accurate
- [ ] Code is properly formatted
- [ ] No TypeScript errors
- [ ] Works on testnet

### Before Production Deployment
- [ ] Get real WalletConnect Project ID
- [ ] Update `.env.local` with real project ID
- [ ] Test on mainnet (with real HBAR)
- [ ] Set debug mode to `false`
- [ ] Review security best practices
- [ ] Test with real user accounts
- [ ] Prepare support documentation
- [ ] Have rollback plan ready

---

## Test Results Template

```
Date: ___________
Tester: ___________
Browser: ___________
OS: ___________

Basic Tests: ___/5 passed
Advanced Tests: ___/5 passed  
Component Tests: ___/2 passed
Error Tests: ___/3 passed
Performance Tests: ___/2 passed
UI/UX Tests: ___/3 passed

Overall Status: [ ] PASS  [ ] FAIL
Notes:
_________________________________
_________________________________
_________________________________
```

---

**Last Updated**: October 19, 2025  
**Version**: 1.0
