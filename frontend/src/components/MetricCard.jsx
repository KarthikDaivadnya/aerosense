export default function MetricCard({ title, value, subtitle, color, icon }) {
  const styles = {
    blue:   { border: 'border-blue-900',   bg: 'bg-blue-950/60',   text: 'text-blue-400'   },
    red:    { border: 'border-red-900',    bg: 'bg-red-950/60',    text: 'text-red-400'    },
    yellow: { border: 'border-yellow-900', bg: 'bg-yellow-950/60', text: 'text-yellow-400' },
    green:  { border: 'border-green-900',  bg: 'bg-green-950/60',  text: 'text-green-400'  },
  }
  const s = styles[color] || styles.blue
  return (
    <div className={`rounded-2xl border ${s.border} ${s.bg} p-5 transition-all duration-200 hover:brightness-110`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{title}</p>
        <span className="text-xl">{icon}</span>
      </div>
      <p className={`text-5xl font-black ${s.text} leading-none`}>{value}</p>
      {subtitle && <p className="text-xs text-gray-600 mt-2">{subtitle}</p>}
    </div>
  )
}