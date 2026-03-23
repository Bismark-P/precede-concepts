'use client'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { 
  Briefcase, Calendar, MapPin, ArrowUpRight, ShieldCheck, 
  Zap, Search, Users, Globe, PlayCircle, Lightbulb, Star 
} from 'lucide-react'

export default function Home() {
  const [items, setItems] = useState<any[]>([])
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

  if (!mounted) return null

  const jobs = items.filter(i => i.category !== 'event')
  const events = items.filter(i => i.category === 'event')

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-slate-950 scroll-smooth">
      
      {/* MOBILE-FRIENDLY NAV */}
      <nav className="sticky top-0 w-full z-[100] bg-white/60 backdrop-blur-xl border-b border-slate-200/40 px-4 md:px-6 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex flex-col text-left">
            <span className="text-lg md:text-xl font-black tracking-tighter uppercase italic leading-none">Precede Concepts</span>
            <span className="text-[7px] font-bold text-blue-600 tracking-[0.3em] uppercase mt-1">Strategic Hub</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <a href="#" className="hover:text-blue-600 transition-colors">Home</a>
            <a href="#services" className="hover:text-blue-600 transition-colors">Services</a>
            <a href="#about" className="hover:text-blue-600 transition-colors">About</a>
            <a href="#opportunities" className="hover:text-blue-600 transition-colors">Opportunities</a>
            <a href="/contact" className="bg-slate-900 text-white px-5 py-2 rounded-full hover:bg-blue-600 transition-all text-[9px] tracking-widest uppercase">Contact</a>
          </div>
          
          <a href="/contact" className="md:hidden bg-slate-900 text-white px-4 py-2 rounded-full text-[9px] font-black uppercase">Contact</a>
        </div>
      </nav>

      {/* TRENDY HERO */}
      <header className="py-20 md:py-40 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)] opacity-40"></div>
        <div className="relative z-10">
          <h1 className="text-5xl md:text-[9rem] font-black tracking-tighter uppercase italic leading-[0.9] mb-8">
            The <span className="text-blue-600">Standard</span> <br/> of execution.
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto font-bold text-[10px] md:text-sm uppercase tracking-widest leading-loose italic">
            Excellence through constant learning, planning, and research. <br/>Your strategic partner for Ghana’s digital landscape.
          </p>
        </div>
      </header>

      {/* 6-PILLAR BENTO GRID */}
      <section id="services" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
          {[
            { title: 'Digital Solutions', icon: <Globe size={18}/>, items: ['Web & Backend Dev', 'Branding', 'API Design'] },
            { title: 'Media Production', icon: <PlayCircle size={18}/>, items: ['Church Media', 'Content Creation', 'Digital Assets'] },
            { title: 'Training & Events', icon: <Calendar size={18}/>, items: ['Hospitality Training', 'Event Scouting', 'Seminars'] },
            { title: 'Opportunities', icon: <Briefcase size={18}/>, items: ['Verified Job Feed', 'Internships', 'Skill Acquisition'] },
            { title: 'Business Support', icon: <Users size={18}/>, items: ['Secretarial Services', 'Printing', 'Outsourcing'] },
            { title: 'Strategy & More', icon: <Lightbulb size={18}/>, items: ['Operations Planning', 'Trend Research', 'Consulting'], dark: true },
          ].map((s, i) => (
            <div key={i} className={`${s.dark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900 border border-slate-200'} p-8 rounded-[2.5rem] h-[360px] flex flex-col justify-between group hover:shadow-2xl transition-all`}>
              <div>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-5 ${s.dark ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-900 group-hover:bg-blue-600 group-hover:text-white transition-colors'}`}>
                  {s.icon}
                </div>
                <h3 className="text-lg font-black uppercase italic mb-2 tracking-tight">{s.title}</h3>
                <ul className={`text-[10px] font-bold uppercase tracking-widest space-y-2 ${s.dark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {s.items.map(item => <li key={item}>• {item}</li>)}
                </ul>
              </div>
              <button className={`flex items-center justify-between w-full p-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${s.dark ? 'bg-white/10 hover:bg-white hover:text-slate-950' : 'bg-slate-50 hover:bg-blue-600 hover:text-white'}`}>
                Explore Pillar <ArrowUpRight size={14}/>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* DYNAMIC FEEDS */}
      <section id="opportunities" className="py-24 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 border-t border-slate-100 text-left">
        <div>
          <h2 className="text-xl font-black uppercase italic text-blue-900 mb-8 border-b-2 border-blue-900 pb-2 inline-block tracking-tighter">Opportunities</h2>
          <div className="space-y-3">
            {jobs.map(job => (
              <div key={job.id} className={`p-5 rounded-2xl flex justify-between items-center border ${job.is_featured ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-slate-100'}`}>
                <div className="flex flex-col text-left">
                  {job.is_featured && <span className="text-[8px] font-black text-blue-600 uppercase mb-1 flex items-center gap-1"><Star size={8} fill="currentColor"/> Recommended</span>}
                  <h4 className="font-bold text-sm text-slate-700 leading-tight">{job.title}</h4>
                </div>
                <a href={job.link} target="_blank" className="text-blue-600"><ArrowUpRight size={16}/></a>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-black uppercase italic text-orange-600 mb-8 border-b-2 border-orange-600 pb-2 inline-block tracking-tighter">Events</h2>
          <div className="space-y-3">
            {events.map(event => (
              <div key={event.id} className={`p-5 rounded-2xl flex justify-between items-center border ${event.is_featured ? 'bg-orange-50 border-orange-200 shadow-sm' : 'bg-white border-slate-100'}`}>
                <div className="flex flex-col text-left">
                  {event.is_featured && <span className="text-[8px] font-black text-orange-600 uppercase mb-1 flex items-center gap-1"><Star size={8} fill="currentColor"/> Our Pick</span>}
                  <h4 className="font-bold text-sm text-slate-900 leading-tight">{event.title}</h4>
                </div>
                <a href={event.link} target="_blank" className="text-orange-600 uppercase text-[10px] font-black">Details</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-10 text-center text-slate-300 text-[9px] font-black uppercase tracking-[0.6em]">
        Precede Concepts &middot; Accra Ghana &middot; 2026
      </footer>
    </div>
  )
}