"use client";
import { useState } from 'react';
import { addManualEntry } from '@/app/lib/collector';
import { ArrowLeft, MapPin, Tag, Star, Sparkles } from 'lucide-react';

// This matches your backend requirements exactly
interface EventData {
  title: string;
  link: string;
  venue?: string;
  price?: string;
  category: 'event' | 'job' | 'training';
  region?: string;
  rating: number;
  review_text: string;
  is_featured: boolean;
}

export default function AdminAddEvent() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<EventData>({
    title: '',
    link: '',
    venue: '',
    price: '',
    category: 'event',
    region: 'Greater Accra',
    rating: 5,
    review_text: '',
    is_featured: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const res = await addManualEntry(formData);
    
    if (res.success) {
      alert("✅ Successfully added to Precede Database!");
      setFormData({ 
        ...formData, 
        title: '', 
        link: '', 
        venue: '', 
        price: '',
        review_text: '', 
        is_featured: false 
      });
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
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-[2.5rem] mt-10 mb-20 font-sans border border-slate-100">
      <div className="flex items-center gap-4 mb-8">
         <a href="/admin" className="p-2 bg-slate-100 rounded-full text-slate-600"><ArrowLeft size={20}/></a>
         <h1 className="text-2xl font-black uppercase italic text-slate-950 flex items-center gap-2">
           <Sparkles className="text-blue-600" size={24} /> Master Entry
         </h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Social Link (TikTok/IG)</label>
          <input 
            className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl outline-none transition-all font-medium text-slate-900" 
            placeholder="Paste URL here" 
            required
            value={formData.link}
            onChange={(e) => setFormData({...formData, link: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Display Title</label>
          <input 
            className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl outline-none transition-all font-bold text-slate-950" 
            placeholder="e.g. Afrobeat Night" 
            required
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Venue</label>
            <input 
              className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl outline-none" 
              placeholder="e.g. Bloom Bar"
              value={formData.venue}
              onChange={(e) => setFormData({...formData, venue: e.target.value})} 
            />
          </div>
          <div className="flex-1">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Price</label>
            <input 
              className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl outline-none font-bold" 
              placeholder="e.g. GHS 150"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})} 
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Region</label>
          <select 
            className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl outline-none appearance-none font-bold text-slate-700 cursor-pointer"
            value={formData.region}
            onChange={(e) => setFormData({...formData, region: e.target.value})}
          >
            {ghanaRegions.map(reg => (
              <option key={reg} value={reg}>{reg} Region</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Category</label>
          <select 
            className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl outline-none appearance-none font-bold text-slate-900 cursor-pointer" 
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value as any})}
          >
            <option value="event">🎉 Event</option>
            <option value="job">💼 Job</option>
            <option value="training">🎓 Training</option>
          </select>
        </div>

        <div className="p-5 bg-blue-50 rounded-[2rem] border border-blue-100">
          <div className="flex justify-between items-center mb-3">
             <label className="text-[10px] font-black uppercase tracking-widest text-blue-600">Precede Rating</label>
             <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full shadow-sm">
                <Star size={12} className="text-yellow-500 fill-yellow-500"/>
                <input 
                  type="number" min="1" max="5" 
                  className="w-8 text-center font-black outline-none bg-transparent"
                  value={formData.rating}
                  onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
                />
             </div>
          </div>
          <textarea 
            className="w-full p-4 bg-white rounded-xl text-sm border-none outline-none focus:ring-2 focus:ring-blue-400 shadow-inner min-h-[80px]" 
            placeholder="What's the vibe?..."
            value={formData.review_text}
            onChange={(e) => setFormData({...formData, review_text: e.target.value})}
          />
        </div>

        <div className="flex items-center justify-between p-5 bg-slate-900 rounded-[2rem] shadow-xl shadow-slate-200">
          <div>
            <span className="block font-black text-white text-[10px] uppercase tracking-widest mb-1">Feature this post</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase italic">Highlight on Homepage</span>
          </div>
          <input 
            type="checkbox" 
            className="w-6 h-6 accent-blue-500 cursor-pointer rounded" 
            checked={formData.is_featured}
            onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
          />
        </div>

        <button 
          disabled={loading}
          className="w-full bg-blue-600 text-white p-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-blue-200 active:scale-95 transition-all hover:bg-slate-950 mt-4 disabled:opacity-50"
        >
          {loading ? "Pushing Data..." : "🚀 Publish Live"}
        </button>
      </form>
    </div>
  );
}