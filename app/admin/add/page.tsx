"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  ArrowLeft, Plus, LayoutDashboard, CheckCircle2, Star,
  Briefcase, GraduationCap, PartyPopper, Map as MapIcon, Building2, Search, ShieldCheck,
  Globe, UploadCloud, X
} from 'lucide-react';

export default function AdminAddEvent() {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSalaryDisclosed, setIsSalaryDisclosed] = useState(true);
  const [isFree, setIsFree] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [userRole, setUserRole] = useState<'super_admin' | 'staff'>('staff');
  const [publishDirectly, setPublishDirectly] = useState(false); 

  const [formData, setFormData] = useState<any>({
    category: 'event', 
    sub_category: 'Conference',
    title: '',
    description: '',
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
    is_official: false,
    organizer_body: '', 
    recurring_day: '',   
    map_query: '',
    status: 'queued', 
    performance_grade: 5,
    performance_notes: '',
    parent_id: null 
  });

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const userEmail = session.user.email;
          const userRole = session.user.user_metadata?.role;

          // 🛡️ THE FAIL-SAFE: Hardcode your exact admin emails here
          const adminEmails = [
            'precedeconcepts@gmail.com', // Change this to your exact login email
          ];

          if (adminEmails.includes(userEmail || '') || userRole === 'super_admin') {
            setUserRole('super_admin');
          } else {
            setUserRole('staff');
          }
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      }
    };

    checkAdminAccess();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setShowSuccess(false);

    let finalImageUrl = formData.image_url;

    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('flyers') 
        .upload(filePath, imageFile);

      if (uploadError) {
        alert("❌ Error uploading image: " + uploadError.message + " (Check your Supabase Storage Policies!)");
        setLoading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('flyers')
        .getPublicUrl(filePath);

      finalImageUrl = publicUrlData.publicUrl;
    }

    const finalData = { ...formData, image_url: finalImageUrl };
    
    if (userRole === 'super_admin' && publishDirectly) {
      finalData.status = 'approved';
    } else {
      finalData.status = 'queued';
    }
    
    if (formData.category === 'job' && !isSalaryDisclosed) {
      finalData.salary_range = 'Undisclosed';
    }
    if (formData.category !== 'job' && isFree) {
      finalData.price = 'Free';
    }

    const { error } = await supabase.from('jobs').insert([finalData]);

    if (!error) {
      setShowSuccess(true);
      setFormData({
        ...formData,
        title: '', description: '', price: '', venue: '', event_date: '', 
        link: '', image_url: '', salary_range: '', 
        duration: '', organizer_body: '', recurring_day: '', map_query: '',
        is_featured: false, is_official: false,
        parent_id: null
      });
      setImageFile(null);
      setImagePreview(null);
      setIsFree(false);
      setPublishDirectly(false);
      window.scrollTo(0, 0);
      
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
              <span className="text-[10px] font-black uppercase tracking-widest">
                {publishDirectly ? 'Published directly to Live Hub!' : 'Sent to Queue Successfully!'}
              </span>
            </div>
            <a href="/admin" className="flex items-center gap-2 bg-[#0A2A5E] text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#1FC8C8] transition-all">
              <LayoutDashboard size={14} /> Dashboard
            </a>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
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

          <div className="space-y-4">
            <div>
              <label className={labelClass}>Main Title *</label>
              <input required className={inputClass} placeholder="e.g. Saturday Night Groove" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
            </div>

            <div>
              <label className={labelClass}>Description / Notes</label>
              <textarea 
                className={`${inputClass} min-h-[120px] resize-none`} 
                placeholder="Add specific details, requirements, or a short summary about this post..." 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                <div className="flex justify-between items-center mb-1.5 pr-1">
                  <label className={`${labelClass} mb-0`}>Organised by</label>
                  <button 
                    type="button" 
                    onClick={() => setFormData({...formData, organizer_body: 'Precede Concepts'})}
                    className="text-[8px] font-black uppercase text-[#1FC8C8] hover:text-[#0A2A5E] transition-colors"
                  >
                    + Use Precede
                  </button>
                </div>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input className={`${inputClass} pl-12`} placeholder="e.g. AbrewaNana Pub" value={formData.organizer_body} onChange={(e) => setFormData({...formData, organizer_body: e.target.value})} />
                </div>
              </div>
              <div>
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Time Category</label>
                <select className={inputClass} value={formData.time_category} onChange={(e) => setFormData({...formData, time_category: e.target.value})}>
                  {['Morning', 'Afternoon', 'Evening', 'Night', 'Full-day', 'All-night', 'Varying Times'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                 <div className="flex justify-between items-center mb-1.5 px-1">
                  <label className={labelClass}>{formData.category === 'job' ? 'Salary Range' : 'Entry Price'}</label>
                  
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

          <div className="grid grid-cols-1 gap-4">
             <div>
                <label className={labelClass}>Flyer / Image Upload</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-slate-300 rounded-2xl hover:border-[#1FC8C8] transition-colors relative bg-white">
                  <div className="space-y-1 text-center">
                    {imagePreview ? (
                      <div className="relative inline-block">
                        <img src={imagePreview} alt="Preview" className="mx-auto h-32 object-contain rounded-lg shadow-md" />
                        <button 
                          type="button" 
                          onClick={() => { setImageFile(null); setImagePreview(null); }} 
                          className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 transition-colors"
                        >
                          <X size={14}/>
                        </button>
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="mx-auto h-10 w-10 text-slate-300 mb-2" />
                        <div className="flex text-sm text-slate-600 justify-center">
                          <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-black text-[#1FC8C8] hover:text-[#0A2A5E] focus-within:outline-none uppercase text-[11px] tracking-widest transition-colors">
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
                          </label>
                          <p className="pl-1 text-[11px] uppercase font-bold text-slate-400 mt-0.5">or drag and drop</p>
                        </div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-2">PNG, JPG, GIF up to 5MB</p>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-px bg-slate-200 flex-1"></div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">OR USE URL LINK</span>
                  <div className="h-px bg-slate-200 flex-1"></div>
                </div>
                <input 
                  className={`${inputClass} mt-4 disabled:opacity-50`} 
                  placeholder="https://..." 
                  value={formData.image_url} 
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})} 
                  disabled={!!imageFile} 
                />
             </div>

             <div>
               <label className={labelClass}>Action Link (External Registration/Tickets)</label>
               <input className={inputClass} placeholder="https://..." value={formData.link} onChange={(e) => setFormData({...formData, link: e.target.value})} />
             </div>
          </div>

          <div className="p-6 bg-slate-50 border border-slate-200 rounded-[2rem]">
            <label className={`${labelClass} mb-4 text-[#0A2A5E]`}>Hub Placement (Hides from General feed if Featured/Official)</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button 
                type="button"
                onClick={() => setFormData({...formData, is_featured: false, is_official: false})}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${!formData.is_featured && !formData.is_official ? 'bg-[#0A2A5E] border-[#0A2A5E] text-white shadow-xl' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
              >
                <Globe size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest text-center">Standard<br/>(All Posts)</span>
              </button>
              
              <button 
                type="button"
                onClick={() => setFormData({...formData, is_featured: true, is_official: false})}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${formData.is_featured ? 'bg-[#1FC8C8] border-[#1FC8C8] text-[#0A2A5E] shadow-xl' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
              >
                <Star size={20} fill={formData.is_featured ? "currentColor" : "none"} />
                <span className="text-[10px] font-black uppercase tracking-widest text-center">Featured Pick<br/>(Premium)</span>
              </button>

              <button 
                type="button"
                onClick={() => setFormData({...formData, is_featured: false, is_official: true})}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${formData.is_official ? 'bg-[#0A2A5E] border-[#0A2A5E] text-[#1FC8C8] shadow-xl' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
              >
                <ShieldCheck size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest text-center">Initiative<br/>(Official)</span>
              </button>
            </div>
          </div>

          {userRole === 'super_admin' && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase text-orange-600 tracking-widest">Super Admin Bypass</p>
                <p className="text-[8px] font-bold text-orange-400 uppercase tracking-tighter mt-0.5">Toggle ON to push this immediately to the public site without queueing.</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" className="hidden" checked={publishDirectly} onChange={() => setPublishDirectly(!publishDirectly)} />
                <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${publishDirectly ? 'bg-orange-500' : 'bg-slate-300'}`}>
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${publishDirectly ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </div>
              </label>
            </div>
          )}

          <button disabled={loading} className={`w-full text-white p-6 rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] shadow-2xl transition-all disabled:opacity-50 mt-4 flex items-center justify-center gap-3 ${publishDirectly ? 'bg-orange-500 hover:bg-orange-600' : 'bg-[#0A2A5E] hover:bg-[#1FC8C8] hover:text-[#0A2A5E]'}`}>
            {loading ? "PROCESSING..." : <><Plus size={18} /> {publishDirectly ? 'Publish Directly to Live Hub' : 'Send to Pending Queue'}</>}
          </button>

        </form>
      </div>
    </div>
  );
}