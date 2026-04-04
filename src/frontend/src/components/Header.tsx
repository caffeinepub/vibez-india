import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, Search } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface HeaderProps {
  showSearch?: boolean;
}

export default function Header({ showSearch = false }: HeaderProps) {
  const { identity } = useInternetIdentity();
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Discover", to: "/discover" },
    { label: "Live", to: "/" },
    { label: "Notifications", to: "/notifications" },
  ];

  const initials = identity
    ? identity.getPrincipal().toString().slice(0, 2).toUpperCase()
    : "VI";

  return (
    <header
      className="sticky top-0 z-40 w-full"
      style={{
        background:
          "linear-gradient(to bottom, oklch(0.11 0.015 240 / 0.98) 70%, oklch(0.08 0.01 240 / 0))",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid oklch(0.19 0.02 240)",
      }}
    >
      <div className="flex items-center justify-between px-6 md:px-10 h-14">
        {/* Brand logo */}
        <Link
          to="/"
          className="flex items-center gap-2 flex-shrink-0"
          data-ocid="header.home.link"
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "#F4A23B" }}
            aria-label="Vibez India logo"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
            >
              <path d="M3 2.5L11.5 7L3 11.5V2.5Z" fill="white" />
            </svg>
          </div>
          <span
            className="font-display font-black text-lg tracking-tight"
            style={{ color: "#F4A23B" }}
          >
            Vibez India
          </span>
        </Link>

        {/* Center nav (hidden on mobile) */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive =
              (pathname === link.to && link.to !== "/") ||
              (link.to === "/" && pathname === "/");
            return (
              <Link
                key={link.label}
                to={link.to}
                className="text-sm font-medium transition-colors"
                style={{ color: isActive ? "#FFFFFF" : "oklch(0.66 0.03 240)" }}
                data-ocid={`header.${link.label.toLowerCase()}.link`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: search icon + avatar */}
        <div className="flex items-center gap-3">
          {showSearch && (
            <button
              type="button"
              className="p-1.5 rounded-full"
              style={{ color: "oklch(0.66 0.03 240)" }}
              data-ocid="header.search.button"
            >
              <Search className="w-5 h-5" />
            </button>
          )}
          <button
            type="button"
            className="p-1.5 rounded-full"
            style={{ color: "oklch(0.66 0.03 240)" }}
            data-ocid="header.notifications.button"
          >
            <Bell className="w-5 h-5" />
          </button>
          <Link to="/profile" data-ocid="header.profile.link">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2"
              style={{
                background:
                  "linear-gradient(135deg, #F4A23B, oklch(0.55 0.22 340))",
                borderColor: "oklch(0.19 0.02 240)",
                color: "white",
              }}
            >
              {initials}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
