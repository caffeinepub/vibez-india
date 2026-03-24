import { Bell, Compass, Home, Plus, User } from "lucide-react";

type Tab = "feed" | "discover" | "upload" | "notifications" | "profile";

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  notificationCount?: number;
}

export function BottomNav({
  activeTab,
  onTabChange,
  notificationCount = 3,
}: BottomNavProps) {
  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "feed", label: "Home", icon: <Home size={22} /> },
    { id: "discover", label: "Discover", icon: <Compass size={22} /> },
    { id: "upload", label: "", icon: null },
    { id: "notifications", label: "Inbox", icon: <Bell size={22} /> },
    { id: "profile", label: "Profile", icon: <User size={22} /> },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border"
      style={{ background: "oklch(0.14 0.022 240)", height: "72px" }}
    >
      {tabs.map((tab) => {
        if (tab.id === "upload") {
          return (
            <button
              key="upload"
              type="button"
              data-ocid="nav.upload_button"
              onClick={() => onTabChange("upload")}
              className="flex items-center justify-center w-12 h-10 rounded-xl text-background font-bold text-xl shadow-glow transition-transform active:scale-95"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.74 0.166 58), oklch(0.74 0.166 58 / 0.8))",
              }}
              aria-label="Upload video"
            >
              <Plus size={24} strokeWidth={2.5} />
            </button>
          );
        }
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            data-ocid={`nav.${tab.id}.link`}
            onClick={() => onTabChange(tab.id)}
            className="flex flex-col items-center justify-center gap-0.5 w-14 h-full relative transition-colors"
            style={{
              color: isActive
                ? "oklch(0.74 0.166 58)"
                : "oklch(0.68 0.028 240)",
            }}
            aria-label={tab.label}
          >
            {tab.icon}
            <span className="text-[10px] font-medium">{tab.label}</span>
            {tab.id === "notifications" && notificationCount > 0 && (
              <span
                className="absolute top-2 right-3 flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold text-white"
                style={{ background: "oklch(0.60 0.248 25)" }}
              >
                {notificationCount}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
