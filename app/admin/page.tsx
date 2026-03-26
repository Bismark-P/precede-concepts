"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { 
  Plus, Check, X, MapPin, Calendar, Clock, 
  Pencil, Trash2, Globe, Archive, Star, Building2, Map as MapIcon
} from 'lucide-react';

export default function AdminDashboard() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'queued' | 'approved'>('queued');
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => { fetchItems(); }, [activeTab]);

  async function fetchItems() {
    setLoading(true);
    const { data } = await supabase.from('jobs').select('*').eq('status', activeTab).order('created_at', { ascending: false });
    if (data) setItems(data);
    setLoading(false);
  }

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    setProcessingId(id);
    const { error } = await supabase.from('jobs').update({ is_featured: !currentStatus }).eq('id', id);
    if (!error) {
      setItems(items.map(item => item.id === id ? { ...item, is_featured: !currentStatus } : item));
    }
    setProcessingId(null);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setProcessingId(id);
    await supabase.from('jobs').update({ status: newStatus }).eq('id', id);
    setItems(items.filter(item => item.id !== id));
    setProcessingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete permanently? This cannot be undone.")) return;
    await supabase.from('jobs').delete().eq('id', id);
    setItems(items.filter(item => item.id !== id));
  };

  const saveEdit = async (e: any) => {
    e.preventDefault();
    const { error } = await supabase.from('jobs').update(editingItem).eq('id', editingItem.id);
    if (!error) {
      setItems(items.map(i => i.id === editingItem.id ? editingItem : i));
      setEditingItem(null);
    }
  };

  const inputClass = "w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-900 outline-none focus:border-[#0A2A5E] text-xs transition-all";
  const labelClass = "block text-[9px] font-black uppercase text-slate-500 mb-1 tracking-widest";

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 pb-20">
      <nav className="bg-[#0A2A5E] px-6 py-5 sticky top-0 z-[100] shadow-lg flex justify-between items-center text-white text-left">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1FC8C8] rounded-xl flex items-center justify-center font-black italic text-[#0A2A5E]">PC</div>
          <div className="text-left leading-none"><span className="text-lg font-black uppercase italic tracking-tighter">Control Hub</span></div>
        </div>
        <a href="/admin/add" className="bg-[#1FC8C8] text-[#0A2A5E] px-5 py-2.5 rounded-xl font-black text-[10px] uppercase flex items-center gap-2 shadow-lg hover:bg-white transition-all"><Plus size={16} /> New Scout</a>
      </nav>

      <div className="max-w-[1600px] mx-auto px-4 pt-10">
        <div className="flex gap-4 mb-8 border-b border-slate-200 pb-4">
           <button onClick={() => setActiveTab('queued')} className={`text-[10px] font-black uppercase px-6 py-3 rounded-xl transition-all ${activeTab === 'queued' ? 'bg-[#0A2A5E] text-white shadow-xl' : 'bg-white text-slate-400'}`}>Queue ({activeTab === 'queued' ? items.length : '...'})</button>
           <button onClick={() => setActiveTab('approved')} className={`text-[10px] font-black uppercase px-6 py-3 rounded-xl transition-all ${activeTab === 'approved' ? 'bg-[#1FC8C8] text-[#0A2A5E] shadow-xl' : 'bg-white text-slate-400'}`}>Live Hub ({activeTab === 'approved' ? items.length : '...'})</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {items.map((item) => (
            <div key={item.id} className={`bg-white border ${item.is_featured ? 'border-[#1FC8C8] ring-2 ring-[#1FC8C8]/10' : 'border-slate-200'} rounded-[2rem] overflow-hidden flex flex-col shadow-sm hover:shadow-xl transition-all`}>
              <div className="h-32 bg-slate-900 relative">
                {item.image_url ? <img src={item.image_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-black text-white/10 text-[8px] uppercase tracking-widest italic">Precede</div>}
                <button onClick={() => toggleFeatured(item.id, item.is_featured)} className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-all ${item.is_featured ? 'bg-[#1FC8C8] text-[#0A2A5E]' : 'bg-black/40 text-white hover:bg-white hover:text-[#0A2A5E]'}`}><Star size={12} fill={item.is_featured ? "currentColor" : "none"} /></button>
                <span className="absolute top-2 left-2 text-[6px] font-black bg-white text-[#0A2A5E] px-2 py-1 rounded-full uppercase tracking-widest shadow-sm">{item.category}</span>
              </div>
              <div className="p-4 flex flex-col flex-1 text-left">
                <h4 className="font-black text-[10px] text-[#0A2A5E] uppercase italic mb-1 line-clamp-2 h-8 leading-tight">{item.title}</h4>
                <p className="text-[7px] font-black text-[#1FC8C8] uppercase mb-3 flex items-center gap-1 leading-none">By: {item.organizer_body || 'Verified Host'}</p>
                <div className="space-y-1 mb-4 flex-1 text-[8px] font-bold text-slate-400 uppercase">
                  <div className="flex items-center gap-1.5"><MapPin size={10}/> {item.venue || 'Various Locations'}</div>
                  <div className="flex items-center gap-1.5"><Calendar size={10}/> {item.recurring_day ? `Every ${item.recurring_day}` : item.event_date}</div>
                </div>
                <div className="flex gap-1.5 pt-3 border-t border-slate-100">
                  <button onClick={() => handleStatusChange(item.id, activeTab === 'queued' ? 'approved' : 'queued')} className={`flex-1 py-2 rounded-lg text-[8px] font-black uppercase transition-all ${activeTab === 'queued' ? 'bg-[#1FC8C8]' : 'bg-slate-100'}`}>{activeTab === 'queued' ? 'Approve' : 'Archive'}</button>
                  <button onClick={() => setEditingItem(item)} className="px-2 bg-slate-50 rounded-lg hover:bg-slate-100"><Pencil size={12} /></button>
                  <button onClick={() => handleDelete(item.id)} className="px-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white"><Trash2 size={12} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editingItem && (
        <div className="fixed inset-0 z-[200] bg-[#0A2A5E]/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl p-8 shadow-2xl text-left overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black uppercase italic text-[#0A2A5E]">Quick Edit Scout</h2>
              <button onClick={() => setEditingItem(null)} className="p-2 bg-slate-50 rounded-full hover:bg-slate-100"><X size={20}/></button>
            </div>
            <form onSubmit={saveEdit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2"><label className={labelClass}>Main Title</label><input required className={inputClass} value={editingItem.title} onChange={(e) => setEditingItem({...editingItem, title: e.target.value})} /></div>
              <div><label className={labelClass}>Organised by</label><input className={inputClass} value={editingItem.organizer_body || ''} onChange={(e) => setEditingItem({...editingItem, organizer_body: e.target.value})} /></div>
              <div><label className={labelClass}>Venue / Area</label><input className={inputClass} value={editingItem.venue || ''} onChange={(e) => setEditingItem({...editingItem, venue: e.target.value})} /></div>
              <div><label className={labelClass}>Date / Deadline</label><input type="date" className={inputClass} value={editingItem.event_date || ''} onChange={(e) => setEditingItem({...editingItem, event_date: e.target.value})} /></div>
              <div><label className={labelClass}>Recurring Day</label><select className={inputClass} value={editingItem.recurring_day || ''} onChange={(e) => setEditingItem({...editingItem, recurring_day: e.target.value})}><option value="">None</option>{['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => <option key={d} value={d}>{d}</option>)}</select></div>
              <div><label className={labelClass}>Pricing / Salary</label><input className={inputClass} value={editingItem.price || editingItem.salary_range || ''} onChange={(e) => editingItem.category === 'job' ? setEditingItem({...editingItem, salary_range: e.target.value}) : setEditingItem({...editingItem, price: e.target.value})} /></div>
              <div><label className={labelClass}>Map Search / Coordinates</label><input className={inputClass} placeholder="GPS or Specific Name" value={editingItem.map_query || ''} onChange={(e) => setEditingItem({...editingItem, map_query: e.target.value})} /></div>
              <div className="md:col-span-2"><button type="submit" className="w-full py-4 rounded-2xl font-black uppercase text-xs bg-[#0A2A5E] text-white hover:bg-[#1FC8C8] hover:text-[#0A2A5E] transition-all shadow-lg">💾 Save Updates</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}