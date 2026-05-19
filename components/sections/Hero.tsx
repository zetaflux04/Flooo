import Image from "next/image";
import Link from "next/link";
import WaterBackground from "@/components/ui/WaterBackground";
import WaveDivider from "@/components/ui/WaveDivider";

export default function Hero() {
  return (
    <WaterBackground variant="hero" className="text-white min-h-[88vh] flex items-center">
      <div className="page-container py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-accent/20 border border-accent/40 text-accent font-semibold px-4 py-1.5 rounded-full mb-6 water-shimmer">
              Pure Water Delivered
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Always Want Safe and Good Water for Healthy Life
            </h1>
            <p className="text-lg text-white/85 mb-8 max-w-lg">
              BIS Certified · RO+UV+UF Purified · 100ml, 250ml, 500ml &amp; 1 Litre packs delivered to your door.
            </p>
            <div className="flex flex-wrap gap-4">
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
                alt="Flooo water bottles"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <WaveDivider color="#FFFFFF" />
      </div>
    </WaterBackground>
  );
}
