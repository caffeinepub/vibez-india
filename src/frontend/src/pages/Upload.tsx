import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2,
  Film,
  Loader2,
  Upload as UploadIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import Header from "../components/Header";
import { CATEGORIES } from "../data/videos";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useCreateVideo } from "../hooks/useQueries";

export default function Upload() {
  const { identity } = useInternetIdentity();
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [category, setCategory] = useState("");
  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: createVideo, isPending } = useCreateVideo();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("video/")) setSelectedFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category) {
      toast.error("Please fill in Title and Category");
      return;
    }
    const tags = hashtags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    try {
      await createVideo({
        title,
        description,
        hashtags: tags,
        category,
        videoUrl: selectedFile ? URL.createObjectURL(selectedFile) : "",
        thumbnailUrl: "",
      });
      setSuccess(true);
      setTitle("");
      setDescription("");
      setHashtags("");
      setCategory("");
      setSelectedFile(null);
      setTimeout(() => setSuccess(false), 4000);
    } catch {
      toast.error("Upload failed. Please try again.");
    }
  };

  if (!identity) {
    return (
      <div
        className="flex flex-col"
        style={{ height: "100dvh", background: "oklch(0.08 0.01 240)" }}
        data-ocid="upload.page"
      >
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
          <Film className="w-16 h-16" style={{ color: "#F4A23B" }} />
          <h2 className="font-display font-bold text-2xl text-white">
            Login to Upload
          </h2>
          <p style={{ color: "oklch(0.60 0.03 240)" }}>
            Sign in to share your videos with India 🎬
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col"
      style={{ height: "100dvh", background: "oklch(0.08 0.01 240)" }}
      data-ocid="upload.page"
    >
      <Header />
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="px-4 pt-5 max-w-lg mx-auto">
          <h1 className="font-display font-black text-2xl text-white mb-1">
            Upload Video
          </h1>
          <p className="text-sm mb-5" style={{ color: "oklch(0.60 0.03 240)" }}>
            Share your moment with India 🇮🇳
          </p>

          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="flex items-center gap-3 rounded-xl p-4 mb-5 border"
                style={{
                  background: "oklch(0.18 0.08 145 / 0.5)",
                  borderColor: "oklch(0.45 0.12 145)",
                }}
                data-ocid="upload.success_state"
              >
                <CheckCircle2
                  className="w-6 h-6"
                  style={{ color: "oklch(0.75 0.18 145)" }}
                />
                <div>
                  <p
                    className="font-semibold text-sm"
                    style={{ color: "oklch(0.85 0.12 145)" }}
                  >
                    Video uploaded! 🎉
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "oklch(0.70 0.08 145)" }}
                  >
                    Your video is being processed.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dropzone */}
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className="block relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all mb-5"
            style={{
              borderColor: dragOver ? "#F4A23B" : "oklch(0.25 0.025 240)",
              background: dragOver
                ? "oklch(0.75 0.165 57 / 0.08)"
                : "oklch(0.12 0.015 240 / 0.5)",
            }}
            data-ocid="upload.dropzone"
          >
            <input
              ref={fileRef}
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {selectedFile ? (
              <div className="flex flex-col items-center gap-2">
                <Film className="w-10 h-10" style={{ color: "#F4A23B" }} />
                <p className="font-semibold text-sm text-white">
                  {selectedFile.name}
                </p>
                <p
                  className="text-xs"
                  style={{ color: "oklch(0.60 0.03 240)" }}
                >
                  {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <UploadIcon
                  className="w-10 h-10"
                  style={{ color: "oklch(0.55 0.03 240)" }}
                />
                <p className="font-semibold text-sm text-white">
                  Drag & drop your video here
                </p>
                <p
                  className="text-xs"
                  style={{ color: "oklch(0.55 0.03 240)" }}
                >
                  or tap to browse
                </p>
                <p
                  className="text-xs mt-1"
                  style={{ color: "oklch(0.50 0.03 240)" }}
                >
                  MP4, MOV, AVI up to 500MB
                </p>
              </div>
            )}
          </label>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="title"
                className="text-sm font-semibold text-white"
              >
                Title *
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your video a catchy title..."
                className="border-none text-sm"
                style={{ background: "oklch(0.15 0.015 240)" }}
                data-ocid="upload.title.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="desc"
                className="text-sm font-semibold text-white"
              >
                Description
              </Label>
              <Textarea
                id="desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell viewers about your video..."
                className="border-none resize-none h-24 text-sm"
                style={{ background: "oklch(0.15 0.015 240)" }}
                data-ocid="upload.description.textarea"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="tags"
                className="text-sm font-semibold text-white"
              >
                Hashtags
              </Label>
              <Input
                id="tags"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                placeholder="#Bollywood, #Dance, #Cricket"
                className="border-none text-sm"
                style={{ background: "oklch(0.15 0.015 240)" }}
                data-ocid="upload.hashtags.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-white">
                Category *
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger
                  className="border-none text-sm"
                  style={{ background: "oklch(0.15 0.015 240)" }}
                  data-ocid="upload.category.select"
                >
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.filter(
                    (c) => c !== "For You" && c !== "Following",
                  ).map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-12 font-bold text-base mt-2 rounded-xl"
              style={{
                background:
                  "linear-gradient(135deg, #F4A23B, oklch(0.55 0.22 340))",
              }}
              data-ocid="upload.submit_button"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...
                </>
              ) : (
                "🚀 Post Video"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
