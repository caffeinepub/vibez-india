import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, Compass, Home, Plus, User } from "lucide-react";
import { motion } from "motion/react";

export default function BottomNav() {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  const tabs = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/discover", icon: Compass, label: "Discover" },
    { to: "/upload", icon: Plus, label: "", isCreate: true },
    { to: "/notifications", icon: Bell, label: "Inbox" },
    { to: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around h-16"
      style={{
        background: "oklch(0.10 0.015 240 / 0.97)",
        backdropFilter: "blur(14px)",
        borderTop: "1px solid oklch(0.19 0.02 240)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {tabs.map((tab) => {
        const isActive = pathname === tab.to;

        if (tab.isCreate) {
          return (
            <Link key={tab.to} to={tab.to} data-ocid="nav.upload.button">
              <motion.div
                whileTap={{ scale: 0.88 }}
                className="w-11 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "#F4A23B" }}
              >
                <Plus className="w-5 h-5 text-white" strokeWidth={2.5} />
              </motion.div>
            </Link>
          );
        }

        return (
          <Link
            key={tab.to}
            to={tab.to}
            className="flex flex-col items-center gap-0.5 py-1 px-3"
            data-ocid={`nav.${tab.label.toLowerCase()}.link`}
          >
            <motion.div whileTap={{ scale: 0.85 }}>
              <tab.icon
                className="w-6 h-6 transition-colors"
                style={{ color: isActive ? "#F4A23B" : "oklch(0.60 0.03 240)" }}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
            </motion.div>
            {tab.label && (
              <span
                className="text-[10px] font-semibold transition-colors"
                style={{ color: isActive ? "#F4A23B" : "oklch(0.55 0.03 240)" }}
              >
                {tab.label}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
