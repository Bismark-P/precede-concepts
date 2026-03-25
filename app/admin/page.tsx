'use client'
import { useState, useEffect } from 'react'
import { Lock, ShieldCheck, Plus, Trash2, Check, ArrowLeft, Star, Eye, EyeOff, Activity, Clock, Search } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function AdminPortal() {
  const [isAuth, setIsAuth] = useState(false)
  const [pass, setPass] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [items, setItems] = useState<any[]>([])
  const [logs, setLogs] = useState<any[]>([])
  
  const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_PASSWORD

  useEffect(() => { 
    if(isAuth) { fetchPending(); fetchLogs(); } 
  }, [isAuth])

  async function fetchPending() {
    const { data } = await supabase.from('jobs').select('*').eq('status', 'pending').order('created_at', { ascending: false })
    if (data) setItems(data)
  }

  async function fetchLogs() {
    const { data } = await supabase.from('sync_logs').select('*').order('executed_at', { ascending: false }).limit(5)
    if (data) setLogs(data)
  }

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
        <div className="bg-white p-10 md:p-12 rounded-[3.5rem] w-full max-w-sm shadow-2xl border-t-8 border-blue-600">
          <Lock size={40} className="mx-auto text-blue-600 mb-6" />
          <h2 className="text-2xl font-black uppercase italic mb-8 text-slate-950">Secure Gate</h2>
          <div className="relative mb-6">
            <input 
              type={showPass ? "text" : "password"} 
              placeholder="Authorization Code" 
              className="w-full p-5 bg-slate-100 rounded-2xl text-center font-bold tracking-widest text-slate-950 outline-none focus:bg-white border-2 border-transparent focus:border-blue-600 transition-all" 
              onChange={(e) => setPass(e.target.value)} 
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              {showPass ? <EyeOff size={18}/> : <Eye size={18}/>}
            </button>
          </div>
          <button onClick={() => pass === ADMIN_SECRET ? setIsAuth(true) : alert('Unauthorized Access')} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-all">Authorize Session</button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-16 max-w-6xl mx-auto font-sans min-h-screen">
      <header className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6 text-left">
        <div className="flex items-center gap-4 w-full">
          <a href="/" className="text-slate-300 hover:text-blue-600 transition-all"><ArrowLeft size={32}/></a>
          <div>
            <h1 className="text-2xl md:text-3xl font-black uppercase italic flex items-center gap-3"><ShieldCheck className="text-blue-600" /> Control Hub</h1>
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Manual Mode Active</span>
          </div>
        </div>
        
        {/* ➕ Quick Add Button */}
        <a href="/admin/add" className="w-full md:w-auto bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-900 transition-all shadow-lg shadow-blue-50">
          <Plus size={14}/> Add New Listing
        </a>
      </header>

      <div className="grid lg:grid-cols-3 gap-12 text-left">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-2"><Activity size={14}/> Pending Queue</h2>
          {items.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
              <Search className="mx-auto text-slate-100 mb-4" size={40} />
              <p className="text-slate-300 text-[10px] font-black uppercase">No items to review</p>
            </div>
          ) : items.map(item => (
            <div key={item.id} className="p-6 bg-white border border-slate-200 rounded-3xl flex flex-col md:flex-row justify-between items-center hover:border-blue-500 transition-all gap-4">
              <div className="flex items-center gap-4 text-left w-full">
                 <button onClick={async () => {await supabase.from('jobs').update({ is_featured: !item.is_featured }).eq('id', item.id); fetchPending();}} className={`${item.is_featured ? 'text-yellow-500' : 'text-slate-200'} transition-colors`}>
                    <Star fill={item.is_featured ? "currentColor" : "none"} size={24}/>
                 </button>
                 <div>
                    <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase tracking-widest mb-1 inline-block">{item.category}</span>
                    <h3 className="font-bold text-lg leading-tight text-slate-800">{item.title}</h3>
                 </div>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <button onClick={async () => {await supabase.from('jobs').update({status: 'approved'}).eq('id', item.id); fetchPending();}} className="flex-1 md:flex-none p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all flex justify-center"><Check size={20}/></button>
                <button onClick={async () => {await supabase.from('jobs').delete().eq('id', item.id); fetchPending();}} className="flex-1 md:flex-none p-3 text-slate-300 hover:text-red-500 transition-all flex justify-center"><Trash2 size={20}/></button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-50 p-8 rounded-[2.5rem] h-fit border border-slate-100 text-left">
           <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8 flex items-center gap-2"><Clock size={14}/> Recent Activity</h2>
          <div className="space-y-6">
            {logs.length === 0 ? <p className="text-[10px] text-slate-400 font-bold uppercase">No logs recorded</p> : logs.map((log, idx) => (
                <div key={idx} className="flex gap-4 items-start border-l-2 border-blue-500 pl-4 py-1">
                  <div>
                    <p className="text-[10px] font-black text-slate-900 uppercase">Manual Update</p>
                    <p className="text-[9px] font-bold text-slate-400">{new Date(log.executed_at).toLocaleString()}</p>
                  </div>
                </div>
            ))}
          </div>
          <p className="mt-12 text-[8px] font-black text-slate-300 uppercase tracking-widest leading-loose">Status: 100% Curated Mode</p>
        </div>
      </div>
    </div>
  )
}