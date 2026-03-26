# ShortLink Manager - Deployment Guide

## Admin Login Credentials

**Username:** RohanAFK
**Password:** Rohan456

## Quick Facts

- **NO DATABASE NEEDED** - Everything runs in browser localStorage
- **NO ENVIRONMENT VARIABLES** - Nothing to configure on Railway
- Login required for ALL pages (even short link redirects)
- Admin-only access

---

## Deploy to Railway in 3 Steps

### Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub

### Step 2: Deploy
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository
4. Railway auto-detects Vite

**Build Settings (Auto-detected):**
- Build Command: `npm run build`
- Start Command: `npm run preview`

### Step 3: That's It!
Railway builds and deploys automatically. No environment variables needed!

---

## Set Up Custom Domain

### 1. In Railway
1. Go to your project → Settings → Domains
2. Click "Add Domain"
3. Enter your domain (e.g., `short.yourdomain.com`)

### 2. In Your Domain Registrar

Railway provides DNS records. Add them:

**For Subdomain (short.yourdomain.com):**
- Type: `CNAME`
- Name: `short`
- Value: (Railway provides this)

**For Root Domain (yourdomain.com):**
- Type: `A`
- Name: `@`
- Value: (Railway provides IP)

### 3. Wait for SSL
- DNS propagation: 5 mins - 48 hours
- Railway auto-provisions HTTPS certificate
- Your site goes live with HTTPS

---

## Telegram Backup Setup

### Why Telegram Backups?
Since all data is in browser localStorage, clearing browser data deletes everything. Telegram backups preserve your data.

### Step 1: Create Bot
1. Open Telegram, search `@BotFather`
2. Send `/newbot`
3. Follow prompts
4. Copy bot token: `123456789:ABCdefGHI...`

### Step 2: Get Chat ID

**For Personal Chat:**
1. Search `@userinfobot`
2. Start chat
3. Copy your chat ID

**For Group:**
1. Create group
2. Add your bot
3. Add `@userinfobot`
4. Bot shows group chat ID: `-1001234567890`
5. Remove `@userinfobot`

### Step 3: Configure in App
1. Login to ShortLink Manager
2. Click Telegram icon (paper plane) in header
3. Enter Bot Token and Chat ID
4. Click Save

### Step 4: Backup Anytime
Click the cloud upload icon to send backup to Telegram.

**Backup includes:**
- All shortlinks
- All shortlists
- Click statistics
- JSON format

---

## Important Notes

### Data Storage
- Everything stored in browser localStorage
- Data is per-browser (different browsers = different data)
- Clearing browser data = losing everything
- **Regular Telegram backups strongly recommended**

### Security
- Only admin can login (RohanAFK)
- ALL pages require login (even /r/shortcode redirects)
- No registration - hardcoded credentials only

### Railway Costs
- Free tier available
- No database costs (we use localStorage)
- Automatic HTTPS included

---

## Troubleshooting

**Site not loading?**
- Check Railway deployment logs
- Ensure build command is `npm run build`
- Ensure start command is `npm run preview`

**Lost all data?**
- Browser data was cleared
- Restore from Telegram backup
- Always keep recent backups

**Telegram backup failing?**
- Check bot token is correct
- Check chat ID format (groups start with `-100`)
- Ensure bot is in the group (if using group chat)

**Can't login?**
- Username must be exactly: `RohanAFK`
- Password must be exactly: `Rohan456`
- Both are case-sensitive

---

## Local Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## No Environment Variables Needed!

Unlike typical apps, you DON'T need to set:
- ❌ Database URLs
- ❌ API Keys (except Telegram, configured in-app)
- ❌ Supabase credentials
- ❌ Any .env variables

Everything runs client-side in the browser!
