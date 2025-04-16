# Deployment Instructions for Play Music App

## Prerequisites
1. Vercel account
2. Domain registrar account (to configure play-music.app and artist.play-music.app)
3. Clerk account with API keys
4. Supabase account with API keys

## Deployment Steps

### 1. Set Up Environment Variables

#### For Main App (play-music.app)
Create a `.env.local` file in the main-app directory with:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### For Artist Dashboard (artist.play-music.app)
Create a `.env.local` file in the artist-dashboard directory with:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Install Vercel CLI
```bash
npm install -g vercel
```

### 3. Deploy Main App
```bash
cd /home/ubuntu/play-music-project/main-app
vercel login
vercel
```
During the setup process:
- Set the production branch to `main`
- Configure the project name as `play-music-app`
- Set the root directory to `.`
- Override default build command if needed
- Set the output directory to `.next`
- Add environment variables from your `.env.local` file

### 4. Deploy Artist Dashboard
```bash
cd /home/ubuntu/play-music-project/artist-dashboard
vercel
```
During the setup process:
- Set the production branch to `main`
- Configure the project name as `artist-play-music-app`
- Set the root directory to `.`
- Override default build command if needed
- Set the output directory to `.next`
- Add environment variables from your `.env.local` file

### 5. Configure Custom Domains
After deployment, in the Vercel dashboard:
1. Go to each project's settings
2. Navigate to the "Domains" section
3. Add your custom domains:
   - `play-music.app` for the main app
   - `artist.play-music.app` for the artist dashboard
4. Follow Vercel's instructions to configure DNS settings with your domain registrar

### 6. Final Testing
After deployment, verify:
- Both applications are accessible at their respective domains
- Authentication works correctly
- Database connections are functioning
- All features work as expected in the production environment
