"use client";
import { useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { 
  ArrowLeft, Plus, LayoutDashboard, CheckCircle2, Star,
  Briefcase, GraduationCap, PartyPopper, Map as MapIcon, Building2, Search
} from 'lucide-react';

export default function AdminAddEvent() {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSalaryDisclosed, setIsSalaryDisclosed] = useState(true);
  const [isFree, setIsFree] = useState(false); // New state for Free toggle

  const [formData, setFormData] = useState<any>({
    category: 'event', 
    sub_category: 'Conference',
    title: '',
    price: '',
    time_category: 'Morning',
    duration: '',
    venue: '',
    region: 'Greater Accra',
    salary_range: '',
    event_date: '',
    link: '',
    image_url: '',
    is_featured: false,
    organizer_body: '', 
    recurring_day: '',   
    map_query: '',
    status: 'queued', // Default to queue for admin review
    performance_grade: 5,
    performance_notes: '',
    parent_id: null // To track reposted history
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setShowSuccess(false);

    const finalData = { ...formData };
    
    // Handle undisclosed salary logic
    if (formData.category === 'job' && !isSalaryDisclosed) {
      finalData.salary_range = 'Undisclosed';
    }

    // Handle Free event/place logic
    if (formData.category !== 'job' && isFree) {
      finalData.price = 'Free';
    }

    const { error } = await supabase.from('jobs').insert([finalData]);

    if (!error) {
      setShowSuccess(true);
      // Reset form but keep category preference
      setFormData({
        ...formData,
        title: '', price: '', venue: '', event_date: '', 
        link: '', image_url: '', salary_range: '', 
        duration: '', organizer_body: '', recurring_day: '', map_query: '',
        is_featured: false,
        parent_id: null
      });
      setIsFree(false); // Reset Free toggle
      window.scrollTo(0, 0);
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    } else {
      alert("❌ Error: " + error.message);
    }
    setLoading(false);
  };

  const inputClass = "w-full p-4 bg-white border-2 border-slate-200 rounded-2xl font-bold text-slate-900 outline-none focus:border-[#0A2A5E] text-sm shadow-sm transition-all";
  const labelClass = "block text-[10px] font-black uppercase text-slate-500 mb-1.5 tracking-widest ml-1";

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 text-left font-sans">
      <div className="max-w-2xl mx-auto p-10 bg-white shadow-2xl rounded-[3rem] border border-slate-200">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <a href="/admin" className="p-3 bg-slate-50 rounded-full text-slate-400 hover:text-[#0A2A5E] shadow-sm transition-all">
            <ArrowLeft size={20}/>
          </a>
          <h1 className="text-2xl font-black uppercase italic text-[#0A2A5E] flex items-center gap-2 tracking-tighter">Publish Scout</h1>
          <div className="w-10 h-10" /> 
        </div>

        {showSuccess && (
          <div className="mb-8 p-4 bg-[#1FC8C8]/10 border-2 border-[#1FC8C8] rounded-2xl flex items-center justify-between animate-bounce">
            <div className="flex items-center gap-3 text-[#0A2A5E]">
              <CheckCircle2 size={20} className="text-[#1FC8C8]" />
              <span className="text-[10px] font-black uppercase tracking-widest">Sent to Queue Successfully!</span>
            </div>
            <a href="/admin" className="flex items-center gap-2 bg-[#0A2A5E] text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#1FC8C8] transition-all">
              <LayoutDashboard size={14} /> Dashboard
            </a>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* CATEGORY SWITCHER */}
          <div className="p-1.5 bg-slate-100 rounded-2xl flex gap-1 border border-slate-200">
            {[
              { id: 'event', label: 'Events', icon: <PartyPopper size={14}/> },
              { id: 'job', label: 'Jobs', icon: <Briefcase size={14}/> },
              { id: 'training', label: 'Training', icon: <GraduationCap size={14}/> },
              { id: 'place', label: 'Places', icon: <Search size={14}/> }
            ].map((cat) => (
              <button 
                key={cat.id} 
                type="button" 
                onClick={() => setFormData({...formData, category: cat.id, sub_category: cat.id === 'job' ? 'Full-time' : cat.id === 'place' ? 'Eatery' : 'Conference'})} 
                className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase transition-all flex items-center justify-center gap-2 ${formData.category === cat.id ? 'bg-[#0A2A5E] text-white shadow-lg' : 'text-slate-400'}`}
              >
                {cat.icon} {cat.id === 'place' ? 'Places' : cat.label}
              </button>
            ))}
          </div>

          {/* BASIC SCOUT DATA */}
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Main Title *</label>
              <input required className={inputClass} placeholder="e.g. Saturday Night Groove" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className={labelClass}>Organised by</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input className={`${inputClass} pl-12`} placeholder="e.g. AbrewaNana Pub" value={formData.organizer_body} onChange={(e) => setFormData({...formData, organizer_body: e.target.value})} />
                </div>
              </div>
              <div>
                {/* UPGRADED RECURRING FIELD: Now accepts flexible custom text */}
                <label className={labelClass}>Schedule / Recurrence</label>
                <input 
                  className={inputClass} 
                  placeholder="e.g. Mon-Sat, 9AM-5PM" 
                  value={formData.recurring_day} 
                  onChange={(e) => setFormData({...formData, recurring_day: e.target.value})} 
                />
              </div>
            </div>
          </div>

          {/* DYNAMIC CATEGORY FIELDS */}
          <div className="p-6 bg-slate-50 rounded-[2.5rem] space-y-4 border border-slate-100">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Type / Sub-Category</label>
                <select className={inputClass} value={formData.sub_category} onChange={(e) => setFormData({...formData, sub_category: e.target.value})}>
                  {formData.category === 'event' && ['Conference', 'Meetup', 'Party', 'Concert', 'Others'].map(o => <option key={o} value={o}>{o}</option>)}
                  {formData.category === 'job' && ['Full-time', 'Part-time', 'Remote', 'Contract', 'Internship'].map(o => <option key={o} value={o}>{o}</option>)}
                  {formData.category === 'training' && ['Seminar', 'Workshop', 'Webinar', 'Bootcamp'].map(o => <option key={o} value={o}>{o}</option>)}
                  {formData.category === 'place' && ['Eatery', 'Restaurant', 'School', 'Lounge', 'Store', 'Clinic'].map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Date / Deadline *</label>
                <input type="date" required className={inputClass} value={formData.event_date} onChange={(e) => setFormData({...formData, event_date: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Venue / Area Name</label>
                <input className={inputClass} placeholder="e.g. Darkuman" value={formData.venue} onChange={(e) => setFormData({...formData, venue: e.target.value})} />
              </div>
              <div>
                <label className={labelClass}>GPS / Map Search Query</label>
                <div className="relative">
                  <MapIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input className={`${inputClass} pl-12`} placeholder="Coordinates or Full Name" value={formData.map_query} onChange={(e) => setFormData({...formData, map_query: e.target.value})} />
                </div>
              </div>
            </div>

            {/* Pricing Section (Shows for all) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Time Category</label>
                <select className={inputClass} value={formData.time_category} onChange={(e) => setFormData({...formData, time_category: e.target.value})}>
                  {['Morning', 'Afternoon', 'Evening', 'Night', 'Full-day', 'All-night'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                 <div className="flex justify-between items-center mb-1.5 px-1">
                  <label className={labelClass}>{formData.category === 'job' ? 'Salary Range' : 'Entry Price'}</label>
                  
                  {/* Dynamic Toggle: Shows "Undisclosed" for Jobs, "Free" for everything else */}
                  {formData.category === 'job' ? (
                    <label className="flex items-center gap-1 text-[8px] font-black uppercase text-[#1FC8C8] cursor-pointer">
                      <input type="checkbox" checked={!isSalaryDisclosed} onChange={() => setIsSalaryDisclosed(!isSalaryDisclosed)} /> Undisclosed
                    </label>
                  ) : (
                    <label className="flex items-center gap-1 text-[8px] font-black uppercase text-[#1FC8C8] cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={isFree} 
                        onChange={() => {
                          setIsFree(!isFree);
                          if (!isFree) setFormData({...formData, price: 'Free'});
                          else setFormData({...formData, price: ''});
                        }} 
                      /> Free
                    </label>
                  )}
                </div>
                
                <input 
                  disabled={(formData.category === 'job' && !isSalaryDisclosed) || (formData.category !== 'job' && isFree)} 
                  className={`${inputClass} disabled:opacity-30 disabled:bg-slate-100 disabled:cursor-not-allowed`} 
                  placeholder={formData.category === 'job' ? "GHS..." : "Price or Free"} 
                  value={formData.category === 'job' ? formData.salary_range : formData.price} 
                  onChange={(e) => formData.category === 'job' ? setFormData({...formData, salary_range: e.target.value}) : setFormData({...formData, price: e.target.value})} 
                />
              </div>
            </div>
          </div>

          {/* MEDIA & PROMOTION */}
          <div className="space-y-4">
             <div 
                onClick={() => setFormData({...formData, is_featured: !formData.is_featured})}
                className={`p-5 rounded-3xl border-2 cursor-pointer transition-all flex items-center justify-between ${formData.is_featured ? 'bg-[#1FC8C8]/10 border-[#1FC8C8]' : 'bg-white border-slate-100 hover:border-slate-200'}`}
              >
                <div className="flex items-center gap-4 text-left leading-tight">
                   <div className={`p-3 rounded-xl ${formData.is_featured ? 'bg-[#1FC8C8] text-[#0A2A5E]' : 'bg-slate-100 text-slate-300'}`}>
                      <Star size={18} fill={formData.is_featured ? "currentColor" : "none"} />
                   </div>
                   <div>
                      <p className="text-[11px] font-black uppercase tracking-widest text-[#0A2A5E]">Promote to Our Picks</p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Will appear at the very top of the Hub</p>
                   </div>
                </div>
              </div>

             <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Flyer / Image URL</label>
                  <input className={inputClass} placeholder="https://..." value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})} />
                </div>
                <div>
                  <label className={labelClass}>Action Link (External)</label>
                  <input className={inputClass} placeholder="https://..." value={formData.link} onChange={(e) => setFormData({...formData, link: e.target.value})} />
                </div>
             </div>
          </div>

          <button disabled={loading} className="w-full bg-[#0A2A5E] text-white p-6 rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] shadow-2xl hover:bg-[#1FC8C8] hover:text-[#0A2A5E] transition-all disabled:opacity-50 mt-4 flex items-center justify-center gap-3">
            {loading ? "UPLOADING TO QUEUE..." : <><Plus size={18} /> Publish Scout</>}
          </button>

        </form>
      </div>
    </div>
  );
}