import Hero from "@/components/sections/Hero";
import StatsBar from "@/components/sections/StatsBar";
import ProductsSection from "@/components/sections/ProductsSection";
import WhyFlooo from "@/components/sections/WhyFlooo";
import HowItWorks from "@/components/sections/HowItWorks";
import ManufacturingUnits from "@/components/sections/ManufacturingUnits";
import FaqSection from "@/components/sections/FaqSection";
import ContactForm from "@/components/sections/ContactForm";
import PremiumDeliveryCta from "@/components/sections/PremiumDeliveryCta";
import TestimonialsSection from "@/components/sections/TestimonialsSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <ProductsSection />
      <WhyFlooo />
      <HowItWorks />
      <ManufacturingUnits />
      <FaqSection />
      <TestimonialsSection />
      <PremiumDeliveryCta />
      <ContactForm />
    </>
  );
}
