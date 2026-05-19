const steps = [
  { num: 1, icon: "🔍", title: "Browse Products", desc: "Explore our range of 250ml, 500ml & 1L packs." },
  { num: 2, icon: "🛒", title: "Add to Cart", desc: "Select your preferred pack size and quantity." },
  { num: 3, icon: "📦", title: "Place Order", desc: "Enter delivery address and confirm your order." },
  { num: 4, icon: "🚚", title: "Get Delivered", desc: "We call to confirm and deliver to your doorstep." },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-32 bg-secondary text-white overflow-hidden mt-10">
      {/* Top Wave */}
      <div className="absolute top-[-1px] left-0 right-0 w-full overflow-hidden leading-none z-0">
        <svg viewBox="0 0 1440 320" className="w-full h-[100px] md:h-[150px]" preserveAspectRatio="none" style={{ display: 'block', fill: '#E6F4FF' }}>
          <path d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
        </svg>
      </div>

      <div className="page-container relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center">How It Works</h2>
        <p className="text-white/80 text-center mt-2 max-w-2xl mx-auto mb-16">Four simple steps to pure hydration</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          <div className="hidden md:block absolute top-8 left-[12%] right-[12%] h-0.5 bg-accent/30" />
          {steps.map((s) => (
            <div key={s.num} className="text-center relative">
              <div className="w-16 h-16 rounded-full bg-accent text-secondary font-bold text-xl flex items-center justify-center mx-auto mb-4 relative z-10 shadow-[0_0_20px_rgba(0,212,255,0.4)]">
                {s.num}
              </div>
              <span className="text-3xl block mb-3">{s.icon}</span>
              <h3 className="font-bold text-white text-lg mb-2">{s.title}</h3>
              <p className="text-white/70 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-[-1px] left-0 right-0 w-full overflow-hidden leading-none z-0">
        <svg viewBox="0 0 1440 320" className="w-full h-[100px] md:h-[150px]" preserveAspectRatio="none" style={{ display: 'block', fill: '#FFFFFF' }}>
          <path d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </section>
  );
}


