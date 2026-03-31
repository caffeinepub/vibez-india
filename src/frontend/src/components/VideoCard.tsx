import {
  Bookmark,
  Heart,
  MessageCircle,
  Music2,
  Play,
  Share2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { type MockVideo, formatCount } from "../data/mockVideos";
import ShareSheet from "./ShareSheet";

interface VideoCardProps {
  video: MockVideo;
  isActive: boolean;
}

const LANG_PILLS = ["हिंदी", "English"];

export default function VideoCard({ video, isActive }: VideoCardProps) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(video.likes);
  const [bookmarked, setBookmarked] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [activeLang, setActiveLang] = useState("हिंदी");
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

  const toggleLike = () => {
    if (liked) {
      setLiked(false);
      setLikes((l) => l - 1);
    } else {
      setLiked(true);
      setLikes((l) => l + 1);
    }
  };

  return (
    <article
      className="snap-item relative w-full h-[100dvh] bg-black overflow-hidden flex-shrink-0"
      onClick={handleDoubleTap}
      onKeyUp={(e) => e.key === "Enter" && handleDoubleTap()}
      data-ocid={`feed.item.${video.id}`}
    >
      <img
        src={video.thumbnail}
        alt={video.title}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/30" />

      {!isActive && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Play className="w-16 h-16 text-white/70 fill-white/70" />
        </div>
      )}

      {/* Double-tap heart burst */}
      <AnimatePresence>
        {showHeart && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1.2 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            <Heart className="w-32 h-32 text-red-500 fill-red-500 drop-shadow-lg" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top-left: username + category badge */}
      <div className="absolute top-[72px] left-4 z-20 flex items-center gap-2">
        <span className="bg-black/40 backdrop-blur-sm rounded-full px-2 py-0.5 text-white text-xs font-semibold">
          {video.handle}
        </span>
        <span
          className="rounded-full px-2 py-0.5 text-xs font-bold"
          style={{
            background: "oklch(0.73 0.17 55 / 0.85)",
            color: "oklch(0.09 0.01 55)",
          }}
        >
          {video.category}
        </span>
      </div>

      {/* Top-right overflow */}
      <div className="absolute top-[72px] right-4 z-20">
        <button
          type="button"
          className="text-white/70 text-lg leading-none p-1"
          onClick={(e) => e.stopPropagation()}
        >
          ···
        </button>
      </div>

      {/* Right-side engagement rail */}
      <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5 z-20">
        {/* Creator avatar */}
        <div className="mb-1">
          <div
            className="w-11 h-11 rounded-full border-2 border-white overflow-hidden flex items-center justify-center text-white font-bold text-lg"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.73 0.17 55), oklch(0.58 0.24 340))",
            }}
          >
            {video.creator[0]}
          </div>
          <div
            className="w-4 h-4 rounded-full flex items-center justify-center -mt-2 mx-auto border border-black"
            style={{ background: "oklch(0.73 0.17 55)" }}
          >
            <span className="text-black text-[8px] font-black">+</span>
          </div>
        </div>

        {/* Like */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleLike();
          }}
          className="flex flex-col items-center gap-1"
          data-ocid={`feed.like.button.${video.id}`}
        >
          <motion.div
            whileTap={{ scale: 1.4 }}
            className="w-11 h-11 rounded-2xl flex items-center justify-center bg-black/30 backdrop-blur-sm"
          >
            <Heart
              className={`w-6 h-6 ${
                liked ? "text-red-500 fill-red-500" : "text-white"
              } transition-colors`}
            />
          </motion.div>
          <span className="text-white text-xs font-semibold drop-shadow">
            {formatCount(likes)}
          </span>
        </button>

        {/* Comment */}
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          className="flex flex-col items-center gap-1"
          data-ocid={`feed.comment.button.${video.id}`}
        >
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-xs font-semibold drop-shadow">
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
            className="flex flex-col items-center gap-1"
            data-ocid={`feed.share.button.${video.id}`}
          >
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-black/30 backdrop-blur-sm">
              <Share2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-xs font-semibold drop-shadow">
              {formatCount(video.shares)}
            </span>
          </button>
        </ShareSheet>

        {/* Bookmark */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setBookmarked(!bookmarked);
          }}
          className="flex flex-col items-center gap-1"
          data-ocid={`feed.bookmark.button.${video.id}`}
        >
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <Bookmark
              className={`w-6 h-6 ${
                bookmarked ? "fill-primary text-primary" : "text-white"
              } transition-colors`}
            />
          </div>
        </button>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-16 p-4 z-20">
        <p className="text-white font-bold text-base drop-shadow">
          {video.handle}
        </p>
        <p className="text-white/90 text-sm mt-0.5 drop-shadow line-clamp-2">
          {video.description}
        </p>
        <div className="flex flex-wrap gap-1 mt-1">
          {video.hashtags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-primary text-xs font-semibold">
              {tag}
            </span>
          ))}
        </div>

        {/* Language filter pills */}
        <div className="flex items-center gap-2 mt-2">
          {LANG_PILLS.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveLang(lang);
              }}
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-all ${
                activeLang === lang
                  ? "border-primary text-primary-foreground"
                  : "border-white/30 text-white/70"
              }`}
              style={
                activeLang === lang ? { background: "var(--primary)" } : {}
              }
            >
              {lang}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 mt-2">
          <Music2 className="w-3 h-3 text-white/70" />
          <span className="text-white/70 text-xs">{video.song}</span>
        </div>
      </div>
    </article>
  );
}
