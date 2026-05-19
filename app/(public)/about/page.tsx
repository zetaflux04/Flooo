export default function AboutPage() {
  return (
    <div className="py-16 bg-background min-h-screen">
      <div className="page-container">
        <h1 className="text-4xl font-bold text-secondary mb-6">About Flooo</h1>
        <div className="card space-y-4 text-muted leading-relaxed">
          <p>
            <strong className="text-secondary">Flooo</strong> is a BIS-certified added mineral water brand
            by <strong className="text-secondary">LSP Enterprises</strong>. We deliver pure, healthy hydration
            across North India through our network of manufacturing units and retail partners.
          </p>
          <p>
            Our water undergoes multi-stage RO + UV + UF purification and is enriched with essential minerals
            for optimal taste and health benefits. Available in 250ml, 500ml, and 1 Litre packs.
          </p>
          <p>
            With manufacturing facilities in Barabanki, Gurugram, and Greater Noida, we are committed to
            bringing premium quality water to every doorstep.
          </p>
        </div>
      </div>
    </div>
  );
}
