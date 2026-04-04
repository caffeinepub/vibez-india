import { useEffect, useRef } from "react";
import type { MockVideo } from "../types";
import VideoCard from "./VideoCard";

interface VideoFeedProps {
  videos: MockVideo[];
  activeCategory: string;
}

export default function VideoFeed({ videos, activeCategory }: VideoFeedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset scroll position when category changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: activeCategory is intentionally a trigger dep
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [activeCategory]);

  if (videos.length === 0) {
    return (
      <div
        className="h-full flex flex-col items-center justify-center gap-4"
        data-ocid="feed.empty_state"
      >
        <span className="text-5xl">🎬</span>
        <p className="text-center" style={{ color: "oklch(0.60 0.03 240)" }}>
          No videos in <strong className="text-white">{activeCategory}</strong>{" "}
          yet.
          <br />
          Be the first to post!
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="snap-container"
      style={{ height: "100%" }}
      data-ocid="feed.list"
    >
      {videos.map((video, i) => (
        <VideoCard key={video.id} video={video} index={i} />
      ))}
    </div>
  );
}
