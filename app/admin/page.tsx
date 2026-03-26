"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { 
  Plus, Check, X, MapPin, Calendar, Clock, 
  Sparkles, Pencil, Trash2, Globe, Archive 
} from 'lucide-react';

// Interface remains the same...
interface AdminItem {
  id: string;
  category: 'event' | 'job' | 'training';
  sub_category: string;
  title: string;
  price_type: string; 
  price: string;
  time_category: string;
  duration: string;
  venue: string;
  region: string;
  salary_range: string;
  event_date: string;
  link: string;
  image_url: string;
  review_text: string;
  status: string;
}

export default function AdminDashboard() {
  const [items, setItems] = useState<AdminItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'queued' | 'approved'>('queued');
  const [editingItem, setEditingItem] = useState<AdminItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => { fetchItems(); }, [activeTab]);

  async function fetchItems() {
    setLoading(true);
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', activeTab)
      .order('created_at', { ascending: false });
    if (!error && data) setItems(data as AdminItem[]);
    setLoading(false);
  }

  const handleStatusChange = async (id: string, newStatus: 'queued' | 'approved') => {
    setProcessingId(id);
    const { error } = await supabase.from('jobs').update({ status: newStatus }).eq('id', id);
    if (!error) setItems(items.filter(item => item.id !== id));
    setProcessingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure?")) return;
    setProcessingId(id);
    const { error } = await supabase.from('jobs').delete().eq('id', id);
    if (!error) setItems(items.filter(item => item.id !== id));
    setProcessingId(null);
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setIsSaving(true);
    const { error } = await supabase.from('jobs').update(editingItem).eq('id', editingItem.id);
    if (!error) {
      setItems(items.map(item => item.id === editingItem.id ? editingItem : item));
      setEditingItem(null);
    }
    setIsSaving(false);
  };

  const inputClass = "w-full p-3 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 outline-none focus:border-[#0A2A5E] text-xs";
  const Label = ({ text }: { text: string }) => <label className="block text-[9px] font-black uppercase text-slate-500 mb-1 tracking-widest">{text}</label>;

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 pb-20">
      
      {/* 🧭 NAVIGATION */}
      <nav className="bg-[#0A2A5E] px-6 py-5 sticky top-0 z-[100] shadow-lg">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1FC8C8] rounded-xl flex items-center justify-center font-black italic text-[#0A2A5E] text-xs shadow-lg">PC</div>
            <div className="flex flex-col text-left">
              <span className="text-lg font-black tracking-tighter uppercase italic text-white leading-none">Control Hub</span>
              <span className="text-[7px] font-bold text-[#1FC8C8] tracking-[0.4em] uppercase mt-1">Admin Dashboard</span>
            </div>
          </div>
          <a href="/admin/add" className="bg-[#1FC8C8] text-[#0A2A5E] px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all flex items-center gap-2">
             <Plus size={16} /> New Scout
          </a>
        </div>
      </nav>

      <div className="max-w-[1600px] mx-auto px-4 pt-10">
        
        {/* TABS */}
        <div className="flex gap-4 mb-8 border-b border-slate-200 pb-4">
           <button onClick={() => setActiveTab('queued')} className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${activeTab === 'queued' ? 'bg-[#0A2A5E] text-white' : 'bg-white text-slate-500 hover:bg-slate-200'}`}>
              <Clock size={14}/> Pending ({items.length})
           </button>
           <button onClick={() => setActiveTab('approved')} className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${activeTab === 'approved' ? 'bg-[#1FC8C8] text-[#0A2A5E]' : 'bg-white text-slate-500 hover:bg-slate-200'}`}>
              <Globe size={14}/> Live on Hub ({items.length})
           </button>
        </div>

        {loading ? (
           <div className="w-full py-20 flex flex-col items-center justify-center text-slate-400">
             <Clock size={40} className="animate-spin mb-4" />
             <p className="font-black uppercase tracking-widest text-[9px]">Fetching Database...</p>
           </div>
        ) : (
          /* --- THE 6-COLUMN GRID --- */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden flex flex-col shadow-sm hover:shadow-xl transition-all">
                
                {/* Slimmed Image Container */}
                <div className="h-32 bg-slate-900 relative">
                  {item.image_url ? <img src={item.image_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-black italic text-white/10 text-[8px] uppercase">No Image</div>}
                  <span className="absolute top-2 left-2 text-[6px] font-black bg-white text-[#0A2A5E] px-2 py-1 rounded-full uppercase tracking-widest shadow-sm">
                    {item.category}
                  </span>
                </div>

                {/* Compact Content */}
                <div className="p-4 flex flex-col flex-1">
                  <h4 className="font-black text-[11px] text-[#0A2A5E] leading-tight uppercase italic mb-3 line-clamp-2 h-8">
                    {item.title}
                  </h4>
                  
                  <div className="space-y-1.5 mb-4 flex-1">
                    <div className="flex items-center gap-1.5 text-[8px] font-bold text-slate-400 uppercase truncate"><MapPin size={10} className="text-[#0A2A5E]"/> {item.venue || 'No Venue'}</div>
                    <div className="flex items-center gap-1.5 text-[8px] font-bold text-slate-400 uppercase truncate"><Calendar size={10} className="text-[#0A2A5E]"/> {item.event_date || 'No Date'}</div>
                  </div>

                  {/* Tiny Action Buttons */}
                  <div className="flex gap-1.5 pt-3 border-t border-slate-100">
                    {activeTab === 'queued' ? (
                      <button onClick={() => handleStatusChange(item.id, 'approved')} disabled={processingId === item.id} className="flex-1 bg-[#1FC8C8] text-[#0A2A5E] py-2 rounded-lg text-[8px] font-black uppercase hover:bg-[#0A2A5E] hover:text-white transition-all">
                        Approve
                      </button>
                    ) : (
                      <button onClick={() => handleStatusChange(item.id, 'queued')} disabled={processingId === item.id} className="flex-1 bg-slate-100 text-slate-600 py-2 rounded-lg text-[8px] font-black uppercase hover:bg-slate-200 transition-all">
                        Archive
                      </button>
                    )}
                    <button onClick={() => setEditingItem(item)} className="px-2 bg-slate-50 text-[#0A2A5E] rounded-lg hover:bg-[#1FC8C8] transition-all">
                      <Pencil size={12} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} disabled={processingId === item.id} className="px-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* EDIT MODAL (Keep original modal code here...) */}
      {editingItem && (
        <div className="fixed inset-0 z-[200] bg-[#0A2A5E]/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-50 rounded-[2.5rem] w-full max-w-2xl p-6 md:p-8 shadow-2xl my-auto border border-white/20">
            <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
              <h2 className="text-2xl font-black italic uppercase text-[#0A2A5E] flex items-center gap-2"><Pencil className="text-[#1FC8C8]"/> Quick Edit</h2>
              <button onClick={() => setEditingItem(null)} className="p-2 bg-slate-200 rounded-full text-slate-600 hover:bg-slate-300 transition-all"><X size={20}/></button>
            </div>
            <form onSubmit={saveEdit} className="space-y-4">
              <div>
                <Label text="Title / Heading" />
                <input required className={inputClass} value={editingItem.title} onChange={(e) => setEditingItem({...editingItem, title: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label text="Image URL" />
                  <input className={inputClass} value={editingItem.image_url} onChange={(e) => setEditingItem({...editingItem, image_url: e.target.value})} />
                </div>
                <div>
                  <Label text="External Link" />
                  <input className={inputClass} value={editingItem.link || ''} onChange={(e) => setEditingItem({...editingItem, link: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="col-span-2">
                  <Label text="Venue / Location" />
                  <input className={inputClass} value={editingItem.venue || ''} onChange={(e) => setEditingItem({...editingItem, venue: e.target.value})} />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <Label text="Date" />
                  <input type="date" className={inputClass} value={editingItem.event_date || ''} onChange={(e) => setEditingItem({...editingItem, event_date: e.target.value})} />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <Label text="Price/Salary" />
                  <input className={inputClass} value={editingItem.category === 'job' ? (editingItem.salary_range || '') : (editingItem.price || '')} onChange={(e) => setEditingItem(editingItem.category === 'job' ? {...editingItem, salary_range: e.target.value} : {...editingItem, price: e.target.value})} />
                </div>
              </div>
              <div>
                <Label text="Description" />
                <textarea className={`${inputClass} min-h-[100px] resize-y`} value={editingItem.review_text || ''} onChange={(e) => setEditingItem({...editingItem, review_text: e.target.value})} />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setEditingItem(null)} className="flex-1 py-4 rounded-xl font-black uppercase text-[10px] bg-slate-200 text-slate-600">Cancel</button>
                <button type="submit" disabled={isSaving} className="flex-[2] py-4 rounded-xl font-black uppercase text-[10px] bg-[#0A2A5E] text-white hover:bg-[#1FC8C8] hover:text-[#0A2A5E]">
                  {isSaving ? "Saving..." : "💾 Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}