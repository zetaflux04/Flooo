"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { icon: "🏭", value: 4, suffix: "", label: "Manufacturing Units" },
  { icon: "🏪", value: 5, suffix: "", label: "Store Locations" },
  { icon: "💧", value: 100, suffix: "%", label: "Purified" },
  { icon: "🛡️", value: 0, suffix: "", label: "FSSAI Certified", text: "FSSAI" },
];

function Counter({ target, suffix, text }: { target: number; suffix: string; text?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          if (text) return;
          let start = 0;
          const step = target / 40;
          const timer = setInterval(() => {
            start += step;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else setCount(Math.floor(start));
          }, 30);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, text]);

  if (text) return <span ref={ref} className="text-3xl md:text-4xl font-bold">{text}</span>;
  return (
    <span ref={ref} className="text-3xl md:text-4xl font-bold">
      {count}{suffix}
    </span>
  );
}

export default function StatsBar() {
  return (
    <section className="bg-white py-12">
      <div className="page-container grid grid-cols-2 sm:grid-cols-4 gap-8 text-center text-secondary">
        {stats.map((s) => (
          <div key={s.label}>
            <span className="text-4xl mb-3 block">{s.icon}</span>
            <Counter target={s.value} suffix={s.suffix} text={s.text} />
            <p className="text-sm text-secondary/70 mt-2 font-medium">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
