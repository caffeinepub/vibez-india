import { Search, TrendingUp, Users } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import {
  CATEGORIES,
  SAMPLE_VIDEOS,
  TRENDING_HASHTAGS,
} from "../data/sampleVideos";

export function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredVideos = SAMPLE_VIDEOS.filter((v) => {
    const matchesSearch =
      !searchQuery ||
      v.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.hashtags.some((h) =>
        h.toLowerCase().includes(searchQuery.toLowerCase()),
      ) ||
      v.handle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "All" || v.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{ background: "oklch(0.14 0.022 240)" }}
    >
      {/* Header */}
      <header
        className="flex-shrink-0 px-4 pt-4 pb-3 z-10"
        style={{
          background:
            "linear-gradient(to bottom, oklch(0.14 0.022 240), oklch(0.17 0.027 240))",
          borderBottom: "1px solid oklch(0.26 0.032 240 / 0.5)",
        }}
      >
        <h1
          className="font-display text-xl font-bold mb-3"
          style={{ color: "oklch(0.94 0.007 240)" }}
        >
          Discover
        </h1>
        <div
          className="flex items-center gap-3 rounded-full px-4 py-3"
          style={{
            background: "oklch(0.21 0.030 240)",
            border: "1px solid oklch(0.26 0.032 240)",
          }}
        >
          <Search size={16} style={{ color: "oklch(0.68 0.028 240)" }} />
          <input
            data-ocid="discover.search_input"
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: "oklch(0.94 0.007 240)" }}
            placeholder="Search videos, hashtags, creators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar mt-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              data-ocid={`discover.${cat.toLowerCase()}.tab`}
              onClick={() => setActiveFilter(cat)}
              className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-colors"
              style={{
                background:
                  activeFilter === cat
                    ? "oklch(0.74 0.166 58)"
                    : "oklch(0.21 0.030 240)",
                color:
                  activeFilter === cat
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

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4">
        {!searchQuery && (
          <>
            <section className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp
                  size={18}
                  style={{ color: "oklch(0.74 0.166 58)" }}
                />
                <h2
                  className="font-semibold text-sm"
                  style={{ color: "oklch(0.94 0.007 240)" }}
                >
                  Trending in India
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {TRENDING_HASHTAGS.map((item, i) => (
                  <motion.button
                    key={item.tag}
                    type="button"
                    data-ocid={`discover.trending.item.${i + 1}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-xl text-left"
                    style={{
                      background: "oklch(0.21 0.030 240)",
                      border: "1px solid oklch(0.26 0.032 240 / 0.4)",
                    }}
                    onClick={() => setSearchQuery(item.tag)}
                  >
                    <div>
                      <div
                        className="text-sm font-bold"
                        style={{ color: "oklch(0.74 0.166 58)" }}
                      >
                        {item.tag}
                      </div>
                      <div
                        className="text-xs mt-0.5"
                        style={{ color: "oklch(0.68 0.028 240)" }}
                      >
                        {item.count} videos
                      </div>
                    </div>
                    <TrendingUp
                      size={14}
                      style={{ color: "oklch(0.72 0.218 150)" }}
                    />
                  </motion.button>
                ))}
              </div>
            </section>

            <section className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Users size={18} style={{ color: "oklch(0.74 0.166 58)" }} />
                <h2
                  className="font-semibold text-sm"
                  style={{ color: "oklch(0.94 0.007 240)" }}
                >
                  Popular Creators
                </h2>
              </div>
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                {SAMPLE_VIDEOS.map((v, i) => (
                  <div
                    key={v.id}
                    data-ocid={`discover.creator.item.${i + 1}`}
                    className="flex-shrink-0 flex flex-col items-center gap-2"
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.07 }}
                      className="w-16 h-16 rounded-full overflow-hidden border-2"
                      style={{ borderColor: "oklch(0.74 0.166 58 / 0.6)" }}
                    >
                      <img
                        src={v.avatar}
                        alt={v.username}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                    <span
                      className="text-xs font-medium text-center w-16 truncate"
                      style={{ color: "oklch(0.94 0.007 240)" }}
                    >
                      {v.handle}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        <section>
          {searchQuery && (
            <h2
              className="font-semibold text-sm mb-3"
              style={{ color: "oklch(0.68 0.028 240)" }}
            >
              {filteredVideos.length} result
              {filteredVideos.length !== 1 ? "s" : ""} for &ldquo;{searchQuery}
              &rdquo;
            </h2>
          )}
          {filteredVideos.length === 0 ? (
            <div
              data-ocid="discover.empty_state"
              className="flex flex-col items-center gap-3 py-16"
            >
              <Search size={48} style={{ color: "oklch(0.26 0.032 240)" }} />
              <p style={{ color: "oklch(0.68 0.028 240)" }}>No results found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {filteredVideos.map((video, i) => (
                <motion.div
                  key={video.id}
                  data-ocid={`discover.video.item.${i + 1}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.06 }}
                  className="relative rounded-xl overflow-hidden"
                  style={{ aspectRatio: "9/16" }}
                >
                  <img
                    src={video.thumbnail}
                    alt={video.caption}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)",
                    }}
                  />
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-white text-xs font-semibold truncate">
                      {video.handle}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "oklch(0.74 0.166 58)" }}
                    >
                      ♥ {(video.likes / 1000).toFixed(0)}K
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
