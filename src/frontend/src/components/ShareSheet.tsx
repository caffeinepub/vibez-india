import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Facebook, Link, MessageCircle, Share2 } from "lucide-react";
import { toast } from "sonner";

interface ShareSheetProps {
  children: React.ReactNode;
  title?: string;
}

export default function ShareSheet({
  children,
  title = "Check out this video on Vibez India 🎬",
}: ShareSheetProps) {
  const waUrl = `https://wa.me/?text=${encodeURIComponent(`${title} https://vibezindia.app`)}`;
  const fbUrl =
    "https://www.facebook.com/sharer/sharer.php?u=https://vibezindia.app";

  const copyLink = () => {
    navigator.clipboard.writeText("https://vibezindia.app").then(() => {
      toast.success("Link copied!");
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="w-52 p-2 bg-popover border-border"
        side="left"
        align="center"
        data-ocid="share.popover"
      >
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground px-2 pb-1 font-medium">
            Share via
          </p>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors cursor-pointer"
            data-ocid="share.whatsapp.button"
          >
            <span className="w-7 h-7 rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-4 h-4 text-white" />
            </span>
            <span className="text-sm font-medium">WhatsApp</span>
          </a>
          <a
            href={fbUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors cursor-pointer"
            data-ocid="share.facebook.button"
          >
            <span className="w-7 h-7 rounded-full bg-[#1877F2] flex items-center justify-center flex-shrink-0">
              <Facebook className="w-4 h-4 text-white" />
            </span>
            <span className="text-sm font-medium">Facebook</span>
          </a>
          <button
            type="button"
            onClick={copyLink}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors"
            data-ocid="share.copy_link.button"
          >
            <span className="w-7 h-7 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <Link className="w-4 h-4" />
            </span>
            <span className="text-sm font-medium">Copy Link</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export { Share2 };
