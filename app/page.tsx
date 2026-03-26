'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from './lib/supabase'
import { 
  MapPin, ArrowUpRight, Code2, Palette, Database, 
  Clock, Megaphone, Send, CircleDollarSign, Printer, Smartphone, 
  MessageSquare, Phone, Mail, Menu, X, Users, PlayCircle, CheckCircle2
} from 'lucide-react'

export default function Home() {
  const [items, setItems] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [filter, setFilter] = useState('all')

  // --- BUSINESS INFO ---
  const WHATSAPP_DIRECT = "https://wa.me/233591999544"
  const WHATSAPP_CHANNEL = "https://whatsapp.com/channel/0029Vb7Mfjf5EjxpZuIIpA2W"
  const BUSINESS_EMAIL = "precedeconcepts@gmail.com"
  const BUSINESS_PHONE = "0591999544"

  useEffect(() => { 
    setMounted(true); 
    fetchApproved(); 
  }, [])

  async function fetchApproved() {
    const { data } = await supabase.from('jobs').select('*').eq('status', 'approved').order('is_featured', { ascending: false })
    if (data) setItems(data)
  }

  const filteredItems = filter === 'all' 
    ? items 
    : items.filter(i => i.category.toLowerCase() === filter.toLowerCase() || (filter === 'training' && i.category === 'seminar'))

  const categorizedServices = [
    { title: 'Administrative & Secretarial', icon: <Printer size={24}/>, subServices: ['Printing & Photocopy', 'Document Binding', 'Scanning & Lamination', 'General Office Support'] },
    { title: 'Graphic Design', icon: <Palette size={24}/>, subServices: ['Logo & Branding', 'Flyers & Banners', 'UI/UX Design', 'Visual Identity'] },
    { title: 'Digital Solutions', icon: <Code2 size={24}/>, subServices: ['Custom Web Development', 'Backend Architecture', 'API Integrations', 'E-Commerce Setup'] },
    { title: 'Digital Marketing', icon: <Megaphone size={24}/>, subServices: ['Social Media Management', 'SEO Optimization', 'Content Marketing', 'Targeted Ad Campaigns'] },
    { title: 'Media Production', icon: <PlayCircle size={24}/>, subServices: ['Content Creation', 'Video Editing', 'Photography Editing', 'Multimedia Storytelling'] },
    { title: 'Agency Outsourcing', icon: <Users size={24}/>, subServices: ['White-Label Tech Support', 'Remote Secretarial', 'B2B Project Execution', 'Staff Augmentation'] },
  ]

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-white font-sans text-slate-950 scroll-smooth overflow-x-hidden">
      
      {/* 🧭 NAVIGATION */}
      <nav className="fixed top-0 w-full z-[100] bg-[#0A2A5E] border-b border-white/5 px-4 md:px-8 py-5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1FC8C8] rounded-xl flex items-center justify-center font-black italic text-[#0A2A5E] text-xs shadow-lg">PC</div>
            <div className="flex flex-col text-left">
              <span className="text-lg font-black tracking-tighter uppercase italic text-white leading-none">Precede Concepts</span>
              <span className="text-[7px] font-bold text-[#1FC8C8] tracking-[0.4em] uppercase mt-1">Standard of Execution</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-7 text-[9px] font-black uppercase tracking-[0.2em] text-white/70">
            {['home', 'about', 'services', 'training', 'jobs', 'events'].map((l) => (
               <a key={l} href={`#${l}`} className="hover:text-[#1FC8C8] transition-all">{l}</a>
            ))}
            <a href="#contact" className="bg-[#1FC8C8] text-[#0A2A5E] px-6 py-3 rounded-full font-black hover:bg-white transition-all">Contact Us</a>
          </div>

          <button className="lg:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* 🚀 HERO (RESTORED BEAUTY) */}
      <header id="home" className="h-screen flex items-center justify-center px-6 text-center bg-[#0A2A5E] relative">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-6xl mx-auto w-full">
          <span className="text-[10px] md:text-[12px] font-black text-[#1FC8C8] uppercase tracking-[0.6em] mb-8 block italic">
            Simplifying progress, delivering value.
          </span>
          
          {/* EXACTLY 2 LINES: White text, Teal "Standard" */}
          <h1 className="text-6xl md:text-[11rem] font-black tracking-tighter uppercase italic leading-[0.8] mb-12 text-white">
            The <span className="text-[#1FC8C8]">Standard</span> <br/> of execution.
          </h1>
          
          <p className="text-white/40 max-w-xl mx-auto font-bold text-[10px] md:text-xs uppercase tracking-[0.3em] italic">
            Progress Simplified — Value Delivered
          </p>
        </motion.div>
      </header>

      {/* 📖 ABOUT US */}
      <section id="about" className="py-32 px-6 bg-slate-50 scroll-mt-24">
        <div className="max-w-5xl mx-auto text-center md:text-left flex flex-col md:flex-row gap-16 items-center">
          <h2 className="flex-1 text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-[#0A2A5E] leading-tight">Beyond a <br/> Digital Agency.</h2>
          <div className="flex-[1.5] border-l-8 border-[#1FC8C8] pl-8">
             <p className="text-slate-600 font-medium text-lg md:text-xl leading-relaxed italic mb-8">
               Precede Concepts is a multifaceted digital agency and community platform designed to bridge the gap between high-end professional services and accessible "hustle-friendly" solutions in Ghana.
             </p>
             <p className="text-slate-400 text-sm font-bold uppercase tracking-widest leading-loose">
               It operates as a dual-purpose ecosystem: a Primary Business providing digital/multimedia services and a Secondary/CSR Hub that drives traffic by offering community resources.
             </p>
          </div>
        </div>
      </section>

      {/* 🏛️ CATEGORIZED SERVICES WITH SUB-SERVICES */}
      <section id="services" className="py-32 px-6 max-w-7xl mx-auto scroll-mt-24">
        <div className="text-center mb-20">
           <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-[#0A2A5E] mb-4">Our Services.</h2>
           <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.5em]">Comprehensive Business Solutions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categorizedServices.map((cat, i) => (
            <div key={i} className="p-10 bg-white border border-slate-100 rounded-[3rem] transition-all hover:border-[#1FC8C8] hover:shadow-2xl text-left flex flex-col">
              <div className="text-[#0F4C81] mb-6 flex justify-start">{cat.icon}</div>
              <h3 className="text-2xl font-black uppercase italic leading-tight text-[#0A2A5E] mb-6">{cat.title}</h3>
              <ul className="space-y-4 flex-1">
                {cat.subServices.map((sub, idx) => (
                   <li key={idx} className="flex items-start gap-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                      <CheckCircle2 size={14} className="text-[#1FC8C8] mt-0.5 flex-shrink-0"/>
                      {sub}
                   </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ⚡ OPPORTUNITY HUB */}
      <section id="training" className="py-32 bg-[#0F4C81] px-6 scroll-mt-24 rounded-t-[5rem] md:rounded-t-[10rem]">
        <div id="jobs" className="scroll-mt-32"></div>
        <div id="events" className="scroll-mt-32"></div>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
            <h2 className="text-4xl font-black uppercase italic text-white tracking-tighter underline decoration-[#1FC8C8] underline-offset-8">Opportunity Hub</h2>
            <div className="flex flex-wrap justify-center gap-2 bg-black/20 p-2 rounded-full">
              {['all', 'job', 'event', 'training'].map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-[#1FC8C8] text-[#0A2A5E]' : 'text-white/60 hover:text-white'}`}>{f}s</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
             {filteredItems.map((item) => (
               <div key={item.id} className="bg-white rounded-[2.5rem] overflow-hidden flex flex-col border border-white/5 shadow-2xl h-full">
                  <div className="h-44 bg-slate-900 relative">
                    {item.image_url ? <img src={item.image_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-black italic text-slate-800 text-[10px] uppercase">Precede</div>}
                    <span className="absolute top-4 left-4 text-[7px] font-black bg-[#1FC8C8] text-[#0A2A5E] px-3 py-1.5 rounded-full uppercase tracking-widest">{item.category}</span>
                  </div>
                  <div className="p-6 text-left flex flex-col justify-between flex-1">
                     <h4 className="font-black text-[13px] text-[#0A2A5E] mb-4 line-clamp-2 uppercase italic tracking-tight leading-snug">{item.title}</h4>
                     <div className="space-y-3 pt-4 border-t border-slate-50">
                        <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase truncate"><MapPin size={12} className="text-[#0F4C81] flex-shrink-0"/> {item.venue || 'Various Locations'}</div>
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-2 text-[11px] font-black text-[#0F4C81] uppercase tracking-tighter"><CircleDollarSign size={13}/> {item.price || item.salary_range || 'Free'}</div>
                           <a href={item.link} target="_blank" className="p-3 bg-slate-50 rounded-full text-[#0A2A5E] hover:bg-[#0A2A5E] hover:text-white transition-all shadow-sm"><ArrowUpRight size={16}/></a>
                        </div>
                     </div>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 💬 CONTACT SECTION (CLEAN UI) */}
      <section id="contact" className="py-32 px-6 bg-[#1FC8C8] scroll-mt-24">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="text-left text-[#0A2A5E]">
            <h2 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter mb-10 leading-none">Move ahead, <br/> stay ahead.</h2>
            <div className="space-y-6 mb-12">
               <div className="flex items-center gap-5"><div className="p-5 bg-white/30 rounded-3xl"><Phone size={24}/></div><span className="text-2xl font-black italic">{BUSINESS_PHONE}</span></div>
               <div className="flex items-center gap-5"><div className="p-5 bg-white/30 rounded-3xl"><Mail size={24}/></div><span className="text-2xl font-black italic truncate">{BUSINESS_EMAIL}</span></div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
               <a href={WHATSAPP_DIRECT} target="_blank" className="flex-1 flex items-center justify-center gap-3 p-7 bg-[#0A2A5E] text-white rounded-[2rem] font-black uppercase text-[10px] tracking-widest shadow-2xl hover:scale-105 transition-all">
                  <MessageSquare size={18}/> WhatsApp Direct
               </a>
               <a href={WHATSAPP_CHANNEL} target="_blank" className="flex-1 flex items-center justify-center gap-3 p-7 bg-white text-[#0A2A5E] rounded-[2rem] font-black uppercase text-[10px] tracking-widest shadow-2xl hover:scale-105 transition-all">
                  <Smartphone size={18}/> Join Channel
               </a>
            </div>
          </div>

          {/* BEAUTIFUL, SIMPLE EMAIL BUTTON */}
          <div className="bg-white p-12 md:p-16 rounded-[4rem] shadow-3xl text-center flex flex-col justify-center items-center border border-[#0A2A5E]/5">
             <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8">
               <Mail size={40} className="text-[#1FC8C8]" />
             </div>
             <h3 className="text-3xl font-black uppercase italic text-[#0A2A5E] mb-4">Send an Enquiry</h3>
             <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-10 leading-relaxed max-w-sm">
               Click below to open your preferred email app and message our team directly. We respond within 24 hours.
             </p>
             <a href={`mailto:${BUSINESS_EMAIL}?subject=New Inquiry for Precede Concepts`} className="w-full px-8 py-7 bg-[#0A2A5E] text-white rounded-[2rem] font-black uppercase text-xs md:text-sm tracking-[0.4em] shadow-2xl hover:bg-[#0F4C81] transition-all flex items-center justify-center gap-3">
                <Send size={20} /> Send an Email
             </a>
          </div>
        </div>
      </section>

      {/* 🏛️ FOOTER */}
      <footer className="py-20 bg-[#0A2A5E] text-center px-6">
        <span className="text-[#1FC8C8] font-black italic uppercase text-2xl tracking-tighter">Precede Concepts</span>
        <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.6em] mt-4">Designed by Precede Concepts 2026 &middot; Accra Ghana</p>
      </footer>
    </div>
  )
}