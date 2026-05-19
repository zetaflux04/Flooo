import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import PageContainer from "@/components/ui/PageContainer";

export default function PremiumDeliveryCta() {
  return (
    <section className="relative bg-secondary text-white overflow-hidden">
      <div className="absolute top-0 left-0 right-0 z-10 leading-none">
        <svg viewBox="0 0 1440 100" className="w-full h-12 md:h-16 block" preserveAspectRatio="none">
          <path
            d="M0,48 C240,0 480,96 720,48 C960,0 1200,80 1440,40 L1440,0 L0,0 Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>
      <PageContainer className="relative z-10 pt-20 pb-24 md:pt-24 md:pb-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative flex justify-center order-2 lg:order-1">
            <div className="relative w-full max-w-md aspect-[4/3] animate-float">
              <Image
                src="/bottle_group_1.png"
                alt="LSP Enterprises water delivery"
                fill
                className="object-contain drop-shadow-2xl"
              />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
              Ready To Get Our Premium Water Delivery Service
            </h2>
            <p className="text-white/80 mb-8 leading-relaxed">
              Book your order today — no online payment required. We deliver pure, BIS-certified water
              straight to your doorstep across NCR and UP.
            </p>
            <ul className="space-y-3 mb-8">
              {["Free Delivery", "7 Days In A Week Service"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-white/90">
                  <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-primary" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/products" className="btn-primary inline-block px-8">
              Our Services
            </Link>
          </div>
        </div>
      </PageContainer>
      <div className="absolute bottom-0 left-0 right-0 z-10 leading-none">
        <svg viewBox="0 0 1440 100" className="w-full h-12 md:h-16 block" preserveAspectRatio="none">
          <path
            d="M0,52 C360,100 720,0 1080,52 C1260,20 1380,36 1440,44 L1440,100 L0,100 Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>
    </section>
  );
}

