"use client";
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; 
import { supabase } from '@/app/lib/supabase';
import { 
  Plus, Check, X, MapPin, Calendar, Clock, LogOut,
  Pencil, Trash2, Star, Building2, RefreshCcw, BarChart3 
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'queued' | 'approved' | 'past'>('queued');
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [gradingItem, setGradingItem] = useState<any | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 🛡️ SECURITY: AUTO-LOGOUT
  const handleLogout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    router.push('/'); 
  };

  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(handleLogout, 5 * 60 * 1000);
  };

  useEffect(() => {
    fetchItems();
    resetTimer();
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    activityEvents.forEach(e => window.addEventListener(e, resetTimer));
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      activityEvents.forEach(e => window.removeEventListener(e, resetTimer));
    };
  }, [activeTab]);

  async function fetchItems() {
    setLoading(true);
    const { data } = await supabase.from('jobs').select('*').eq('status', activeTab).order('created_at', { ascending: false });
    if (data) setItems(data);
    setLoading(false);
  }

  const handleRepost = async (item: any) => {
    const { id, created_at, status, performance_grade, performance_notes, ...rest } = item;
    const newItem = { 
      ...rest, 
      status: 'queued', 
      title: `${item.title} (Repost)` 
    };
    const { error } = await supabase.from('jobs').insert([newItem]);
    if (!error) {
      alert("Scout duplicated to Queue! Update the date and republish.");
      setActiveTab('queued');
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    await supabase.from('jobs').update({ status: newStatus }).eq('id', id);
    setItems(items.filter(i => i.id !== id));
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    await supabase.from('jobs').update({ is_featured: !current }).eq('id', id);
    setItems(items.map(i => i.id === id ? { ...i, is_featured: !current } : i));
  };

  const saveEdit = async (e: any) => {
    e.preventDefault();
    await supabase.from('jobs').update(editingItem).eq('id', editingItem.id);
    setItems(items.map(i => i.id === editingItem.id ? editingItem : i));
    setEditingItem(null);
  };

  const saveGrading = async (e: any) => {
    e.preventDefault();
    await supabase.from('jobs').update({
      performance_grade: gradingItem.performance_grade,
      performance_notes: gradingItem.performance_notes
    }).eq('id', gradingItem.id);
    setItems(items.map(i => i.id === gradingItem.id ? gradingItem : i));
    setGradingItem(null);
  };

  const inputClass = "w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-900 text-xs transition-all outline-none focus:border-[#0A2A5E]";
  const labelClass = "block text-[9px] font-black uppercase text-slate-500 mb-1 tracking-widest";

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 pb-20 text-left">
      <nav className="bg-[#0A2A5E] px-6 py-5 sticky top-0 z-[100] shadow-lg flex justify-between items-center text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1FC8C8] rounded-xl flex items-center justify-center font-black italic text-[#0A2A5E]">PC</div>
          <span className="text-lg font-black uppercase italic tracking-tighter">Control Hub</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/add" className="bg-[#1FC8C8] text-[#0A2A5E] px-5 py-2.5 rounded-xl font-black text-[10px] uppercase flex items-center gap-2 hover:bg-white transition-all">
            <Plus size={16} /> New Scout
          </Link>
          <button onClick={handleLogout} className="p-2.5 bg-white/10 hover:bg-red-500 rounded-xl transition-all"><LogOut size={18} /></button>
        </div>
      </nav>

      <div className="max-w-[1600px] mx-auto px-4 pt-10">
        <div className="flex gap-4 mb-8 border-b border-slate-200 pb-4 overflow-x-auto">
           <button onClick={() => setActiveTab('queued')} className={`text-[10px] font-black uppercase px-6 py-3 rounded-xl transition-all ${activeTab === 'queued' ? 'bg-[#0A2A5E] text-white shadow-xl' : 'bg-white text-slate-400'}`}>Queue ({activeTab === 'queued' ? items.length : '...'})</button>
           <button onClick={() => setActiveTab('approved')} className={`text-[10px] font-black uppercase px-6 py-3 rounded-xl transition-all ${activeTab === 'approved' ? 'bg-[#1FC8C8] text-[#0A2A5E] shadow-xl' : 'bg-white text-slate-400'}`}>Live Hub ({activeTab === 'approved' ? items.length : '...'})</button>
           <button onClick={() => setActiveTab('past')} className={`text-[10px] font-black uppercase px-6 py-3 rounded-xl transition-all ${activeTab === 'past' ? 'bg-slate-800 text-white shadow-xl' : 'bg-white text-slate-400'}`}>Past / Analytics ({activeTab === 'past' ? items.length : '...'})</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden flex flex-col shadow-sm hover:shadow-xl transition-all">
              <div className="h-28 bg-slate-900 relative">
                {item.image_url && <img src={item.image_url} className="w-full h-full object-cover opacity-60" />}
                <button onClick={() => toggleFeatured(item.id, item.is_featured)} className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md ${item.is_featured ? 'bg-[#1FC8C8] text-[#0A2A5E]' : 'bg-black/40 text-white'}`}><Star size={12} fill={item.is_featured ? "currentColor" : "none"}/></button>
                <div className="absolute inset-0 flex items-center justify-center">
                  {activeTab === 'past' && <div className="flex gap-1">
                    {[1,2,3,4,5].map((star) => <Star key={star} size={10} fill={star <= (item.performance_grade || 0) ? "#1FC8C8" : "none"} className="text-[#1FC8C8]"/>)}
                  </div>}
                </div>
                <span className="absolute top-2 left-2 text-[6px] font-black bg-white text-[#0A2A5E] px-2 py-1 rounded-full uppercase tracking-widest">{item.category}</span>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h4 className="font-black text-[10px] text-[#0A2A5E] uppercase mb-1 line-clamp-2 leading-tight h-8">{item.title}</h4>
                <p className="text-[7px] font-black text-[#1FC8C8] uppercase mb-3 italic">By: {item.organizer_body || 'Host TBD'}</p>
                
                <div className="flex flex-col gap-1.5 pt-3 border-t border-slate-100 mt-auto">
                  {activeTab !== 'past' ? (
                    <button onClick={() => handleStatusChange(item.id, activeTab === 'queued' ? 'approved' : 'past')} className="w-full py-2 rounded-lg text-[8px] font-black uppercase bg-[#1FC8C8] text-[#0A2A5E] shadow-sm">{activeTab === 'queued' ? 'Approve' : 'Archive (Move to Past)'}</button>
                  ) : (
                    <button onClick={() => handleRepost(item)} className="w-full py-2 rounded-lg text-[8px] font-black uppercase bg-[#0A2A5E] text-white flex items-center justify-center gap-2 hover:bg-[#1FC8C8] hover:text-[#0A2A5E] transition-all"><RefreshCcw size={10}/> Repost Event</button>
                  )}
                  <div className="flex gap-1.5">
                    <button onClick={() => setEditingItem(item)} className="flex-1 py-2 bg-slate-50 rounded-lg flex justify-center hover:bg-slate-100 transition-all"><Pencil size={12} /></button>
                    {activeTab === 'past' && <button onClick={() => setGradingItem(item)} className="flex-1 py-2 bg-slate-50 rounded-lg flex justify-center hover:bg-slate-100 transition-all"><BarChart3 size={12} /></button>}
                    <button onClick={() => { if(confirm("Delete permanently?")) supabase.from('jobs').delete().eq('id', item.id).then(() => fetchItems()) }} className="flex-1 py-2 bg-red-50 text-red-500 rounded-lg flex justify-center hover:bg-red-500 hover:text-white transition-all"><Trash2 size={12} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 📊 GRADING MODAL */}
      {gradingItem && (
        <div className="fixed inset-0 z-[200] bg-[#0A2A5E]/90 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={saveGrading} className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black italic text-[#0A2A5E] uppercase flex items-center gap-2"><BarChart3/> Performance Analysis</h2>
              <button onClick={() => setGradingItem(null)} type="button" className="p-2 bg-slate-50 rounded-full"><X size={20}/></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Success Rating</label>
                <div className="flex gap-2 mt-1">
                  {[1,2,3,4,5].map(star => (
                    <button key={star} type="button" onClick={() => setGradingItem({...gradingItem, performance_grade: star})} className={`p-2 rounded-lg border-2 transition-all ${gradingItem.performance_grade >= star ? 'bg-[#1FC8C8] border-[#1FC8C8]' : 'border-slate-100'}`}><Star size={16} fill="white" className="text-white"/></button>
                  ))}
                </div>
              </div>
              <div>
                <label className={labelClass}>Internal Analytics / Notes</label>
                <textarea className={`${inputClass} h-32 pt-3 resize-none`} placeholder="Describe turnout, audience reaction, or technical issues..." value={gradingItem.performance_notes || ''} onChange={e => setGradingItem({...gradingItem, performance_notes: e.target.value})} />
              </div>
              <button type="submit" className="w-full py-4 bg-[#0A2A5E] text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg">Lock to History</button>
            </div>
          </form>
        </div>
      )}

      {/* 🛠️ EDIT MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-[200] bg-[#0A2A5E]/90 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={saveEdit} className="bg-white rounded-[2.5rem] w-full max-w-2xl p-8 shadow-2xl grid grid-cols-2 gap-4">
            <div className="col-span-2 flex justify-between mb-2"><h2 className="text-xl font-black italic text-[#0A2A5E] uppercase">Quick Edit Scout</h2><button onClick={() => setEditingItem(null)} type="button" className="p-2 bg-slate-50 rounded-full"><X size={20}/></button></div>
            <div className="col-span-2"><label className={labelClass}>Main Title</label><input required className={inputClass} value={editingItem.title} onChange={e => setEditingItem({...editingItem, title: e.target.value})} /></div>
            <div><label className={labelClass}>Organised by</label><input className={inputClass} value={editingItem.organizer_body || ''} onChange={e => setEditingItem({...editingItem, organizer_body: e.target.value})} /></div>
            <div><label className={labelClass}>Map Query / GPS</label><input className={inputClass} value={editingItem.map_query || ''} onChange={e => setEditingItem({...editingItem, map_query: e.target.value})} /></div>
            <div><label className={labelClass}>Date</label><input type="date" className={inputClass} value={editingItem.event_date || ''} onChange={e => setEditingItem({...editingItem, event_date: e.target.value})} /></div>
            <div><label className={labelClass}>Category</label><select className={inputClass} value={editingItem.category} onChange={e => setEditingItem({...editingItem, category: e.target.value})}><option value="event">Event</option><option value="job">Job</option><option value="training">Training</option><option value="place">Place</option></select></div>
            <button type="submit" className="col-span-2 py-4 bg-[#0A2A5E] text-white rounded-2xl font-black uppercase text-xs mt-4 shadow-lg">Save Changes</button>
          </form>
        </div>
      )}
    </div>
  );
}