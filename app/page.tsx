'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from './lib/supabase'
import { 
  Briefcase, Calendar, MapPin, ArrowUpRight, Globe, PlayCircle, Lightbulb, 
  MessageSquare, Users, Code2, Palette, Database, ChevronRight, Star, Clock, Megaphone,
  Send, CircleDollarSign, Printer, Smartphone, CheckCircle2, Instagram, Phone, Mail, Menu, X
} from 'lucide-react'

export default function Home() {
  const [items, setItems] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [filter, setFilter] = useState('all')

  useEffect(() => { setMounted(true); fetchApproved(); }, [])

  async function fetchApproved() {
    const { data } = await supabase.from('jobs').select('*').eq('status', 'approved').order('is_featured', { ascending: false })
    if (data) setItems(data)
  }

  const filteredItems = filter === 'all' 
    ? items 
    : items.filter(i => i.category.toLowerCase() === filter.toLowerCase() || (filter === 'training' && i.category === 'seminar'))

  const services = [
    { 
        title: 'Administrative & Secretarial', 
        icon: <Printer size={20}/>, 
        desc: 'Professional printing, photocopying, document binding, and office support.',
        accent: '#1FC8C8'
    },
    { 
        title: 'Graphic Design', 
        icon: <Palette size={20}/>, 
        desc: 'Strategic Branding, Logo Design & Visual Identity.',
        accent: '#1FC8C8'
    },
    { 
        title: 'Digital Solutions', 
        icon: <Code2 size={20}/>, 
        desc: 'Web Development, Backend & API Design.',
        accent: '#1FC8C8'
    },
    { 
        title: 'Digital Marketing', 
        icon: <Megaphone size={20}/>, 
        desc: 'SEO, Strategy & Social Campaigns.',
        accent: '#1FC8C8'
    },
    { 
        title: 'Agency Outsourcing', 
        icon: <Users size={20}/>, 
        desc: 'White-label Tech & Admin Support.',
        accent: '#1FC8C8'
    },
  ]

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-white font-sans text-slate-950 scroll-smooth overflow-x-hidden">
      
      {/* 🧭 NAVIGATION */}
      <nav className="fixed top-0 w-full z-[100] bg-[#0A2A5E] border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex flex-col text-left">
            <span className="text-xl font-black tracking-tighter uppercase italic text-white leading-none">Precede Concepts</span>
            <span className="text-[7px] font-bold text-[#1FC8C8] tracking-[0.4em] uppercase mt-1">Standard of Execution</span>
          </div>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center gap-8 text-[9px] font-black uppercase tracking-[0.2em] text-white/70">
            <a href="#home" className="hover:text-[#1FC8C8]">Home</a>
            <a href="#about" className="hover:text-[#1FC8C8]">About Us</a>
            <a href="#training" className="hover:text-[#1FC8C8]">Training</a>
            <a href="#jobs" className="hover:text-[#1FC8C8]">Jobs</a>
            <a href="#events" className="hover:text-[#1FC8C8]">Events</a>
            <a href="#contact" className="bg-[#1FC8C8] text-[#0A2A5E] px-6 py-3 rounded-full font-black">Contact Us</a>
          </div>

          {/* MOBILE TOGGLE */}
          <button className="lg:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="lg:hidden bg-[#0A2A5E] border-t border-white/10 mt-4 py-6 flex flex-col gap-6 text-[10px] font-black uppercase tracking-widest text-white">
              <a href="#home" onClick={() => setIsMenuOpen(false)}>Home</a>
              <a href="#about" onClick={() => setIsMenuOpen(false)}>About Us</a>
              <a href="#training" onClick={() => setIsMenuOpen(false)}>Training</a>
              <a href="#jobs" onClick={() => setIsMenuOpen(false)}>Jobs</a>
              <a href="#events" onClick={() => setIsMenuOpen(false)}>Events</a>
              <a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 🚀 HERO SECTION (Deep Blue) */}
      <header id="home" className="pt-48 pb-24 px-6 text-center bg-[#0A2A5E] text-white relative">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
          <span className="text-[10px] font-black text-[#1FC8C8] uppercase tracking-[0.5em] mb-6 block italic">Simplifying progress, delivering value.</span>
          <h1 className="text-5xl md:text-9xl font-black tracking-tighter uppercase italic leading-[0.9] mb-8">
            The Standard <br/> of execution.
          </h1>
          <p className="text-white/60 max-w-xl mx-auto font-bold text-xs uppercase tracking-[0.2em] italic">
            Progress Simplified — Value Delivered
          </p>
        </motion.div>
      </header>

      {/* 🏛️ SERVICES SECTION (White) */}
      <section id="services" className="py-20 px-6 max-w-7xl mx-auto scroll-mt-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4 text-left">
          <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-[#0A2A5E]">Agency <br/> Services.</h2>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">Core Business Solutions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {services.map((s, i) => (
            <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:border-[#0F4C81] transition-all text-left">
              <div className="text-[#0F4C81] mb-4">{s.icon}</div>
              <h3 className="text-sm font-black uppercase italic mb-2 leading-tight">{s.title}</h3>
              <p className="text-[9px] font-bold text-slate-400 uppercase leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ⚡ OPPORTUNITY HUB (Mid Blue) */}
      <section id="training" className="py-20 bg-[#0F4C81] px-6 scroll-mt-20">
        <div id="jobs" className="scroll-mt-32"></div>
        <div id="events" className="scroll-mt-32"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <h2 className="text-3xl font-black uppercase italic text-white tracking-tighter">Opportunity Hub</h2>
            
            {/* HUB FILTERS */}
            <div className="flex flex-wrap justify-center gap-2">
              {['all', 'job', 'event', 'training'].map((f) => (
                <button 
                  key={f} 
                  onClick={() => setFilter(f)}
                  className={`px-6 py-2 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-[#1FC8C8] text-[#0A2A5E]' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                  {f}s
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             {filteredItems.map((item) => (
               <div key={item.id} className="bg-white rounded-[2rem] overflow-hidden flex flex-col group border border-white/10 shadow-xl transition-all hover:-translate-y-1">
                  <div className="h-40 bg-slate-900 overflow-hidden relative">
                    {item.image_url ? <img src={item.image_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-black italic text-slate-700 uppercase">Precede</div>}
                    <span className="absolute top-4 left-4 text-[7px] font-black bg-[#1FC8C8] text-[#0A2A5E] px-2 py-1 rounded-full uppercase">{item.category}</span>
                  </div>
                  <div className="p-5 text-left flex flex-col justify-between flex-1">
                     <h4 className="font-black text-sm text-slate-900 mb-3 line-clamp-2 uppercase italic">{item.title}</h4>
                     <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase">
                           <MapPin size={12} className="text-[#0F4C81]"/> <span className="truncate">{item.venue || 'TBA'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-2 text-[9px] font-black text-[#0F4C81] uppercase">
                             <CircleDollarSign size={12}/> {item.price || item.salary_range || 'Free'}
                           </div>
                           <a href={item.link} target="_blank" className="p-2 bg-slate-100 rounded-full text-slate-900 hover:bg-[#0F4C81] hover:text-white transition-all"><ArrowUpRight size={14}/></a>
                        </div>
                     </div>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 💬 CONTACT & FORM (Teal) */}
      <section id="contact" className="py-20 px-6 bg-[#1FC8C8] scroll-mt-24">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16">
          <div className="text-left">
            <h2 className="text-5xl font-black uppercase italic tracking-tighter text-[#0A2A5E] mb-6">Move ahead, <br/> stay ahead.</h2>
            <p className="text-[#0F4C81] font-bold text-xs uppercase tracking-widest mb-10 leading-loose">Reach out to us for professional inquiries, administrative support, or technical solutions.</p>
            
            <div className="space-y-6">
               <div className="flex items-center gap-4 text-[#0A2A5E]">
                  <div className="p-4 bg-white/20 rounded-2xl"><Phone size={20}/></div>
                  <span className="text-lg font-black italic">0591999544</span>
               </div>
               <div className="flex items-center gap-4 text-[#0A2A5E]">
                  <div className="p-4 bg-white/20 rounded-2xl"><Mail size={20}/></div>
                  <span className="text-lg font-black italic truncate">precedeconcpts@gmail.com</span>
               </div>
            </div>

            {/* MAJOR LINKS */}
            <div className="flex flex-col sm:flex-row gap-4 mt-12">
               <a href="#" className="flex-1 flex items-center justify-center gap-3 p-5 bg-[#0A2A5E] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl">
                  <MessageSquare size={18}/> WhatsApp Channel
               </a>
               <a href="#" className="flex-1 flex items-center justify-center gap-3 p-5 bg-white text-[#0A2A5E] rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl">
                  <Send size={18}/> Telegram Channel
               </a>
            </div>
          </div>

          <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl">
             <form className="space-y-4 text-left">
                <div>
                   <label className="text-[9px] font-black uppercase text-slate-400 ml-2 mb-2 block">Your Name</label>
                   <input className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-[#1FC8C8] text-sm" placeholder="Full Name" />
                </div>
                <div>
                   <label className="text-[9px] font-black uppercase text-slate-400 ml-2 mb-2 block">Email Address</label>
                   <input className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-[#1FC8C8] text-sm" placeholder="Email" />
                </div>
                <div>
                   <label className="text-[9px] font-black uppercase text-slate-400 ml-2 mb-2 block">Message</label>
                   <textarea className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-[#1FC8C8] text-sm min-h-[120px]" placeholder="How can we help?" />
                </div>
                <button className="w-full p-5 bg-[#0A2A5E] text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-[#0F4C81] transition-all">Send Message</button>
             </form>
          </div>
        </div>
      </section>

      {/* 🏛️ FOOTER */}
      <footer className="py-12 bg-[#0A2A5E] text-center px-6">
        <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.5em] leading-loose">
          Precede Concepts &middot; Accra Ghana &middot; Designed by Precede Concepts 2026
        </p>
      </footer>

    </div>
  )
}