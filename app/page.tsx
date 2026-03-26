'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from './lib/supabase'
import { 
  MapPin, ArrowUpRight, Code2, Palette, Database, 
  CircleDollarSign, Printer, Smartphone, MessageSquare, 
  Phone, Mail, Menu, X, Users, PlayCircle, CheckCircle2, Send, Megaphone
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

  // --- MAILTO FUNCTION ---
  const handleMailTo = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `mailto:${BUSINESS_EMAIL}?subject=New Inquiry for Precede Concepts`;
  };

  const filteredItems = filter === 'all' 
    ? items 
    : items.filter(i => i.category.toLowerCase() === filter.toLowerCase() || (filter === 'training' && i.category === 'seminar'))

  // ⚡ Slim to 6 items maximum for perfectly fitting rows
  const displayItems = filteredItems.slice(0, 6);

  const categorizedServices = [
    { title: 'Admin & Secretarial', icon: <Printer size={20}/>, subServices: ['Printing & Photocopy', 'Document Binding', 'Scanning & Laminating'] },
    { title: 'Graphic Design', icon: <Palette size={20}/>, subServices: ['Logo & Branding', 'Flyers & Banners', 'UI/UX Visuals'] },
    { title: 'Digital Solutions', icon: <Code2 size={20}/>, subServices: ['Web Development', 'Backend Systems', 'API Integrations'] },
    { title: 'Digital Marketing', icon: <Megaphone size={20}/>, subServices: ['Social Media Mgt.', 'SEO Optimization', 'Targeted Ads'] },
    { title: 'Media Production', icon: <PlayCircle size={20}/>, subServices: ['Content Creation', 'Video Editing', 'Photo Retouching'] },
    { title: 'Agency Outsourcing', icon: <Users size={20}/>, subServices: ['White-Label Tech', 'Remote Assistance', 'B2B Execution'] },
  ]

  if (!mounted) return null

  return (
    <div className="bg-[#0A2A5E] font-sans text-slate-950 scroll-smooth">
      
      {/* 🧭 NAVIGATION */}
      <nav className="fixed top-0 w-full z-[100] bg-[#0A2A5E]/90 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#1FC8C8] rounded-lg flex items-center justify-center font-black italic text-[#0A2A5E] text-[10px] shadow-lg">PC</div>
            <div className="flex flex-col text-left">
              <span className="text-sm md:text-lg font-black tracking-tighter uppercase italic text-white leading-none">Precede Concepts</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-8 text-[9px] font-black uppercase tracking-[0.2em] text-white/70">
            {['home', 'about', 'services', 'hub'].map((l) => (
               <a key={l} href={`#${l}`} className="hover:text-[#1FC8C8] transition-all">{l}</a>
            ))}
            <a href="#contact" className="bg-[#1FC8C8] text-[#0A2A5E] px-5 py-2.5 rounded-full font-black hover:bg-white transition-all">Contact Us</a>
          </div>

          <button className="lg:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="lg:hidden absolute left-0 top-full w-full bg-[#0A2A5E] border-b border-white/10 p-6 flex flex-col gap-6 text-xs font-black uppercase tracking-widest text-white shadow-2xl">
              <a href="#home" onClick={() => setIsMenuOpen(false)}>Home</a>
              <a href="#about" onClick={() => setIsMenuOpen(false)}>About Us</a>
              <a href="#services" onClick={() => setIsMenuOpen(false)}>Services</a>
              <a href="#hub" onClick={() => setIsMenuOpen(false)}>Opportunity Hub</a>
              <a href="#contact" onClick={() => setIsMenuOpen(false)} className="text-[#1FC8C8]">Contact Us</a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 🚀 1. HERO */}
      <section id="home" className="min-h-screen lg:h-screen w-full flex items-center justify-center px-6 pt-20 bg-[#0A2A5E] relative overflow-hidden">
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="max-w-7xl mx-auto text-center w-full flex flex-col items-center justify-center">
          
          <span className="text-[8px] md:text-[10px] lg:text-xs font-black text-[#1FC8C8] uppercase tracking-[0.4em] md:tracking-[0.8em] mb-4 md:mb-6 block italic">
            Simplifying progress, delivering value.
          </span>
          
          <h1 className="text-5xl md:text-8xl lg:text-[10rem] font-black tracking-tighter uppercase italic leading-[0.9] mb-4 md:mb-8 text-white w-full drop-shadow-lg">
            THE <span className="text-[#1FC8C8]">STANDARD</span> <br/> OF EXECUTION.
          </h1>
          
          <p className="text-white/60 font-black text-[8px] md:text-[10px] lg:text-xs uppercase tracking-[0.3em] md:tracking-[0.6em] italic mt-2">
            Progress Simplified — Value Delivered
          </p>
          
        </motion.div>
      </section>

      {/* 📖 2. ABOUT US */}
      <section id="about" className="min-h-screen lg:h-screen w-full flex items-center justify-center px-6 pt-20 bg-[#1FC8C8]">
        <div className="max-w-6xl mx-auto w-full flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          <h2 className="lg:flex-1 text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-[#0A2A5E] leading-none text-center lg:text-left">
            Beyond a <br/> Digital Agency.
          </h2>
          <div className="lg:flex-[1.5] border-l-4 lg:border-l-8 border-[#0A2A5E] pl-6 lg:pl-10 text-center lg:text-left">
             <p className="text-[#0A2A5E] font-black text-lg md:text-2xl leading-relaxed italic mb-6">
               Precede Concepts bridges the gap between high-end professional services and accessible "hustle-friendly" solutions in Ghana.
             </p>
             <p className="text-[#0A2A5E]/70 text-xs md:text-sm font-black uppercase tracking-[0.2em] leading-loose">
               We operate a dual-purpose ecosystem: A primary business executing top-tier digital & multimedia services, and a CSR Hub driving traffic by curating vital community resources.
             </p>
          </div>
        </div>
      </section>

      {/* 🏛️ 3. SERVICES */}
      <section id="services" className="min-h-screen lg:h-screen w-full flex flex-col items-center justify-center px-6 pt-24 pb-12 bg-white">
        <div className="w-full max-w-7xl mx-auto">
          <div className="text-center mb-10 lg:mb-16">
             <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-[#0A2A5E] mb-3">Our Services.</h2>
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.5em]">Comprehensive Business Solutions</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {categorizedServices.map((cat, i) => (
              <div key={i} className="p-6 lg:p-8 bg-slate-50 border border-slate-100 rounded-3xl hover:border-[#1FC8C8] hover:shadow-xl transition-all flex flex-col">
                <div className="flex items-center gap-4 mb-5 pb-5 border-b border-slate-200/50">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#0F4C81] shadow-sm flex-shrink-0">{cat.icon}</div>
                  <h3 className="text-sm md:text-base font-black uppercase italic leading-tight text-[#0A2A5E]">{cat.title}</h3>
                </div>
                <ul className="space-y-3 flex-1">
                  {cat.subServices.map((sub, idx) => (
                     <li key={idx} className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        <CheckCircle2 size={12} className="text-[#1FC8C8] flex-shrink-0"/>
                        {sub}
                     </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ⚡ 4. OPPORTUNITY HUB */}
      <section id="hub" className="min-h-screen lg:h-screen w-full flex flex-col items-center justify-center px-6 pt-24 pb-12 bg-[#0F4C81]">
        <div className="w-full max-w-7xl mx-auto flex flex-col h-full justify-center">
          
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
            <h2 className="text-3xl md:text-4xl font-black uppercase italic text-white tracking-tighter">Opportunity Hub</h2>
            <div className="flex flex-wrap justify-center gap-2 bg-black/20 p-1.5 rounded-full">
              {['all', 'job', 'event', 'training'].map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`px-5 py-2 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-[#1FC8C8] text-[#0A2A5E]' : 'text-white/60 hover:text-white'}`}>{f}s</button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
             {displayItems.length === 0 ? (
               <div className="col-span-full text-center py-10 text-white/50 text-xs font-black uppercase tracking-widest">No scouts available in this category.</div>
             ) : displayItems.map((item) => (
               <div key={item.id} className="bg-white rounded-3xl overflow-hidden flex flex-col shadow-2xl h-full border-2 border-transparent hover:border-[#1FC8C8] transition-all">
                  <div className="h-32 lg:h-40 bg-slate-900 relative">
                    {item.image_url ? <img src={item.image_url} className="w-full h-full object-cover" alt="flyer" /> : <div className="w-full h-full flex items-center justify-center font-black italic text-slate-800 text-[10px] uppercase">Precede</div>}
                    <span className="absolute top-3 left-3 text-[7px] font-black bg-[#1FC8C8] text-[#0A2A5E] px-2.5 py-1 rounded-full uppercase tracking-widest">{item.category}</span>
                  </div>
                  <div className="p-5 text-left flex flex-col justify-between flex-1">
                     <h4 className="font-black text-xs md:text-sm text-[#0A2A5E] mb-4 line-clamp-2 uppercase italic leading-snug">{item.title}</h4>
                     <div className="space-y-2 pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase truncate"><MapPin size={12} className="text-[#0F4C81] flex-shrink-0"/> {item.venue || 'Various Locations'}</div>
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-2 text-[10px] font-black text-[#0F4C81] uppercase tracking-tighter"><CircleDollarSign size={12}/> {item.price || item.salary_range || 'Free'}</div>
                           <a href={item.link} target="_blank" className="p-2 bg-slate-50 rounded-full text-[#0A2A5E] hover:bg-[#0F4C81] hover:text-white transition-all shadow-sm"><ArrowUpRight size={14}/></a>
                        </div>
                     </div>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 💬 5. CONTACT */}
      <section id="contact" className="min-h-screen lg:h-screen w-full flex flex-col items-center justify-center px-6 pt-20 pb-10 bg-[#0A2A5E] relative overflow-hidden">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-8 lg:gap-16 items-center flex-1">
          
          {/* LEFT: Matches Home Page Typography */}
          <div className="text-center lg:text-left text-white w-full flex flex-col items-center lg:items-start justify-center">
            <h2 className="text-5xl md:text-8xl lg:text-[7.5rem] font-black tracking-tighter uppercase italic leading-[0.85] mb-4 md:mb-6 text-white w-full drop-shadow-lg">
              MOVE <span className="text-[#1FC8C8]">AHEAD,</span> <br/> STAY AHEAD.
            </h2>
            <p className="text-white/60 font-black text-[8px] md:text-[10px] lg:text-xs uppercase tracking-[0.3em] md:tracking-[0.6em] italic mt-2">
              Progress Simplified — Value Delivered
            </p>
          </div>

          {/* RIGHT: Contact Information Stack */}
          <div className="flex flex-col gap-6 text-left bg-white/5 p-8 lg:p-12 rounded-[3rem] border border-white/10 backdrop-blur-sm">
             
             {/* Vertically Stacked Phone and Email */}
             <div className="flex flex-col gap-6 mb-4">
               <div className="flex items-center gap-4 text-white">
                  <div className="p-4 bg-[#1FC8C8]/20 rounded-2xl text-[#1FC8C8] flex-shrink-0"><Phone size={24}/></div>
                  <div className="flex flex-col">
                     <span className="text-[8px] font-black uppercase tracking-widest text-[#1FC8C8]">Call Us</span>
                     <span className="text-2xl md:text-3xl font-black italic">{BUSINESS_PHONE}</span>
                  </div>
               </div>
               
               <div className="flex items-center gap-4 text-white">
                  <div className="p-4 bg-[#1FC8C8]/20 rounded-2xl text-[#1FC8C8] flex-shrink-0"><Mail size={24}/></div>
                  <div className="flex flex-col min-w-0">
                     <span className="text-[8px] font-black uppercase tracking-widest text-[#1FC8C8]">Email Us</span>
                     {/* break-all prevents long emails from overflowing the card on mobile */}
                     <span className="text-sm sm:text-lg md:text-xl font-black italic break-all">{BUSINESS_EMAIL}</span>
                  </div>
               </div>
             </div>

             {/* WhatsApp Buttons Grid */}
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <a href={WHATSAPP_DIRECT} target="_blank" className="flex items-center justify-center gap-2 p-4 md:p-5 bg-white text-[#0A2A5E] rounded-2xl font-black uppercase text-[9px] tracking-widest hover:bg-[#1FC8C8] transition-all text-center">
                  <MessageSquare size={16} className="flex-shrink-0"/> WhatsApp Message
               </a>
               <a href={WHATSAPP_CHANNEL} target="_blank" className="flex items-center justify-center gap-2 p-4 md:p-5 bg-white/10 text-white rounded-2xl font-black uppercase text-[9px] tracking-widest hover:bg-white/20 transition-all text-center">
                  <Smartphone size={16} className="flex-shrink-0"/> Join WhatsApp Channel
               </a>
             </div>

             <button onClick={handleMailTo} className="w-full py-5 md:py-6 bg-[#1FC8C8] text-[#0A2A5E] rounded-2xl font-black uppercase text-xs tracking-[0.3em] hover:bg-white transition-all flex justify-center items-center gap-3 mt-2 shadow-[0_0_30px_rgba(31,200,200,0.3)]">
                <Send size={18} /> Send an Email
             </button>

          </div>
        </div>

        {/* COMPACT CENTERED FOOTER */}
        <div className="w-full flex flex-col items-center justify-center mt-12 pt-6 border-t border-white/10 text-center gap-2">
           <span className="text-[#1FC8C8] font-black italic uppercase text-lg tracking-tighter">Precede Concepts</span>
           <span className="text-white/30 text-[8px] font-black uppercase tracking-[0.5em]">Accra Ghana &middot; &copy; 2026</span>
        </div>
      </section>

    </div>
  )
}