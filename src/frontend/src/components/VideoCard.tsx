import {
  Check,
  Heart,
  MessageCircle,
  Music,
  Share2,
  UserPlus,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import type { VideoData } from "../data/sampleVideos";

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

interface VideoCardProps {
  video: VideoData;
  isActive: boolean;
  index: number;
}

export function VideoCard({ video, isActive, index }: VideoCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(video.likes);
  const [following, setFollowing] = useState(video.isFollowing);
  const [heartBurst, setHeartBurst] = useState(false);
  const [progress] = useState(42);
  const lastTapRef = useRef(0);

  const handleLike = useCallback(() => {
    setLiked((prev) => {
      const next = !prev;
      setLikeCount((c) => (next ? c + 1 : c - 1));
      return next;
    });
    if (!liked) {
      setHeartBurst(true);
      setTimeout(() => setHeartBurst(false), 400);
    }
  }, [liked]);

  const handleDoubleTap = useCallback(() => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      if (!liked) handleLike();
    }
    lastTapRef.current = now;
  }, [liked, handleLike]);

  return (
    <div
      className="snap-item relative flex-shrink-0 w-full flex items-center justify-center"
      style={{ height: "calc(100vh - 72px)" }}
      data-ocid={`feed.item.${index + 1}`}
    >
      {/* Video thumbnail / background */}
      <div
        className="relative rounded-3xl overflow-hidden shadow-card"
        style={{
          width: "min(420px, 100vw)",
          height: "min(calc(100vh - 72px), 750px)",
          maxHeight: "90vh",
        }}
      >
        <button
          type="button"
          className="w-full h-full block p-0 border-0 bg-transparent cursor-default"
          aria-label="Double-tap to like"
          onClick={handleDoubleTap}
        >
          <img
            src={video.thumbnail}
            alt={video.caption}
            className="w-full h-full object-cover"
            style={{ display: "block" }}
          />
        </button>

        {/* Dark gradient overlay bottom */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 40%, transparent 65%)",
          }}
        />

        {/* Playing indicator */}
        {isActive && (
          <div className="absolute top-4 right-4 flex gap-1 items-center pointer-events-none">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-0.5 bg-white rounded-full"
                style={{
                  height: `${12 + i * 4}px`,
                  opacity: 0.8,
                  animation: `pulse ${0.6 + i * 0.15}s ease-in-out infinite alternate`,
                }}
              />
            ))}
          </div>
        )}

        {/* Right action rail */}
        <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5">
          {/* Follow/Avatar */}
          <div className="relative">
            <button
              type="button"
              data-ocid={`feed.${index + 1}.open_modal_button`}
              className="w-11 h-11 rounded-full border-2 overflow-hidden block"
              style={{ borderColor: "oklch(0.74 0.166 58)" }}
              aria-label="View profile"
            >
              <img
                src={video.avatar}
                alt={video.username}
                className="w-full h-full object-cover"
              />
            </button>
            <button
              type="button"
              data-ocid={`feed.${index + 1}.toggle`}
              onClick={(e) => {
                e.stopPropagation();
                setFollowing((prev) => !prev);
              }}
              className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center text-white"
              style={{
                background: following
                  ? "oklch(0.72 0.218 150)"
                  : "oklch(0.74 0.166 58)",
              }}
              aria-label={following ? "Following" : "Follow"}
            >
              {following ? (
                <Check size={10} strokeWidth={3} />
              ) : (
                <UserPlus size={10} strokeWidth={2.5} />
              )}
            </button>
          </div>

          {/* Like */}
          <button
            type="button"
            data-ocid={`feed.${index + 1}.button`}
            onClick={handleLike}
            className="flex flex-col items-center gap-1"
            aria-label="Like"
          >
            <Heart
              size={30}
              fill={liked ? "oklch(0.61 0.265 355)" : "none"}
              stroke={liked ? "oklch(0.61 0.265 355)" : "white"}
              strokeWidth={2}
              className={heartBurst ? "heart-burst" : ""}
              style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))" }}
            />
            <span
              className="text-white text-xs font-semibold"
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
            >
              {formatCount(likeCount)}
            </span>
          </button>

          {/* Comment */}
          <button
            type="button"
            data-ocid={`feed.${index + 1}.secondary_button`}
            className="flex flex-col items-center gap-1"
            aria-label="Comment"
          >
            <MessageCircle
              size={28}
              stroke="white"
              strokeWidth={2}
              style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))" }}
            />
            <span
              className="text-white text-xs font-semibold"
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
            >
              {formatCount(video.comments)}
            </span>
          </button>

          {/* Share */}
          <button
            type="button"
            data-ocid={`feed.${index + 1}.share_button`}
            className="flex flex-col items-center gap-1"
            aria-label="Share"
          >
            <Share2
              size={26}
              stroke="white"
              strokeWidth={2}
              style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))" }}
            />
            <span
              className="text-white text-xs font-semibold"
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
            >
              {formatCount(video.shares)}
            </span>
          </button>

          {/* Spinning record */}
          <button
            type="button"
            className="flex flex-col items-center gap-1"
            aria-label="Sound"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${isActive ? "animate-spin-slow" : ""}`}
              style={{
                background:
                  "radial-gradient(circle, oklch(0.14 0.022 240) 30%, oklch(0.26 0.032 240) 100%)",
                border: "2px solid oklch(0.74 0.166 58 / 0.6)",
              }}
            >
              <Music size={12} stroke="oklch(0.74 0.166 58)" />
            </div>
          </button>
        </div>

        {/* Bottom caption overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 pb-3 pointer-events-none">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white font-bold text-sm">{video.handle}</span>
          </div>
          <p className="text-white text-sm leading-snug mb-1 line-clamp-2">
            {video.caption}
          </p>
          <div className="flex flex-wrap gap-1 mb-2">
            {video.hashtags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs font-semibold"
                style={{ color: "oklch(0.74 0.166 58)" }}
              >
                {tag}
              </span>
            ))}
          </div>
          {/* Sound info */}
          <div className="flex items-center gap-2 mb-3">
            <Music size={11} style={{ color: "oklch(0.94 0.007 240 / 0.8)" }} />
            <span className="text-xs text-white/70 truncate max-w-[200px]">
              {video.soundName} · {video.soundArtist}
            </span>
          </div>
          {/* Progress bar */}
          <div
            className="relative h-0.5 rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.25)" }}
          >
            <div
              className="absolute left-0 top-0 h-full rounded-full"
              style={{
                width: `${progress}%`,
                background: "oklch(0.74 0.166 58)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
