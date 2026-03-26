"use client";
import { useState } from 'react';
import { addManualEntry } from '@/app/lib/collector';
import { 
  ArrowLeft, Sparkles, Image as ImageIcon, 
  Plus, LayoutDashboard, CheckCircle2, Star
} from 'lucide-react';

export default function AdminAddEvent() {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [imgError, setImgError] = useState(false);

  const [formData, setFormData] = useState<any>({
    category: 'event', 
    sub_category: 'Concert',
    title: '',
    price_type: 'Paid', 
    price: '',
    time_category: 'TBD',
    venue: '',
    region: 'Greater Accra',
    salary_range: '',
    event_date: '',
    link: '',
    image_url: '',
    review_text: '',
    is_featured: false, // Default is false
    rating: 5
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setShowSuccess(false);

    const res = await addManualEntry(formData);
    
    if (res.success) {
      setShowSuccess(true);
      setFormData({
        ...formData,
        title: '', price: '', venue: '', event_date: '', 
        link: '', image_url: '', review_text: '', salary_range: '',
        is_featured: false // Reset toggle after success
      });
      setImgError(false);
      window.scrollTo(0, 0);
    } else {
      alert("❌ Error: " + res.error);
    }
    setLoading(false);
  };

  const inputClass = "w-full p-4 bg-white border-2 border-slate-200 rounded-2xl font-bold text-slate-900 outline-none focus:border-[#0A2A5E] text-sm shadow-sm transition-all";
  const labelClass = "block text-[10px] font-black uppercase text-slate-500 mb-1.5 tracking-widest ml-1";

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4">
      <div className="max-w-xl mx-auto p-10 bg-white shadow-2xl rounded-[3rem] border border-slate-200 text-left">
        
        <div className="flex items-center justify-between mb-8">
          <a href="/admin" className="p-3 bg-slate-50 rounded-full text-slate-400 hover:text-[#0A2A5E] shadow-sm transition-all">
            <ArrowLeft size={20}/>
          </a>
          <h1 className="text-2xl font-black uppercase italic text-[#0A2A5E] flex items-center gap-2">New Scout</h1>
          <div className="w-10 h-10" /> 
        </div>

        {showSuccess && (
          <div className="mb-8 p-4 bg-[#1FC8C8]/10 border-2 border-[#1FC8C8]/20 rounded-2xl flex items-center justify-between animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-3 text-[#0A2A5E]">
              <CheckCircle2 size={20} className="text-[#1FC8C8]" />
              <span className="text-[10px] font-black uppercase tracking-widest">Added to Queue!</span>
            </div>
            <a href="/admin" className="flex items-center gap-2 bg-[#0A2A5E] text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#1FC8C8] hover:text-[#0A2A5E] transition-all">
              <LayoutDashboard size={14} /> View Hub
            </a>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-1.5 bg-slate-100 rounded-2xl flex gap-1 border border-slate-200">
            {['event', 'job', 'training'].map((cat) => (
              <button key={cat} type="button" onClick={() => setFormData({...formData, category: cat})} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${formData.category === cat ? 'bg-[#0A2A5E] text-white shadow-lg' : 'text-slate-400'}`}>{cat}</button>
            ))}
          </div>

          <div className="relative w-full h-52 bg-slate-900 rounded-[2rem] overflow-hidden flex items-center justify-center border-4 border-slate-50">
            {formData.image_url && !imgError ? <img src={formData.image_url} className="w-full h-full object-cover" onError={() => setImgError(true)} /> : <div className="text-center opacity-30"><ImageIcon size={40} className="mx-auto mb-2 text-white" /><h2 className="text-white font-black italic text-xl uppercase tracking-widest">Precede</h2></div>}
          </div>

          <div>
            <label className={labelClass}>Scout Title *</label>
            <input required className={inputClass} placeholder="Enter title..." value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Type *</label>
              <select required className={inputClass} value={formData.sub_category} onChange={(e) => setFormData({...formData, sub_category: e.target.value})}>
                <option value="Concert">Concert</option>
                <option value="Gospel Concert">Gospel Concert</option>
                <option value="Graduation">Graduation</option>
                <option value="Matriculation">Matriculation</option>
                <option value="Conference">Conference</option>
                <option value="Seminar">Seminar</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Date *</label>
              <input type="date" required className={inputClass} value={formData.event_date} onChange={(e) => setFormData({...formData, event_date: e.target.value})} />
            </div>
          </div>

          {/* ⭐ THE NEW TOP PICKS TOGGLE */}
          <div 
            onClick={() => setFormData({...formData, is_featured: !formData.is_featured})}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${formData.is_featured ? 'bg-[#1FC8C8]/10 border-[#1FC8C8]' : 'bg-slate-50 border-slate-100 hover:border-slate-200'}`}
          >
            <div className="flex items-center gap-3">
               <div className={`p-2 rounded-lg ${formData.is_featured ? 'bg-[#1FC8C8] text-[#0A2A5E]' : 'bg-slate-200 text-slate-400'}`}>
                  <Star size={16} fill={formData.is_featured ? "currentColor" : "none"} />
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#0A2A5E]">Promote to Top Picks</p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Will appear in the "Our Picks" section</p>
               </div>
            </div>
            <div className={`w-10 h-5 rounded-full relative transition-all ${formData.is_featured ? 'bg-[#1FC8C8]' : 'bg-slate-300'}`}>
               <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.is_featured ? 'right-1' : 'left-1'}`} />
            </div>
          </div>

          <div><label className={labelClass}>Venue</label><input className={inputClass} placeholder="Location" value={formData.venue} onChange={(e) => setFormData({...formData, venue: e.target.value})} /></div>
          <div><label className={labelClass}>Flyer URL</label><input className={inputClass} placeholder="https://..." value={formData.image_url} onChange={(e) => {setFormData({...formData, image_url: e.target.value}); setImgError(false);}} /></div>

          <button disabled={loading} className="w-full bg-[#0A2A5E] text-white p-6 rounded-2xl font-black uppercase text-xs tracking-[0.3em] shadow-xl hover:bg-[#1FC8C8] hover:text-[#0A2A5E] transition-all flex items-center justify-center gap-3">
            {loading ? "SENDING..." : <><Plus size={18} /> Send to Queue</>}
          </button>

          {!showSuccess && (
            <a href="/admin" className="block text-center text-[9px] font-black uppercase text-slate-300 hover:text-slate-500 transition-all tracking-widest pt-2">
              Back to Dashboard
            </a>
          )}
        </form>
      </div>
    </div>
  );
}