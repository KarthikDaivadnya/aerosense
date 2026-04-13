import {
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-3 text-xs shadow-xl">
        <p className="text-gray-400 mb-2">Cycle <span className="text-white font-bold">{label}</span></p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="font-mono">
            {p.name}: <span className="font-bold">{Number(p.value).toFixed(1)}</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function EngineDetail({ data, engineId }) {
  if (!data || data.length === 0) return null

  const lastEntry = data[data.length - 1]

  const sensors = [
    { key: 'sensor_2',  name: 'Fan Inlet Temp',      color: '#60a5fa' },
    { key: 'sensor_3',  name: 'LPC Outlet Temp',     color: '#34d399' },
    { key: 'sensor_4',  name: 'HPC Outlet Temp',     color: '#f87171' },
    { key: 'sensor_7',  name: 'Fan Inlet Pressure',  color: '#fbbf24' },
    { key: 'sensor_11', name: 'HPC Outlet Pressure', color: '#a78bfa' },
  ]

  return (
    <div className="space-y-5">

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Current Cycle',  value: lastEntry?.cycle,                        color: 'text-blue-400'   },
          { label: 'Actual RUL',     value: lastEntry?.RUL,                          color: 'text-green-400'  },
          { label: 'Predicted RUL',  value: Math.round(lastEntry?.predicted_RUL),    color: 'text-purple-400' },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl border border-gray-800 bg-gray-900 p-5 text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">{s.label}</p>
            <p className={`text-4xl font-black ${s.color} font-mono`}>{s.value}</p>
            <p className="text-xs text-gray-600 mt-1">cycles</p>
          </div>
        ))}
      </div>

      {/* RUL Chart */}
      <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
          <div>
            <h3 className="font-bold text-white">Remaining Useful Life Prediction</h3>
            <p className="text-xs text-gray-500">Actual vs ML-predicted RUL — last 30 cycles</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#60a5fa" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}    />
              </linearGradient>
              <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#f87171" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#f87171" stopOpacity={0}    />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="cycle" stroke="#374151" tick={{ fill: '#6b7280', fontSize: 11 }} />
            <YAxis stroke="#374151" tick={{ fill: '#6b7280', fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
            <Area type="monotone" dataKey="RUL"           stroke="#60a5fa" fill="url(#actualGrad)" strokeWidth={2} name="Actual RUL"    dot={false} />
            <Area type="monotone" dataKey="predicted_RUL" stroke="#f87171" fill="url(#predGrad)"   strokeWidth={2} name="Predicted RUL" dot={false} strokeDasharray="5 5" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Sensor Chart */}
      <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1.5 h-6 bg-purple-500 rounded-full" />
          <div>
            <h3 className="font-bold text-white">Engine Sensor Telemetry</h3>
            <p className="text-xs text-gray-500">Key sensor readings over last 30 cycles</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="cycle" stroke="#374151" tick={{ fill: '#6b7280', fontSize: 11 }} />
            <YAxis stroke="#374151" tick={{ fill: '#6b7280', fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
            {sensors.map(s => (
              <Line key={s.key} type="monotone" dataKey={s.key}
                    stroke={s.color} strokeWidth={1.5} dot={false} name={s.name} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  )
}