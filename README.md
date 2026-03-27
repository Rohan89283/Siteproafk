# GojoSatoruAFK - Professional URL Shortener

A modern, fast URL shortening platform with role-based access control, built with React and Supabase.

## Features

- **Public Shortlinks** - `/r/:code` redirects work without login
- **Fast Redirects** - Edge function powered instant redirects
- **Admin Dashboard** - User management, platform statistics
- **User Dashboard** - Create and manage personal shortlinks
- **Click Tracking** - Real-time analytics
- **Dark/Light Theme** - Professional UI with theme toggle
- **Custom Short Codes** - Choose your own or auto-generate

## Quick Start

### Default Admin Credentials
- **Username:** RohanAFK
- **Password:** Rohan456

### Access Points
- **Login:** `https://gojosatoruafk.com` or `https://gojosatoruafk.com/auth`
- **Dashboard:** `https://gojosatoruafk.com/dashboard`
- **Redirects:** `https://gojosatoruafk.com/r/:code` (no login required)

## User Roles

### Admin
- Create and delete user accounts
- View all shortlinks across all users
- Manage any shortlink (edit, delete, toggle status)
- View platform-wide statistics

### User
- Create custom shortlinks
- Edit their own shortlinks
- Toggle their links active/inactive
- View click statistics
- Cannot see other users' links

## How It Works

### Creating a Shortlink
1. Sign in with your credentials
2. Click "Create Shortlink" button
3. Enter destination URL (required)
4. Optionally enter custom short code (or leave blank for auto-generate)
5. Click "Create"
6. Copy and share your shortlink!

### Managing Shortlinks
- **Edit** - Change the destination URL
- **Activate/Deactivate** - Toggle link status
- **Delete** - Permanently remove shortlink
- **Copy** - Copy shortlink to clipboard

### Public Redirects
- Anyone can access `/r/:code` URLs
- No authentication required
- Instant redirect to destination
- Click count automatically incremented
- Only works for active links

## Tech Stack

- **Frontend:** React 18 + Vite
- **Routing:** React Router v6
- **Database:** Supabase (PostgreSQL)
- **Auth:** Custom Edge Function with bcrypt
- **Redirects:** Supabase Edge Functions (Deno)
- **Styling:** Pure CSS with CSS variables
- **Theme:** Dark/Light mode support

## Database Schema

### app_users
- User accounts with authentication
- Roles: admin or user
- Bcrypt password hashing

### shortlinks
- Short code (unique)
- Destination URL
- Owner (user_id)
- Click count
- Active status
- Timestamps

## Edge Functions

### auth
- **Path:** `/functions/v1/auth`
- **Auth:** Public (no JWT verification)
- **Actions:** signin, create_user, update_password
- **Purpose:** Secure authentication with bcrypt

### redirect
- **Path:** `/functions/v1/redirect?code=:code`
- **Auth:** Public (no JWT verification)
- **Purpose:** Fast shortlink redirects with click tracking

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Environment Variables

Required in `.env` file:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Security

- Row Level Security (RLS) on all tables
- Bcrypt password hashing (10 rounds)
- Session management via localStorage
- Public shortlinks use security definer function
- Role-based permissions enforced at database level

## Color Scheme

- **Primary:** Blue (#3b82f6)
- **Success:** Green (#10b981)
- **Danger:** Red (#ef4444)

Both light and dark themes supported with seamless transitions.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
