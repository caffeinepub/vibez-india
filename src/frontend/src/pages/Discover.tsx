import { Input } from "@/components/ui/input";
import { Search, TrendingUp, User } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import Header from "../components/Header";
import { MOCK_VIDEOS, TRENDING_HASHTAGS } from "../data/videos";
import { useSearchVideos } from "../hooks/useQueries";

const MOCK_CREATORS = [
  {
    name: "Priya Dances",
    handle: "@priya_dances",
    followers: "2.1M",
    avatar: "/assets/generated/avatar-dancer.dim_100x100.jpg",
    initials: "PD",
  },
  {
    name: "Rohit Cricket",
    handle: "@rohit_cricket",
    followers: "5.4M",
    avatar: "/assets/generated/avatar-cricket.dim_100x100.jpg",
    initials: "RC",
  },
  {
    name: "Mumbai Foodie",
    handle: "@mumbai_foodie",
    followers: "3.2M",
    avatar: "/assets/generated/avatar-food.dim_100x100.jpg",
    initials: "MF",
  },
  {
    name: "Vikram Travels",
    handle: "@arjun_travel",
    followers: "1.1M",
    avatar: "/assets/generated/avatar-bollywood.dim_100x100.jpg",
    initials: "VT",
  },
  {
    name: "Meera Yoga",
    handle: "@meera_yoga",
    followers: "890K",
    avatar: "/assets/generated/avatar-dancer.dim_100x100.jpg",
    initials: "MY",
  },
  {
    name: "Kavya Music",
    handle: "@kavya_music",
    followers: "7.8M",
    avatar: "/assets/generated/avatar-bollywood.dim_100x100.jpg",
    initials: "KM",
  },
];

export default function Discover() {
  const [query, setQuery] = useState("");
  const { data: searchResults } = useSearchVideos(query);
  const backendResults =
    query && searchResults && searchResults.length > 0 ? searchResults : null;

  return (
    <div
      className="flex flex-col"
      style={{ height: "100dvh", background: "oklch(0.08 0.01 240)" }}
      data-ocid="discover.page"
    >
      <Header />
      <div className="flex-1 overflow-y-auto pb-20">
        <div
          className="sticky top-0 z-10 px-4 pt-3 pb-3"
          style={{
            background: "oklch(0.08 0.01 240 / 0.95)",
            backdropFilter: "blur(8px)",
            borderBottom: "1px solid oklch(0.19 0.02 240)",
          }}
        >
          <div className="relative max-w-lg mx-auto">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: "oklch(0.55 0.03 240)" }}
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search videos, creators, hashtags..."
              className="pl-10 border-none text-sm h-9 rounded-full"
              style={{ background: "oklch(0.15 0.015 240)", color: "white" }}
              data-ocid="discover.search_input"
            />
          </div>
        </div>

        <div className="px-4 pt-5 space-y-6 max-w-2xl mx-auto">
          {/* Trending */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4" style={{ color: "#F4A23B" }} />
              <h2 className="font-display font-bold text-base text-white">
                Trending in India
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {TRENDING_HASHTAGS.map((tag) => (
                <motion.button
                  key={tag}
                  type="button"
                  whileTap={{ scale: 0.93 }}
                  onClick={() => setQuery(tag)}
                  className="px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
                  style={{
                    background: "oklch(0.15 0.015 240)",
                    color: "oklch(0.80 0.02 240)",
                  }}
                  data-ocid="discover.hashtag.button"
                >
                  {tag}
                </motion.button>
              ))}
            </div>
          </section>

          {/* Popular Creators */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4" style={{ color: "#F4A23B" }} />
              <h2 className="font-display font-bold text-base text-white">
                Popular Creators
              </h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 pills-scroll">
              {MOCK_CREATORS.map((creator, i) => (
                <div
                  key={creator.handle}
                  className="flex flex-col items-center gap-2 flex-shrink-0 w-[72px]"
                  data-ocid={`discover.creator.item.${i + 1}`}
                >
                  <div
                    className="w-14 h-14 rounded-full overflow-hidden saffron-ring flex items-center justify-center text-white font-bold text-base"
                    style={{
                      background:
                        "linear-gradient(135deg, #F4A23B, oklch(0.55 0.22 340))",
                    }}
                  >
                    {creator.avatar ? (
                      <img
                        src={creator.avatar}
                        alt={creator.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      creator.initials
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-[11px] font-semibold text-white truncate w-[72px] text-center">
                      {creator.name}
                    </p>
                    <p
                      className="text-[10px] font-medium"
                      style={{ color: "#F4A23B" }}
                    >
                      {creator.followers}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Video grid */}
          <section>
            <h2 className="font-display font-bold text-base text-white mb-3">
              {backendResults ? `Results for "${query}"` : "Explore Videos"}
            </h2>
            {backendResults && backendResults.length === 0 && (
              <div
                className="text-center py-8"
                style={{ color: "oklch(0.55 0.03 240)" }}
                data-ocid="discover.empty_state"
              >
                No results for &ldquo;{query}&rdquo;
              </div>
            )}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {(backendResults
                ? backendResults.map((v, i) => ({
                    id: i,
                    title: v.title,
                    thumbnail: v.thumbnailUrl,
                    category: v.category,
                  }))
                : MOCK_VIDEOS
              ).map((video, i) => (
                <div
                  key={"id" in video ? video.id : i}
                  className="relative aspect-[9/16] rounded-xl overflow-hidden"
                  style={{ background: "oklch(0.15 0.015 240)" }}
                  data-ocid={`discover.item.${i + 1}`}
                >
                  {"thumbnail" in video && video.thumbnail && (
                    <img
                      src={video.thumbnail as string}
                      alt={video.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}
                  {!("thumbnail" in video && video.thumbnail) &&
                    "gradient" in video && (
                      <div
                        className="w-full h-full"
                        style={{
                          background: (video as { gradient: string }).gradient,
                        }}
                      />
                    )}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)",
                    }}
                  />
                  <p className="absolute bottom-2 left-2 right-2 text-white text-xs font-semibold line-clamp-2">
                    {video.title}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
