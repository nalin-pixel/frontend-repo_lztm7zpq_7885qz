import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Payment({ user }) {
  const [services, setServices] = useState([])
  const [serviceCode, setServiceCode] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const load = async () => {
    const res = await fetch(`${API}/services`)
    const data = await res.json()
    setServices(data)
  }
  useEffect(()=>{ load() }, [])

  const pay = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    try {
      if (!user) throw new Error('Please log in first')
      const res = await fetch(`${API}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_email: user.email, service_code: serviceCode })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Payment failed')
      setMessage(`Payment successful. Reference: ${data.reference}. Amount: $${Number(data.amount).toFixed(2)}`)
    } catch (e) { setError(e.message) }
  }

  return (
    <div className="max-w-xl mx-auto bg-white shadow rounded-xl p-6">
      <h3 className="font-semibold text-slate-800 mb-4">Pay for a test</h3>
      <form onSubmit={pay} className="space-y-3">
        <div>
          <label className="block text-sm text-slate-600 mb-1">Select service</label>
          <select value={serviceCode} onChange={e=>setServiceCode(e.target.value)} className="w-full border rounded-md px-3 py-2">
            <option value="">Choose...</option>
            {services.map(s => (
              <option key={s.id} value={s.code}>{s.name} (${Number(s.price).toFixed(2)})</option>
            ))}
          </select>
        </div>
        {error && <p className="text-rose-600 text-sm">{error}</p>}
        {message && <p className="text-emerald-600 text-sm">{message}</p>}
        <button className="w-full bg-slate-900 text-white rounded-md py-2 hover:bg-slate-800" disabled={!serviceCode}>Pay</button>
      </form>
    </div>
  )
}
