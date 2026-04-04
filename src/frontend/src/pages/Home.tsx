import { useState } from "react";
import CategoryTabs from "../components/CategoryTabs";
import Header from "../components/Header";
import VideoFeed from "../components/VideoFeed";
import { MOCK_VIDEOS } from "../data/videos";
import type { MockVideo } from "../types";

const CATEGORY_MAP: Record<string, string[]> = {
  Bollywood: ["Bollywood"],
  Cricket: ["Cricket"],
  Dance: ["Dance"],
  Comedy: ["Comedy"],
  Music: ["Music"],
  Food: ["Food"],
  Travel: ["Travel"],
  Lifestyle: ["Lifestyle"],
};

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("For You");

  const filtered: MockVideo[] =
    activeCategory === "For You" || activeCategory === "Following"
      ? MOCK_VIDEOS
      : MOCK_VIDEOS.filter((v) => {
          const cats = CATEGORY_MAP[activeCategory] ?? [];
          return cats.includes(v.category);
        });

  return (
    <div
      className="relative flex flex-col"
      style={{ height: "100dvh", background: "oklch(0.08 0.01 240)" }}
      data-ocid="home.page"
    >
      <Header />
      <CategoryTabs active={activeCategory} onChange={setActiveCategory} />
      <div className="flex-1 min-h-0">
        <VideoFeed videos={filtered} activeCategory={activeCategory} />
      </div>
    </div>
  );
}
