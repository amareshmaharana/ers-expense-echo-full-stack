const StatCard = ({ label, value, meta, tone = 'neutral' }) => {
  const tones = {
    neutral: 'from-gray-600 to-gray-700',
    cyan: 'from-cyan-600 to-cyan-700',
    purple: 'from-purple-600 to-purple-700',
    amber: 'from-amber-600 to-amber-700',
    emerald: 'from-emerald-600 to-emerald-700',
  }

  return (
    <div className="glass-card p-6 relative overflow-hidden group">
      <div className={`absolute inset-0 bg-gradient-to-br ${tones[tone]} opacity-10 group-hover:opacity-20 transition`} />
      <div className="relative">
        <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">{label}</p>
        <p className="mt-3 text-4xl sm:text-5xl font-bold">{value}</p>
        <p className="mt-3 text-sm text-gray-400">{meta}</p>
      </div>
    </div>
  )
}

export default StatCard
