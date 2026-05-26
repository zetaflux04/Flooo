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

const imageSizeClasses = {
  sm: "w-7 h-7",
  md: "w-8 h-8",
  lg: "w-10 h-10",
} as const;

const imagePixelSizes = {
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
  const pixelSize = imagePixelSizes[size];

  const content = (
    <>
      <span
        className={cn(
          "relative shrink-0 overflow-hidden rounded-full bg-white",
          imageSizeClasses[size],
          imageClassName
        )}
      >
        <Image
          src="/lsp_logo.jpeg"
          alt="LSP Enterprises"
          fill
          className="object-cover"
          sizes={`${pixelSize}px`}
          priority
        />
      </span>
      {showText && (
        <span className={cn("min-w-0 font-bold text-primary truncate", textClassName)}>
          LSP Enterprises
        </span>
      )}
    </>
  );

  if (!asLink) {
    return <div className={cn("flex items-center gap-1.5 sm:gap-2 min-w-0", className)}>{content}</div>;
  }

  return (
    <Link href={href} className={cn("flex items-center gap-1.5 sm:gap-2 min-w-0", className)}>
      {content}
    </Link>
  );
}
