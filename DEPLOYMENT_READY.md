# 🚀 DEPLOYMENT CHECKLIST - QuickFix Lead Capture

## ✅ YOUR CURRENT STATUS
- **Code is built and committed** — ready to push
- **SSH to GitHub confirmed working** — `seanodland` authenticated
- **All files ready** in `/home/sean/leadform/`

## 🛠 CREATE GITHUB REPO
Open: `https://github.com/new`
1. **Repository name:** exactly `quickfix-leads`
2. **Set to:** Public (not private)  
3. **Create repository**
4. **Don't initialize** with README (we already have one)
5. **Click Create repository**

## 📤 PUSH TO GITHUB
Run these *after* you create the repo:
```bash
cd /home/sean/leadform
git push -u origin main
```

## 🌐 ENABLE GITHUB PAGES
1. Go to: `https://github.com/seanodland/quickfix-leads/settings/pages`
2. **Source**: Deploy from a branch  
3. **Branch**: main | `/ (root)`, **Save**
4. **Your live URL**: `https://seanodland.github.io/quickfix-leads/`

## 📱 TEST LIVE SITE
1. **Visit live URL** on phone: `https://seanodland.github.io/quickfix-leads/`
2. **Fill test form** (use your email)
3. **Check email**: Filter for "urgent" or "repair request"
4. **Forward emails** to your contractor's actual email

## 📋 REGENERATE QR CODES (on live URL)
Run this after site is live:
```bash
python3 regen_qr.py
```
*Updates QR codes to point to your live site*

---

## 🏆 MARKETING & PRINTING
**Business Card:** `qr-business-card.png` (144×144px)
**Flyers:** `qr-main.png` (600×600px printable)
**Signage:** `qr-print.svg` (Vector, infinite sizing)

---

## 🎬 NEXT LEVEL (Optional)
- **Custom domain**: Settings → Pages → Custom domain 
- **Analytics QR**: Use `qr-analytics.png` (tracks scans)
- **Want SMS**: I'll wire in Twilio (requires phone number + card)
- **Want app**: Wrap as PWA (add to home screen)

---

**STUCK?** Screen-share here: I'll run each command step-by-step.

**READY?** Create the repo now — once it's live, everything else takes 2 minutes.