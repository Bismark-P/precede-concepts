"use client";
import { useState } from 'react';
import { addManualEntry } from '@/app/lib/collector';
import { ArrowLeft, Image as ImageIcon, Link as LinkIcon, Sparkles, Star, Eye, Clock, MapPin, CircleDollarSign } from 'lucide-react';

interface EventData {
  title: string;
  link: string;
  venue?: string;
  price?: string;
  time_category: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  category: 'event' | 'job' | 'training';
  region: string;
  rating: number;
  review_text: string;
  is_featured: boolean;
  image_url?: string;
}

export default function AdminAddEvent() {
  const [loading, setLoading] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [formData, setFormData] = useState<EventData>({
    title: '',
    link: '',
    venue: '',
    price: '',
    time_category: 'Evening',
    category: 'event',
    region: 'Greater Accra',
    rating: 5,
    review_text: '',
    is_featured: false,
    image_url: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const res = await addManualEntry(formData);
    
    if (res.success) {
      alert("🚀 Precede Engine Updated!");
      setFormData({ 
        title: '', 
        link: '', 
        venue: '', 
        price: '', 
        time_category: 'Evening',
        category: 'event',
        region: 'Greater Accra',
        rating: 5,
        review_text: '', 
        is_featured: false, 
        image_url: '' 
      });
      setImgError(false);
      window.scrollTo(0, 0);
    } else {
      alert("❌ Error: " + res.error);
    }
    setLoading(false);
  };

  const ghanaRegions = [
    "Ahafo", "Ashanti", "Bono", "Bono East", "Central", "Eastern", 
    "Greater Accra", "Northern", "North East", "Oti", "Savannah", 
    "Upper East", "Upper West", "Volta", "Western", "Western North"
  ];

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-2xl rounded-[3rem] mt-10 mb-20 border border-slate-50 font-sans">
      
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8">
         <a href="/admin" className="p-3 bg-slate-50 rounded-full text-slate-400 hover:text-blue-600 transition-colors">
           <ArrowLeft size={20}/>
         </a>
         <h1 className="text-2xl font-black uppercase italic text-slate-950 flex items-center gap-2">
           <Sparkles className="text-blue-600" size={24} /> Master Scout
         </h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* 🖼️ FLYER PREVIEW */}
        <div className="relative w-full h-60 bg-slate-900 rounded-[2.5rem] overflow-hidden mb-6 border-4 border-white shadow-2xl flex items-center justify-center text-center">
          {formData.image_url && !imgError ? (
            <img 
              src={formData.image_url} 
              alt="Flyer Preview" 
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
              onLoad={() => setImgError(false)}
            />
          ) : (
            <div className="p-6">
               <h2 className="text-white font-black italic uppercase tracking-tighter text-3xl leading-none">
                 Precede <br/> <span className="text-blue-500 text-sm">Concepts</span>
               </h2>
               <p className="text-[10px] text-slate-500 mt-3 font-bold uppercase tracking-widest">
                 {imgError ? "⚠️ Broken Image Link" : "Curation Mode"}
               </p>
            </div>
          )}
          <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md p-2 rounded-full text-white">
            <Eye size={16} />
          </div>
        </div>

        {/* INPUT: IMAGE URL */}
        <div className="p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus-within:border-blue-100 transition-all">
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
            <ImageIcon size={14}/> Flyer Image URL (Optional)
          </label>
          <input 
            className="w-full bg-transparent outline-none text-sm font-medium text-slate-700" 
            placeholder="Paste .jpg or .png link" 
            value={formData.image_url}
            onChange={(e) => {
              setFormData({...formData, image_url: e.target.value});
              setImgError(false);
            }}
          />
        </div>

        {/* INPUT: TITLE */}
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Listing Title</label>
          <input 
            className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl outline-none font-bold text-slate-950" 
            placeholder="e.g. Easter Holiday Jam" 
            required
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
        </div>

        {/* SELECT: TIME CATEGORY & RATE */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1">
               <Clock size={10}/> Period
            </label>
            <select 
              className="w-full p-4 bg-slate-50 rounded-2xl outline-none text-xs font-bold appearance-none cursor-pointer"
              value={formData.time_category}
              onChange={(e) => setFormData({...formData, time_category: e.target.value as any})}
            >
              <option value="Morning">☀️ Morning</option>
              <option value="Afternoon">🌤️ Afternoon</option>
              <option value="Evening">🌆 Evening</option>
              <option value="Night">🌙 Night</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1 text-center">
               <CircleDollarSign size={10}/> Rate
            </label>
            <input 
              className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-sm text-center" 
              placeholder="Free / GHS" 
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})} 
            />
          </div>
        </div>

        {/* INPUT: VENUE */}
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1">
            <MapPin size={10}/> Venue
          </label>
          <input 
            className="w-full p-4 bg-slate-50 rounded-2xl outline-none text-sm font-medium" 
            placeholder="e.g. Polo Beach Club" 
            value={formData.venue} 
            onChange={(e) => setFormData({...formData, venue: e.target.value})} 
          />
        </div>

        {/* SELECT: REGION & TYPE */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Region</label>
            <select className="w-full p-4 bg-slate-100 rounded-2xl outline-none font-bold text-xs appearance-none cursor-pointer" value={formData.region} onChange={(e) => setFormData({...formData, region: e.target.value})}>
              {ghanaRegions.map(reg => <option key={reg} value={reg}>{reg}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Type</label>
            <select className="w-full p-4 bg-slate-100 rounded-2xl outline-none font-bold text-xs appearance-none cursor-pointer" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value as any})}>
              <option value="event">🎉 Event</option>
              <option value="job">💼 Job</option>
              <option value="training">🎓 Training</option>
            </select>
          </div>
        </div>

        {/* SOURCE LINK */}
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
            <LinkIcon size={12}/> Info Link (Optional)
          </label>
          <input 
            className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl outline-none text-xs" 
            placeholder="TikTok/IG/Web" 
            value={formData.link}
            onChange={(e) => setFormData({...formData, link: e.target.value})}
          />
        </div>

        {/* VIBE CHECK */}
        <div className="p-5 bg-blue-50 rounded-[2.5rem] border border-blue-100">
          <div className="flex justify-between items-center mb-3 text-left">
             <label className="text-[10px] font-black uppercase tracking-widest text-blue-600 italic underline">Precede Review</label>
             <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full shadow-sm">
                <Star size={12} className="text-yellow-500 fill-yellow-500"/>
                <input 
                  type="number" min="1" max="5" 
                  className="w-6 text-center font-black outline-none bg-transparent" 
                  value={formData.rating} 
                  onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
                />
             </div>
          </div>
          <textarea 
            className="w-full p-4 bg-white rounded-2xl text-xs border-none outline-none shadow-sm min-h-[80px]" 
            placeholder="Why do you recommend this?..." 
            value={formData.review_text} 
            onChange={(e) => setFormData({...formData, review_text: e.target.value})}
          />
        </div>

        {/* FEATURED */}
        <div className="flex items-center justify-between p-5 bg-slate-950 rounded-[2.5rem] shadow-2xl">
          <span className="font-black text-white text-[10px] uppercase tracking-[0.2em]">Featured</span>
          <input 
            type="checkbox" 
            className="w-6 h-6 accent-blue-500 cursor-pointer" 
            checked={formData.is_featured} 
            onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
          />
        </div>

        <button 
          disabled={loading} 
          className="w-full bg-blue-600 text-white p-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] shadow-xl shadow-blue-200 active:scale-95 transition-all hover:bg-slate-900 mt-2"
        >
          {loading ? "Updating Hub..." : "🚀 Publish Scout"}
        </button>
      </form>
    </div>
  );
}