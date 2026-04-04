import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, CheckCheck, Heart, MessageCircle, UserPlus } from "lucide-react";
import { motion } from "motion/react";
import { Variant_like_comment_follow } from "../backend";
import Header from "../components/Header";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetNotifications,
  useMarkNotificationsRead,
} from "../hooks/useQueries";

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: "like",
    user: "@rohit_cricket",
    msg: 'liked your video "Bhangra Moves"',
    time: "2m ago",
  },
  {
    id: 2,
    type: "follow",
    user: "@priya_dances",
    msg: "started following you",
    time: "15m ago",
  },
  {
    id: 3,
    type: "comment",
    user: "@mumbai_foodie",
    msg: 'commented: "Amazing energy! 🔥"',
    time: "1h ago",
  },
  {
    id: 4,
    type: "like",
    user: "@ananya_food",
    msg: 'liked your video "Diwali Vibes"',
    time: "3h ago",
  },
  {
    id: 5,
    type: "follow",
    user: "@arjun_travel",
    msg: "started following you",
    time: "5h ago",
  },
  {
    id: 6,
    type: "comment",
    user: "@kavya_music",
    msg: 'commented: "This is fire! 🎶"',
    time: "7h ago",
  },
];

function NotifIcon({ type }: { type: string }) {
  if (type === "like")
    return <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />;
  if (type === "follow")
    return <UserPlus className="w-3.5 h-3.5" style={{ color: "#F4A23B" }} />;
  return <MessageCircle className="w-3.5 h-3.5 text-blue-400" />;
}

function notifTypeFromVariant(v: Variant_like_comment_follow): string {
  if (v === Variant_like_comment_follow.like) return "like";
  if (v === Variant_like_comment_follow.comment) return "comment";
  return "follow";
}

export default function Notifications() {
  const { identity } = useInternetIdentity();
  const { data: notifications, isLoading } = useGetNotifications();
  const { mutate: markRead, isPending: marking } = useMarkNotificationsRead();

  if (!identity) {
    return (
      <div
        className="flex flex-col"
        style={{ height: "100dvh", background: "oklch(0.08 0.01 240)" }}
        data-ocid="notifications.page"
      >
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
          <Bell className="w-16 h-16" style={{ color: "#F4A23B" }} />
          <h2 className="font-display font-bold text-2xl text-white">
            Your Inbox
          </h2>
          <p style={{ color: "oklch(0.60 0.03 240)" }}>
            Login to see your notifications
          </p>
        </div>
      </div>
    );
  }

  const liveNotifs = notifications ?? [];
  const hasUnread = liveNotifs.some((n) => !n.read);
  const showMock = liveNotifs.length === 0;

  const items = showMock
    ? MOCK_NOTIFICATIONS
    : liveNotifs.map((n, i) => ({
        id: i,
        type: notifTypeFromVariant(n.notificationType),
        user: `${n.fromUser.toString().slice(0, 12)}...`,
        msg:
          n.notificationType === Variant_like_comment_follow.like
            ? "liked your video"
            : n.notificationType === Variant_like_comment_follow.follow
              ? "started following you"
              : "commented on your video",
        time: "recently",
        read: n.read,
      }));

  return (
    <div
      className="flex flex-col"
      style={{ height: "100dvh", background: "oklch(0.08 0.01 240)" }}
      data-ocid="notifications.page"
    >
      <Header />
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="px-4 pt-5 max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-5">
            <h1 className="font-display font-black text-2xl text-white">
              Inbox
            </h1>
            {hasUnread && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => markRead()}
                disabled={marking}
                className="text-xs"
                style={{ borderColor: "oklch(0.25 0.025 240)" }}
                data-ocid="notifications.mark_read.button"
              >
                <CheckCheck className="w-3 h-3 mr-1" />
                Mark all read
              </Button>
            )}
          </div>

          {isLoading && (
            <div className="space-y-3" data-ocid="notifications.loading_state">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && (
            <div className="space-y-1">
              {items.map((notif, i) => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{
                    background:
                      !("read" in notif) || !notif.read
                        ? "oklch(0.75 0.165 57 / 0.06)"
                        : "transparent",
                  }}
                  data-ocid={`notifications.item.${i + 1}`}
                >
                  <div className="relative flex-shrink-0">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                      style={{
                        background:
                          "linear-gradient(135deg, #F4A23B, oklch(0.55 0.22 340))",
                      }}
                    >
                      {notif.user[1]?.toUpperCase() ?? "U"}
                    </div>
                    <span
                      className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center border"
                      style={{
                        background: "oklch(0.12 0.015 240)",
                        borderColor: "oklch(0.22 0.025 240)",
                      }}
                    >
                      <NotifIcon type={notif.type} />
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white">
                      <span className="font-semibold">{notif.user}</span>{" "}
                      <span style={{ color: "oklch(0.66 0.03 240)" }}>
                        {notif.msg}
                      </span>
                    </p>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: "oklch(0.55 0.03 240)" }}
                    >
                      {notif.time}
                    </p>
                  </div>
                  {"read" in notif && !notif.read && (
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: "#F4A23B" }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
