"use client";

import { useState, useEffect, useLayoutEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, MapPin, Star } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";

const ROTATE_MS = 4000;
const FADE_MS = 300;

const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "Family Customer",
    location: "Noida, UP",
    text: "As a father of two, safe drinking water is essential for us. LSP Enterprises delivers every week on time, and the 1-litre packs are perfect for our home.",
    rating: 5,
  },
  {
    name: "Priya Malhotra",
    role: "Homemaker",
    location: "Greater Noida, UP",
    text: "We switched to LSP Enterprises six months ago. The RO+UV purification tastes clean, and the delivery team is always polite when they call to confirm.",
    rating: 5,
  },
  {
    name: "Amit Patel",
    role: "Retail Partner",
    location: "Barabanki, UP",
    text: "I stock LSP Enterprises at my shop for the neighbourhood. Customers trust the BIS certification, and the quality stays consistent in every batch.",
    rating: 5,
  },
  {
    name: "Kavita Singh",
    role: "Office Admin",
    location: "Gurugram, Haryana",
    text: "Our office orders 500ml bulk packs every month. No online payment stress — they call, confirm, and deliver. Very reliable for our team.",
    rating: 5,
  },
  {
    name: "Deepak Sharma",
    role: "Regular Customer",
    location: "Delhi NCR",
    text: "My parents can taste the difference with mineral-enriched water. LSP Enterprises has been our trusted brand for over a year — highly recommended.",
    rating: 5,
  },
  {
    name: "Ananya Reddy",
    role: "Young Parent",
    location: "Noida, UP",
    text: "The 250ml packs are ideal for school tiffins. Sealed, fresh, and easy to order — LSP Enterprises makes healthy hydration simple for busy families.",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);
  const [paused, setPaused] = useState(false);
  const progressKey = useRef(0);
  const measureRef = useRef<HTMLDivElement>(null);
  const pendingIndex = useRef<number | null>(null);
  const [cardHeight, setCardHeight] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      const root = measureRef.current;
      if (!root) return;
      const h = root.offsetHeight;
      if (h > 0) setCardHeight(h);
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      const next = (index + testimonials.length) % testimonials.length;
      if (next === active || pendingIndex.current !== null) return;
      pendingIndex.current = next;
      progressKey.current += 1;
      setVisible(false);
    },
    [active]
  );

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  useEffect(() => {
    if (visible || pendingIndex.current === null) return;
    const timer = setTimeout(() => {
      setActive(pendingIndex.current!);
      pendingIndex.current = null;
      setVisible(true);
    }, FADE_MS);
    return () => clearTimeout(timer);
  }, [visible]);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => goTo(active + 1), ROTATE_MS);
    return () => clearInterval(timer);
  }, [paused, active, goTo]);

  const current = testimonials[active];

  return (
    <section className="relative py-24 overflow-hidden bg-[#f4f9fc]">
      <div
        ref={measureRef}
        className="pointer-events-none fixed top-0 -left-[9999px] w-full max-w-4xl opacity-0"
        aria-hidden
      >
        <div className="grid w-full">
          {testimonials.map((t) => (
            <article
              key={`measure-${t.name}`}
              className="col-start-1 row-start-1 p-8 md:p-10 lg:p-12 pl-9 md:pl-11"
            >
              <TestimonialContent t={t} />
            </article>
          ))}
        </div>
      </div>

      <div
        className="absolute inset-0 opacity-[0.4] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(0,212,255,0.12) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(1,35,122,0.06) 0%, transparent 45%)",
        }}
        aria-hidden
      />

      <div className="page-container relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-flex items-center rounded-full bg-primary/10 text-secondary text-xs font-semibold tracking-wider uppercase px-4 py-1.5 mb-4">
            Customer Stories
          </span>
          <h2 className="text-3xl md:text-[2.5rem] font-bold text-secondary leading-tight tracking-tight">
            What Our Clients Are Saying
          </h2>
          <p className="text-muted mt-3 text-base md:text-lg">
            Trusted by families and businesses across North India
          </p>
        </div>

        <div
          className="max-w-4xl mx-auto"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative bg-white rounded-3xl shadow-[0_20px_60px_-12px_rgba(1,35,122,0.12)] border border-white ring-1 ring-secondary/5 overflow-hidden">
            <div
              className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-primary via-ripple to-secondary"
              aria-hidden
            />

            <div
              className="relative p-8 md:p-10 lg:p-12 pl-9 md:pl-11"
              style={cardHeight > 0 ? { minHeight: cardHeight } : undefined}
            >
              <article
                className={cn(
                  "transition-opacity duration-300 ease-in-out",
                  visible ? "opacity-100" : "opacity-0"
                )}
              >
                <TestimonialContent t={current} />
              </article>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 px-2">
            <p className="text-sm text-muted tabular-nums order-2 sm:order-1">
              <span className="font-semibold text-secondary">
                {String(active + 1).padStart(2, "0")}
              </span>
              <span className="mx-1.5 text-gray-300">/</span>
              <span>{String(testimonials.length).padStart(2, "0")}</span>
            </p>

            <div className="flex items-center gap-3 order-1 sm:order-2">
              <button
                type="button"
                onClick={prev}
                className="w-12 h-12 rounded-full bg-white border border-gray-200 text-secondary shadow-sm hover:bg-secondary hover:text-white hover:border-secondary transition-all duration-200 flex items-center justify-center"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={next}
                className="w-12 h-12 rounded-full bg-secondary text-white shadow-md shadow-secondary/20 hover:bg-secondary/90 transition-all duration-200 flex items-center justify-center"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full sm:w-32 order-3 sm:order-3">
              <div className="h-1 rounded-full bg-gray-200 overflow-hidden">
                <div
                  key={progressKey.current}
                  className="h-full rounded-full bg-gradient-to-r from-primary to-ripple testimonial-progress"
                  style={{ animationDuration: `${ROTATE_MS}ms` }}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((t, i) => (
              <button
                key={t.name}
                type="button"
                onClick={() => goTo(i)}
                className={cn(
                  "rounded-full transition-all duration-300",
                  i === active
                    ? "w-3 h-3 bg-secondary scale-110"
                    : "w-2 h-2 bg-gray-300 hover:bg-primary/60"
                )}
                aria-label={`View review from ${t.name}`}
                aria-current={i === active ? "true" : undefined}
              />
            ))}
          </div>

          <p className="sr-only" aria-live="polite">
            Review by {current.name}, {current.role}, {current.location}
          </p>
        </div>
      </div>
    </section>
  );
}

function TestimonialContent({ t }: { t: (typeof testimonials)[number] }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-10">
      <div className="flex flex-col items-center md:items-start shrink-0 md:w-[200px]">
        <div className="relative mb-4">
          <div
            className="absolute -inset-1 rounded-full bg-gradient-to-br from-primary/60 to-secondary/30 blur-md"
            aria-hidden
          />
          <Avatar
            name={t.name}
            className="w-20 h-20 md:w-24 md:h-24 ring-4 ring-white shadow-lg text-xl md:text-2xl"
          />
        </div>
        <h3 className="font-bold text-secondary text-lg text-center md:text-left">{t.name}</h3>
        <p className="text-sm text-primary font-medium text-center md:text-left">{t.role}</p>
        <p className="flex items-center gap-1 text-xs text-muted mt-1 justify-center md:justify-start">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          {t.location}
        </p>
        <div className="flex gap-0.5 mt-3">
          {Array.from({ length: t.rating }).map((_, idx) => (
            <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
          ))}
        </div>
      </div>

      <div className="flex-1 md:border-l md:border-gray-100 md:pl-10">
        <span
          className="text-6xl md:text-7xl font-serif text-primary/15 leading-none select-none block -mb-4 md:-mb-6"
          aria-hidden
        >
          &ldquo;
        </span>
        <p className="text-secondary text-lg md:text-xl leading-relaxed font-medium">{t.text}</p>
      </div>
    </div>
  );
}
