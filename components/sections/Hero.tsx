import Image from "next/image";
import Link from "next/link";
import WaterBackground from "@/components/ui/WaterBackground";
import WaveDivider from "@/components/ui/WaveDivider";
import PageContainer from "@/components/ui/PageContainer";

export default function Hero() {
  return (
    <WaterBackground
      variant="hero"
      className="text-white min-h-[88vh] flex flex-col justify-center"
    >
      <PageContainer className="py-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div className="text-center lg:text-left">
            <span className="inline-block bg-accent/20 border border-accent/40 text-accent font-semibold px-4 py-1.5 rounded-full mb-4 water-shimmer">
              Have Faith In Us
            </span>
            <p className="mb-4">
              <span>☆ LSP Flooo </span>
              <span className="ml-2">☆ LPS Flowers</span>
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Premium Quality Water You Can Trust Every Day
            </h1>
            <p className="text-lg text-white/85 mb-8 max-w-lg mx-auto lg:mx-0">
              BIS Certified · RO+UV+UF Purified · 100ml, 250ml, 500ml &amp; 1 Litre packs delivered to your door.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link href="/products" className="btn-primary">
                Shop Now
              </Link>
              <Link href="/stores" className="btn-outline">
                Find a Store
              </Link>
            </div>
          </div>
          <div className="relative flex justify-center items-center">
            <div className="relative w-full max-w-lg aspect-square animate-float">
              <Image
                src="/bottle_group.png"
                alt="LSP Enterprises water bottles"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </PageContainer>
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <WaveDivider color="#FFFFFF" />
      </div>
    </WaterBackground>
  );
}
