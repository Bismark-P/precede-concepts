"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { Plus, Check, X, MapPin, Calendar, Clock, Pencil, Trash2, Globe, Archive } from 'lucide-react';

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

  const handleStatusChange = async (id: string, newStatus: string) => {
    setProcessingId(id);
    await supabase.from('jobs').update({ status: newStatus }).eq('id', id);
    setItems(items.filter(item => item.id !== id));
    setProcessingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete permanently?")) return;
    await supabase.from('jobs').delete().eq('id', id);
    setItems(items.filter(item => item.id !== id));
  };

  const saveEdit = async (e: any) => {
    e.preventDefault();
    await supabase.from('jobs').update(editingItem).eq('id', editingItem.id);
    setItems(items.map(i => i.id === editingItem.id ? editingItem : i));
    setEditingItem(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 pb-20">
      <nav className="bg-[#0A2A5E] px-6 py-5 sticky top-0 z-[100] shadow-lg flex justify-between items-center text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1FC8C8] rounded-xl flex items-center justify-center font-black italic text-[#0A2A5E]">PC</div>
          <div className="text-left leading-none"><span className="text-lg font-black uppercase italic tracking-tighter">Control Hub</span></div>
        </div>
        <a href="/admin/add" className="bg-[#1FC8C8] text-[#0A2A5E] px-5 py-2.5 rounded-xl font-black text-[10px] uppercase flex items-center gap-2"><Plus size={16} /> New Scout</a>
      </nav>

      <div className="max-w-[1600px] mx-auto px-4 pt-10">
        <div className="flex gap-4 mb-8 border-b border-slate-200 pb-4">
           <button onClick={() => setActiveTab('queued')} className={`text-[10px] font-black uppercase px-6 py-3 rounded-xl ${activeTab === 'queued' ? 'bg-[#0A2A5E] text-white shadow-xl' : 'bg-white text-slate-400'}`}>Queue ({activeTab === 'queued' ? items.length : '...'})</button>
           <button onClick={() => setActiveTab('approved')} className={`text-[10px] font-black uppercase px-6 py-3 rounded-xl ${activeTab === 'approved' ? 'bg-[#1FC8C8] text-[#0A2A5E] shadow-xl' : 'bg-white text-slate-400'}`}>Live Hub ({activeTab === 'approved' ? items.length : '...'})</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden flex flex-col shadow-sm hover:shadow-xl transition-all">
              <div className="h-32 bg-slate-900 relative">
                {item.image_url ? <img src={item.image_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-black text-white/10 text-[8px] uppercase">Precede</div>}
              </div>
              <div className="p-4 flex flex-col flex-1 text-left">
                <h4 className="font-black text-[11px] text-[#0A2A5E] uppercase italic mb-3 line-clamp-2 h-8">{item.title}</h4>
                <div className="space-y-1 mb-4 flex-1 text-[8px] font-bold text-slate-400 uppercase">
                  <div className="flex items-center gap-1.5"><MapPin size={10}/> {item.venue || 'No Venue'}</div>
                  <div className="flex items-center gap-1.5"><Calendar size={10}/> {item.event_date}</div>
                </div>
                <div className="flex gap-1.5 pt-3 border-t border-slate-100">
                  <button onClick={() => handleStatusChange(item.id, activeTab === 'queued' ? 'approved' : 'queued')} className={`flex-1 py-2 rounded-lg text-[8px] font-black uppercase ${activeTab === 'queued' ? 'bg-[#1FC8C8]' : 'bg-slate-100'}`}>{activeTab === 'queued' ? 'Approve' : 'Archive'}</button>
                  <button onClick={() => setEditingItem(item)} className="px-2 bg-slate-50 rounded-lg"><Pencil size={12} /></button>
                  <button onClick={() => handleDelete(item.id)} className="px-2 bg-red-50 text-red-500 rounded-lg"><Trash2 size={12} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editingItem && (
        <div className="fixed inset-0 z-[200] bg-[#0A2A5E]/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-xl p-8 shadow-2xl text-left">
            <h2 className="text-xl font-black uppercase italic text-[#0A2A5E] mb-6 flex justify-between">Edit Scout <button onClick={() => setEditingItem(null)}><X size={20}/></button></h2>
            <form onSubmit={saveEdit} className="space-y-4">
              <label className="text-[9px] font-black uppercase text-slate-500">Title</label>
              <input required className="w-full p-3 border-2 border-slate-100 rounded-xl font-bold text-xs" value={editingItem.title} onChange={(e) => setEditingItem({...editingItem, title: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-[9px] font-black uppercase text-slate-500">Date</label><input type="date" required className="w-full p-3 border-2 border-slate-100 rounded-xl font-bold text-xs" value={editingItem.event_date} onChange={(e) => setEditingItem({...editingItem, event_date: e.target.value})} /></div>
                <div><label className="text-[9px] font-black uppercase text-slate-500">Type</label><select className="w-full p-3 border-2 border-slate-100 rounded-xl font-bold text-xs" value={editingItem.sub_category} onChange={(e) => setEditingItem({...editingItem, sub_category: e.target.value})}><option value="Concert">Concert</option><option value="Gospel Concert">Gospel Concert</option><option value="Graduation">Graduation</option><option value="Matriculation">Matriculation</option></select></div>
              </div>
              <button type="submit" className="w-full py-4 rounded-xl font-black uppercase text-xs bg-[#0A2A5E] text-white">Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}