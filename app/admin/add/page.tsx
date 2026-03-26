"use client";
import { useState } from 'react';
import { addManualEntry } from '@/app/lib/collector';
import { 
  ArrowLeft, Sparkles, Image as ImageIcon, 
  Plus, LayoutDashboard, CheckCircle2, Star,
  Briefcase, GraduationCap, PartyPopper, Clock
} from 'lucide-react';

export default function AdminAddEvent() {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isSalaryDisclosed, setIsSalaryDisclosed] = useState(true);

  const [formData, setFormData] = useState<any>({
    category: 'event', 
    sub_category: 'Conference',
    title: '',
    price_type: 'Paid', 
    price: '',
    time_category: 'Morning',
    duration: '',
    venue: '',
    region: 'Greater Accra',
    salary_range: '',
    event_date: '',
    link: '',
    image_url: '',
    review_text: '',
    is_featured: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setShowSuccess(false);

    // Handle undisclosed salary logic
    const finalData = { ...formData };
    if (formData.category === 'job' && !isSalaryDisclosed) {
      finalData.salary_range = 'Undisclosed';
    }

    const res = await addManualEntry(finalData);
    if (res.success) {
      setShowSuccess(true);
      setFormData({
        ...formData,
        title: '', price: '', venue: '', event_date: '', 
        link: '', image_url: '', review_text: '', salary_range: '', duration: '',
        is_featured: false
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
      <div className="max-w-2xl mx-auto p-10 bg-white shadow-2xl rounded-[3rem] border border-slate-200 text-left">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <a href="/admin" className="p-3 bg-slate-50 rounded-full text-slate-400 hover:text-[#0A2A5E] shadow-sm transition-all">
            <ArrowLeft size={20}/>
          </a>
          <h1 className="text-2xl font-black uppercase italic text-[#0A2A5E] flex items-center gap-2">Publish Scout</h1>
          <div className="w-10 h-10" /> 
        </div>

        {showSuccess && (
          <div className="mb-8 p-4 bg-[#1FC8C8]/10 border-2 border-[#1FC8C8]/20 rounded-2xl flex items-center justify-between animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-3 text-[#0A2A5E]">
              <CheckCircle2 size={20} className="text-[#1FC8C8]" />
              <span className="text-[10px] font-black uppercase tracking-widest">Sent to Queue!</span>
            </div>
            <a href="/admin" className="flex items-center gap-2 bg-[#0A2A5E] text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#1FC8C8] transition-all">
              <LayoutDashboard size={14} /> View Dashboard
            </a>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* CATEGORY SWITCHER */}
          <div className="p-1.5 bg-slate-100 rounded-2xl flex gap-1 border border-slate-200">
            {[
              { id: 'event', label: 'Events', icon: <PartyPopper size={14}/> },
              { id: 'job', label: 'Jobs', icon: <Briefcase size={14}/> },
              { id: 'training', label: 'Training', icon: <GraduationCap size={14}/> }
            ].map((cat) => (
              <button 
                key={cat.id} 
                type="button" 
                onClick={() => setFormData({...formData, category: cat.id, sub_category: cat.id === 'job' ? 'Full-time' : 'Conference'})} 
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 ${formData.category === cat.id ? 'bg-[#0A2A5E] text-white shadow-lg' : 'text-slate-400'}`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>

          {/* GENERAL INFO (Common to all) */}
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Main Title *</label>
              <input required className={inputClass} placeholder="Enter a catchy headline..." value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className={labelClass}>Time Slot</label>
                <select className={inputClass} value={formData.time_category} onChange={(e) => setFormData({...formData, time_category: e.target.value})}>
                  {['Morning', 'Afternoon', 'Evening', 'Night', 'Full-day', 'Half-day', 'All-night'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Region</label>
                <select className={inputClass} value={formData.region} onChange={(e) => setFormData({...formData, region: e.target.value})}>
                  {["Greater Accra", "Ashanti", "Western", "Central", "Eastern", "Northern", "Volta"].map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* --- CONDITIONAL FIELDS: EVENTS --- */}
          {formData.category === 'event' && (
            <div className="p-6 bg-slate-50 rounded-3xl space-y-4 border border-slate-100">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Event Type</label>
                  <select className={inputClass} value={formData.sub_category} onChange={(e) => setFormData({...formData, sub_category: e.target.value})}>
                    <option value="Conference">Conference</option><option value="Meetup">Meetup</option><option value="Party">Party</option><option value="Concert">Concert</option><option value="Others">Others</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Event Date *</label>
                  <input type="date" required className={inputClass} value={formData.event_date} onChange={(e) => setFormData({...formData, event_date: e.target.value})} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Venue</label>
                <input className={inputClass} placeholder="e.g. Accra Mall" value={formData.venue} onChange={(e) => setFormData({...formData, venue: e.target.value})} />
              </div>
            </div>
          )}

          {/* --- CONDITIONAL FIELDS: JOBS --- */}
          {formData.category === 'job' && (
            <div className="p-6 bg-slate-50 rounded-3xl space-y-4 border border-slate-100">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Employment Type</label>
                  <select className={inputClass} value={formData.sub_category} onChange={(e) => setFormData({...formData, sub_category: e.target.value})}>
                    <option value="Full-time">Full-time</option><option value="Part-time">Part-time</option><option value="Remote">Remote</option><option value="Contract">Contract</option><option value="Internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Deadline Date *</label>
                  <input type="date" required className={inputClass} value={formData.event_date} onChange={(e) => setFormData({...formData, event_date: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Location</label>
                  <input className={inputClass} placeholder="e.g. East Legon" value={formData.venue} onChange={(e) => setFormData({...formData, venue: e.target.value})} />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5 px-1">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Salary Range</label>
                    <label className="flex items-center gap-1 text-[8px] font-black uppercase text-[#1FC8C8] cursor-pointer">
                      <input type="checkbox" checked={!isSalaryDisclosed} onChange={() => setIsSalaryDisclosed(!isSalaryDisclosed)} /> Undisclosed
                    </label>
                  </div>
                  <input disabled={!isSalaryDisclosed} className={`${inputClass} disabled:opacity-30`} placeholder="e.g. GHS 3k - 5k" value={formData.salary_range} onChange={(e) => setFormData({...formData, salary_range: e.target.value})} />
                </div>
              </div>
            </div>
          )}

          {/* --- CONDITIONAL FIELDS: TRAINING --- */}
          {formData.category === 'training' && (
            <div className="p-6 bg-slate-50 rounded-3xl space-y-4 border border-slate-100">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Training Type</label>
                  <select className={inputClass} value={formData.sub_category} onChange={(e) => setFormData({...formData, sub_category: e.target.value})}>
                    <option value="Seminar">Seminar</option><option value="Workshop">Workshop</option><option value="Webinar">Webinar</option><option value="Bootcamp">Bootcamp</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Start Date *</label>
                  <input type="date" required className={inputClass} value={formData.event_date} onChange={(e) => setFormData({...formData, event_date: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Venue / Platform</label>
                  <input className={inputClass} placeholder="e.g. Zoom or British Council" value={formData.venue} onChange={(e) => setFormData({...formData, venue: e.target.value})} />
                </div>
                <div>
                  <label className={labelClass}>Duration</label>
                  <input className={inputClass} placeholder="e.g. 3 Weeks" value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} />
                </div>
              </div>
            </div>
          )}

          {/* MEDIA & PROMOTION */}
          <div className="space-y-4">
             <div>
                <label className={labelClass}>Flyer Image URL</label>
                <input className={inputClass} placeholder="https://..." value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})} />
             </div>
             
             <div 
                onClick={() => setFormData({...formData, is_featured: !formData.is_featured})}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${formData.is_featured ? 'bg-[#1FC8C8]/10 border-[#1FC8C8]' : 'bg-white border-slate-100 hover:border-slate-200'}`}
              >
                <div className="flex items-center gap-3 text-left leading-tight">
                   <div className={`p-2 rounded-lg ${formData.is_featured ? 'bg-[#1FC8C8] text-[#0A2A5E]' : 'bg-slate-200 text-slate-400'}`}>
                      <Star size={16} fill={formData.is_featured ? "currentColor" : "none"} />
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#0A2A5E]">Promote to Our Picks</p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase">Featured at top of homepage</p>
                   </div>
                </div>
              </div>
          </div>

          <button disabled={loading} className="w-full bg-[#0A2A5E] text-white p-6 rounded-2xl font-black uppercase text-xs tracking-[0.3em] shadow-xl hover:bg-[#1FC8C8] hover:text-[#0A2A5E] transition-all disabled:opacity-50 mt-4 flex items-center justify-center gap-3">
            {loading ? "PROCESSING..." : <><Plus size={18} /> Send to Queue</>}
          </button>

        </form>
      </div>
    </div>
  );
}