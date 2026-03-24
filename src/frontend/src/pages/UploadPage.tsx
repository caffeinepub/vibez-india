import {
  ChevronDown,
  Globe,
  Hash,
  Loader2,
  Lock,
  Upload,
  Video,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { CATEGORIES } from "../data/sampleVideos";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface UploadPageProps {
  onClose: () => void;
}

export function UploadPage({ onClose }: UploadPageProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [category, setCategory] = useState("Bollywood");
  const [isPublic, setIsPublic] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const { identity, login } = useInternetIdentity();

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith("video/")) {
      setSelectedFile(file);
    } else {
      toast.error("Please select a video file");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handlePost = async () => {
    if (!identity) {
      toast.error("Please log in to upload videos");
      login();
      return;
    }
    if (!selectedFile) {
      toast.error("Please select a video file");
      return;
    }
    if (!title.trim()) {
      toast.error("Please add a title");
      return;
    }
    setIsUploading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsUploading(false);
    toast.success("Video uploaded successfully! 🎉");
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: "oklch(0.14 0.022 240)" }}
      data-ocid="upload.modal"
    >
      {/* Header */}
      <header
        className="flex items-center justify-between px-4 py-4 flex-shrink-0"
        style={{ borderBottom: "1px solid oklch(0.26 0.032 240 / 0.5)" }}
      >
        <button
          type="button"
          data-ocid="upload.close_button"
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full"
          style={{ background: "oklch(0.21 0.030 240)" }}
          aria-label="Close"
        >
          <X size={18} style={{ color: "oklch(0.94 0.007 240)" }} />
        </button>
        <h1
          className="font-display text-lg font-bold"
          style={{ color: "oklch(0.94 0.007 240)" }}
        >
          Upload Video
        </h1>
        <button
          type="button"
          data-ocid="upload.submit_button"
          onClick={handlePost}
          disabled={isUploading || !selectedFile || !title.trim()}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-opacity disabled:opacity-50"
          style={{
            background: "oklch(0.74 0.166 58)",
            color: "oklch(0.14 0.022 240)",
          }}
        >
          {isUploading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Posting...
            </>
          ) : (
            "Post"
          )}
        </button>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-4">
        {/* Upload area */}
        <div
          ref={dropZoneRef}
          data-ocid="upload.dropzone"
          className="relative rounded-2xl overflow-hidden transition-colors"
          style={{
            border: `2px dashed ${dragOver ? "oklch(0.74 0.166 58)" : "oklch(0.26 0.032 240)"}`,
            background: dragOver
              ? "oklch(0.21 0.030 240)"
              : "oklch(0.17 0.027 240)",
            aspectRatio: "16/9",
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) =>
              e.target.files?.[0] && handleFileSelect(e.target.files[0])
            }
            data-ocid="upload.upload_button"
          />
          <button
            type="button"
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 w-full h-full cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Click to select video file"
          >
            {selectedFile ? (
              <>
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: "oklch(0.72 0.218 150 / 0.2)" }}
                >
                  <Video size={28} style={{ color: "oklch(0.72 0.218 150)" }} />
                </div>
                <div className="text-center">
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "oklch(0.94 0.007 240)" }}
                  >
                    {selectedFile.name}
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: "oklch(0.68 0.028 240)" }}
                  >
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{
                    background: "oklch(0.74 0.166 58 / 0.2)",
                    color: "oklch(0.74 0.166 58)",
                  }}
                >
                  Change Video
                </span>
              </>
            ) : (
              <>
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: "oklch(0.74 0.166 58 / 0.15)" }}
                >
                  <Upload size={28} style={{ color: "oklch(0.74 0.166 58)" }} />
                </div>
                <div className="text-center">
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "oklch(0.94 0.007 240)" }}
                  >
                    Tap to select video
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: "oklch(0.68 0.028 240)" }}
                  >
                    or drag and drop here
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "oklch(0.68 0.028 240 / 0.6)" }}
                  >
                    MP4, MOV, AVI up to 500MB
                  </p>
                </div>
              </>
            )}
          </button>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <label
            htmlFor="upload-title"
            className="text-sm font-semibold"
            style={{ color: "oklch(0.68 0.028 240)" }}
          >
            Title *
          </label>
          <input
            id="upload-title"
            data-ocid="upload.title.input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{
              background: "oklch(0.21 0.030 240)",
              border: "1px solid oklch(0.26 0.032 240)",
              color: "oklch(0.94 0.007 240)",
            }}
            placeholder="Give your video a catchy title..."
            maxLength={100}
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label
            htmlFor="upload-description"
            className="text-sm font-semibold"
            style={{ color: "oklch(0.68 0.028 240)" }}
          >
            Description
          </label>
          <textarea
            id="upload-description"
            data-ocid="upload.description.textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
            style={{
              background: "oklch(0.21 0.030 240)",
              border: "1px solid oklch(0.26 0.032 240)",
              color: "oklch(0.94 0.007 240)",
            }}
            placeholder="Tell your story..."
            rows={3}
            maxLength={500}
          />
        </div>

        {/* Hashtags */}
        <div className="space-y-2">
          <label
            htmlFor="upload-hashtags"
            className="flex items-center gap-2 text-sm font-semibold"
            style={{ color: "oklch(0.68 0.028 240)" }}
          >
            <Hash size={14} /> Hashtags
          </label>
          <input
            id="upload-hashtags"
            data-ocid="upload.hashtags.input"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{
              background: "oklch(0.21 0.030 240)",
              border: "1px solid oklch(0.26 0.032 240)",
              color: "oklch(0.94 0.007 240)",
            }}
            placeholder="#Bollywood #Dance #India"
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label
            htmlFor="upload-category"
            className="text-sm font-semibold"
            style={{ color: "oklch(0.68 0.028 240)" }}
          >
            Category
          </label>
          <div className="relative">
            <select
              id="upload-category"
              data-ocid="upload.category.select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none appearance-none"
              style={{
                background: "oklch(0.21 0.030 240)",
                border: "1px solid oklch(0.26 0.032 240)",
                color: "oklch(0.94 0.007 240)",
              }}
            >
              {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "oklch(0.68 0.028 240)" }}
            />
          </div>
        </div>

        {/* Privacy */}
        <div
          className="flex items-center justify-between p-4 rounded-xl"
          style={{
            background: "oklch(0.21 0.030 240)",
            border: "1px solid oklch(0.26 0.032 240 / 0.5)",
          }}
        >
          <div className="flex items-center gap-3">
            {isPublic ? (
              <Globe size={20} style={{ color: "oklch(0.72 0.218 150)" }} />
            ) : (
              <Lock size={20} style={{ color: "oklch(0.68 0.028 240)" }} />
            )}
            <div>
              <p
                className="text-sm font-semibold"
                style={{ color: "oklch(0.94 0.007 240)" }}
              >
                {isPublic ? "Public" : "Private"}
              </p>
              <p className="text-xs" style={{ color: "oklch(0.68 0.028 240)" }}>
                {isPublic
                  ? "Everyone can see this video"
                  : "Only you can see this video"}
              </p>
            </div>
          </div>
          <button
            type="button"
            data-ocid="upload.privacy.toggle"
            onClick={() => setIsPublic((p) => !p)}
            className="relative w-12 h-6 rounded-full transition-colors"
            style={{
              background: isPublic
                ? "oklch(0.74 0.166 58)"
                : "oklch(0.26 0.032 240)",
            }}
            aria-label="Toggle privacy"
          >
            <div
              className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform"
              style={{
                transform: isPublic ? "translateX(26px)" : "translateX(4px)",
              }}
            />
          </button>
        </div>

        {/* Post button */}
        <button
          type="button"
          data-ocid="upload.primary_button"
          onClick={handlePost}
          disabled={isUploading || !selectedFile || !title.trim()}
          className="w-full py-4 rounded-2xl text-base font-bold transition-opacity disabled:opacity-40 flex items-center justify-center gap-2"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.74 0.166 58), oklch(0.68 0.18 45))",
            color: "oklch(0.14 0.022 240)",
          }}
        >
          {isUploading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Uploading to Vibez...
            </>
          ) : (
            "🎬 Post Video"
          )}
        </button>

        {isUploading && (
          <div data-ocid="upload.loading_state" className="flex justify-center">
            <p className="text-xs" style={{ color: "oklch(0.68 0.028 240)" }}>
              Processing your video...
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
