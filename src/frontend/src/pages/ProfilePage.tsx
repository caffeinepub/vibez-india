import {
  Bookmark,
  Check,
  Edit2,
  Grid3X3,
  Heart,
  LogIn,
  LogOut,
  Settings,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { SAMPLE_VIDEOS } from "../data/sampleVideos";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useSaveProfile, useUserProfile } from "../hooks/useQueries";

type ProfileTab = "videos" | "liked" | "saved";

const PROFILE_STATS = [
  { label: "Following", value: "142" },
  { label: "Followers", value: "28.4K" },
  { label: "Likes", value: "1.2M" },
];

export function ProfilePage() {
  const { identity, login, clear } = useInternetIdentity();
  const { data: userProfile } = useUserProfile();
  const saveProfile = useSaveProfile();
  const [activeTab, setActiveTab] = useState<ProfileTab>("videos");
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(userProfile?.name || "Vibez User");
  const nameInputRef = useRef<HTMLInputElement>(null);

  const isLoggedIn = !!identity;
  const displayName =
    userProfile?.name || (isLoggedIn ? "Vibez User" : "Guest");
  const principalStr = identity?.getPrincipal().toString();
  const shortPrincipal = principalStr
    ? `${principalStr.slice(0, 8)}...${principalStr.slice(-6)}`
    : null;

  const handleSaveProfile = async () => {
    if (!editName.trim()) return;
    try {
      await saveProfile.mutateAsync({ name: editName.trim() });
      toast.success("Profile updated!");
      setIsEditing(false);
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const startEditing = () => {
    setEditName(displayName);
    setIsEditing(true);
    setTimeout(() => nameInputRef.current?.focus(), 50);
  };

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{ background: "oklch(0.14 0.022 240)" }}
    >
      <header
        className="flex items-center justify-between px-4 py-4 flex-shrink-0"
        style={{
          background:
            "linear-gradient(to bottom, oklch(0.14 0.022 240), oklch(0.17 0.027 240))",
          borderBottom: "1px solid oklch(0.26 0.032 240 / 0.5)",
        }}
      >
        <h1
          className="font-display text-xl font-bold"
          style={{ color: "oklch(0.94 0.007 240)" }}
        >
          Profile
        </h1>
        <div className="flex items-center gap-2">
          {isLoggedIn && (
            <button
              type="button"
              data-ocid="profile.logout.button"
              onClick={() => {
                clear();
                toast.success("Logged out");
              }}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{
                background: "oklch(0.21 0.030 240)",
                color: "oklch(0.68 0.028 240)",
              }}
            >
              <LogOut size={13} />
              Logout
            </button>
          )}
          <button
            type="button"
            data-ocid="profile.settings.button"
            className="w-8 h-8 flex items-center justify-center rounded-full"
            style={{ background: "oklch(0.21 0.030 240)" }}
            aria-label="Settings"
          >
            <Settings size={16} style={{ color: "oklch(0.68 0.028 240)" }} />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {!isLoggedIn ? (
          <div className="flex flex-col items-center gap-6 py-20 px-8">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{ background: "oklch(0.21 0.030 240)" }}
            >
              <LogIn size={40} style={{ color: "oklch(0.74 0.166 58)" }} />
            </div>
            <div className="text-center">
              <h2
                className="font-display text-xl font-bold mb-2"
                style={{ color: "oklch(0.94 0.007 240)" }}
              >
                Join Vibez
              </h2>
              <p className="text-sm" style={{ color: "oklch(0.68 0.028 240)" }}>
                Log in to create videos, follow creators, and explore Indian
                content!
              </p>
            </div>
            <button
              type="button"
              data-ocid="profile.login.button"
              onClick={login}
              className="w-full py-4 rounded-2xl text-base font-bold"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.74 0.166 58), oklch(0.68 0.18 45))",
                color: "oklch(0.14 0.022 240)",
              }}
            >
              Log In / Sign Up
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center px-4 pt-6 pb-4">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold mb-3 border-4"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.74 0.166 58), oklch(0.61 0.265 355))",
                  borderColor: "oklch(0.26 0.032 240)",
                  color: "white",
                }}
              >
                {displayName.charAt(0).toUpperCase()}
              </div>

              {isEditing ? (
                <div className="flex items-center gap-2 mb-1">
                  <input
                    ref={nameInputRef}
                    id="profile-name-input"
                    data-ocid="profile.name.input"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="px-3 py-1.5 rounded-lg text-center text-base font-bold outline-none"
                    style={{
                      background: "oklch(0.21 0.030 240)",
                      border: "1px solid oklch(0.74 0.166 58)",
                      color: "oklch(0.94 0.007 240)",
                      maxWidth: "160px",
                    }}
                  />
                  <button
                    type="button"
                    data-ocid="profile.save.button"
                    onClick={handleSaveProfile}
                    disabled={saveProfile.isPending}
                    className="w-7 h-7 flex items-center justify-center rounded-full"
                    style={{ background: "oklch(0.72 0.218 150)" }}
                  >
                    <Check size={14} className="text-white" />
                  </button>
                  <button
                    type="button"
                    data-ocid="profile.cancel.button"
                    onClick={() => setIsEditing(false)}
                    className="w-7 h-7 flex items-center justify-center rounded-full"
                    style={{ background: "oklch(0.21 0.030 240)" }}
                  >
                    <X size={14} style={{ color: "oklch(0.68 0.028 240)" }} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-1">
                  <h2
                    className="text-xl font-bold"
                    style={{ color: "oklch(0.94 0.007 240)" }}
                  >
                    {displayName}
                  </h2>
                  <button
                    type="button"
                    data-ocid="profile.edit.button"
                    onClick={startEditing}
                    aria-label="Edit name"
                  >
                    <Edit2
                      size={14}
                      style={{ color: "oklch(0.68 0.028 240)" }}
                    />
                  </button>
                </div>
              )}

              {shortPrincipal && (
                <p
                  className="text-xs mb-3"
                  style={{ color: "oklch(0.68 0.028 240)" }}
                >
                  {shortPrincipal}
                </p>
              )}

              <p
                className="text-sm text-center mb-4"
                style={{ color: "oklch(0.68 0.028 240)" }}
              >
                🇮🇳 Sharing the best of India • Cricket • Bollywood • Food
              </p>

              <div className="flex items-center gap-8 mb-4">
                {PROFILE_STATS.map((stat) => (
                  <div key={stat.label} className="flex flex-col items-center">
                    <span
                      className="text-lg font-bold"
                      style={{ color: "oklch(0.94 0.007 240)" }}
                    >
                      {stat.value}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: "oklch(0.68 0.028 240)" }}
                    >
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                data-ocid="profile.edit_button"
                onClick={startEditing}
                className="w-full max-w-xs py-2.5 rounded-xl text-sm font-semibold"
                style={{
                  background: "oklch(0.21 0.030 240)",
                  border: "1px solid oklch(0.26 0.032 240)",
                  color: "oklch(0.94 0.007 240)",
                }}
              >
                Edit Profile
              </button>
            </div>

            <div
              className="flex border-b"
              style={{ borderColor: "oklch(0.26 0.032 240 / 0.5)" }}
            >
              {(["videos", "liked", "saved"] as ProfileTab[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  data-ocid={`profile.${tab}.tab`}
                  onClick={() => setActiveTab(tab)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold relative"
                  style={{
                    color:
                      activeTab === tab
                        ? "oklch(0.74 0.166 58)"
                        : "oklch(0.68 0.028 240)",
                  }}
                >
                  {tab === "videos" && <Grid3X3 size={16} />}
                  {tab === "liked" && <Heart size={16} />}
                  {tab === "saved" && <Bookmark size={16} />}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="profile-tab-underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5"
                      style={{ background: "oklch(0.74 0.166 58)" }}
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-0.5 p-0.5">
              {SAMPLE_VIDEOS.map((video, i) => (
                <motion.div
                  key={video.id}
                  data-ocid={`profile.video.item.${i + 1}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.06 }}
                  className="relative overflow-hidden"
                  style={{ aspectRatio: "9/16" }}
                >
                  <img
                    src={video.thumbnail}
                    alt={video.caption}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)",
                    }}
                  />
                  <div className="absolute bottom-1 left-1 flex items-center gap-1">
                    <Heart size={10} fill="white" stroke="white" />
                    <span className="text-white text-[10px] font-semibold">
                      {(video.likes / 1000).toFixed(0)}K
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
