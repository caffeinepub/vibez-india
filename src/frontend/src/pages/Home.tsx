import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Bell, Search } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import VideoCard from "../components/VideoCard";
import type { MockVideo } from "../data/mockVideos";
import { CATEGORIES, MOCK_VIDEOS } from "../data/mockVideos";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetNotifications } from "../hooks/useQueries";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { identity } = useInternetIdentity();
  const { data: notifications } = useGetNotifications();
  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;

  const filtered: MockVideo[] =
    activeCategory === "All"
      ? MOCK_VIDEOS
      : MOCK_VIDEOS.filter((v) => v.category === activeCategory);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const index = Math.round(container.scrollTop / window.innerHeight);
      setActiveIndex(index);
    };
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const initial =
    identity?.getPrincipal().toString().slice(0, 2).toUpperCase() ?? "VI";

  return (
    <div className="relative h-[100dvh] overflow-hidden" data-ocid="home.page">
      {/* Sticky top header */}
      <header
        className="absolute top-0 left-0 right-0 z-30 flex items-center gap-2 px-3 pt-3 pb-2"
        style={{
          background:
            "linear-gradient(to bottom, oklch(0.09 0.02 240 / 0.95) 60%, transparent)",
        }}
      >
        {/* Brand mark */}
        <div className="flex flex-col leading-none mr-1 flex-shrink-0">
          <span
            className="font-display font-black text-sm tracking-widest"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.73 0.17 55), oklch(0.58 0.24 340))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            VIBEZ
          </span>
          <span
            className="font-display font-black text-[9px] tracking-widest"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.73 0.17 55), oklch(0.58 0.24 340))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            INDIA
          </span>
        </div>

        {/* Search bar */}
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search videos, creators…"
            className="pl-8 h-8 text-xs border-none rounded-full"
            style={{ background: "oklch(0.16 0.03 240)" }}
            data-ocid="home.search_input"
            readOnly
          />
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            className="relative p-1"
            data-ocid="home.notifications.button"
          >
            <Bell className="w-5 h-5 text-foreground" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500" />
            )}
          </button>
          <Avatar className="w-7 h-7 border border-primary">
            <AvatarFallback
              className="text-[10px] font-bold"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.73 0.17 55), oklch(0.58 0.24 340))",
                color: "white",
              }}
            >
              {initial}
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Category filter pills */}
      <div className="absolute top-14 left-0 right-0 z-30 pb-2 px-3">
        <div className="pills-scroll flex items-center gap-2">
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat}
              type="button"
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                setActiveCategory(cat);
                setActiveIndex(0);
              }}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                activeCategory === cat
                  ? "border-primary text-primary-foreground"
                  : "bg-transparent text-white/80 border-white/30"
              }`}
              style={
                activeCategory === cat
                  ? {
                      background: "var(--primary)",
                      borderColor: "var(--primary)",
                    }
                  : {}
              }
              data-ocid="home.category.tab"
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Video feed */}
      <div
        ref={containerRef}
        className="snap-container h-full"
        data-ocid="feed.list"
      >
        {filtered.length > 0 ? (
          filtered.map((video, i) => (
            <VideoCard
              key={video.id}
              video={video}
              isActive={i === activeIndex}
            />
          ))
        ) : (
          <div
            className="snap-item h-[100dvh] flex flex-col items-center justify-center gap-4"
            data-ocid="feed.empty_state"
          >
            <span className="text-5xl">🎬</span>
            <p className="text-muted-foreground text-center">
              No videos in <strong>{activeCategory}</strong> yet.
              <br />
              Be the first to post!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
