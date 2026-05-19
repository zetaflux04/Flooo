import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "green" | "blue" | "orange" | "magenta" | "cyan" | "default";
  className?: string;
}

const variants = {
  green: "bg-green-100 text-green-700",
  blue: "bg-blue-100 text-blue-700",
  orange: "bg-orange-100 text-orange-700",
  magenta: "bg-light-blue text-primary",
  cyan: "bg-cyan-100 text-cyan-700",
  default: "bg-gray-100 text-gray-700",
};

export default function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
