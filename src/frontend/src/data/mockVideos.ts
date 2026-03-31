export interface MockVideo {
  id: number;
  title: string;
  creator: string;
  handle: string;
  description: string;
  hashtags: string[];
  category: string;
  thumbnail: string;
  likes: number;
  comments: number;
  shares: number;
  song: string;
}

export const MOCK_VIDEOS: MockVideo[] = [
  {
    id: 1,
    title: "Epic Bhangra Moves 🕺",
    creator: "Arjun Vibes",
    handle: "@arjun_vibes",
    description:
      "Watch me slay this Bhangra routine at the Punjab Festival! Pure energy 🔥",
    hashtags: ["#Bhangra", "#PunjabiFolk", "#Dance", "#India"],
    category: "Dance",
    thumbnail: "/assets/generated/thumb-bhangra.dim_400x700.jpg",
    likes: 42800,
    comments: 1240,
    shares: 3600,
    song: "🎵 Tunak Tunak Tun - Daler Mehndi",
  },
  {
    id: 2,
    title: "Street Food Mumbai 🍜",
    creator: "Mumbai Foodie",
    handle: "@mumbai_foodie",
    description:
      "Best Vada Pav spot in Dadar — must try if you visit! Street food heaven 😍",
    hashtags: ["#MumbaiFoodScene", "#StreetFood", "#VadaPav", "#Foodie"],
    category: "Food",
    thumbnail: "/assets/generated/thumb-food.dim_400x700.jpg",
    likes: 89200,
    comments: 4320,
    shares: 12000,
    song: "🎵 Ek Baar Aa Ja — Pritam",
  },
  {
    id: 3,
    title: "IPL Highlights 🏏",
    creator: "Cricket Crazy",
    handle: "@cricket_crazy",
    description:
      "That six over mid-wicket! 🏏 This season is absolutely insane! #IPL2024",
    hashtags: ["#IPL2024", "#Cricket", "#Mumbai Indians", "#Virat"],
    category: "Cricket",
    thumbnail: "/assets/generated/thumb-cricket.dim_400x700.jpg",
    likes: 156000,
    comments: 8900,
    shares: 24000,
    song: "🎵 Kar Har Maidaan Fateh — Sukhwinder",
  },
  {
    id: 4,
    title: "Classical Dance Fusion 💃",
    creator: "Dance India",
    handle: "@dance_india",
    description:
      "Bharatanatyam meets Bollywood — a fusion you have never seen before! 💃✨",
    hashtags: ["#Bharatanatyam", "#BollywoodDance", "#ClassicalFusion"],
    category: "Dance",
    thumbnail: "/assets/generated/thumb-dance.dim_400x700.jpg",
    likes: 73400,
    comments: 2810,
    shares: 9800,
    song: "🎵 Naatu Naatu — MM Keeravani",
  },
  {
    id: 5,
    title: "Himalayan Trek 🏔️",
    creator: "Adventurer Raj",
    handle: "@adventurer_raj",
    description:
      "Day 12 of my Spiti Valley trek. The views are absolutely breathtaking 😮",
    hashtags: ["#Himalayas", "#SpitivalleyTrek", "#Adventure", "#Travel"],
    category: "Travel",
    thumbnail: "/assets/generated/thumb-himalaya.dim_400x700.jpg",
    likes: 31600,
    comments: 980,
    shares: 5400,
    song: "🎵 Kun Faya Kun — A.R. Rahman",
  },
  {
    id: 6,
    title: "Diwali Celebration ✨",
    creator: "Festival Queen",
    handle: "@festival_queen",
    description:
      "Happy Diwali everyone! 🪔 Lighting diyas and rangoli with my family 🥰",
    hashtags: ["#Diwali2024", "#FestivalOfLights", "#Rangoli", "#India"],
    category: "Bollywood",
    thumbnail: "/assets/generated/thumb-diwali.dim_400x700.jpg",
    likes: 201000,
    comments: 15200,
    shares: 48000,
    song: "🎵 Tum Hi Ho — Arijit Singh",
  },
];

export const CATEGORIES = [
  "All",
  "Bollywood",
  "Cricket",
  "Dance",
  "Comedy",
  "Food",
  "Travel",
  "Lifestyle",
];

export const TRENDING_HASHTAGS = [
  "#IPL2024",
  "#Diwali",
  "#Bhangra",
  "#Biryani",
  "#Bollywood",
  "#Cricket",
  "#Holi",
  "#Desi",
  "#Mumbai",
  "#Delhi",
  "#Bangalore",
  "#Chai",
];

export function formatCount(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}
