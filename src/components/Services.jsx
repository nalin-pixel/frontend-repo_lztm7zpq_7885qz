import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Services() {
  const [services, setServices] = useState([])
  const [form, setForm] = useState({ code:'', name:'', price:'', description:'' })
  const [error, setError] = useState('')

  const load = async () => {
    try {
      const res = await fetch(`${API}/services`)
      const data = await res.json()
      setServices(data)
    } catch (e) { setError('Failed to load services') }
  }

  useEffect(() => { load() }, [])

  const create = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch(`${API}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: form.code,
          name: form.name,
          price: parseFloat(form.price || '0'),
          description: form.description || undefined
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to create')
      setForm({ code:'', name:'', price:'', description:'' })
      setServices(prev => [data, ...prev])
    } catch (e) { setError(e.message) }
  }

  return (
    <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="font-semibold text-slate-800 mb-4">Available services</h3>
        <ul className="divide-y">
          {services.length === 0 && <li className="py-3 text-slate-500 text-sm">No services yet.</li>}
          {services.map(s => (
            <li key={s.id} className="py-3 flex items-start justify-between">
              <div>
                <p className="font-medium text-slate-800">{s.name} <span className="text-slate-400">({s.code})</span></p>
                {s.description && <p className="text-slate-600 text-sm">{s.description}</p>}
              </div>
              <div className="font-semibold">${Number(s.price).toFixed(2)}</div>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="font-semibold text-slate-800 mb-4">Add a new service</h3>
        <form onSubmit={create} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-slate-600 mb-1">Code</label>
              <input value={form.code} onChange={e=>setForm({...form, code:e.target.value})} className="w-full border rounded-md px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Name</label>
              <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} className="w-full border rounded-md px-3 py-2" required />
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">Description</label>
            <textarea value={form.description} onChange={e=>setForm({...form, description:e.target.value})} className="w-full border rounded-md px-3 py-2" rows={3} />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">Price (USD)</label>
            <input type="number" step="0.01" value={form.price} onChange={e=>setForm({...form, price:e.target.value})} className="w-full border rounded-md px-3 py-2" required />
          </div>
          {error && <p className="text-rose-600 text-sm">{error}</p>}
          <button className="w-full bg-slate-900 text-white rounded-md py-2 hover:bg-slate-800">Create</button>
        </form>
      </div>
    </div>
  )
}
