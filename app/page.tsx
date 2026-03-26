'use client'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { 
  Briefcase, Calendar, MapPin, ArrowUpRight, Globe, PlayCircle, Lightbulb, 
  MessageSquare, Users, Code2, Palette, Database, ChevronRight, Star, Clock, Megaphone,
  Send, CircleDollarSign, ShieldCheck
} from 'lucide-react'

export default function Home() {
  const [items, setItems] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true); fetchApproved(); }, [])

  async function fetchApproved() {
    const { data } = await supabase.from('jobs').select('*').eq('status', 'approved').order('is_featured', { ascending: false }).order('created_at', { ascending: false })
    if (data) setItems(data)
  }

  const services = [
    { id: 'digital', title: 'Digital Solutions', icon: <Code2/>, desc: 'Professional Web Development, Backend Architecture & API Design.' },
    { id: 'graphic', title: 'Graphic Design', icon: <Palette/>, desc: 'Strategic Branding, Logo Design & High-End UI/UX Assets.' },
    { id: 'outsource', title: 'Outsourcing', icon: <Users/>, desc: 'Expert Tech, Administrative & Multimedia Support for Growing Agencies.' },
    { id: 'marketing', title: 'Digital Marketing', icon: <Megaphone/>, desc: 'Growth Strategy, SEO Optimization & Targeted Social Campaigns.' },
    { id: 'admin', title: 'Administrative', icon: <Database/>, desc: 'Secretarial Duties, Data Management & Business Operations.' },
    { id: 'media', title: 'Media Production', icon: <PlayCircle/>, desc: 'High-Quality Content Creation, Video Editing & Multimedia Planning.' },
  ]

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-slate-950 scroll-smooth">
      
      {/* 🧭 NAVIGATION (Admin hidden) */}
      <nav className="sticky top-0 w-full z-[100] bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex flex-col text-left">
            <span className="text-2xl font-black tracking-tighter uppercase italic leading-none">Precede Concepts</span>
            <span className="text-[8px] font-bold text-blue-600 tracking-[0.4em] uppercase mt-1">Strategic Operations Hub</span>
          </div>

          <div className="hidden lg:flex items-center gap-10 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
            <a href="#about" className="hover:text-blue-600 transition-colors">About Us</a>
            <a href="#services" className="hover:text-blue-600 transition-colors">Services</a>
            <a href="#opportunities" className="hover:text-blue-600 transition-colors">Opportunities</a>
            <a href="#contact" className="bg-slate-950 text-white px-8 py-4 rounded-full hover:bg-blue-600 transition-all shadow-lg shadow-slate-200">Contact Us</a>
          </div>
        </div>
      </nav>

      {/* 🚀 HERO */}
      <header id="about" className="py-32 md:py-48 px-6 text-center bg-white relative scroll-mt-20">
        <div className="relative z-10">
          <h1 className="text-7xl md:text-[11rem] font-black tracking-tighter uppercase italic leading-[0.8] mb-10">
            The <span className="text-blue-600">Standard</span> <br/> of execution.
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto font-bold text-xs md:text-sm uppercase tracking-[0.3em] leading-loose italic">
            Precision in planning, research, and technical development. <br/>Your strategic outsourcing partner in Ghana.
          </p>
        </div>
      </header>

      {/* 🏛️ SERVICES SECTION */}
      <section id="services" className="py-32 px-6 max-w-7xl mx-auto scroll-mt-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-4 text-left">
          <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none">Core <br/> Solutions.</h2>
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] border-l-4 border-blue-600 pl-4 py-2">Leveraging Global Expertise Locally</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {services.map((s) => (
            <div key={s.id} className="p-10 bg-white border border-slate-100 rounded-[3rem] hover:shadow-2xl transition-all group">
              <div className="w-14 h-14 bg-slate-50 text-slate-900 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all">
                {s.icon}
              </div>
              <h3 className="text-2xl font-black uppercase italic mb-3 tracking-tight">{s.title}</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ⚡ OPPORTUNITY HUB (CSR Section) */}
      <section id="opportunities" className="py-32 bg-slate-950 px-6 scroll-mt-24 rounded-t-[5rem] md:rounded-t-[10rem]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-black uppercase italic text-blue-500 mb-4 tracking-tighter">The Opportunity Hub</h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.5em]">CSR Initiative &middot; Curated for Growth</p>
          </div>
          
          <div className="space-y-6">
             {items.map((item) => (
               <div key={item.id} className="bg-white/5 border border-white/10 p-5 rounded-[2.5rem] flex flex-col md:flex-row gap-6 items-center group hover:bg-white/10 transition-all">
                  <div className="w-24 h-24 bg-slate-800 rounded-3xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {item.image_url ? <img src={item.image_url} className="w-full h-full object-cover" alt="" /> : <span className="text-[9px] font-black text-slate-600 uppercase italic">Precede</span>}
                  </div>
                  <div className="flex-1 text-center md:text-left">
                     <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-2">
                        <span className="text-[8px] font-black bg-blue-600 text-white px-3 py-1 rounded-full uppercase tracking-widest">{item.category}</span>
                        <span className="text-[8px] font-black bg-white/10 text-slate-400 px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
                           <Clock size={10}/> {item.time_category || item.job_type || 'Active'}
                        </span>
                     </div>
                     <h4 className="font-bold text-lg text-white mb-2 leading-tight">{item.title}</h4>
                     <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                       <span className="flex items-center gap-1.5"><MapPin size={12} className="text-blue-500"/> {item.region}</span>
                       <span className="flex items-center gap-1.5"><CircleDollarSign size={12} className="text-emerald-500"/> {item.price || item.salary_range || 'Free'}</span>
                     </div>
                  </div>
                  <a href={item.link} target="_blank" className="p-4 bg-white/10 rounded-full text-white group-hover:bg-blue-600 transition-all"><ArrowUpRight size={20}/></a>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 💬 CONTACT & SOCIAL */}
      <section id="contact" className="py-32 px-6 text-center max-w-5xl mx-auto scroll-mt-24">
        <h2 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter mb-12 leading-none">Let's Connect.</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          <a href="#" className="flex items-center justify-center gap-4 p-8 bg-slate-900 text-white rounded-[3rem] font-black uppercase text-xs tracking-[0.4em] hover:bg-blue-600 transition-all shadow-xl">
            <Send size={20}/> Telegram Channel
          </a>
          <a href="#" className="flex items-center justify-center gap-4 p-8 bg-emerald-500 text-white rounded-[3rem] font-black uppercase text-xs tracking-[0.4em] hover:bg-slate-950 transition-all shadow-xl">
            <MessageSquare size={20}/> WhatsApp Hub
          </a>
        </div>
        <footer className="pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
           <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.6em]">Precede Concepts &middot; Accra Ghana &middot; 2026</span>
        </footer>
      </section>

    </div>
  )
}