import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, CheckCheck, Heart, MessageCircle, UserPlus } from "lucide-react";
import { motion } from "motion/react";
import { Variant_like_comment_follow } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetNotifications,
  useMarkNotificationsRead,
} from "../hooks/useQueries";

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: "like",
    user: "@cricket_crazy",
    msg: 'liked your video "Bhangra Moves"',
    time: "2m ago",
  },
  {
    id: 2,
    type: "follow",
    user: "@dance_india",
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
    user: "@festival_queen",
    msg: 'liked your video "Diwali Vibes"',
    time: "3h ago",
  },
  {
    id: 5,
    type: "follow",
    user: "@adventurer_raj",
    msg: "started following you",
    time: "5h ago",
  },
];

function NotifIcon({ type }: { type: string }) {
  if (type === "like")
    return <Heart className="w-4 h-4 text-red-400 fill-red-400" />;
  if (type === "follow") return <UserPlus className="w-4 h-4 text-primary" />;
  return <MessageCircle className="w-4 h-4 text-blue-400" />;
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
        className="h-[100dvh] flex flex-col items-center justify-center gap-4 px-6 text-center"
        data-ocid="notifications.page"
      >
        <Bell className="w-16 h-16 text-primary" />
        <h2 className="font-display font-bold text-2xl">Your Inbox</h2>
        <p className="text-muted-foreground">Login to see your notifications</p>
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
      className="h-[100dvh] overflow-y-auto pb-20 pt-12"
      data-ocid="notifications.page"
    >
      <div className="px-4 max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display font-black text-2xl">Inbox</h1>
          {hasUnread && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => markRead()}
              disabled={marking}
              className="text-xs border-border"
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
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  !("read" in notif) || !notif.read ? "bg-primary/5" : ""
                }`}
                data-ocid={`notifications.item.${i + 1}`}
              >
                <div className="relative">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.72 0.17 55), oklch(0.58 0.24 340))",
                    }}
                  >
                    {notif.user[1]?.toUpperCase() ?? "U"}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-card border border-border flex items-center justify-center">
                    <NotifIcon type={notif.type} />
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-semibold">{notif.user}</span>{" "}
                    <span className="text-muted-foreground">{notif.msg}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {notif.time}
                  </p>
                </div>
                {"read" in notif && !notif.read && (
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
