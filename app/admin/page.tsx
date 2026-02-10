'use client'
import { useState, useEffect } from 'react'
import { Lock, ShieldCheck } from 'lucide-react'

export default function AdminGate() {
  const [isAuth, setIsAuth] = useState(false)
  const [pass, setPass] = useState('')
  const SECRET = "Precede2026"

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
        <div className="bg-white p-12 rounded-[3rem] w-full max-w-sm shadow-2xl">
          <Lock size={48} className="mx-auto text-blue-600 mb-6" />
          <h2 className="text-2xl font-black uppercase italic mb-8">Access Locked</h2>
          <input 
            type="password" 
            placeholder="Enter Admin Code"
            className="w-full p-4 bg-slate-100 rounded-2xl mb-4 text-center font-bold"
            onChange={(e) => setPass(e.target.value)}
          />
          <button 
            onClick={() => pass === SECRET ? setIsAuth(true) : alert('Wrong Code')}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest"
          >
            Authorize
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-12 font-sans">
      <h1 className="text-4xl font-black uppercase italic italic flex items-center gap-4">
        <ShieldCheck className="text-blue-600" /> Admin Dashboard
      </h1>
      <p className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-xs">Manage Opportunities & Events</p>
      {/* Rest of your Scraper UI goes here */}
    </div>
  )
}