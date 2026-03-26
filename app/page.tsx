'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from './lib/supabase'
import { 
  MapPin, ArrowUpRight, Code2, Palette, Database, ChevronRight, 
  Clock, Megaphone, Send, CircleDollarSign, Printer, Smartphone, 
  MessageSquare, Instagram, Phone, Mail, Menu, X, Users, PlayCircle
} from 'lucide-react'

export default function Home() {
  const [items, setItems] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [filter, setFilter] = useState('all')

  // --- BUSINESS INFO ---
  const WHATSAPP_DIRECT = "https://wa.me/233591999544"
  const WHATSAPP_CHANNEL = "https://whatsapp.com/channel/0029Vb7Mfjf5EjxpZuIIpA2W"
  const TELEGRAM_CHAT = "#" // Update later
  const TELEGRAM_CHANNEL = "#" // Update later
  const BUSINESS_EMAIL = "precedeconcepts@gmail.com"
  const BUSINESS_PHONE = "0591999544"

  useEffect(() => { setMounted(true); fetchApproved(); }, [])

  async function fetchApproved() {
    const { data } = await supabase.from('jobs').select('*').eq('status', 'approved').order('is_featured', { ascending: false })
    if (data) setItems(data)
  }

  const filteredItems = filter === 'all' 
    ? items 
    : items.filter(i => i.category.toLowerCase() === filter.toLowerCase() || (filter === 'training' && i.category === 'seminar'))

  const services = [
    { title: 'Administrative & Secretarial', icon: <Printer size={20}/>, desc: 'Professional printing, photocopy, binding, and office support.' },
    { title: 'Graphic Design', icon: <Palette size={20}/>, desc: 'Strategic Branding, Logo Design & Visual Identity.' },
    { title: 'Digital Solutions', icon: <Code2 size={20}/>, desc: 'Web Development, Backend & API Design.' },
    { title: 'Digital Marketing', icon: <Megaphone size={20}/>, desc: 'SEO, Strategy & Social Campaigns.' },
    { title: 'Agency Outsourcing', icon: <Users size={20}/>, desc: 'White-label Tech & Admin Support.' },
  ]

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-white font-sans text-slate-950 scroll-smooth overflow-x-hidden">
      
      {/* 🧭 NAVIGATION */}
      <nav className="fixed top-0 w-full z-[100] bg-[#0A2A5E] border-b border-white/5 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex flex-col text-left">
            <span className="text-lg md:text-xl font-black tracking-tighter uppercase italic text-white leading-none">Precede Concepts</span>
            <span className="text-[7px] font-bold text-[#1FC8C8] tracking-[0.4em] uppercase mt-1">Standard of Execution</span>
          </div>

          <div className="hidden lg:flex items-center gap-7 text-[9px] font-black uppercase tracking-[0.2em] text-white/70">
            {['home', 'about us', 'services', 'training', 'jobs', 'events'].map((l) => (
               <a key={l} href={`#${l.replace(' ', '')}`} className="hover:text-[#1FC8C8] transition-all">{l}</a>
            ))}
            <a href="#contact" className="bg-[#1FC8C8] text-[#0A2A5E] px-6 py-3 rounded-full font-black hover:bg-white transition-all">Contact Us</a>
          </div>

          <button className="lg:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="lg:hidden bg-[#0A2A5E] absolute left-0 w-full px-6 py-10 flex flex-col gap-6 text-[11px] font-black uppercase tracking-widest text-white border-b border-white/10 shadow-2xl">
              <a href="#home" onClick={() => setIsMenuOpen(false)}>Home</a>
              <a href="#about" onClick={() => setIsMenuOpen(false)}>About Us</a>
              <a href="#services" onClick={() => setIsMenuOpen(false)}>Our Services</a>
              <a href="#training" onClick={() => setIsMenuOpen(false)}>Training</a>
              <a href="#jobs" onClick={() => setIsMenuOpen(false)}>Jobs</a>
              <a href="#events" onClick={() => setIsMenuOpen(false)}>Events</a>
              <a href="#contact" onClick={() => setIsMenuOpen(false)} className="text-[#1FC8C8]">Contact Us</a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 🚀 HERO SECTION */}
      <header id="home" className="pt-52 pb-24 md:pt-64 md:pb-40 px-6 text-center bg-[#0A2A5E] text-white relative">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto">
          <span className="text-[9px] md:text-[10px] font-black text-[#1FC8C8] uppercase tracking-[0.5em] mb-6 block italic">Simplifying progress, delivering value.</span>
          <h1 className="text-5xl md:text-[10rem] font-black tracking-tighter uppercase italic leading-[0.9] mb-10">
            The Standard <br/> of execution.
          </h1>
          <p className="text-white/40 max-w-xl mx-auto font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] italic">
            Progress Simplified — Value Delivered
          </p>
        </motion.div>
      </header>

      {/* 🏛️ AGENCY SERVICES (Minimal Grid) */}
      <section id="services" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-24">
        <div id="about" className="scroll-mt-32 flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4 text-left">
           <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-[#0A2A5E]">Our <br/> Services.</h2>
           <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">Strategic Digital Operations</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {services.map((s, i) => (
            <div key={i} className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] transition-all hover:bg-white hover:border-[#1FC8C8] hover:shadow-xl group">
              <div className="text-[#0F4C81] mb-6 bg-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-[#1FC8C8] group-hover:text-[#0A2A5E] transition-all">{s.icon}</div>
              <h3 className="text-[11px] font-black uppercase italic mb-3 leading-tight text-[#0A2A5E]">{s.title}</h3>
              <p className="text-[9px] font-bold text-slate-400 uppercase leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ⚡ OPPORTUNITY HUB (4-Card Row) */}
      <section id="training" className="py-24 bg-[#0F4C81] px-6 scroll-mt-20 rounded-t-[4rem] md:rounded-t-[8rem]">
        <div id="jobs" className="scroll-mt-32"></div>
        <div id="events" className="scroll-mt-32"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
            <h2 className="text-3xl font-black uppercase italic text-white tracking-tighter">Opportunity Hub</h2>
            <div className="flex flex-wrap justify-center gap-2 bg-black/20 p-1.5 rounded-full">
              {['all', 'job', 'event', 'training'].map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`px-6 py-2.5 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-[#1FC8C8] text-[#0A2A5E]' : 'text-white/60'}`}>{f}s</button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
             {filteredItems.map((item) => (
               <div key={item.id} className="bg-white rounded-[2.5rem] overflow-hidden flex flex-col border border-white/5 shadow-2xl h-full">
                  <div className="h-40 bg-slate-900 relative">
                    {item.image_url ? <img src={item.image_url} className="w-full h-full object-cover" alt=""/> : <div className="w-full h-full flex items-center justify-center font-black italic text-slate-800 text-[10px] uppercase">Precede</div>}
                    <span className="absolute top-4 left-4 text-[7px] font-black bg-[#1FC8C8] text-[#0A2A5E] px-2.5 py-1.5 rounded-full uppercase tracking-widest">{item.category}</span>
                  </div>
                  <div className="p-6 text-left flex flex-col justify-between flex-1">
                     <h4 className="font-black text-[12px] text-slate-900 mb-4 line-clamp-2 uppercase italic tracking-tight leading-snug">{item.title}</h4>
                     <div className="space-y-3 pt-4 border-t border-slate-50">
                        <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase"><MapPin size={12} className="text-[#0F4C81]"/> <span className="truncate">{item.venue || 'Various'}</span></div>
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-2 text-[10px] font-black text-[#0F4C81] uppercase tracking-tighter"><CircleDollarSign size={13}/> {item.price || item.salary_range || 'Free Access'}</div>
                           <a href={item.link} target="_blank" className="p-2.5 bg-slate-50 rounded-full text-[#0A2A5E] hover:bg-[#0A2A5E] hover:text-white transition-all"><ArrowUpRight size={14}/></a>
                        </div>
                     </div>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 💬 CONTACT & FORM */}
      <section id="contact" className="py-24 px-6 bg-[#1FC8C8] scroll-mt-24">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-32">
          <div className="text-left">
            <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-[#0A2A5E] mb-10">Move ahead, <br/> stay ahead.</h2>
            <div className="space-y-6 mb-12">
               <div className="flex items-center gap-5 text-[#0A2A5E]">
                  <div className="p-5 bg-white/20 rounded-3xl"><Phone size={24}/></div>
                  <div className="flex flex-col"><span className="text-[8px] font-black uppercase tracking-widest opacity-60">Call Us</span><span className="text-xl font-black italic">{BUSINESS_PHONE}</span></div>
               </div>
               <div className="flex items-center gap-5 text-[#0A2A5E]">
                  <div className="p-5 bg-white/20 rounded-3xl"><Mail size={24}/></div>
                  <div className="flex flex-col"><span className="text-[8px] font-black uppercase tracking-widest opacity-60">Email Us</span><span className="text-xl font-black italic">{BUSINESS_EMAIL}</span></div>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
               <a href={WHATSAPP_DIRECT} target="_blank" className="flex-1 flex items-center justify-center gap-3 p-6 bg-[#0A2A5E] text-white rounded-[2rem] font-black uppercase text-[10px] tracking-widest shadow-2xl">
                  <MessageSquare size={18}/> WhatsApp Direct
               </a>
               <a href={WHATSAPP_CHANNEL} target="_blank" className="flex-1 flex items-center justify-center gap-3 p-6 bg-white text-[#0A2A5E] rounded-[2rem] font-black uppercase text-[10px] tracking-widest shadow-2xl">
                  <Smartphone size={18}/> WhatsApp Channel
               </a>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
               <a href={TELEGRAM_CHAT} className="flex-1 flex items-center justify-center gap-3 p-6 bg-[#0F4C81] text-white rounded-[2rem] font-black uppercase text-[10px] tracking-widest shadow-2xl">
                  <Send size={18}/> Telegram Chat
               </a>
               <a href={TELEGRAM_CHANNEL} className="flex-1 flex items-center justify-center gap-3 p-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-[10px] tracking-widest shadow-2xl">
                  <Send size={18}/> Telegram Channel
               </a>
            </div>
          </div>

          <div className="bg-white p-10 md:p-14 rounded-[4rem] shadow-3xl text-left">
             <form className="space-y-5">
                <div><label className="text-[9px] font-black uppercase text-slate-400 ml-4 mb-2 block">Name</label><input className="w-full p-5 bg-slate-50 rounded-3xl outline-none focus:ring-2 ring-[#0A2A5E] text-sm" placeholder="Full Name" /></div>
                <div><label className="text-[9px] font-black uppercase text-slate-400 ml-4 mb-2 block">Email</label><input className="w-full p-5 bg-slate-50 rounded-3xl outline-none focus:ring-2 ring-[#0A2A5E] text-sm" placeholder="Email Address" /></div>
                <div><label className="text-[9px] font-black uppercase text-slate-400 ml-4 mb-2 block">Message</label><textarea className="w-full p-6 bg-slate-50 rounded-[2.5rem] outline-none focus:ring-2 ring-[#0A2A5E] text-sm min-h-[150px]" placeholder="How can we help?" /></div>
                <button type="button" className="w-full p-6 bg-[#0A2A5E] text-white rounded-[2rem] font-black uppercase text-xs tracking-widest hover:bg-[#0F4C81] transition-all">Send Inquiry</button>
             </form>
          </div>
        </div>
      </section>

      {/* 🏛️ FOOTER */}
      <footer className="py-16 bg-[#0A2A5E] text-center px-6 border-t border-white/5">
        <div className="flex flex-col items-center gap-4">
            <span className="text-white font-black italic uppercase text-lg tracking-tighter leading-none">Precede Concepts</span>
            <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.5em] leading-relaxed">
              Standard of Execution &middot; Accra Ghana <br/> 
              &copy; Designed by Precede Concepts 2026
            </p>
        </div>
      </footer>
    </div>
  )
}