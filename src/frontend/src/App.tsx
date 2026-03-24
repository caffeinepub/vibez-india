import { Toaster } from "@/components/ui/sonner";
import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { BottomNav } from "./components/BottomNav";
import { DiscoverPage } from "./pages/DiscoverPage";
import { FeedPage } from "./pages/FeedPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { UploadPage } from "./pages/UploadPage";

type Tab = "feed" | "discover" | "upload" | "notifications" | "profile";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("feed");
  const [showUpload, setShowUpload] = useState(false);

  const handleTabChange = (tab: Tab) => {
    if (tab === "upload") {
      setShowUpload(true);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex justify-center"
      style={{ background: "oklch(0.12 0.018 240)" }}
    >
      {/* Mobile-first centered container */}
      <div
        className="relative w-full overflow-hidden"
        style={{ maxWidth: "480px" }}
      >
        {/* Main page content */}
        <div className="pb-[72px]">
          {activeTab === "feed" && (
            <FeedPage onUploadClick={() => setShowUpload(true)} />
          )}
          {activeTab === "discover" && <DiscoverPage />}
          {activeTab === "notifications" && <NotificationsPage />}
          {activeTab === "profile" && <ProfilePage />}
        </div>

        {/* Bottom navigation */}
        <BottomNav
          activeTab={activeTab}
          onTabChange={handleTabChange}
          notificationCount={3}
        />

        {/* Upload Modal */}
        <AnimatePresence>
          {showUpload && <UploadPage onClose={() => setShowUpload(false)} />}
        </AnimatePresence>

        <Toaster position="top-center" />
      </div>
    </div>
  );
}
