import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Facebook, Link2, MessageCircle } from "lucide-react";
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
        className="w-48 p-1.5"
        side="left"
        align="center"
        style={{
          background: "oklch(0.14 0.02 240)",
          border: "1px solid oklch(0.22 0.025 240)",
        }}
        data-ocid="share.popover"
      >
        <p
          className="text-[11px] px-2 py-1"
          style={{ color: "oklch(0.60 0.03 240)" }}
        >
          Share via
        </p>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-md transition-colors hover:bg-white/5"
          data-ocid="share.whatsapp.button"
        >
          <span
            className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "#25D366" }}
          >
            <MessageCircle className="w-3.5 h-3.5 text-white" />
          </span>
          <span className="text-sm font-medium text-white">WhatsApp</span>
        </a>
        <a
          href={fbUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-md transition-colors hover:bg-white/5"
          data-ocid="share.facebook.button"
        >
          <span
            className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "#1877F2" }}
          >
            <Facebook className="w-3.5 h-3.5 text-white" />
          </span>
          <span className="text-sm font-medium text-white">Facebook</span>
        </a>
        <button
          type="button"
          onClick={copyLink}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md transition-colors hover:bg-white/5"
          data-ocid="share.copy_link.button"
        >
          <span
            className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "oklch(0.22 0.025 240)" }}
          >
            <Link2 className="w-3.5 h-3.5 text-white" />
          </span>
          <span className="text-sm font-medium text-white">Copy Link</span>
        </button>
      </PopoverContent>
    </Popover>
  );
}
