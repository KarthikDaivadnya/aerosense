import { useEffect, useState } from 'react'
import { getMetrics, getSummary, getEngine } from '../api'
import MetricCard from './MetricCard'
import EngineTable from './EngineTable'
import EngineDetail from './EngineDetail'

export default function Dashboard() {
  const [metrics, setMetrics]       = useState(null)
  const [engines, setEngines]       = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [engineData, setEngineData] = useState([])
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    Promise.all([getMetrics(), getSummary()]).then(([m, s]) => {
      setMetrics(m.data)
      setEngines(s.data)
      setLoading(false)
    })
  }, [])

  const handleSelect = (id) => {
    setSelectedId(id)
    setEngineData([])
    getEngine(id)
      .then(res => setEngineData(res.data))
      .catch(err => console.error('API Error:', err))
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 bg-[#0a0a0f]">
      <div className="w-12 h-12 border-2 border-blue-500/40 border-t-blue-500 rounded-full animate-spin" />
      <p className="text-gray-500 text-sm tracking-widest uppercase">Loading Telemetry</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a0a0f]">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#0d0d14] border-b border-gray-800 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-base">
            ✈️
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wide text-white">AeroSense</h1>
            <p className="text-xs text-gray-600">Predictive Maintenance · GE Aerospace Research</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 flex items-center gap-4 text-xs">
            <span className="text-gray-500">
              MAE <span className="text-blue-400 font-mono font-bold ml-1">{metrics?.model_mae}</span>
            </span>
            <div className="w-px h-3 bg-gray-700" />
            <span className="text-gray-500">
              R² <span className="text-green-400 font-mono font-bold ml-1">{metrics?.model_r2}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-green-400 font-medium">Live</span>
          </div>
        </div>
      </nav>
      {metrics?.critical > 0 && (
        <div className="bg-red-950 border-b border-red-800 px-8 py-2 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-500 pulse-red" />
            <p className="text-red-400 text-sm font-semibold">
              ⚠️ {metrics.critical} engines require immediate maintenance attention
            </p>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-8 py-10 space-y-8">

        {/* Page Title */}
        <div>
          <h2 className="text-3xl font-black text-white">Fleet Health Overview</h2>
          <p className="text-gray-500 text-sm mt-2">
            Monitoring{' '}
            <span className="text-blue-400 font-semibold">{metrics?.total_engines} turbofan engines</span>
            {' '}using Random Forest ML trained on NASA CMAPSS dataset
          </p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard title="Total Engines" value={metrics?.total_engines} subtitle="Active in fleet"     color="blue"   icon="🛩️" />
          <MetricCard title="Critical"      value={metrics?.critical}      subtitle="Needs maintenance"  color="red"    icon="🔴" />
          <MetricCard title="Warning"       value={metrics?.warning}       subtitle="Monitor closely"    color="yellow" icon="⚠️" />
          <MetricCard title="Healthy"       value={metrics?.healthy}       subtitle="Operating normally" color="green"  icon="✅" />
        </div>

        {/* Engine Table */}
        <EngineTable engines={engines} onSelect={handleSelect} selectedId={selectedId} />

        {/* Engine Detail */}
        {selectedId && engineData.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-2 h-7 bg-linear-to-b from-blue-500 to-purple-500 rounded-full" />
              <div>
                <h2 className="text-xl font-bold text-white">
                  Engine #{String(selectedId).padStart(3, '0')} — Detailed Analysis
                </h2>
                <p className="text-xs text-gray-500">Sensor telemetry · RUL prediction · Last 30 cycles</p>
              </div>
            </div>
            <EngineDetail data={engineData} engineId={selectedId} />
          </div>
        )}

        {/* Loading engine */}
        {selectedId && engineData.length === 0 && (
          <div className="flex items-center justify-center py-16 gap-3">
            <div className="w-5 h-5 border-2 border-blue-500/40 border-t-blue-500 rounded-full animate-spin" />
            <span className="text-sm text-gray-500">Fetching engine telemetry...</span>
          </div>
        )}

        {/* Empty state */}
        {!selectedId && (
          <div className="rounded-2xl border border-dashed border-gray-800 text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-white font-semibold text-lg">Select an engine to inspect</p>
            <p className="text-gray-500 text-sm mt-2">
              View sensor trends, RUL predictions and health breakdown
            </p>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-gray-700 pb-6">
          Built with React · FastAPI · Random Forest ML · NASA CMAPSS Turbofan Engine Dataset
        </p>

      </div>
    </div>
  )
}