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
import { CATEGORIES } from "../data/mockVideos";
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
        className="h-[100dvh] flex flex-col items-center justify-center gap-4 px-6 text-center"
        data-ocid="upload.page"
      >
        <Film className="w-16 h-16 text-primary" />
        <h2 className="font-display font-bold text-2xl">Login to Upload</h2>
        <p className="text-muted-foreground">
          Sign in to share your videos with the world 🎬
        </p>
      </div>
    );
  }

  return (
    <div
      className="h-[100dvh] overflow-y-auto pb-20 pt-12"
      data-ocid="upload.page"
    >
      <div className="px-4 max-w-lg mx-auto">
        <h1 className="font-display font-black text-2xl mb-1">Upload Video</h1>
        <p className="text-muted-foreground text-sm mb-6">
          Share your moment with India 🇮🇳
        </p>

        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center gap-3 bg-green-900/40 border border-green-700 rounded-xl p-4 mb-6"
              data-ocid="upload.success_state"
            >
              <CheckCircle2 className="w-6 h-6 text-green-400" />
              <div>
                <p className="text-green-300 font-semibold text-sm">
                  Video uploaded! 🎉
                </p>
                <p className="text-green-400 text-xs">
                  Your video is being processed.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dropzone - use label wrapping hidden input for semantic correctness */}
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`block relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all mb-6 ${
            dragOver
              ? "border-primary bg-primary/10"
              : "border-border hover:border-primary/60 hover:bg-muted/30"
          }`}
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
              <Film className="w-10 h-10 text-primary" />
              <p className="font-semibold text-sm">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <UploadIcon className="w-10 h-10 text-muted-foreground" />
              <p className="font-semibold text-sm">
                Drag & drop your video here
              </p>
              <p className="text-xs text-muted-foreground">or tap to browse</p>
              <p className="text-xs text-muted-foreground mt-1">
                MP4, MOV, AVI up to 500MB
              </p>
            </div>
          )}
        </label>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-sm font-semibold">
              Title *
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your video a catchy title..."
              className="bg-muted border-none"
              data-ocid="upload.title.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="desc" className="text-sm font-semibold">
              Description
            </Label>
            <Textarea
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell viewers about your video..."
              className="bg-muted border-none resize-none h-24"
              data-ocid="upload.description.textarea"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tags" className="text-sm font-semibold">
              Hashtags
            </Label>
            <Input
              id="tags"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              placeholder="#Bollywood, #Dance, #Cricket (comma separated)"
              className="bg-muted border-none"
              data-ocid="upload.hashtags.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold">Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger
                className="bg-muted border-none"
                data-ocid="upload.category.select"
              >
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.filter((c) => c !== "All").map((cat) => (
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
            className="w-full h-12 font-bold text-base mt-2"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.72 0.17 55), oklch(0.58 0.24 340))",
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
  );
}
