import Link from "next/link";
import { MapPin, Phone, Mail, Facebook, Twitter, Linkedin } from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";
import PageContainer from "./PageContainer";
import FooterTopWave from "./FooterTopWave";
import FooterSubscribe from "./FooterSubscribe";
import BackToTop from "./BackToTop";
import {
  COMPANY_ADDRESS_LINES,
  COMPANY_EMAIL,
  COMPANY_PHONE_DISPLAY,
  COMPANY_PHONE_HREF,
} from "@/lib/company-contact";

const usefulLinks = [
  { href: "/about", label: "About Company" },
  { href: "/products", label: "Services" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#faq", label: "Our FAQ" },
  { href: "/#contact", label: "Contact Us" },
];

const socialLinks = [
  { href: "https://www.facebook.com/profile.php?id=61569604631975", label: "Facebook", icon: Facebook },
  { href: "#", label: "Twitter", icon: Twitter },
  { href: "#", label: "LinkedIn", icon: Linkedin },
];

export default function Footer() {
  return (
    <>
      <div className="bg-white pt-10 pb-0" aria-hidden />
      <FooterTopWave />
      <footer className="relative bg-foreground text-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
          <div className="absolute -top-20 right-0 w-[28rem] h-[28rem] rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-10 -left-20 w-80 h-80 rounded-full bg-secondary/40 blur-3xl" />
        </div>

        <PageContainer className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 py-10 border-b border-white/10">
            <p className="text-lg md:text-xl font-medium text-white/95">
              Please <span className="text-primary font-semibold">Call Us</span> to Take an Extraordinary Service
            </p>
            <a
              href={COMPANY_PHONE_HREF}
              className="inline-flex items-center justify-center gap-2 bg-primary text-secondary font-bold rounded-full px-6 py-3.5 hover:bg-ripple transition-colors shadow-lg shadow-primary/25 shrink-0"
            >
              <Phone className="w-5 h-5" />
              {COMPANY_PHONE_DISPLAY}
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-12">
            <div>
              <BrandLogo
                size="lg"
                textClassName="text-2xl text-white"
                className="mb-4"
                asLink={false}
              />
              <p className="text-white/70 text-sm leading-relaxed mb-6">
                BIS-certified added mineral water by LSP Enterprises. Pure hydration delivered across North India.
              </p>
              <div>
                <h4 className="font-semibold text-white mb-2">Open Hours:</h4>
                <p className="text-white/70 text-sm">Mon - Sat: 9AM - 6PM</p>
                <p className="text-white/70 text-sm">Sunday: Closed</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-5">Address</h4>
              <ul className="space-y-4 text-sm text-white/75">
                <li className="flex gap-3">
                  <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>
                    {COMPANY_ADDRESS_LINES.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </span>
                </li>
                <li className="flex gap-3">
                  <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <a href={COMPANY_PHONE_HREF} className="hover:text-primary transition-colors">
                    Call Us: {COMPANY_PHONE_DISPLAY}
                  </a>
                </li>
                <li className="flex gap-3">
                  <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <a href={`mailto:${COMPANY_EMAIL}`} className="hover:text-primary transition-colors">
                    {COMPANY_EMAIL}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-5">Useful Links</h4>
              <ul className="space-y-2.5 text-sm text-white/75">
                {usefulLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-5">Subscribe</h4>
              <p className="text-white/70 text-sm mb-4 leading-relaxed">
                Get updates on offers, new pack sizes, and delivery areas.
              </p>
              <FooterSubscribe />
            </div>
          </div>
        </PageContainer>

        <div className="relative z-10 bg-black/20 border-t border-white/10">
          <PageContainer className="py-5">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/60">
              <p className="text-center md:text-left">
                LSP Enterprises © {new Date().getFullYear()} All Rights Reserved
              </p>
              <div className="flex items-center gap-3">
                {socialLinks.map(({ href, label, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-primary hover:text-secondary hover:border-primary transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
              <div className="flex items-center gap-3 text-center">
                <Link href="#" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
                <span className="text-white/30">|</span>
                <Link href="#" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </PageContainer>
        </div>
      </footer>
      <BackToTop />
    </>
  );
}

