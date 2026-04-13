export default function EngineTable({ engines, onSelect, selectedId }) {
  const statusStyle = {
    Critical: { dot: 'bg-red-500 pulse-red',  text: 'text-red-400',    badge: 'bg-red-950 border border-red-800 text-red-400'       },
    Warning:  { dot: 'bg-yellow-500',          text: 'text-yellow-400', badge: 'bg-yellow-950 border border-yellow-800 text-yellow-400' },
    Healthy:  { dot: 'bg-green-500',           text: 'text-green-400',  badge: 'bg-green-950 border border-green-800 text-green-400'   },
  }

  const criticalCount = engines.filter(e => e.status === 'Critical').length

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900 overflow-hidden">

      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-white text-lg">Engine Fleet Monitor</h2>
          <p className="text-xs text-gray-500 mt-0.5">{engines.length} engines tracked · Click any row to inspect</p>
        </div>
        {criticalCount > 0 && (
          <div className="flex items-center gap-2 bg-red-950 border border-red-800 rounded-xl px-3 py-2">
            <div className="w-2 h-2 rounded-full bg-red-500 pulse-red" />
            <span className="text-red-400 text-xs font-semibold">{criticalCount} Critical Alerts</span>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-y-auto max-h-80">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gray-800/90">
            <tr className="text-gray-400 text-xs uppercase tracking-wider">
              <th className="px-6 py-3 text-left">Engine</th>
              <th className="px-6 py-3 text-left">Cycles Run</th>
              <th className="px-6 py-3 text-left">RUL Remaining</th>
              <th className="px-6 py-3 text-left">Health Score</th>
              <th className="px-6 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {engines.map((e) => {
              const s = statusStyle[e.status] || statusStyle.Healthy
              const isSelected = selectedId === e.engine_id
              return (
                <tr
                  key={e.engine_id}
                  onClick={() => onSelect(e.engine_id)}
                  className={`border-t border-gray-800 cursor-pointer transition-all duration-150
                    ${isSelected ? 'bg-blue-950/60 border-l-2 border-l-blue-500' : 'hover:bg-gray-800/60'}`}
                >
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${s.dot}`} />
                      <span className="font-mono font-bold text-blue-400">
                        #{String(e.engine_id).padStart(3, '0')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-gray-300">
                    {e.max_cycle} <span className="text-gray-600 text-xs">cycles</span>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`font-mono font-semibold ${s.text}`}>{e.current_RUL}</span>
                    <span className="text-gray-600 text-xs ml-1">cycles</span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-gray-700 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            e.health_score < 20 ? 'bg-red-500' :
                            e.health_score < 50 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${e.health_score}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 font-mono w-10">{e.health_score}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${s.badge}`}>
                      {e.status}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}