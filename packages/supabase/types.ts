// Define basic structures for nested objects used in Track
// Adjust these based on the actual Spotify API response structure if needed

export interface Artist {
  id: string;
  name: string;
  // Add other relevant artist fields if needed
}

export interface AlbumImage {
  url: string;
  height?: number;
  width?: number;
}

export interface Album {
  id: string;
  name: string;
  images: AlbumImage[];
  // Add other relevant album fields if needed
}

export interface ExternalUrls {
  spotify: string;
  // Add other external URL types if available (e.g., apple_music)
}

// Define the main Track type
export interface Track {
  id: string; // Spotify Track ID
  name: string;
  artists: Artist[];
  album: Album;
  preview_url: string | null; // Can be null
  external_urls: ExternalUrls;
  duration_ms: number;
  // Add any other fields you might receive from the Spotify API and want to use
  // Example: popularity?: number;
  // Example: is_playable?: boolean;
}
