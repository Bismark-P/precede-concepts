'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { runGlobalSync } from '../lib/scraper'
import { RefreshCw, Check, Trash2, ShieldCheck, ArrowLeft, Lock, Search } from 'lucide-react'

export default function AdminPage() {
  const [items, setItems] = useState<any[]>([])
  const [syncing, setSyncing] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  // PASSWORD PROTECTION
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [password, setPassword] = useState('')
  const ADMIN_SECRET = "Precede2026"

  useEffect(() => { 
    setMounted(true)
    if(isAuthorized) fetchPending() 
  }, [isAuthorized])

  async function fetchPending() {
    const { data } = await supabase.from('jobs').select('*').eq('status', 'pending').order('created_at', { ascending: false })
    if (data) setItems(data)
  }

  if (!mounted) return null

  // 1. LOGIN SCREEN
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
        <div className="bg-white p-12 rounded-[3rem] w-full max-w-md shadow-2xl border-t-8 border-blue-600">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Lock size={40} />
          </div>
          <h2 className="text-2xl font-black uppercase italic text-slate-900 mb-2">Secure Gate</h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-10">Precede Hub Manager</p>
          
          <input 
            type="password" 
            placeholder="Authorization Code"
            className="w-full p-5 bg-slate-100 rounded-2xl border-none focus:ring-2 focus:ring-blue-600 mb-4 text-center font-bold tracking-widest"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button 
            onClick={() => password === ADMIN_SECRET ? setIsAuthorized(true) : alert('Access Denied')}
            className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all"
          >
            Unlock Platform
          </button>
        </div>
      </div>
    )
  }

  // 2. MAIN ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <header className="max-w-5xl mx-auto flex justify-between items-center mb-10 bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-4 text-left">
          <a href="/" className="text-slate-300 hover:text-blue-600 transition-colors"><ArrowLeft size={30} /></a>
          <div>
            <h1 className="text-xl font-black uppercase italic leading-none">Hub Manager</h1>
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Active Admin Session</span>
          </div>
        </div>
        <button 
          onClick={async () => {setSyncing(true); await runGlobalSync(); fetchPending(); setSyncing(false);}} 
          disabled={syncing}
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] flex gap-3 items-center tracking-widest hover:bg-blue-600 disabled:bg-slate-300 transition-all"
        >
          <RefreshCw className={syncing ? 'animate-spin' : ''} size={16}/> {syncing ? 'Scanning...' : 'Sync All Sources'}
        </button>
      </header>

      <main className="max-w-5xl mx-auto space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-slate-300">
            <Search className="mx-auto text-slate-200 mb-4" size={48} />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Waiting for new sync results...</p>
          </div>
        ) : (
          items.map(item => (
            <div key={item.id} className="bg-white p-6 rounded-3xl border border-slate-200 flex justify-between items-center shadow-sm hover:border-blue-200 transition-all">
              <div className="flex-1 text-left">
                <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase tracking-widest mb-2 inline-block">
                  {item.category} | {item.source_site}
                </span>
                <h3 className="font-bold text-lg text-slate-800">{item.title}</h3>
              </div>
              <div className="flex gap-2 ml-6">
                <button 
                  onClick={async () => {await supabase.from('jobs').update({status: 'approved'}).eq('id', item.id); fetchPending();}} 
                  className="bg-emerald-500 text-white p-4 rounded-2xl hover:bg-emerald-600 transition-all"
                >
                  <Check size={20} />
                </button>
                <button 
                  onClick={async () => {await supabase.from('jobs').delete().eq('id', item.id); fetchPending();}} 
                  className="bg-slate-100 text-slate-400 hover:text-red-500 p-4 rounded-2xl transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  )
}