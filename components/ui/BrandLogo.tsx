import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  showText?: boolean;
  className?: string;
  imageClassName?: string;
  textClassName?: string;
  href?: string;
  size?: "sm" | "md" | "lg";
  asLink?: boolean;
};

const imageHeights = {
  sm: 28,
  md: 32,
  lg: 40,
} as const;

export default function BrandLogo({
  showText = true,
  className,
  imageClassName,
  textClassName,
  href = "/",
  size = "md",
  asLink = true,
}: BrandLogoProps) {
  const height = imageHeights[size];

  const content = (
    <>
      <span
        className={cn(
          "relative shrink-0 overflow-hidden rounded-full bg-white",
          imageClassName
        )}
        style={{ width: height, height }}
      >
        <Image
          src="/lsp_logo.jpeg"
          alt="LSP Enterprises"
          fill
          className="object-cover"
          sizes={`${height}px`}
          priority
        />
      </span>
      {showText && (
        <span className={cn("font-bold text-primary truncate", textClassName)}>
          LSP Enterprises
        </span>
      )}
    </>
  );

  if (!asLink) {
    return <div className={cn("flex items-center gap-2 min-w-0", className)}>{content}</div>;
  }

  return (
    <Link href={href} className={cn("flex items-center gap-2 min-w-0", className)}>
      {content}
    </Link>
  );
}
