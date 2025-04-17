# Play

## The Next Music Platform

### Empowering artists and promoting all cultures

## Getting Started

This monorepo contains two Next.js applications built with the [T3 Stack](https://create.t3.gg/), [Bun](https://bun.sh/) for package management, [Supabase](https://supabase.com) for the Database and [Clerk](https://clerk.com) for Auth

- `apps/play`: The main music platform (runs on `localhost:3000`, maps to `play-music.app`)
- `apps/artists`: The artist portal (runs on `localhost:3001`, maps to `artist.play-music.app`)

1.  **Clone the repository:**

    ```bash
    git clone <https://github.com/krismatterz/play-music>
    cd play-music
    ```

2.  **Install dependencies:**
    From the root of the monorepo:

    ```bash
    bun install
    ```

3.  **Set up environment variables:**
    Each application might have its own environment variables.

    - Copy `apps/play/.env.example` to `apps/play/.env` and fill in the values.
    - Copy `apps/artists/.env.example` to `apps/artists/.env` and fill in the values.
      Check each `.env.example` file for required variables.

4.  **This project uses Supabase:**
5.  **Run the development servers:**
    You can run each application concurrently in separate terminals:

    - **To run the `play` app:**

      ```bash
      # From the root directory
        cd apps/play && bun run dev
      ```

      Open [http://localhost:3000](http://localhost:3000) in your browser.

    - **To run the `artists` app:**
      ```bash
      # From the root directory
      cd apps/artists && bun run dev
      ```
      Open [http://localhost:3001](http://localhost:3001) in your browser.

## Resources & Brand Guidelines

When integrating with music platforms, please adhere to their respective guidelines:

- **Spotify:**
  - [Spotify Developer](https://developer.spotify.com)
  - [Spotify Design & Branding Guidelines](https://developer.spotify.com/documentation/design)
- **Apple:**
  - [Apple Developer Licensing and Trademarks](https://developer.apple.com/licensing-trademarks/)
  - [Apple Music Identity Guidelines](https://marketing.services.apple/apple-music-identity-guidelines)
  - [Apple Music Link Builder](https://toolbox.marketingtools.apple.com/en-us/apple-music/link-builder)
- **Amazon:**
  - [Amazon Music Brand Guidelines](https://artists.amazonmusic.com/brand-guidelines)
- **Deezer:**
  - [Deezer Brand Guidelines](https://deezerbrand.com/document/12#/brand-dna/logotype)
