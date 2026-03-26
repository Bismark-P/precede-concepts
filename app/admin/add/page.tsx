"use client";
import { useState } from 'react';
import { addManualEntry } from '@/app/lib/collector';
import { 
  ArrowLeft, Image as ImageIcon, Sparkles, Eye, Clock, 
  MapPin, CircleDollarSign, Briefcase, GraduationCap, Trophy, Plus 
} from 'lucide-react';

// 1. Strict Interface to satisfy TypeScript
interface EventData {
  category: 'event' | 'job' | 'training' | 'sports' | 'others' | 'seminar';
  title: string;
  price_type: string; 
  price: string;
  time_category: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  venue: string;
  region: string;
  salary_range: string;
  job_type: string;
  deadline: string;
  link: string;
  image_url: string;
  review_text: string;
  is_featured: boolean;
  rating: number;
}

export default function AdminAddEvent() {
  const [loading, setLoading] = useState(false);
  const [imgError, setImgError] = useState(false);

  const [formData, setFormData] = useState<EventData>({
    category: 'event', 
    title: '',
    price_type: 'Paid', 
    price: '',
    time_category: 'Evening',
    venue: '',
    region: 'Greater Accra',
    salary_range: '',
    job_type: 'Full-time',
    deadline: '',
    link: '',
    image_url: '',
    review_text: '',
    is_featured: false,
    rating: 5
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await addManualEntry(formData);
    if (res.success) {
      alert("🚀 Published to Precede Hub!");
      setFormData({
        ...formData,
        title: '', price: '', venue: '', image_url: '', 
        review_text: '', salary_range: '', deadline: '', link: ''
      });
      setImgError(false);
      window.scrollTo(0, 0);
    } else {
      alert("❌ Error: " + res.error);
    }
    setLoading(false);
  };

  const regions = ["Ahafo", "Ashanti", "Bono", "Bono East", "Central", "Eastern", "Greater Accra", "Northern", "North East", "Oti", "Savannah", "Upper East", "Upper West", "Volta", "Western", "Western North"];

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-2xl rounded-[3rem] mt-10 mb-20 font-sans border border-slate-50 text-left">
      <div className="flex items-center gap-4 mb-8">
         <a href="/admin" className="p-3 bg-slate-50 rounded-full text-slate-400 hover:text-blue-600 transition-all"><ArrowLeft size={20}/></a>
         <h1 className="text-2xl font-black uppercase italic text-slate-950 flex items-center gap-2">
           <Sparkles className="text-blue-600" size={24} /> New Scout
         </h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* CATEGORY SELECTOR (AT TOP) */}
        <div className="p-1 bg-slate-100 rounded-2xl flex gap-1">
          {['event', 'job', 'training', 'sports'].map((cat) => (
            <button 
              key={cat} type="button"
              onClick={() => setFormData({...formData, category: cat as any})}
              className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${formData.category === cat ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FLYER PREVIEW */}
        <div className="relative w-full h-52 bg-slate-900 rounded-[2.5rem] overflow-hidden flex items-center justify-center border-4 border-white shadow-lg">
          {formData.image_url && !imgError ? (
            <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" onError={() => setImgError(true)} />
          ) : (
            <div className="text-center opacity-30">
               <h2 className="text-white font-black italic text-2xl uppercase tracking-tighter leading-none">Precede <br/> <span className="text-blue-500 text-sm">Concepts</span></h2>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus-within:border-blue-100 transition-all">
          <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Flyer Image URL (Direct Link)</label>
          <input className="w-full bg-transparent outline-none text-xs font-medium" placeholder="Paste link to .jpg or .png" value={formData.image_url} onChange={(e) => {setFormData({...formData, image_url: e.target.value}); setImgError(false);}} />
        </div>

        <input className="w-full p-5 bg-slate-50 rounded-2xl font-black text-slate-950 outline-none border-2 border-transparent focus:border-blue-600 transition-all" placeholder="Title / Heading" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />

        {/* SHAPE-SHIFTING INPUTS */}
        {formData.category === 'job' ? (
          <div className="space-y-4">
            <div className="flex gap-3">
              <select className="flex-1 p-4 bg-slate-50 rounded-2xl font-bold text-xs outline-none" value={formData.job_type} onChange={(e) => setFormData({...formData, job_type: e.target.value})}>
                <option value="Full-time">Full-time</option><option value="Remote">Remote</option><option value="Internship">Internship</option><option value="Contract">Contract</option>
              </select>
              <input className="flex-1 p-4 bg-slate-50 rounded-2xl font-bold text-xs outline-none" placeholder="Salary (e.g. 3k-5k)" value={formData.salary_range} onChange={(e) => setFormData({...formData, salary_range: e.target.value})} />
            </div>
            <input type="date" className="w-full p-4 bg-slate-50 rounded-2xl text-xs font-bold outline-none text-slate-400" value={formData.deadline} onChange={(e) => setFormData({...formData, deadline: e.target.value})} />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-3">
              <select className="w-24 p-4 bg-slate-100 rounded-2xl font-black text-[10px] outline-none" value={formData.price_type} onChange={(e) => setFormData({...formData, price_type: e.target.value})}>
                <option value="Paid">Paid</option><option value="Free">Free</option>
              </select>
              <input 
                disabled={formData.price_type === 'Free'}
                className="flex-1 p-4 bg-slate-50 rounded-2xl font-black text-xs outline-none disabled:opacity-20" 
                placeholder="Min Price (e.g. 150+)" 
                value={formData.price} 
                onChange={(e) => setFormData({...formData, price: e.target.value})} 
              />
            </div>
            <div className="flex gap-3">
               <select className="flex-1 p-4 bg-slate-50 rounded-2xl font-bold text-xs outline-none" value={formData.time_category} onChange={(e) => setFormData({...formData, time_category: e.target.value as any})}>
                <option value="Morning">Morning</option><option value="Afternoon">Afternoon</option><option value="Evening">Evening</option><option value="Night">Night</option>
              </select>
              <input className="flex-1 p-4 bg-slate-50 rounded-2xl text-xs font-medium outline-none" placeholder="Venue" value={formData.venue} onChange={(e) => setFormData({...formData, venue: e.target.value})} />
            </div>
          </div>
        )}

        <select className="w-full p-4 bg-slate-100 rounded-2xl font-bold text-xs outline-none" value={formData.region} onChange={(e) => setFormData({...formData, region: e.target.value})}>
          {regions.map(reg => <option key={reg} value={reg}>{reg} Region</option>)}
        </select>

        <textarea className="w-full p-5 bg-blue-50/30 rounded-3xl text-xs font-medium outline-none border border-blue-50 min-h-[100px]" placeholder="Recommendation / Vibe Check..." value={formData.review_text} onChange={(e) => setFormData({...formData, review_text: e.target.value})} />

        <button disabled={loading} className="w-full bg-blue-600 text-white p-6 rounded-[2.5rem] font-black uppercase text-[10px] tracking-[0.4em] shadow-xl shadow-blue-100 hover:bg-slate-900 transition-all">
          {loading ? "Syncing..." : "🚀 Publish Scout"}
        </button>
      </form>
    </div>
  );
}