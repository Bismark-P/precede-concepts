"use client";
import { useState } from 'react';
import { addManualEntry } from '@/app/lib/collector';

// Match this exactly to your collector.ts requirements
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
    
    // Calls the logic in app/lib/collector.ts
    const res = await addManualEntry(formData);
    
    if (res.success) {
      alert("🚀 Precede Engine: Post is Live!");
      // Reset form
      setFormData({ 
        ...formData, 
        title: '', 
        link: '', 
        venue: '', 
        review_text: '', 
        is_featured: false 
      });
      window.scrollTo(0, 0);
    } else {
      alert("❌ Error: " + res.error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl mt-10 mb-20 font-sans">
      <h1 className="text-2xl font-bold mb-2 text-gray-800">Precede Master Entry</h1>
      <p className="text-sm text-gray-500 mb-6">Add events, jobs, or training from your phone.</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Source Link</label>
          <input 
            className="w-full p-3 border rounded-lg bg-gray-50" 
            placeholder="Paste TikTok/IG/FB Link" 
            required
            value={formData.link}
            onChange={(e) => setFormData({...formData, link: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Display Title</label>
          <input 
            className="w-full p-3 border rounded-lg" 
            placeholder="e.g. Easter Holiday Bash" 
            required
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
        </div>

        <div className="flex gap-2">
          <div className="w-1/2">
            <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Venue</label>
            <input className="w-full p-3 border rounded-lg" value={formData.venue} onChange={(e) => setFormData({...formData, venue: e.target.value})} />
          </div>
          <div className="w-1/2">
            <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Price</label>
            <input className="w-full p-3 border rounded-lg" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Category</label>
          <select 
            className="w-full p-3 border rounded-lg bg-white" 
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value as any})}
          >
            <option value="event">🎉 Event</option>
            <option value="job">💼 Job</option>
            <option value="training">🎓 Training</option>
          </select>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <label className="block text-sm font-bold text-blue-800 mb-2">Review & Rating</label>
          <input 
            type="number" min="1" max="5" 
            className="w-full p-2 border rounded-lg mb-2" 
            value={formData.rating}
            onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
          />
          <textarea 
            className="w-full p-2 border rounded-lg text-sm" 
            placeholder="Short vibe check or notes..."
            value={formData.review_text}
            onChange={(e) => setFormData({...formData, review_text: e.target.value})}
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div>
            <span className="block font-bold text-yellow-800">Feature Post</span>
            <span className="text-xs text-yellow-700">Show at the top of the site</span>
          </div>
          <input 
            type="checkbox" 
            className="w-6 h-6 accent-yellow-600" 
            checked={formData.is_featured}
            onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
          />
        </div>

        <button 
          disabled={loading}
          className="w-full bg-blue-600 text-white p-4 rounded-lg font-bold shadow-md active:scale-95 transition"
        >
          {loading ? "Syncing with Supabase..." : "🚀 Publish Live"}
        </button>
      </form>
    </div>
  );
}