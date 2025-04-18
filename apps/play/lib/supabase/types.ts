export interface Artist {
  id: string;
  name: string;
}

export interface AlbumImage {
  height: number;
  url: string;
  width: number;
}

export interface Album {
  id: string;
  name: string;
  images: AlbumImage[];
}

export interface ExternalUrls {
  spotify: string;
}

export interface Track {
  id: string;
  name: string;
  preview_url: string | null;
  duration_ms: number;
  album: Album;
  artists: Artist[];
  external_urls: ExternalUrls;
  // Add more fields as needed based on the actual Spotify API response
}
