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
import { MOCK_VIDEOS } from "../data/mockVideos";
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
  // Facebook connection is tracked client-side (not in backend)
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

  const handleToggleFacebook = () => {
    setFbConnected((prev) => !prev);
    toast.success(
      fbConnected ? "Facebook disconnected" : "Facebook connected! 🎉",
    );
  };

  const handleWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent("Check out Vibez India — the best short video app for India! https://vibezindia.app 🎬")}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (!isAuthenticated) {
    return (
      <div
        className="h-[100dvh] flex flex-col items-center justify-center gap-6 px-6 text-center"
        data-ocid="profile.page"
      >
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center text-4xl"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.73 0.17 55), oklch(0.58 0.24 340))",
          }}
        >
          🎬
        </div>
        <div>
          <h2 className="font-display font-black text-2xl mb-1">
            Join Vibez India
          </h2>
          <p className="text-muted-foreground text-sm">
            Login to create, share and connect with creators across India
          </p>
        </div>
        <Button
          onClick={handleLogin}
          disabled={isLoggingIn}
          className="w-full max-w-xs h-12 font-bold text-base"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.73 0.17 55), oklch(0.58 0.24 340))",
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
    );
  }

  if (profileLoading) {
    return (
      <div
        className="h-[100dvh] overflow-y-auto pb-20 pt-12"
        data-ocid="profile.page"
      >
        <div className="px-4 max-w-lg mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="w-20 h-20 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
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
      className="h-[100dvh] overflow-y-auto pb-20 pt-12"
      data-ocid="profile.page"
    >
      <div className="px-4 max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-white font-black text-3xl border-2 border-primary flex-shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.73 0.17 55), oklch(0.58 0.24 340))",
              }}
            >
              {initial}
            </div>
            <div>
              <h2 className="font-display font-black text-xl">{displayName}</h2>
              {bio && (
                <p className="text-muted-foreground text-sm mt-0.5 line-clamp-2">
                  {bio}
                </p>
              )}
              {fbConnected && (
                <Badge className="mt-1 bg-[#1877F2] text-white border-0 text-xs">
                  <Facebook className="w-3 h-3 mr-1" /> Facebook Connected
                </Badge>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={openEdit}
            className="border-border text-xs"
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
              className="bg-card rounded-xl p-3 text-center"
            >
              <p className="font-display font-black text-xl text-primary">
                {stat.value}
              </p>
              <p className="text-muted-foreground text-xs">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Social connects */}
        <div className="space-y-3 mb-6">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Connect & Share
          </h3>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleToggleFacebook}
            className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${
              fbConnected
                ? "bg-[#1877F2]/20 border-[#1877F2] text-[#4a9eff]"
                : "bg-card border-border hover:border-[#1877F2]/50"
            }`}
            data-ocid="profile.facebook.button"
          >
            <Facebook className="w-5 h-5 text-[#1877F2]" />
            <div className="text-left">
              <p className="font-semibold text-sm">
                {fbConnected ? "Facebook Connected" : "Connect with Facebook"}
              </p>
              <p className="text-xs text-muted-foreground">
                {fbConnected
                  ? "Tap to disconnect"
                  : "Share your Vibez on Facebook"}
              </p>
            </div>
            {fbConnected && (
              <CheckCircle2 className="w-5 h-5 text-[#1877F2] ml-auto" />
            )}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleWhatsApp}
            className="w-full flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-[#25D366]/50 transition-all"
            data-ocid="profile.whatsapp.button"
          >
            <MessageCircle className="w-5 h-5 text-[#25D366]" />
            <div className="text-left">
              <p className="font-semibold text-sm">Share on WhatsApp</p>
              <p className="text-xs text-muted-foreground">
                Invite friends to Vibez India
              </p>
            </div>
          </motion.button>
        </div>

        {/* Video grid */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Grid className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm">My Videos</h3>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {MOCK_VIDEOS.slice(0, 6).map((v, i) => (
              <div
                key={v.id}
                className="relative aspect-square rounded-lg overflow-hidden bg-muted"
                data-ocid={`profile.item.${i + 1}`}
              >
                <img
                  src={v.thumbnail}
                  alt={v.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            ))}
          </div>
        </div>

        {/* Logout */}
        <Button
          variant="outline"
          onClick={handleLogout}
          className="w-full border-border text-muted-foreground"
          data-ocid="profile.logout.button"
        >
          <LogOut className="w-4 h-4 mr-2" /> Log out
        </Button>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6 mb-2">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            caffeine.ai
          </a>
        </p>
      </div>

      {/* Profile Setup Modal */}
      <Dialog open={showSetup} onOpenChange={setShowSetup}>
        <DialogContent
          className="bg-card border-border max-w-sm mx-auto"
          data-ocid="profile.setup.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display font-black text-xl text-center">
              Welcome to Vibez! 🎬
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSetup} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">Your Name *</Label>
              <Input
                value={setupName}
                onChange={(e) => setSetupName(e.target.value)}
                placeholder="What should we call you?"
                className="bg-muted border-none"
                data-ocid="profile.setup.name.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">Bio</Label>
              <Textarea
                value={setupBio}
                onChange={(e) => setSetupBio(e.target.value)}
                placeholder="Tell us about yourself..."
                className="bg-muted border-none resize-none h-20"
                data-ocid="profile.setup.bio.textarea"
              />
            </div>
            <Button
              type="submit"
              disabled={creating}
              className="w-full font-bold"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.73 0.17 55), oklch(0.58 0.24 340))",
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
          className="bg-card border-border max-w-sm mx-auto"
          data-ocid="profile.edit.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display font-black text-xl">
              Edit Profile
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">Display Name</Label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="bg-muted border-none"
                data-ocid="profile.edit.name.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">Bio</Label>
              <Textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                className="bg-muted border-none resize-none h-20"
                data-ocid="profile.edit.bio.textarea"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEdit(false)}
                className="flex-1 border-border"
                data-ocid="profile.edit.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updating}
                className="flex-1 font-bold"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.73 0.17 55), oklch(0.58 0.24 340))",
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
