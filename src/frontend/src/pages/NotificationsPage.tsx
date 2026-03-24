import { Bell, Heart, MessageCircle, UserPlus } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { NOTIFICATIONS } from "../data/sampleVideos";

export function NotificationsPage() {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "like":
        return (
          <Heart
            size={16}
            fill="oklch(0.61 0.265 355)"
            stroke="oklch(0.61 0.265 355)"
          />
        );
      case "follow":
        return (
          <UserPlus size={16} style={{ color: "oklch(0.72 0.218 150)" }} />
        );
      case "comment":
        return (
          <MessageCircle size={16} style={{ color: "oklch(0.74 0.166 58)" }} />
        );
      default:
        return <Bell size={16} style={{ color: "oklch(0.68 0.028 240)" }} />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

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
        <div className="flex items-center gap-3">
          <h1
            className="font-display text-xl font-bold"
            style={{ color: "oklch(0.94 0.007 240)" }}
          >
            Notifications
          </h1>
          {unreadCount > 0 && (
            <span
              className="px-2 py-0.5 rounded-full text-xs font-bold text-white"
              style={{ background: "oklch(0.60 0.248 25)" }}
              data-ocid="notifications.badge"
            >
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            data-ocid="notifications.mark_read.button"
            onClick={markAllRead}
            className="text-xs font-semibold"
            style={{ color: "oklch(0.74 0.166 58)" }}
          >
            Mark all read
          </button>
        )}
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {notifications.length === 0 ? (
          <div
            data-ocid="notifications.empty_state"
            className="flex flex-col items-center gap-4 py-20"
          >
            <Bell size={48} style={{ color: "oklch(0.26 0.032 240)" }} />
            <p style={{ color: "oklch(0.68 0.028 240)" }}>
              No notifications yet
            </p>
          </div>
        ) : (
          <div
            className="divide-y"
            style={{ borderColor: "oklch(0.26 0.032 240 / 0.3)" }}
          >
            {notifications.map((notif, i) => (
              <motion.button
                key={notif.id}
                type="button"
                data-ocid={`notifications.item.${i + 1}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="w-full flex items-center gap-3 px-4 py-4 text-left transition-colors"
                style={{
                  background: notif.isRead
                    ? "transparent"
                    : "oklch(0.74 0.166 58 / 0.04)",
                }}
                onClick={() =>
                  setNotifications((prev) =>
                    prev.map((n) =>
                      n.id === notif.id ? { ...n, isRead: true } : n,
                    ),
                  )
                }
              >
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src={notif.avatar}
                      alt={notif.user}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{
                      background: "oklch(0.21 0.030 240)",
                      border: "1.5px solid oklch(0.14 0.022 240)",
                    }}
                  >
                    {getIcon(notif.type)}
                  </div>
                </div>

                <div className="flex-1 min-w-0 text-left">
                  <p
                    className="text-sm"
                    style={{ color: "oklch(0.94 0.007 240)" }}
                  >
                    <span className="font-bold">{notif.user}</span>{" "}
                    <span style={{ color: "oklch(0.68 0.028 240)" }}>
                      {notif.action}
                    </span>
                  </p>
                  {notif.content && (
                    <p
                      className="text-xs mt-0.5 truncate"
                      style={{ color: "oklch(0.68 0.028 240)" }}
                    >
                      {notif.content}
                    </p>
                  )}
                  <p
                    className="text-xs mt-1"
                    style={{ color: "oklch(0.68 0.028 240 / 0.7)" }}
                  >
                    {notif.time}
                  </p>
                </div>

                {!notif.isRead && (
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: "oklch(0.74 0.166 58)" }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
