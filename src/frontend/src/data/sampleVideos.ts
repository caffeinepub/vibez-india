export interface VideoData {
  id: string;
  username: string;
  handle: string;
  avatar: string;
  thumbnail: string;
  caption: string;
  hashtags: string[];
  soundName: string;
  soundArtist: string;
  likes: number;
  comments: number;
  shares: number;
  category: string;
  isFollowing: boolean;
}

export const SAMPLE_VIDEOS: VideoData[] = [
  {
    id: "1",
    username: "Priya Sharma",
    handle: "@BollywoodBeats",
    avatar: "/assets/generated/avatar-bollywood.dim_100x100.jpg",
    thumbnail: "/assets/generated/thumb-bollywood.dim_400x700.jpg",
    caption:
      "Main character energy at Filmfare Awards 2024 🎬✨ This outfit took 3 months to make!",
    hashtags: [
      "#Bollywood",
      "#FilmfareAwards",
      "#DesiFashion",
      "#BollywoodVibes",
    ],
    soundName: "Besharam Rang",
    soundArtist: "Vishal-Sheykhar",
    likes: 482300,
    comments: 12400,
    shares: 8900,
    category: "Bollywood",
    isFollowing: false,
  },
  {
    id: "2",
    username: "Rahul Cricket",
    handle: "@CricketFever",
    avatar: "/assets/generated/avatar-cricket.dim_100x100.jpg",
    thumbnail: "/assets/generated/thumb-cricket.dim_400x700.jpg",
    caption:
      "INDIA WON!! 🏆🇮🇳 What a match at Wankhede Stadium! Rohit Sharma century! 🎉",
    hashtags: ["#IPL2024", "#TeamIndia", "#Cricket", "#BleedBlue"],
    soundName: "Victory Cheer",
    soundArtist: "Stadium Crowd",
    likes: 1240000,
    comments: 45600,
    shares: 32100,
    category: "Cricket",
    isFollowing: true,
  },
  {
    id: "3",
    username: "Kavya Singh",
    handle: "@DelhiDancer",
    avatar: "/assets/generated/avatar-dancer.dim_100x100.jpg",
    thumbnail: "/assets/generated/thumb-dance.dim_400x700.jpg",
    caption:
      "Learned this Bhangra routine in just 2 days 💃 Delhi streets are my stage! 🌟",
    hashtags: ["#Bhangra", "#IndianDance", "#DelhiGirl", "#DanceTrend"],
    soundName: "Jind Mahi",
    soundArtist: "Diljit Dosanjh",
    likes: 876500,
    comments: 23400,
    shares: 15600,
    category: "Dance",
    isFollowing: false,
  },
  {
    id: "4",
    username: "Chef Arjun",
    handle: "@SpiceKitchen",
    avatar: "/assets/generated/avatar-food.dim_100x100.jpg",
    thumbnail: "/assets/generated/thumb-food.dim_400x700.jpg",
    caption:
      "Best Pani Puri in all of Mumbai! 😍 This chaat wala has been here for 40 years! 🌶️",
    hashtags: ["#StreetFood", "#Mumbai", "#PaniPuri", "#IndianFood"],
    soundName: "Mumbai Calling",
    soundArtist: "Nucleya",
    likes: 654200,
    comments: 18900,
    shares: 11200,
    category: "Food",
    isFollowing: false,
  },
  {
    id: "5",
    username: "Meera Diwali",
    handle: "@MumbaiMoments",
    avatar: "/assets/generated/avatar-bollywood.dim_100x100.jpg",
    thumbnail: "/assets/generated/thumb-diwali.dim_400x700.jpg",
    caption:
      "Happy Diwali from my family to yours! 🪔✨ May this festival of lights bring joy to everyone!",
    hashtags: ["#Diwali", "#FestivalOfLights", "#DiwaliDecor", "#HappyDiwali"],
    soundName: "Aa Dekhen Zara",
    soundArtist: "Traditional",
    likes: 923000,
    comments: 34200,
    shares: 56700,
    category: "Lifestyle",
    isFollowing: true,
  },
  {
    id: "6",
    username: "Aditya Travels",
    handle: "@TajMahalVibes",
    avatar: "/assets/generated/avatar-cricket.dim_100x100.jpg",
    thumbnail: "/assets/generated/thumb-travel.dim_400x700.jpg",
    caption:
      "Taj Mahal at 5AM - no tourists, just pure magic 🕌 Worth every early morning! 📸",
    hashtags: ["#TajMahal", "#IncredibleIndia", "#Travel", "#IndiaTravel"],
    soundName: "Jai Ho",
    soundArtist: "A.R. Rahman",
    likes: 1100000,
    comments: 28300,
    shares: 44500,
    category: "Travel",
    isFollowing: false,
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
  { tag: "#Bollywood", count: "2.4M" },
  { tag: "#IPL2024", count: "8.1M" },
  { tag: "#IndianDance", count: "1.9M" },
  { tag: "#StreetFood", count: "3.2M" },
  { tag: "#Diwali", count: "12.5M" },
  { tag: "#Bhangra", count: "890K" },
  { tag: "#MumbaiDiaries", count: "1.1M" },
  { tag: "#DesiVibes", count: "4.7M" },
];

export const NOTIFICATIONS = [
  {
    id: "n1",
    type: "like",
    user: "CricketFever",
    avatar: "/assets/generated/avatar-cricket.dim_100x100.jpg",
    action: "liked your video",
    content: "INDIA WON!! 🏆🇮🇳",
    time: "2m ago",
    isRead: false,
  },
  {
    id: "n2",
    type: "follow",
    user: "DelhiDancer",
    avatar: "/assets/generated/avatar-dancer.dim_100x100.jpg",
    action: "started following you",
    content: "",
    time: "15m ago",
    isRead: false,
  },
  {
    id: "n3",
    type: "comment",
    user: "SpiceKitchen",
    avatar: "/assets/generated/avatar-food.dim_100x100.jpg",
    action: "commented on your video",
    content: "Amazing moves! 🔥",
    time: "1h ago",
    isRead: true,
  },
  {
    id: "n4",
    type: "like",
    user: "BollywoodBeats",
    avatar: "/assets/generated/avatar-bollywood.dim_100x100.jpg",
    action: "liked your video",
    content: "Taj Mahal at 5AM 📸",
    time: "2h ago",
    isRead: true,
  },
  {
    id: "n5",
    type: "follow",
    user: "MumbaiMoments",
    avatar: "/assets/generated/avatar-bollywood.dim_100x100.jpg",
    action: "started following you",
    content: "",
    time: "3h ago",
    isRead: true,
  },
  {
    id: "n6",
    type: "comment",
    user: "TajMahalVibes",
    avatar: "/assets/generated/avatar-cricket.dim_100x100.jpg",
    action: "replied to your comment",
    content: "5AM was totally worth it!",
    time: "5h ago",
    isRead: true,
  },
];
