export interface Track {
  title: string;
  cover: string;
  duration: string;
  plays: string; // e.g., "1.2M"
  explicit?: boolean;
}

export interface Album {
  title: string;
  cover: string;
  year: number;
}

export interface Event {
  city: string;
  date: string; // e.g., "JUN 28"
  venue: string;
}

export interface AudienceLocation {
  city: string;
  listeners: string; // e.g., "150K"
}

// NOTE: Using placeholder images. Replace with actual paths if available.
const placeholderCover = "/Eladio - DON KBRN.png";

export const artistData = {
  name: "Eladio Carrión",
  profilePic: "/EladioCarrionAvatar.png",
  monthlyListeners: "15.8M",
};

export const topTracks: Track[] = [
  {
    title: "El Reggaetón del Disco",
    cover: placeholderCover,
    duration: "3:23",
    plays: "90.5M",
    explicit: true,
  },
  {
    title: "Invencible",
    cover: placeholderCover,
    duration: "1:30",
    plays: "78.2M",
    explicit: true,
  },
  {
    title: "Romeo y Julieta",
    cover: placeholderCover,
    duration: "3:26",
    plays: "65.1M",
    explicit: true,
  },
  {
    title: "Coco Chanel",
    cover: "/3MEN2_KBRN_Cover.png",
    duration: "3:28",
    plays: "57.6M",
    explicit: true,
  },
  {
    title: "Chulx",
    cover: "/Lia_Kali_Chulx_Cover.png",
    duration: "3:03",
    plays: "45.3M",
    explicit: true,
  },
];

export const albums: Album[] = [
  { title: "DON KBRN", cover: placeholderCover, year: 2025 },
  { title: "Sol María", cover: "/Eladio_Sol_Maria_Cover.png", year: 2024 },
  { title: "3MEN2 KBRN", cover: "/3MEN2_KBRN_Cover.png", year: 2023 },
  {
    title: "Sauce Boyz 2",
    cover: "/Eladio_Sauce_Boyz_2_Cover.png",
    year: 2021,
  },
];

export const upcomingEvents: Event[] = [
  { city: "Madrid", date: "JUL 15", venue: "Wizink Center" },
  { city: "Barcelona", date: "JUL 18", venue: "Palau Sant Jordi" },
  { city: "Miami", date: "AUG 05", venue: "Kaseya Center" },
  { city: "Los Angeles", date: "AUG 12", venue: "Crypto.com Arena" },
];

export const audienceLocations: AudienceLocation[] = [
  { city: "Mexico City", listeners: "1.5M" },
  { city: "Santiago", listeners: "1.1M" },
  { city: "Madrid", listeners: "950K" },
  { city: "Buenos Aires", listeners: "800K" },
  { city: "Bogotá", listeners: "750K" },
];
