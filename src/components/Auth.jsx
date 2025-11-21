import { useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Auth({ onAuthed }) {
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/signup'
      const body = isLogin ? { email, password } : { name, email, password }
      const res = await fetch(`${API}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Request failed')
      localStorage.setItem('lab_token', data.token)
      localStorage.setItem('lab_user', JSON.stringify({ name: data.name, email: data.email }))
      onAuthed({ name: data.name, email: data.email, token: data.token })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white shadow rounded-xl p-6">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">{isLogin ? 'Log in' : 'Create an account'}</h2>
      <form onSubmit={submit} className="space-y-3">
        {!isLogin && (
          <div>
            <label className="block text-sm text-slate-600 mb-1">Full name</label>
            <input value={name} onChange={e=>setName(e.target.value)} className="w-full border rounded-md px-3 py-2" required />
          </div>
        )}
        <div>
          <label className="block text-sm text-slate-600 mb-1">Email</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full border rounded-md px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm text-slate-600 mb-1">Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full border rounded-md px-3 py-2" required />
        </div>
        {error && <p className="text-rose-600 text-sm">{error}</p>}
        <button disabled={loading} className="w-full bg-slate-900 text-white rounded-md py-2 hover:bg-slate-800 disabled:opacity-60">{loading ? 'Please wait...' : (isLogin ? 'Log in' : 'Sign up')}</button>
      </form>
      <p className="text-sm text-slate-600 mt-3 text-center">
        {isLogin ? 'No account?' : 'Already have an account?'}{' '}
        <button className="text-blue-600 underline" onClick={()=>setIsLogin(!isLogin)}>
          {isLogin ? 'Sign up' : 'Log in'}
        </button>
      </p>
    </div>
  )
}
