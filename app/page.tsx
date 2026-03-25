'use client'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { 
  Briefcase, Calendar, MapPin, ArrowUpRight, 
  Clock, Sparkles, Star, Globe, PlayCircle, 
  Lightbulb, Sun, SunMedium, Sunset, Moon, GraduationCap, 
  ChevronRight, CircleDollarSign, Users, Search 
} from 'lucide-react'

export default function Home() {
  const [items, setItems] = useState<any[]>([])
  const [activeFilter, setActiveFilter] = useState('all')
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true); fetchApproved(); }, [])

  async function fetchApproved() {
    const { data } = await supabase.from('jobs')
      .select('*')
      .eq('status', 'approved')
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
    if (data) setItems(data)
  }

  const filteredItems = items.filter(item => {
    if (activeFilter === 'all') return true;
    const filter = activeFilter.toLowerCase();
    const category = (item.category || "").toLowerCase();
    const timeCat = (item.time_category || "").toLowerCase();
    return category === filter || timeCat === filter;
  });

  const filters = [
    { id: 'all', label: 'All', icon: null },
    { id: 'Morning', label: 'Morning', icon: <Sun size={12}/> },
    { id: 'Afternoon', label: 'Afternoon', icon: <SunMedium size={12}/> },
    { id: 'Evening', label: 'Evening', icon: <Sunset size={12}/> },
    { id: 'Night', label: 'Night', icon: <Moon size={12}/> },
    { id: 'job', label: 'Jobs', icon: <Briefcase size={12}/> },
    { id: 'event', label: 'Events', icon: <Sparkles size={12}/> },
    { id: 'training', label: 'Training', icon: <GraduationCap size={12}/> },
  ]

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-slate-950">
      <nav className="sticky top-0 w-full z-[100] bg-white/70 backdrop-blur-xl border-b border-slate-200/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex flex-col text-left">
            <span className="text-xl font-black tracking-tighter uppercase italic leading-none text-slate-900">Precede Hub</span>
            <span className="text-[7px] font-bold text-blue-600 tracking-[0.3em] uppercase mt-1">Strategic Discovery</span>
          </div>
          <a href="/admin" className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-all"><Users size={16}/></a>
        </div>
      </nav>

      <header className="pt-20 pb-12 px-6 text-center bg-white border-b border-slate-100">
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.85] mb-6">
          The <span className="text-blue-600">Standard</span> <br/> of Ghana.
        </h1>
        <p className="text-slate-400 max-w-lg mx-auto font-bold text-[10px] uppercase tracking-[0.2em] leading-loose italic">
          Curated opportunities and verified nightlife.
        </p>
      </header>

      <div className="sticky top-[73px] z-[90] bg-white/80 backdrop-blur-md border-b border-slate-100 py-4 mb-8 overflow-hidden">
        <div className="flex gap-2 overflow-x-auto px-6 no-scrollbar">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeFilter === f.id ? 'bg-slate-900 text-white shadow-xl' : 'bg-white border border-slate-200 text-slate-500'
              }`}
            >
              {f.icon} {f.label}
            </button>
          ))}
        </div>
      </div>

      <section className="px-6 max-w-2xl mx-auto pb-32">
        <div className="space-y-4">
          {filteredItems.length > 0 ? filteredItems.map((item) => (
            <div key={item.id} className={`flex gap-4 p-4 bg-white rounded-[2rem] border transition-all hover:shadow-xl group relative ${item.is_featured ? 'border-blue-100 shadow-md' : 'border-slate-100'}`}>
              <div className="w-24 h-24 md:w-28 md:h-28 flex-shrink-0 bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center relative">
                {item.image_url ? (
                  <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-2 opacity-40">
                    <span className="text-white font-black italic text-[9px] uppercase block">Precede</span>
                    <span className="text-blue-500 text-[7px] font-bold uppercase">Concepts</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-between flex-1 py-1 text-left overflow-hidden">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest bg-slate-100 text-slate-600">
                      {item.category}
                    </span>
                    <span className="text-[8px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-1">
                      <Clock size={8}/> {item.time_category}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm md:text-base leading-tight pr-6 line-clamp-2">
                    {item.title}
                  </h3>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <MapPin size={10} className="text-blue-500"/>
                    <span className="text-[10px] font-bold truncate">{item.venue || 'TBA'} • {item.region}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-900">
                    <CircleDollarSign size={10} className="text-emerald-500"/>
                    <span className="text-[10px] font-black tracking-tighter">{item.price || 'Contact'}</span>
                  </div>
                </div>
              </div>
              <a href={item.link || '#'} target={item.link ? "_blank" : "_self"} className="absolute top-4 right-4 p-2 bg-slate-50 rounded-full text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <ChevronRight size={14}/>
              </a>
            </div>
          )) : (
            <div className="text-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-100">
               <Search className="mx-auto text-slate-200 mb-4" size={48} />
               <p className="text-slate-300 font-black uppercase text-[10px]">No scouts found.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}