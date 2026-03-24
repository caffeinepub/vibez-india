import { ChevronDown, Mail, Search, Upload } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { VideoCard } from "../components/VideoCard";
import { CATEGORIES, SAMPLE_VIDEOS } from "../data/sampleVideos";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface FeedPageProps {
  onUploadClick: () => void;
}

export function FeedPage({ onUploadClick }: FeedPageProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTab, setActiveTab] = useState<"live" | "following" | "foryou">(
    "foryou",
  );
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { login, identity } = useInternetIdentity();

  const filteredVideos =
    activeCategory === "All"
      ? SAMPLE_VIDEOS
      : SAMPLE_VIDEOS.filter((v) => v.category === activeCategory);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleScroll = () => {
      const idx = Math.round(el.scrollTop / el.clientHeight);
      setCurrentVideoIndex(idx);
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{ background: "oklch(0.14 0.022 240)" }}
    >
      {/* Top Nav */}
      <header
        className="flex-shrink-0 z-30 px-4 py-2"
        style={{
          background:
            "linear-gradient(to bottom, oklch(0.14 0.022 240), oklch(0.17 0.027 240))",
          borderBottom: "1px solid oklch(0.26 0.032 240 / 0.5)",
        }}
      >
        <div className="flex items-center gap-2 max-w-screen-sm mx-auto">
          {/* Logo */}
          <span
            className="font-display text-2xl font-extrabold tracking-tight flex-shrink-0"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.74 0.166 58), oklch(0.82 0.18 72))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Vibez
          </span>

          {/* Tab buttons */}
          <div className="flex items-center gap-1 mx-2 flex-shrink-0">
            {(["live", "following", "foryou"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                data-ocid={`feed.${tab}.tab`}
                onClick={() => setActiveTab(tab)}
                className="text-sm font-semibold px-2 py-1 relative transition-colors"
                style={{
                  color:
                    activeTab === tab
                      ? "oklch(0.74 0.166 58)"
                      : "oklch(0.68 0.028 240)",
                }}
              >
                {tab === "live"
                  ? "Live"
                  : tab === "following"
                    ? "Following"
                    : "For You"}
                {activeTab === tab && (
                  <motion.div
                    layoutId="tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ background: "oklch(0.74 0.166 58)" }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Search */}
          <div
            className="flex-1 flex items-center gap-2 rounded-full px-3 py-1.5 text-sm"
            style={{
              background: "oklch(0.21 0.030 240)",
              border: "1px solid oklch(0.26 0.032 240)",
            }}
          >
            <Search size={14} style={{ color: "oklch(0.68 0.028 240)" }} />
            <input
              data-ocid="feed.search_input"
              className="bg-transparent flex-1 outline-none text-foreground placeholder:text-muted-foreground text-xs min-w-0"
              placeholder="Search..."
            />
          </div>

          {/* Icons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              data-ocid="feed.mail.button"
              className="w-8 h-8 flex items-center justify-center rounded-full"
              style={{ color: "oklch(0.68 0.028 240)" }}
              aria-label="Messages"
            >
              <Mail size={18} />
            </button>
            <button
              type="button"
              data-ocid="feed.upload.button"
              onClick={onUploadClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
              style={{
                background: "oklch(0.74 0.166 58)",
                color: "oklch(0.14 0.022 240)",
              }}
            >
              <Upload size={12} />
              <span>Upload</span>
            </button>
            {identity ? (
              <button
                type="button"
                data-ocid="feed.avatar.button"
                className="w-8 h-8 rounded-full overflow-hidden border-2"
                style={{ borderColor: "oklch(0.74 0.166 58)" }}
                aria-label="Profile"
              >
                <div
                  className="w-full h-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: "oklch(0.61 0.265 355)" }}
                >
                  U
                </div>
              </button>
            ) : (
              <button
                type="button"
                data-ocid="feed.login.button"
                onClick={login}
                className="text-xs font-semibold px-2 py-1 rounded-full"
                style={{
                  color: "oklch(0.74 0.166 58)",
                  border: "1px solid oklch(0.74 0.166 58 / 0.5)",
                }}
              >
                Login
              </button>
            )}
          </div>
        </div>

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mt-2 pb-1 max-w-screen-sm mx-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              data-ocid={`feed.${cat.toLowerCase()}.tab`}
              onClick={() => setActiveCategory(cat)}
              className="flex-shrink-0 px-3.5 py-1 rounded-full text-xs font-semibold transition-colors"
              style={{
                background:
                  activeCategory === cat
                    ? "oklch(0.94 0.007 240)"
                    : "oklch(0.21 0.030 240)",
                color:
                  activeCategory === cat
                    ? "oklch(0.14 0.022 240)"
                    : "oklch(0.68 0.028 240)",
                border: "1px solid oklch(0.26 0.032 240 / 0.5)",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Video Feed */}
      <div
        ref={containerRef}
        className="flex-1 snap-container no-scrollbar"
        style={{ overflowY: "scroll" }}
      >
        <AnimatePresence>
          {filteredVideos.length > 0 ? (
            filteredVideos.map((video, index) => (
              <VideoCard
                key={video.id}
                video={video}
                isActive={index === currentVideoIndex}
                index={index}
              />
            ))
          ) : (
            <div
              className="flex flex-col items-center justify-center h-full gap-4"
              data-ocid="feed.empty_state"
            >
              <p className="text-muted-foreground">
                No videos in this category yet
              </p>
              <button
                type="button"
                data-ocid="feed.upload_button"
                onClick={onUploadClick}
                className="px-6 py-2 rounded-full font-semibold text-background"
                style={{ background: "oklch(0.74 0.166 58)" }}
              >
                Be the first to upload!
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Scroll hint */}
      {currentVideoIndex === 0 && filteredVideos.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none"
        >
          <ChevronDown
            size={20}
            style={{ color: "oklch(0.74 0.166 58 / 0.7)" }}
            className="animate-bounce"
          />
        </motion.div>
      )}
    </div>
  );
}
