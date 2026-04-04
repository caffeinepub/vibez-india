import { motion } from "motion/react";
import { CATEGORIES } from "../data/videos";

interface CategoryTabsProps {
  active: string;
  onChange: (cat: string) => void;
}

export default function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  return (
    <div
      className="w-full z-30"
      style={{
        background: "oklch(0.10 0.012 240 / 0.96)",
        backdropFilter: "blur(6px)",
        borderBottom: "1px solid oklch(0.19 0.02 240)",
      }}
    >
      <div
        className="pills-scroll flex items-center gap-1 px-4 md:justify-center md:gap-2"
        style={{ padding: "8px 16px" }}
      >
        {CATEGORIES.map((cat) => {
          const isActive = active === cat;
          return (
            <motion.button
              key={cat}
              type="button"
              whileTap={{ scale: 0.93 }}
              onClick={() => onChange(cat)}
              className="flex-shrink-0 px-3 py-1.5 text-sm font-medium transition-all rounded-sm"
              style={{
                color: isActive ? "#FFFFFF" : "oklch(0.66 0.03 240)",
                fontWeight: isActive ? 700 : 500,
                letterSpacing: "0.01em",
                position: "relative",
              }}
              data-ocid="home.category.tab"
            >
              {cat}
              {isActive && (
                <motion.div
                  layoutId="cat-underline"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full"
                  style={{ background: "#F4A23B", width: "70%" }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
