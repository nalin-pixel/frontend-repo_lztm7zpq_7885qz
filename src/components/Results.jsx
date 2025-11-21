import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Results({ user }) {
  const [results, setResults] = useState([])
  const [form, setForm] = useState({ service_code:'', values:'', notes:'' })
  const [services, setServices] = useState([])
  const [error, setError] = useState('')

  const load = async () => {
    const base = user?.email ? `${API}/results?user_email=${encodeURIComponent(user.email)}` : `${API}/results`
    const res = await fetch(base)
    const data = await res.json()
    setResults(data)
    const res2 = await fetch(`${API}/services`)
    setServices(await res2.json())
  }
  useEffect(()=>{ load() }, [user])

  const publish = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (!user) throw new Error('Please log in first')
      let parsed
      try { parsed = JSON.parse(form.values || '{}') } catch { throw new Error('Values must be valid JSON, e.g. {"WBC": "5.2"}') }
      const res = await fetch(`${API}/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_email: user.email, service_code: form.service_code, values: parsed, notes: form.notes || undefined })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to publish result')
      setResults(prev => [data, ...prev])
      setForm({ service_code:'', values:'', notes:'' })
    } catch (e) { setError(e.message) }
  }

  return (
    <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="font-semibold text-slate-800 mb-4">Your results</h3>
        <ul className="divide-y">
          {results.length === 0 && <li className="py-3 text-slate-500 text-sm">No results yet.</li>}
          {results.map(r => (
            <li key={r.id} className="py-3">
              <div className="flex items-center justify-between">
                <p className="font-medium text-slate-800">{r.service_code}</p>
                <span className="text-xs text-slate-500">{r.reported_at ? new Date(r.reported_at).toLocaleString() : ''}</span>
              </div>
              <pre className="bg-slate-50 p-3 rounded text-sm overflow-auto mt-2">{JSON.stringify(r.values, null, 2)}</pre>
              {r.notes && <p className="text-sm text-slate-600 mt-2">{r.notes}</p>}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="font-semibold text-slate-800 mb-4">Publish a result (demo)</h3>
        <form onSubmit={publish} className="space-y-3">
          <div>
            <label className="block text-sm text-slate-600 mb-1">Service</label>
            <select value={form.service_code} onChange={e=>setForm({...form, service_code:e.target.value})} className="w-full border rounded-md px-3 py-2">
              <option value="">Choose...</option>
              {services.map(s => (<option key={s.id} value={s.code}>{s.name}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">Values (JSON)</label>
            <textarea rows={5} value={form.values} onChange={e=>setForm({...form, values:e.target.value})} className="w-full border rounded-md px-3 py-2" placeholder='{"Hb": "13.2 g/dL", "WBC": "5.6 x10^9/L"}' />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">Notes</label>
            <input value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} className="w-full border rounded-md px-3 py-2" />
          </div>
          {error && <p className="text-rose-600 text-sm">{error}</p>}
          <button className="w-full bg-slate-900 text-white rounded-md py-2 hover:bg-slate-800" disabled={!form.service_code || !form.values}>Publish</button>
        </form>
      </div>
    </div>
  )
}
