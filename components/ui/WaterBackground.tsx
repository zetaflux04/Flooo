"use client";

import { cn } from "@/lib/utils";

type Variant = "hero" | "section" | "footer";

const variantStyles: Record<Variant, { gradient: string; wave: string }> = {
  hero: {
    gradient: "bg-gradient-to-br from-deep via-secondary to-[#061d76]",
    wave: "fill-white/10",
  },
  section: {
    gradient: "bg-gradient-to-b from-light-blue to-background",
    wave: "fill-primary/15",
  },
  footer: {
    gradient: "bg-gradient-to-br from-secondary to-deep",
    wave: "fill-primary/20",
  },
};

interface WaterBackgroundProps {
  variant?: Variant;
  className?: string;
  children?: React.ReactNode;
}

export default function WaterBackground({
  variant = "hero",
  className,
  children,
}: WaterBackgroundProps) {
  const styles = variantStyles[variant];

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div className={cn("absolute inset-0", styles.gradient)} aria-hidden />
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        {[...Array(6)].map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white/10 animate-float"
            style={{
              width: `${12 + i * 8}px`,
              height: `${12 + i * 8}px`,
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${4 + i}s`,
            }}
          />
        ))}
      </div>
      <svg
        className="absolute bottom-0 left-0 w-[200%] h-24 md:h-32 animate-wave opacity-60"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          className={styles.wave}
          d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,30 1440,60 L1440,120 L0,120 Z"
        />
      </svg>
      <svg
        className="absolute bottom-0 left-0 w-[200%] h-20 md:h-28 opacity-40"
        style={{ animation: "wave 10s ease-in-out infinite reverse" }}
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          className="fill-white/5"
          d="M0,80 C480,20 960,100 1440,50 L1440,100 L0,100 Z"
        />
      </svg>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
