export interface MockVideo {
  id: number;
  title: string;
  creator: string;
  handle: string;
  description: string;
  hashtags: string[];
  category: string;
  gradient: string;
  thumbnail?: string;
  likes: number;
  comments: number;
  shares: number;
  song: string;
  location: string;
}

export type TabId = "home" | "discover" | "upload" | "inbox" | "profile";
