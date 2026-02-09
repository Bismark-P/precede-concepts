'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { runGlobalSync } from '../lib/scraper'
import { RefreshCw, Check, Trash2, ShieldCheck, ArrowLeft } from 'lucide-react'

export default function AdminPage() {
  const [items, setItems] = useState<any[]>([])
  const [syncing, setSyncing] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true); fetchPending(); }, [])

  async function fetchPending() {
    const { data } = await supabase.from('jobs').select('*').eq('status', 'pending').order('created_at', { ascending: false })
    if (data) setItems(data)
  }

  const sync = async () => { setSyncing(true); await runGlobalSync(); await fetchPending(); setSyncing(false); }
  const approve = async (id: string) => { await supabase.from('jobs').update({ status: 'approved' }).eq('id', id); fetchPending(); }
  const remove = async (id: string) => { await supabase.from('jobs').delete().eq('id', id); fetchPending(); }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <header className="max-w-5xl mx-auto flex justify-between items-center mb-10 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-4">
          <a href="/" className="text-slate-400 hover:text-blue-600 transition-colors"><ArrowLeft /></a>
          <ShieldCheck className="text-blue-600" />
          <h1 className="text-xl font-black uppercase">Hub Manager</h1>
        </div>
        <button onClick={sync} disabled={syncing} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-black uppercase text-[10px] flex gap-2 items-center tracking-widest disabled:bg-slate-300">
          <RefreshCw className={syncing ? 'animate-spin' : ''} size={16}/> {syncing ? 'Scanning...' : 'Global Sync'}
        </button>
      </header>
      <main className="max-w-5xl mx-auto space-y-4">
        {items.length === 0 ? <p className="text-center py-20 text-slate-400 italic">All caught up! Run a sync to find more.</p> :
          items.map(item => (
            <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-200 flex justify-between items-center">
              <div>
                <span className="text-[9px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded uppercase tracking-widest mb-2 inline-block">{item.source_site} | {item.category}</span>
                <h3 className="font-bold text-lg">{item.title}</h3>
              </div>
              <div className="flex gap-2">
                <button onClick={() => approve(item.id)} className="bg-emerald-600 text-white p-3 rounded-xl hover:bg-emerald-700"><Check /></button>
                <button onClick={() => remove(item.id)} className="text-slate-300 hover:text-red-500 p-3"><Trash2 /></button>
              </div>
            </div>
          ))
        }
      </main>
    </div>
  )
}