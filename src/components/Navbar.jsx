import { useEffect, useState } from 'react'

export default function Navbar({ current, onNavigate, user, onLogout }) {
  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'auth', label: user ? 'Account' : 'Log in / Sign up' },
    { id: 'services', label: 'Services' },
    { id: 'payment', label: 'Payment' },
    { id: 'results', label: 'Results' },
    { id: 'test', label: 'Connection' },
  ]

  return (
    <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/flame-icon.svg" alt="Lab" className="w-8 h-8" />
          <span className="font-semibold text-slate-800">BlueLab</span>
        </div>
        <nav className="flex items-center gap-2 text-sm">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => t.id === 'test' ? window.location.assign('/test') : onNavigate(t.id)}
              className={`px-3 py-2 rounded-md transition-colors ${current === t.id ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              {t.label}
            </button>
          ))}
          {user && (
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-slate-200">
              <span className="text-slate-600 hidden sm:block">{user.name || user.email}</span>
              <button onClick={onLogout} className="px-3 py-2 rounded-md bg-rose-500 text-white hover:bg-rose-600">Logout</button>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
