# ShortLink Manager

A secure, admin-only URL shortener with Telegram backup integration. All data stored in browser localStorage - no database required!

## Features

- **Admin-only access** with hardcoded credentials
- **Organize links** into collections (shortlists)
- **Click tracking** and statistics
- **Toggle links** active/inactive
- **Browser localStorage** for data (zero database setup)
- **Telegram bot integration** for backups
- **Login required** for all pages (including redirects)

## Quick Start

**Login Credentials:**
- Username: `RohanAFK`
- Password: `Rohan456`

## Deploy to Railway

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete step-by-step instructions.

**Quick Deploy:**
1. Sign in to [Railway](https://railway.app) with GitHub
2. Deploy this repo
3. Railway auto-detects build settings
4. **No environment variables needed!**
5. Done!

## Telegram Backups

Since data is stored in browser localStorage, backing up to Telegram is recommended:

1. Create a bot via @BotFather on Telegram
2. Get chat ID from @userinfobot
3. Login to admin panel
4. Click Telegram icon (paper plane) in header
5. Enter Bot Token and Chat ID, save
6. Click backup icon anytime to send full backup

Backups include all shortlinks, shortlists, and statistics in JSON format.

## Tech Stack

- React 18 + Vite
- React Router
- Browser localStorage (zero database!)
- Telegram Bot API
- Pure CSS with responsive design

## Development

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

## Project Structure

```
src/
├── components/          # React components
│   ├── AdminShortlinks.jsx
│   ├── AdminStats.jsx
│   ├── AdminUsers.jsx
│   ├── ShortlinkItem.jsx
│   ├── ShortlinksView.jsx
│   ├── ShortlistCard.jsx
│   └── ShortlistsManager.jsx
├── lib/                 # Utilities
│   ├── localStorage.js  # Data storage & auth
│   └── telegram.js      # Telegram integration
├── pages/              # Page components
│   ├── AdminDashboard.jsx
│   ├── Auth.jsx
│   ├── Redirect.jsx
│   └── UserDashboard.jsx
├── App.jsx
└── main.jsx
```

## Security

- Only admin (RohanAFK) can access
- No user registration
- Login required for ALL routes (including /r/shortcode)
- Data stored in browser localStorage
- Hardcoded credentials for maximum simplicity

## Data Storage

All data in browser localStorage:
- Authentication state
- Shortlinks
- Shortlists
- Click counts
- Telegram configuration

**Important:** Clearing browser data deletes everything. Regular Telegram backups recommended!

## Usage

### Creating Short Links
1. Login with admin credentials
2. Create a shortlist (e.g., "Social Media")
3. Add links to your shortlist
4. Share short URL: `yourdomain.com/r/ABC123`
5. Track clicks in real-time

### Telegram Backups
1. Configure Telegram (one-time setup)
2. Click backup icon anytime
3. Receive JSON file with all data
4. Restore by importing data (feature coming soon)

## Why localStorage?

- **Zero setup**: No database configuration
- **Free hosting**: No database costs
- **Fast**: All data in browser
- **Simple**: No complex backend
- **Portable**: Works anywhere with static hosting

## Deployment Checklist

- [ ] Push code to GitHub
- [ ] Deploy to Railway
- [ ] Add custom domain (optional)
- [ ] Configure Telegram backups
- [ ] Test login with admin credentials
- [ ] Create first shortlist
- [ ] Add first shortlink
- [ ] Test redirect
- [ ] Send first backup

## Support

For deployment help, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## License

MIT
