import { cn } from "@/lib/utils";

function initialsFromName(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Avatar({
  name,
  className,
  textClassName,
}: {
  name: string;
  className?: string;
  textClassName?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white font-bold shrink-0",
        className
      )}
      role="img"
      aria-label={name}
    >
      <span className={cn("select-none", textClassName)} aria-hidden>
        {initialsFromName(name)}
      </span>
    </div>
  );
}
