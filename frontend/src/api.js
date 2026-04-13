import axios from 'axios'

const BASE = 'http://127.0.0.1:8000'

export const getMetrics = () => axios.get(`${BASE}/api/metrics`)
export const getSummary = () => axios.get(`${BASE}/api/summary`)
export const getEngine  = (id) => axios.get(`${BASE}/api/engine/${id}`)