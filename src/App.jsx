import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Auth from './components/Auth'
import Services from './components/Services'
import Payment from './components/Payment'
import Results from './components/Results'

function App() {
  const [tab, setTab] = useState('home')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const u = localStorage.getItem('lab_user')
    if (u) setUser(JSON.parse(u))
  }, [])

  const logout = () => {
    localStorage.removeItem('lab_user')
    localStorage.removeItem('lab_token')
    setUser(null)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar current={tab} onNavigate={setTab} user={user} onLogout={logout} />

      <main className="max-w-6xl mx-auto p-6 space-y-8">
        {tab === 'home' && (
          <section className="text-center py-16">
            <h1 className="text-4xl font-bold text-slate-900 mb-3">Welcome to BlueLab</h1>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Book lab services, pay securely, and view your results online. Create an account to get started.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button onClick={()=>setTab('services')} className="px-4 py-2 rounded-md bg-slate-900 text-white">Explore services</button>
              <button onClick={()=>setTab('auth')} className="px-4 py-2 rounded-md bg-white border">Log in / Sign up</button>
            </div>
          </section>
        )}

        {tab === 'auth' && <Auth onAuthed={setUser} />}
        {tab === 'services' && <Services />}
        {tab === 'payment' && <Payment user={user} />}
        {tab === 'results' && <Results user={user} />}
      </main>

      <footer className="py-8 text-center text-slate-500 text-sm">
        © {new Date().getFullYear()} BlueLab — Demo application
      </footer>
    </div>
  )
}

export default App
