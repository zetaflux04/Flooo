import { Droplets, Award, Truck, Factory } from "lucide-react";

const features = [
  {
    icon: Droplets,
    title: "Always Feel Fresh",
    desc: "RO + UV + UF technology for crystal-clear purity in every drop.",
  },
  {
    icon: Award,
    title: "Premium in Quality",
    desc: "Packaging water bottle, meeting all Indian quality standards.",
  },
  {
    icon: Droplets,
    title: "Good for a Healthy Life",
    desc: "PH-balanced, mineral enriched water for your family's wellbeing.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    desc: "Quick home delivery across NCR & UP serviceable areas.",
  },
];

export default function WhyFlooo() {
  return (
    <section className="py-20 bg-white">
      <div className="page-container">
        <h2 className="section-title">Why Choose LSP Enterprises</h2>
        <p className="section-subtitle mb-12">Premium hydration backed by science and trust</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="card card-hover text-center group border border-transparent hover:border-primary/20"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-light-blue flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold text-secondary text-lg mb-2">{title}</h3>
              <p className="text-muted text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

