import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  Edit3,
  Facebook,
  Grid,
  Loader2,
  LogOut,
  MessageCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import Header from "../components/Header";
import { MOCK_VIDEOS } from "../data/videos";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCreateUser,
  useGetCallerUserProfile,
  useUpdateUser,
} from "../hooks/useQueries";

function formatFollowers(n: bigint): string {
  const num = Number(n);
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return String(num);
}

export default function Profile() {
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const qc = useQueryClient();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const {
    data: profile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();
  const { mutateAsync: createUser, isPending: creating } = useCreateUser();
  const { mutateAsync: updateUser, isPending: updating } = useUpdateUser();

  const [showSetup, setShowSetup] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [setupName, setSetupName] = useState("");
  const [setupBio, setSetupBio] = useState("");
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [fbConnected, setFbConnected] = useState(false);

  const showProfileSetup =
    isAuthenticated &&
    !profileLoading &&
    isFetched &&
    profile === null &&
    !showSetup;
  if (showProfileSetup && !showSetup) {
    setTimeout(() => setShowSetup(true), 100);
  }

  const handleLogin = async () => {
    try {
      await login();
    } catch (err: any) {
      if (err?.message === "User is already authenticated") {
        await clear();
        setTimeout(() => login(), 300);
      }
    }
  };

  const handleLogout = async () => {
    await clear();
    qc.clear();
    toast.success("Logged out successfully");
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!setupName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    try {
      await createUser({
        displayName: setupName,
        bio: setupBio,
        avatarUrl: "",
      });
      setShowSetup(false);
      toast.success("Profile created! Welcome to Vibez 🎉");
    } catch {
      toast.error("Failed to create profile");
    }
  };

  const openEdit = () => {
    setEditName(profile?.displayName ?? "");
    setEditBio(profile?.bio ?? "");
    setShowEdit(true);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    try {
      await updateUser({
        displayName: editName,
        bio: editBio,
        avatarUrl: profile.avatarUrl,
      });
      setShowEdit(false);
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const handleWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent("Check out Vibez India — the best short video app for India! https://vibezindia.app 🎬")}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (!isAuthenticated) {
    return (
      <div
        className="flex flex-col"
        style={{ height: "100dvh", background: "oklch(0.08 0.01 240)" }}
        data-ocid="profile.page"
      >
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 text-center">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-4xl"
            style={{
              background:
                "linear-gradient(135deg, #F4A23B, oklch(0.55 0.22 340))",
            }}
          >
            🎬
          </div>
          <div>
            <h2 className="font-display font-black text-2xl text-white mb-1">
              Join Vibez India
            </h2>
            <p className="text-sm" style={{ color: "oklch(0.60 0.03 240)" }}>
              Login to create, share and connect with creators across India
            </p>
          </div>
          <Button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="w-full max-w-xs h-12 font-bold text-base rounded-xl"
            style={{
              background:
                "linear-gradient(135deg, #F4A23B, oklch(0.55 0.22 340))",
            }}
            data-ocid="profile.login.button"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Logging in...
              </>
            ) : (
              "Login to Vibez"
            )}
          </Button>
        </div>
      </div>
    );
  }

  if (profileLoading) {
    return (
      <div
        className="flex flex-col"
        style={{ height: "100dvh", background: "oklch(0.08 0.01 240)" }}
        data-ocid="profile.page"
      >
        <Header />
        <div className="flex-1 overflow-y-auto pb-20">
          <div className="px-4 pt-5 max-w-lg mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Skeleton className="w-20 h-20 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const displayName = profile?.displayName ?? "Vibez User";
  const bio = profile?.bio ?? "";
  const initial = displayName[0]?.toUpperCase() ?? "V";

  return (
    <div
      className="flex flex-col"
      style={{ height: "100dvh", background: "oklch(0.08 0.01 240)" }}
      data-ocid="profile.page"
    >
      <Header />
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="px-4 pt-5 max-w-lg mx-auto">
          {/* Profile header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-white font-black text-3xl border-2 flex-shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, #F4A23B, oklch(0.55 0.22 340))",
                  borderColor: "#F4A23B",
                }}
              >
                {initial}
              </div>
              <div>
                <h2 className="font-display font-black text-xl text-white">
                  {displayName}
                </h2>
                {bio && (
                  <p
                    className="text-sm mt-0.5 line-clamp-2"
                    style={{ color: "oklch(0.60 0.03 240)" }}
                  >
                    {bio}
                  </p>
                )}
                {fbConnected && (
                  <Badge
                    className="mt-1 text-white border-0 text-xs"
                    style={{ background: "#1877F2" }}
                  >
                    <Facebook className="w-3 h-3 mr-1" /> Facebook Connected
                  </Badge>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={openEdit}
              className="text-xs"
              style={{ borderColor: "oklch(0.25 0.025 240)" }}
              data-ocid="profile.edit.button"
            >
              <Edit3 className="w-3 h-3 mr-1" /> Edit
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: "Videos", value: MOCK_VIDEOS.length },
              {
                label: "Followers",
                value: profile ? formatFollowers(profile.followerCount) : "0",
              },
              {
                label: "Following",
                value: profile ? formatFollowers(profile.followingCount) : "0",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl p-3 text-center"
                style={{ background: "oklch(0.12 0.015 240)" }}
              >
                <p
                  className="font-display font-black text-xl"
                  style={{ color: "#F4A23B" }}
                >
                  {stat.value}
                </p>
                <p
                  className="text-xs"
                  style={{ color: "oklch(0.60 0.03 240)" }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Social connects */}
          <div className="space-y-3 mb-6">
            <h3
              className="text-sm font-semibold uppercase tracking-wide"
              style={{ color: "oklch(0.55 0.03 240)" }}
            >
              Connect & Share
            </h3>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setFbConnected((p) => !p);
                toast.success(
                  fbConnected
                    ? "Facebook disconnected"
                    : "Facebook connected! 🎉",
                );
              }}
              className="w-full flex items-center gap-3 p-4 rounded-xl border transition-all"
              style={{
                background: fbConnected
                  ? "rgba(24,119,242,0.12)"
                  : "oklch(0.12 0.015 240)",
                borderColor: fbConnected ? "#1877F2" : "oklch(0.22 0.025 240)",
              }}
              data-ocid="profile.facebook.button"
            >
              <Facebook className="w-5 h-5" style={{ color: "#1877F2" }} />
              <div className="text-left">
                <p className="font-semibold text-sm text-white">
                  {fbConnected ? "Facebook Connected" : "Connect with Facebook"}
                </p>
                <p
                  className="text-xs"
                  style={{ color: "oklch(0.60 0.03 240)" }}
                >
                  {fbConnected
                    ? "Tap to disconnect"
                    : "Share your Vibez on Facebook"}
                </p>
              </div>
              {fbConnected && (
                <CheckCircle2
                  className="w-5 h-5 ml-auto"
                  style={{ color: "#1877F2" }}
                />
              )}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleWhatsApp}
              className="w-full flex items-center gap-3 p-4 rounded-xl border transition-all"
              style={{
                background: "oklch(0.12 0.015 240)",
                borderColor: "oklch(0.22 0.025 240)",
              }}
              data-ocid="profile.whatsapp.button"
            >
              <MessageCircle className="w-5 h-5" style={{ color: "#25D366" }} />
              <div className="text-left">
                <p className="font-semibold text-sm text-white">
                  Invite Friends on WhatsApp
                </p>
                <p
                  className="text-xs"
                  style={{ color: "oklch(0.60 0.03 240)" }}
                >
                  Invite friends to Vibez India
                </p>
              </div>
            </motion.button>
          </div>

          {/* Video grid */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Grid className="w-4 h-4" style={{ color: "#F4A23B" }} />
              <h3 className="font-semibold text-sm text-white">My Videos</h3>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {MOCK_VIDEOS.slice(0, 6).map((v, i) => (
                <div
                  key={v.id}
                  className="relative aspect-square rounded-lg overflow-hidden"
                  style={{ background: "oklch(0.15 0.015 240)" }}
                  data-ocid={`profile.item.${i + 1}`}
                >
                  {v.thumbnail ? (
                    <img
                      src={v.thumbnail}
                      alt={v.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full"
                      style={{ background: v.gradient }}
                    />
                  )}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Logout */}
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full"
            style={{
              borderColor: "oklch(0.25 0.025 240)",
              color: "oklch(0.60 0.03 240)",
            }}
            data-ocid="profile.logout.button"
          >
            <LogOut className="w-4 h-4 mr-2" /> Log out
          </Button>

          {/* Footer */}
          <p
            className="text-center text-xs mt-6 mb-2"
            style={{ color: "oklch(0.50 0.03 240)" }}
          >
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
              style={{ color: "#F4A23B" }}
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>

      {/* Profile Setup Modal */}
      <Dialog open={showSetup} onOpenChange={setShowSetup}>
        <DialogContent
          className="max-w-sm mx-auto"
          style={{
            background: "oklch(0.12 0.015 240)",
            borderColor: "oklch(0.22 0.025 240)",
          }}
          data-ocid="profile.setup.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display font-black text-xl text-center text-white">
              Welcome to Vibez! 🎬
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSetup} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-white">
                Your Name *
              </Label>
              <Input
                value={setupName}
                onChange={(e) => setSetupName(e.target.value)}
                placeholder="What should we call you?"
                className="border-none"
                style={{ background: "oklch(0.15 0.015 240)" }}
                data-ocid="profile.setup.name.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-white">Bio</Label>
              <Textarea
                value={setupBio}
                onChange={(e) => setSetupBio(e.target.value)}
                placeholder="Tell us about yourself..."
                className="border-none resize-none h-20"
                style={{ background: "oklch(0.15 0.015 240)" }}
                data-ocid="profile.setup.bio.textarea"
              />
            </div>
            <Button
              type="submit"
              disabled={creating}
              className="w-full font-bold rounded-xl"
              style={{
                background:
                  "linear-gradient(135deg, #F4A23B, oklch(0.55 0.22 340))",
              }}
              data-ocid="profile.setup.submit_button"
            >
              {creating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...
                </>
              ) : (
                "Start Creating! 🚀"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Modal */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent
          className="max-w-sm mx-auto"
          style={{
            background: "oklch(0.12 0.015 240)",
            borderColor: "oklch(0.22 0.025 240)",
          }}
          data-ocid="profile.edit.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display font-black text-xl text-white">
              Edit Profile
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-white">
                Display Name
              </Label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="border-none"
                style={{ background: "oklch(0.15 0.015 240)" }}
                data-ocid="profile.edit.name.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-white">Bio</Label>
              <Textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                className="border-none resize-none h-20"
                style={{ background: "oklch(0.15 0.015 240)" }}
                data-ocid="profile.edit.bio.textarea"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEdit(false)}
                className="flex-1 text-sm"
                style={{ borderColor: "oklch(0.25 0.025 240)" }}
                data-ocid="profile.edit.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updating}
                className="flex-1 font-bold rounded-xl"
                style={{
                  background:
                    "linear-gradient(135deg, #F4A23B, oklch(0.55 0.22 340))",
                }}
                data-ocid="profile.edit.save_button"
              >
                {updating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
