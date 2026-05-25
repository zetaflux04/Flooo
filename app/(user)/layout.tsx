import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import MSMEBadge from "@/components/ui/MSMEBadge";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-background">{children}</main>
      <Footer />
      <MSMEBadge />
      <WhatsAppButton />
    </div>
  );
}
