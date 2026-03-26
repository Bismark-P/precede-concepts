"use client";
import { useState } from 'react';
import { addManualEntry } from '@/app/lib/collector';
import { 
  ArrowLeft, Image as ImageIcon, Sparkles, Eye, Clock, 
  MapPin, CircleDollarSign, Briefcase, GraduationCap, Trophy, Plus 
} from 'lucide-react';

// 1. Updated Interface to handle new fields
interface EventData {
  category: 'event' | 'job' | 'training';
  sub_category: string; // Handles Event Type, Job Type, or Training Type
  title: string;
  price_type: string; 
  price: string;
  time_category: string;
  duration: string; // New: For Training
  venue: string; // Doubles as "Location" for Jobs
  region: string;
  salary_range: string;
  event_date: string; // New: Unified date field
  link: string;
  image_url: string;
  review_text: string;
  is_featured: boolean;
  rating: number;
}

export default function AdminAddEvent() {
  const [loading, setLoading] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isSalaryDisclosed, setIsSalaryDisclosed] = useState(true);

  const [formData, setFormData] = useState<EventData>({
    category: 'event', 
    sub_category: 'Conference',
    title: '',
    price_type: 'Paid', 
    price: '',
    time_category: 'Evening',
    duration: '',
    venue: '',
    region: 'Greater Accra',
    salary_range: '',
    event_date: '',
    link: '',
    image_url: '',
    review_text: '',
    is_featured: false,
    rating: 5
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Auto-handle undisclosed salary before sending
    const finalData = { ...formData };
    if (formData.category === 'job' && !isSalaryDisclosed) {
        finalData.salary_range = 'Undisclosed';
    }

    const res = await addManualEntry(finalData);
    if (res.success) {
      alert("🚀 Published to Precede Hub!");
      setFormData({
        ...formData,
        title: '', price: '', venue: '', image_url: '', 
        review_text: '', salary_range: '', event_date: '', link: '', duration: ''
      });
      setImgError(false);
      window.scrollTo(0, 0);
    } else {
      alert("❌ Error: " + res.error);
    }
    setLoading(false);
  };

  const regions = ["Ahafo", "Ashanti", "Bono", "Bono East", "Central", "Eastern", "Greater Accra", "Northern", "North East", "Oti", "Savannah", "Upper East", "Upper West", "Volta", "Western", "Western North"];
  const timeCategories = ["Morning", "Afternoon", "Evening", "Night", "Half-day", "Full-day", "All-night"];

  // Reusable input styling for high contrast
  const inputClass = "w-full p-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:border-[#0A2A5E] focus:ring-4 ring-[#0A2A5E]/10 placeholder-slate-400 transition-all shadow-sm text-sm";
  const labelClass = "block text-[10px] font-black uppercase text-slate-500 mb-1.5 tracking-widest ml-1";

  return (
    <div className="max-w-xl mx-auto p-6 md:p-10 bg-slate-50 shadow-2xl rounded-[3rem] mt-10 mb-20 font-sans border border-slate-200 text-left">
      <div className="flex items-center gap-4 mb-8">
         <a href="/admin" className="p-3 bg-white border border-slate-200 rounded-full text-slate-600 hover:text-[#0A2A5E] hover:border-[#0A2A5E] transition-all"><ArrowLeft size={20}/></a>
         <h1 className="text-2xl font-black uppercase italic text-[#0A2A5E] flex items-center gap-2">
           <Sparkles className="text-[#1FC8C8]" size={24} /> Hub Publisher
         </h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* 1. CATEGORY SELECTOR */}
        <div className="p-1.5 bg-slate-200/50 rounded-2xl flex gap-1 border border-slate-200">
          {(['event', 'job', 'training'] as const).map((cat) => (
            <button 
              key={cat} type="button"
              onClick={() => setFormData({
                  ...formData, 
                  category: cat,
                  // Reset sub-categories when switching tabs
                  sub_category: cat === 'job' ? 'Full-time' : 'Conference' 
              })}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.category === cat ? 'bg-white text-[#0A2A5E] shadow-md border border-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 2. IMAGE PREVIEW */}
        <div className="relative w-full h-56 bg-slate-900 rounded-[2rem] overflow-hidden flex items-center justify-center border-4 border-slate-200 shadow-inner">
          {formData.image_url && !imgError ? (
            <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" onError={() => setImgError(true)} />
          ) : (
            <div className="text-center opacity-40">
               <ImageIcon size={48} className="mx-auto mb-2 text-white" />
               <h2 className="text-white font-black italic text-xl uppercase tracking-widest">No Image</h2>
            </div>
          )}
        </div>

        {/* 3. GENERAL INFO (Always Visible) */}
        <div>
          <label className={labelClass}>Flyer / Image URL</label>
          <input className={inputClass} placeholder="https://..." value={formData.image_url} onChange={(e) => {setFormData({...formData, image_url: e.target.value}); setImgError(false);}} />
        </div>

        <div>
          <label className={labelClass}>Title / Heading</label>
          <input className={inputClass} placeholder="Enter a catchy title..." required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
        </div>

        {/* =========================================
            SHAPE-SHIFTING SECTION BASED ON CATEGORY
            ========================================= */}

        {/* --- EVENT FIELDS --- */}
        {formData.category === 'event' && (
          <div className="p-6 bg-white border border-slate-200 rounded-[2rem] space-y-5 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#1FC8C8] mb-4">Event Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Event Type</label>
                <select className={inputClass} value={formData.sub_category} onChange={(e) => setFormData({...formData, sub_category: e.target.value})}>
                  <option value="Conference">Conference</option><option value="Meetup">Meetup</option><option value="Party">Party</option><option value="Exhibition">Exhibition</option><option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Event Date</label>
                <input type="date" className={inputClass} value={formData.event_date} onChange={(e) => setFormData({...formData, event_date: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Venue</label>
                <input className={inputClass} placeholder="e.g. Accra ICC" value={formData.venue} onChange={(e) => setFormData({...formData, venue: e.target.value})} />
              </div>
              <div>
                <label className={labelClass}>Time</label>
                <select className={inputClass} value={formData.time_category} onChange={(e) => setFormData({...formData, time_category: e.target.value})}>
                  {timeCategories.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* --- JOB FIELDS --- */}
        {formData.category === 'job' && (
          <div className="p-6 bg-white border border-slate-200 rounded-[2rem] space-y-5 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#1FC8C8] mb-4">Job Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Employment Type</label>
                <select className={inputClass} value={formData.sub_category} onChange={(e) => setFormData({...formData, sub_category: e.target.value})}>
                  <option value="Full-time">Full-time</option><option value="Part-time">Part-time</option><option value="Remote">Remote</option><option value="Contract">Contract</option><option value="Internship">Internship</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Location</label>
                <input className={inputClass} placeholder="e.g. East Legon" value={formData.venue} onChange={(e) => setFormData({...formData, venue: e.target.value})} />
              </div>
            </div>
            
            <div>
               <div className="flex justify-between items-end mb-1.5">
                 <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Salary</label>
                 <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 cursor-pointer">
                    <input type="checkbox" checked={!isSalaryDisclosed} onChange={() => setIsSalaryDisclosed(!isSalaryDisclosed)} className="accent-[#0A2A5E]" /> Undisclosed
                 </label>
               </div>
               <input disabled={!isSalaryDisclosed} className={`${inputClass} disabled:opacity-50 disabled:bg-slate-100`} placeholder="e.g. GHS 3,000 - 5,000" value={formData.salary_range} onChange={(e) => setFormData({...formData, salary_range: e.target.value})} />
            </div>

            <div>
              <label className={labelClass}>Application Deadline</label>
              <input type="date" className={inputClass} value={formData.event_date} onChange={(e) => setFormData({...formData, event_date: e.target.value})} />
            </div>
          </div>
        )}

        {/* --- TRAINING & SEMINAR FIELDS --- */}
        {formData.category === 'training' && (
          <div className="p-6 bg-white border border-slate-200 rounded-[2rem] space-y-5 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#1FC8C8] mb-4">Training Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Training Type</label>
                <select className={inputClass} value={formData.sub_category} onChange={(e) => setFormData({...formData, sub_category: e.target.value})}>
                  <option value="Seminar">Seminar</option><option value="Workshop">Workshop</option><option value="Webinar">Webinar</option><option value="Masterclass">Masterclass</option><option value="Bootcamp">Bootcamp</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Start Date</label>
                <input type="date" className={inputClass} value={formData.event_date} onChange={(e) => setFormData({...formData, event_date: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Duration</label>
                <input className={inputClass} placeholder="e.g. 3 Weeks" value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} />
              </div>
              <div>
                <label className={labelClass}>Venue / Link</label>
                <input className={inputClass} placeholder="Physical or Zoom" value={formData.venue} onChange={(e) => setFormData({...formData, venue: e.target.value})} />
              </div>
            </div>
          </div>
        )}

        {/* 4. PRICING (Hide for Jobs) */}
        {formData.category !== 'job' && (
          <div className="flex gap-4">
            <div className="w-1/3">
              <label className={labelClass}>Access</label>
              <select className={inputClass} value={formData.price_type} onChange={(e) => setFormData({...formData, price_type: e.target.value})}>
                <option value="Paid">Paid</option><option value="Free">Free</option>
              </select>
            </div>
            <div className="w-2/3">
              <label className={labelClass}>Fee / Price</label>
              <input disabled={formData.price_type === 'Free'} className={`${inputClass} disabled:opacity-50 disabled:bg-slate-100`} placeholder="e.g. GHS 150+" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
            </div>
          </div>
        )}

        {/* 5. UNIVERSAL FOOTER FIELDS */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Region</label>
            <select className={inputClass} value={formData.region} onChange={(e) => setFormData({...formData, region: e.target.value})}>
              {regions.map(reg => <option key={reg} value={reg}>{reg}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>External Link</label>
            <input className={inputClass} placeholder="URL to Apply/Register" value={formData.link} onChange={(e) => setFormData({...formData, link: e.target.value})} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Description / Summary</label>
          <textarea className={`${inputClass} min-h-[120px] resize-y`} placeholder="Write a brief overview..." value={formData.review_text} onChange={(e) => setFormData({...formData, review_text: e.target.value})} />
        </div>

        <button disabled={loading} className="w-full bg-[#0A2A5E] text-white p-6 rounded-2xl font-black uppercase text-xs tracking-[0.3em] shadow-xl shadow-[#0A2A5E]/20 hover:bg-[#1FC8C8] hover:text-[#0A2A5E] transition-all disabled:opacity-50 mt-4">
          {loading ? "SYNCING TO DATABASE..." : "🚀 PUBLISH TO HUB"}
        </button>
      </form>
    </div>
  );
}