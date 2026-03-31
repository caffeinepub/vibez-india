import { Input } from "@/components/ui/input";
import { Search, TrendingUp, User } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { MOCK_VIDEOS, TRENDING_HASHTAGS } from "../data/mockVideos";
import { useSearchVideos } from "../hooks/useQueries";

const MOCK_CREATORS = [
  {
    name: "Arjun Vibes",
    handle: "@arjun_vibes",
    followers: "2.1M",
    color: "from-orange-500 to-pink-500",
  },
  {
    name: "Mumbai Foodie",
    handle: "@mumbai_foodie",
    followers: "890K",
    color: "from-yellow-400 to-orange-500",
  },
  {
    name: "Cricket Crazy",
    handle: "@cricket_crazy",
    followers: "5.4M",
    color: "from-blue-500 to-cyan-400",
  },
  {
    name: "Dance India",
    handle: "@dance_india",
    followers: "3.2M",
    color: "from-purple-500 to-pink-500",
  },
  {
    name: "Adventurer Raj",
    handle: "@adventurer_raj",
    followers: "1.1M",
    color: "from-green-500 to-teal-400",
  },
  {
    name: "Festival Queen",
    handle: "@festival_queen",
    followers: "7.8M",
    color: "from-red-500 to-orange-400",
  },
];

export default function Discover() {
  const [query, setQuery] = useState("");
  const { data: searchResults } = useSearchVideos(query);

  const displayVideos =
    query && searchResults && searchResults.length > 0 ? searchResults : null;

  return (
    <div className="h-[100dvh] overflow-y-auto pb-20" data-ocid="discover.page">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md px-4 pt-12 pb-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search videos, creators, hashtags..."
            className="pl-10 bg-muted border-none text-sm"
            data-ocid="discover.search_input"
          />
        </div>
      </div>

      <div className="px-4 pt-4 space-y-6">
        <section>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h2 className="font-display font-bold text-base">
              Trending in India
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {TRENDING_HASHTAGS.map((tag) => (
              <motion.button
                key={tag}
                type="button"
                whileTap={{ scale: 0.93 }}
                className="px-3 py-1.5 rounded-full bg-muted text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
                data-ocid="discover.hashtag.button"
              >
                {tag}
              </motion.button>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-3">
            <User className="w-4 h-4 text-primary" />
            <h2 className="font-display font-bold text-base">
              Popular Creators
            </h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 pills-scroll">
            {MOCK_CREATORS.map((creator) => (
              <div
                key={creator.handle}
                className="flex flex-col items-center gap-2 flex-shrink-0 w-20"
              >
                <div
                  className={`w-14 h-14 rounded-full bg-gradient-to-br ${creator.color} flex items-center justify-center text-white font-bold text-xl border-2 border-primary`}
                >
                  {creator.name[0]}
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold truncate w-20 text-center">
                    {creator.name}
                  </p>
                  <p className="text-[10px] text-primary font-medium">
                    {creator.followers}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display font-bold text-base mb-3">
            {displayVideos ? `Results for "${query}"` : "Explore Videos"}
          </h2>
          {displayVideos && displayVideos.length === 0 && (
            <div
              className="text-center py-8 text-muted-foreground"
              data-ocid="discover.empty_state"
            >
              No results found for "{query}"
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            {(displayVideos ?? MOCK_VIDEOS).map((video, i) => {
              const mv = "thumbnail" in video ? video : null;
              const thumb = mv ? mv.thumbnail : "";
              const title = "title" in video ? video.title : "";
              const key = "id" in video ? String(video.id) : `search-${i}`;
              return (
                <div
                  key={key}
                  className="relative aspect-[9/16] rounded-lg overflow-hidden bg-muted"
                  data-ocid={`discover.item.${i + 1}`}
                >
                  {thumb && (
                    <img
                      src={thumb}
                      alt={title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <p className="absolute bottom-2 left-2 right-2 text-white text-xs font-semibold line-clamp-2">
                    {title}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
