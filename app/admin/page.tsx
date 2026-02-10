'use client'
import { useState, useEffect } from 'react'
import { Lock, ShieldCheck, RefreshCw, Trash2, Check, ArrowLeft, Star, Eye, EyeOff } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { runGlobalSync } from '../lib/scraper'

export default function AdminPortal() {
  const [isAuth, setIsAuth] = useState(false)
  const [pass, setPass] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [items, setItems] = useState<any[]>([])
  const [syncing, setSyncing] = useState(false)
  const SECRET = "Precede2026"

  useEffect(() => { if(isAuth) fetchPending() }, [isAuth])

  async function fetchPending() {
    const { data } = await supabase.from('jobs').select('*').eq('status', 'pending')
    if (data) setItems(data)
  }

  const toggleFeatured = async (id: string, current: boolean) => {
    await supabase.from('jobs').update({ is_featured: !current }).eq('id', id)
    fetchPending()
  }

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
        <div className="bg-white p-12 rounded-[3.5rem] w-full max-w-sm shadow-2xl">
          <Lock size={40} className="mx-auto text-blue-600 mb-6" />
          <h2 className="text-2xl font-black uppercase italic mb-8">Secure Gate</h2>
          <div className="relative mb-4">
            <input type={showPass ? "text" : "password"} placeholder="Passcode" className="w-full p-5 bg-slate-50 rounded-2xl text-center font-bold" onChange={(e) => setPass(e.target.value)} />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              {showPass ? <EyeOff size={18}/> : <Eye size={18}/>}
            </button>
          </div>
          <button onClick={() => pass === SECRET ? setIsAuth(true) : alert('Unauthorized')} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest">Authorize</button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 md:p-16 max-w-5xl mx-auto font-sans">
      <header className="flex justify-between items-center mb-16">
        <div className="flex items-center gap-4">
          <a href="/" className="text-slate-300 hover:text-blue-600"><ArrowLeft size={32}/></a>
          <h1 className="text-3xl font-black uppercase italic italic flex items-center gap-3"><ShieldCheck className="text-blue-600" /> Control Hub</h1>
        </div>
        <button onClick={async () => {setSyncing(true); await runGlobalSync(); fetchPending(); setSyncing(false);}} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
          <RefreshCw className={syncing ? 'animate-spin' : ''} size={14}/> Sync Global
        </button>
      </header>

      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="p-6 bg-white border border-slate-200 rounded-3xl flex justify-between items-center hover:border-blue-500 transition-all">
            <div className="text-left flex items-center gap-4">
               <button onClick={() => toggleFeatured(item.id, item.is_featured)} className={`${item.is_featured ? 'text-yellow-500' : 'text-slate-200'} hover:text-yellow-500 transition-colors`}>
                  <Star fill={item.is_featured ? "currentColor" : "none"} size={24}/>
               </button>
               <div>
                  <span className="text-[9px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded-full uppercase tracking-widest mb-2 inline-block">{item.category}</span>
                  <h3 className="font-bold text-lg leading-none">{item.title}</h3>
               </div>
            </div>
            <div className="flex gap-2">
              <button onClick={async () => {await supabase.from('jobs').update({status: 'approved'}).eq('id', item.id); fetchPending();}} className="p-4 bg-emerald-500 text-white rounded-2xl"><Check size={20}/></button>
              <button onClick={async () => {await supabase.from('jobs').delete().eq('id', item.id); fetchPending();}} className="p-4 text-slate-300 hover:text-red-500"><Trash2 size={20}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}