const BentoPanel = ({ title, eyebrow, children, className = '' }) => (
  <section className={`glass-card p-6 sm:p-8 ${className}`}>
    {eyebrow && <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">{eyebrow}</p>}
    <h2 className="mt-2 text-2xl sm:text-3xl font-bold">{title}</h2>
    <div className="mt-6">{children}</div>
  </section>
)

export default BentoPanel
