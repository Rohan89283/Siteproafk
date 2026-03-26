# ShortLink Manager

A multi-user URL shortener with admin controls, built with React and Supabase.

## Features

- **Role-based access control** (Admin & User roles)
- **Username/password authentication** (no email required)
- **Organize links** into collections (shortlists)
- **Click tracking** and analytics
- **Toggle links** active/inactive
- **Admin controls** for user management
- **Supabase backend** for data persistence
- **Modern responsive UI** with animations

## User Roles

### Admin
- View platform statistics (total users, shortlinks, clicks)
- Create and delete user accounts
- Manage all shortlinks across all users
- Full access to all features

### User
- Create and manage personal shortlists
- Add/edit/delete their own shortlinks
- View click statistics for their links
- Cannot see other users' data

## Quick Start

**Default Admin Credentials:**
- Username: `RohanAFK`
- Password: `Rohan456`

## Deploy to Railway

1. Sign in to [Railway](https://railway.app) with GitHub
2. Deploy this repository
3. Railway auto-detects Vite build settings
4. Add environment variables from `.env` file:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy!

## Tech Stack

- **Frontend:** React 18 + Vite
- **Routing:** React Router v6
- **Database:** Supabase (PostgreSQL)
- **Auth:** Custom username/password (bcrypt)
- **Styling:** Pure CSS with animations
- **Hosting:** Railway (or any static host)

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
├── components/
│   ├── AdminShortlinks.jsx  # Admin view of all shortlinks
│   ├── AdminStats.jsx        # Platform statistics dashboard
│   ├── AdminUsers.jsx        # User management interface
│   ├── ShortlinkItem.jsx     # Individual shortlink card
│   ├── ShortlinksView.jsx    # User's shortlinks view
│   ├── ShortlistCard.jsx     # Shortlist card component
│   └── ShortlistsManager.jsx # Shortlist creation/management
├── pages/
│   ├── AdminDashboard.jsx    # Admin dashboard page
│   ├── Auth.jsx              # Login page
│   ├── Redirect.jsx          # Shortlink redirect handler
│   └── UserDashboard.jsx     # User dashboard page
├── lib/
│   ├── auth.js               # Authentication functions
│   ├── shortlinks.js         # Shortlink/shortlist operations
│   └── supabase.js           # Supabase client configuration
├── App.jsx                   # Main app with routing
└── main.jsx                  # Entry point
```

## Database Schema

### app_users
- `id` (uuid) - Primary key
- `username` (text) - Unique username
- `password_hash` (text) - Bcrypt hash
- `role` (text) - 'admin' or 'user'
- `created_at` (timestamptz)

### shortlists
- `id` (uuid) - Primary key
- `name` (text) - Shortlist name
- `user_id` (uuid) - Owner reference
- `created_at` (timestamptz)

### shortlinks
- `id` (uuid) - Primary key
- `short_code` (text) - Unique short code
- `original_url` (text) - Destination URL
- `shortlist_id` (uuid) - Parent shortlist
- `user_id` (uuid) - Owner reference
- `is_active` (boolean) - Active status
- `click_count` (integer) - Total clicks
- `created_at` (timestamptz)

## Security

- **Row Level Security (RLS)** enabled on all tables
- **Custom auth** with bcrypt password hashing
- **Session management** via localStorage
- **Role-based permissions** enforced at database level
- **Secure password policies**

## Key Features

### Admin Dashboard
1. **Statistics Overview**
   - Total users count
   - Total shortlinks count
   - Total clicks across platform

2. **User Management**
   - Create new users with username/password
   - Assign roles (admin/user)
   - Delete users
   - View user creation dates

3. **Shortlink Management**
   - View all shortlinks across all users
   - Toggle links active/inactive
   - Delete any shortlink
   - View click statistics

### User Dashboard
1. **Shortlist Management**
   - Create organized collections
   - Edit shortlist names
   - Delete shortlists (cascades to links)

2. **Shortlink Creation**
   - Auto-generated or custom short codes
   - Add destination URLs
   - Toggle active/inactive
   - Real-time click tracking

3. **Analytics**
   - View clicks per shortlink
   - Track shortlist performance
   - Monitor active/inactive links

### Public Redirect
- Public route: `/r/:code`
- Increments click counter
- Redirects to destination URL
- Works only for active links
- No login required

## Environment Variables

Required in `.env` file:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

These are provided when you create a Supabase project.

## Admin Tasks

### Creating Users
1. Login as admin
2. Navigate to "Users" tab
3. Click "Add User"
4. Enter username and password
5. Select role (admin/user)
6. Click "Create User"

### Managing Shortlinks
Admins can view and manage all shortlinks across all users. This is useful for:
- Moderating content
- Removing broken links
- Monitoring platform usage
- Troubleshooting user issues

## User Tasks

### Creating a Shortlist
1. Login with your credentials
2. Click "Add Shortlist"
3. Enter a name (e.g., "Social Media")
4. Click "Create"

### Adding a Shortlink
1. Select or create a shortlist
2. Enter the destination URL
3. Optional: Enter custom short code
4. Click "Add Link"
5. Copy and share the generated short URL

### Tracking Performance
- View click counts on each shortlink card
- Toggle links active/inactive as needed
- Edit destination URLs anytime
- Organize links across multiple shortlists

## Color Scheme

The UI uses a modern, professional color palette:
- **Primary:** Cyan (#0ea5e9)
- **Secondary:** Teal (#14b8a6)
- **Accent:** Orange (#f59e0b)
- **Success:** Green (#10b981)
- **Error:** Red (#ef4444)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
