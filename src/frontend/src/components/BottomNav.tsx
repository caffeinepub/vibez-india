import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, Home, Plus, Search, User } from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetNotifications } from "../hooks/useQueries";

export default function BottomNav() {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const { data: notifications } = useGetNotifications();
  const { identity } = useInternetIdentity();
  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;

  const tabs = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/discover", icon: Search, label: "Discover" },
    { to: "/upload", icon: Plus, label: "", isUpload: true },
    {
      to: "/notifications",
      icon: Bell,
      label: "Inbox",
      hasBadge: unreadCount > 0,
    },
    { to: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around h-16"
      style={{
        background: "oklch(0.09 0.02 240 / 0.97)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid oklch(0.20 0.03 240)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {tabs.map((tab) => {
        const isActive = pathname === tab.to;
        if (tab.isUpload) {
          return (
            <Link key={tab.to} to={tab.to} data-ocid="nav.upload.button">
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="w-12 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.73 0.17 55), oklch(0.58 0.24 340))",
                }}
              >
                <Plus
                  className="w-6 h-6 text-white font-bold"
                  strokeWidth={3}
                />
              </motion.div>
            </Link>
          );
        }
        return (
          <Link
            key={tab.to}
            to={tab.to}
            className="flex flex-col items-center gap-0.5 relative pt-1"
            data-ocid={`nav.${tab.label.toLowerCase()}.link`}
          >
            {/* Active indicator — orange line at top */}
            {isActive && (
              <motion.div
                layoutId="nav-indicator"
                className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full"
                style={{ background: "oklch(0.73 0.17 55)" }}
              />
            )}
            <motion.div whileTap={{ scale: 0.85 }} className="relative">
              <tab.icon
                className="w-6 h-6 transition-colors"
                style={{
                  color: isActive
                    ? "oklch(0.73 0.17 55)"
                    : "oklch(0.68 0.04 240)",
                }}
                strokeWidth={isActive ? 2.5 : 2}
              />
              {tab.hasBadge && identity && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[9px] font-bold">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </motion.div>
            <span
              className="text-[10px] font-medium transition-colors"
              style={{
                color: isActive
                  ? "oklch(0.73 0.17 55)"
                  : "oklch(0.68 0.04 240)",
              }}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
