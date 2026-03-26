# ShortLink Manager

A complete shortlink management platform with user dashboards, admin control panel, and click analytics. Built with React, Supabase, and Vite.

## Features

### User Panel
- Sign up and login with email/password
- Create multiple shortlists to organize links
- Create, edit, and delete shortlinks
- View click analytics and history per link
- Copy short URLs with one click
- View all personal shortlinks and statistics

### Admin Panel
- System statistics dashboard (users, shortlists, shortlinks, total clicks)
- User management with role control (promote/demote admin)
- View all shortlinks globally
- Delete shortlinks from admin interface
- Access control based on user roles

### Core Features
- Fast shortlink redirects (format: `/r/{shortCode}`)
- Automatic click tracking and analytics
- Row Level Security (RLS) for data protection
- Responsive design for mobile and desktop
- Clean, modern UI with smooth animations

## Tech Stack

- **Frontend**: React 18 + React Router
- **Build Tool**: Vite
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Email/Password)
- **Styling**: CSS3 with responsive design

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── AdminShortlinks.jsx
│   ├── AdminStats.jsx
│   ├── AdminUsers.jsx
│   ├── ShortlinkItem.jsx
│   ├── ShortlinksView.jsx
│   ├── ShortlistCard.jsx
│   └── ShortlistsManager.jsx
├── lib/                 # Utility functions
│   ├── auth.js
│   ├── shortlinks.js
│   └── supabase.js
├── pages/              # Page components
│   ├── AdminDashboard.jsx
│   ├── Auth.jsx
│   ├── Redirect.jsx
│   └── UserDashboard.jsx
├── App.jsx
└── main.jsx
```

## Setup Instructions

### 1. Prerequisites
- Node.js 16+
- Supabase account (https://supabase.com)

### 2. Clone & Install
```bash
git clone <your-repo-url>
cd shortlink-manager
npm install
```

### 3. Configure Environment
The `.env` file is already configured with:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_SUPABASE_ANON_KEY=your_anon_key
```

These values are automatically set from your Supabase project.

### 4. Database Setup
The database schema is automatically created. Tables include:
- `user_roles` - User role management (user/admin)
- `shortlists` - Link collections
- `shortlinks` - Individual short links
- `shortlink_clicks` - Click tracking

All tables have Row Level Security enabled for data protection.

### 5. Local Development
```bash
npm run dev
```
Opens http://localhost:3000

### 6. Production Build
```bash
npm run build
```
Creates optimized build in `dist/` folder

## Deployment to Railway

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/shortlink-manager.git
git push -u origin main
```

### Step 2: Connect to Railway
1. Go to https://railway.app
2. Create new project
3. Select "Deploy from GitHub"
4. Connect your GitHub account and select this repository
5. Configure environment variables:
   - `VITE_SUPABASE_URL` - Your Supabase URL
   - `VITE_SUPABASE_SUPABASE_ANON_KEY` - Your Supabase anon key

### Step 3: Configure Build & Start
- Build Command: `npm run build`
- Start Command: `npm run preview`
- Or configure as static site serving `dist/` folder

### Step 4: Connect Domain
1. In Railway project settings, go to "Domains"
2. Add your domain `gojosatoruafk.com`
3. Update DNS records as instructed by Railway

## Usage

### For Regular Users
1. Sign up with email and password
2. Create a shortlist (e.g., "Social Media", "Marketing")
3. Add shortlinks to your lists
4. Share the short URL (e.g., gojosatoruafk.com/r/ABC123)
5. Track clicks and analytics in real-time

### For Admins
1. Access admin panel at `/admin`
2. View global statistics
3. Manage users (promote to admin)
4. View and delete any shortlink
5. Monitor system usage

## Authentication

- Email/password authentication via Supabase
- JWT-based sessions
- Automatic role assignment on signup (user by default)
- Admin roles managed by other admins

## API Routes

### Redirect
- `GET /r/:shortCode` - Redirect to original URL

### User Routes
- `/dashboard` - User dashboard
- `/dashboard/links` - All user links

### Admin Routes
- `/admin` - Statistics
- `/admin/users` - User management
- `/admin/shortlinks` - All shortlinks

## Database Schema

### user_roles
```sql
- id (UUID, primary key)
- user_id (UUID, references auth.users)
- role (TEXT: 'user' | 'admin')
- created_at, updated_at
```

### shortlists
```sql
- id, user_id
- name, description
- created_at, updated_at
```

### shortlinks
```sql
- id, user_id, shortlist_id
- short_code (UNIQUE)
- original_url, title, description
- click_count
- created_at, updated_at
```

### shortlink_clicks
```sql
- id, shortlink_id
- clicked_at
- user_agent, ip_address
```

## Security

- All user data protected by Row Level Security
- Users can only access their own data
- Admins have global access
- Passwords securely hashed by Supabase
- Environment variables not exposed to client

## Future Enhancements

- Custom short codes
- Link expiration
- QR code generation
- Advanced analytics (geography, device type)
- Bulk link management
- API for programmatic access
- Dark mode
- Notifications

## Support

For issues or questions, create an issue in your GitHub repository.

## License

MIT