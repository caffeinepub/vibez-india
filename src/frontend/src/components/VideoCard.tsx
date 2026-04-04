import { Heart, MapPin, MessageCircle, Music2, Share2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { formatCount } from "../data/videos";
import type { MockVideo } from "../types";
import ShareSheet from "./ShareSheet";

interface VideoCardProps {
  video: MockVideo;
  index: number;
}

export default function VideoCard({ video, index }: VideoCardProps) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(video.likes);
  const [showHeart, setShowHeart] = useState(false);
  const lastTapRef = useRef(0);

  const handleDoubleTap = useCallback(() => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      if (!liked) {
        setLiked(true);
        setLikes((l) => l + 1);
      }
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 900);
    }
    lastTapRef.current = now;
  }, [liked]);

  const toggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (liked) {
      setLiked(false);
      setLikes((l) => l - 1);
    } else {
      setLiked(true);
      setLikes((l) => l + 1);
    }
  };

  const creatorInitial = video.creator[0]?.toUpperCase() ?? "V";

  return (
    <div
      className="snap-item relative w-full flex-shrink-0"
      style={{ height: "100%" }}
      data-ocid={`feed.item.${index + 1}`}
    >
      {/* Full-viewport layout: centered card column + action rail */}
      <div className="w-full h-full flex items-end justify-center pb-20">
        {/* Video card */}
        <div
          className="relative flex-shrink-0"
          style={{
            width: "clamp(280px, 50vw, 340px)",
            height: "calc(100% - 1rem)",
            maxHeight: "680px",
          }}
          onClick={handleDoubleTap}
          onKeyUp={(e) => e.key === "Enter" && handleDoubleTap()}
        >
          {/* Video background */}
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden"
            style={{ borderRadius: "16px" }}
          >
            {video.thumbnail ? (
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
              />
            ) : (
              <div
                className="w-full h-full"
                style={{ background: video.gradient }}
              />
            )}
            {/* Dark gradient overlay */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.25) 100%)",
              }}
            />
          </div>

          {/* Double-tap heart burst */}
          <AnimatePresence>
            {showHeart && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1.2 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.6 }}
              >
                <Heart className="w-24 h-24 text-red-500 fill-red-500 drop-shadow-2xl" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom-left info overlay */}
          <div
            className="absolute bottom-0 left-0 right-0 p-3 z-10"
            style={{ borderRadius: "0 0 16px 16px" }}
          >
            <p className="text-white font-bold text-sm leading-tight">
              {video.handle}
            </p>
            <p className="text-white/85 text-xs mt-0.5 line-clamp-2 leading-relaxed">
              {video.description}
            </p>
            <div className="flex flex-wrap gap-1 mt-1">
              {video.hashtags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-semibold"
                  style={{ color: "#F4A23B" }}
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1 mt-1.5">
              <MapPin
                className="w-3 h-3"
                style={{ color: "rgba(255,255,255,0.65)" }}
              />
              <span
                className="text-[11px]"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                {video.location}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <Music2
                className="w-3 h-3"
                style={{ color: "rgba(255,255,255,0.65)" }}
              />
              <span
                className="text-[11px] truncate"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                {video.song}
              </span>
            </div>
          </div>
        </div>

        {/* Right action rail — attached to card */}
        <div
          className="flex flex-col items-center gap-4 flex-shrink-0"
          style={{
            marginLeft: "12px",
            alignSelf: "flex-end",
            paddingBottom: "12px",
          }}
        >
          {/* Creator avatar with saffron ring */}
          <div
            className="flex flex-col items-center"
            style={{ marginBottom: "2px" }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm saffron-ring overflow-hidden flex-shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, #F4A23B, oklch(0.55 0.22 340))",
              }}
            >
              {creatorInitial}
            </div>
            <div
              className="w-4 h-4 rounded-full flex items-center justify-center border border-black -mt-1.5 z-10 flex-shrink-0"
              style={{ background: "#F4A23B" }}
            >
              <span
                className="text-black font-black"
                style={{ fontSize: "9px" }}
              >
                +
              </span>
            </div>
          </div>

          {/* Like */}
          <button
            type="button"
            onClick={toggleLike}
            className="flex flex-col items-center gap-0.5"
            data-ocid={`feed.like.button.${index + 1}`}
          >
            <motion.div
              whileTap={{ scale: 1.4 }}
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(0,0,0,0.4)",
                backdropFilter: "blur(4px)",
              }}
            >
              <Heart
                className={`w-5 h-5 transition-colors ${liked ? "fill-red-500 text-red-500" : "text-white"}`}
              />
            </motion.div>
            <span className="text-white text-[11px] font-semibold drop-shadow">
              {formatCount(likes)}
            </span>
          </button>

          {/* Comment */}
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col items-center gap-0.5"
            data-ocid={`feed.comment.button.${index + 1}`}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(0,0,0,0.4)",
                backdropFilter: "blur(4px)",
              }}
            >
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-white text-[11px] font-semibold drop-shadow">
              {formatCount(video.comments)}
            </span>
          </button>

          {/* Share */}
          <ShareSheet
            title={`${video.title} — ${video.handle} on Vibez India 🎬`}
          >
            <button
              type="button"
              onClick={(e) => e.stopPropagation()}
              className="flex flex-col items-center gap-0.5"
              data-ocid={`feed.share.button.${index + 1}`}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(0,0,0,0.4)",
                  backdropFilter: "blur(4px)",
                }}
              >
                <Share2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-white text-[11px] font-semibold drop-shadow">
                {formatCount(video.shares)}
              </span>
            </button>
          </ShareSheet>

          {/* India flag indicator */}
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
            style={{
              background: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(4px)",
            }}
          >
            🇮🇳
          </div>
        </div>
      </div>
    </div>
  );
}
