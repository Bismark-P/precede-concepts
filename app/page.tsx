'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from './lib/supabase'
import { 
  Briefcase, Calendar, MapPin, ArrowUpRight, Globe, PlayCircle, Lightbulb, 
  MessageSquare, Users, Code2, Palette, Database, ChevronRight, Star, Clock, Megaphone,
  Send, CircleDollarSign, Printer, Smartphone, CheckCircle2, Instagram, Phone
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

  // 1. SERVICES REORDERED: Admin & Secretarial First
  const services = [
    { 
        title: 'Administrative & Secretarial', 
        icon: <Database/>, 
        desc: 'Core business operations, professional documentation, and office support.',
        tags: ['Printing', 'Photocopy', 'Scanning', 'Binding'],
        accent: 'blue'
    },
    { 
        title: 'Graphic Design', 
        icon: <Palette/>, 
        desc: 'Strategic Visual Identity, Logo Design, UI/UX Assets & High-End Branding.',
        accent: 'emerald'
    },
    { 
        title: 'Digital Solutions', 
        icon: <Code2/>, 
        desc: 'Custom Web Development, Backend Architecture & API Integrations.',
        accent: 'blue'
    },
    { 
        title: 'Digital Marketing', 
        icon: <Megaphone/>, 
        desc: 'Growth Strategy, SEO Optimization, Content Marketing & Social Ads.',
        accent: 'indigo'
    },
    { 
        title: 'Media Production', 
        icon: <PlayCircle/>, 
        desc: 'Multimedia Storytelling, Video Editing & Digital Content Strategy.',
        accent: 'rose'
    },
    { 
        title: 'Agency Outsourcing', 
        icon: <Users/>, 
        desc: 'Professional White-label support for technical and administrative tasks.',
        accent: 'slate'
    },
  ]

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-slate-950 scroll-smooth overflow-x-hidden">
      
      {/* 🧭 NAVIGATION */}
      <nav className="fixed top-0 w-full z-[100] bg-white/60 backdrop-blur-2xl border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col text-left">
            <span className="text-xl font-black tracking-tighter uppercase italic leading-none">Precede Concepts</span>
            <span className="text-[7px] font-bold text-blue-600 tracking-[0.4em] uppercase mt-1">Standard of Execution</span>
          </motion.div>

          <div className="hidden lg:flex items-center gap-10 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
            <a href="#home" className="hover:text-blue-600 transition-colors">Home</a>
            <a href="#about" className="hover:text-blue-600 transition-colors">About Us</a>
            <a href="#training" className="hover:text-blue-600 transition-colors">Training</a>
            <a href="#jobs" className="hover:text-blue-600 transition-colors">Jobs</a>
            <a href="#events" className="hover:text-blue-600 transition-colors">Events</a>
            <a href="#contact" className="bg-slate-950 text-white px-8 py-4 rounded-full hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">Contact Us</a>
          </div>
        </div>
      </nav>

      {/* 🚀 HERO SECTION */}
      <header id="home" className="pt-48 pb-32 px-6 text-center bg-white relative">
        <div id="about" className="absolute top-0"></div>
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.5em] mb-6 block">Simplifying progress, delivering value.</span>
          <h1 className="text-6xl md:text-[11rem] font-black tracking-tighter uppercase italic leading-[0.8] mb-10">
            The <span className="text-blue-600 underline decoration-8 underline-offset-[12px]">Standard</span> <br/> of execution.
          </h1>
          
          <div className="flex flex-col items-center gap-6">
            <p className="text-slate-400 max-w-2xl mx-auto font-bold text-xs md:text-sm uppercase tracking-[0.3em] leading-loose italic">
              Progress Simplified — Value Delivered
            </p>
            <div className="bg-slate-50 px-8 py-4 rounded-full border border-slate-100 inline-flex items-center gap-4">
                <span className="text-[10px] font-black uppercase text-slate-400">Call: <span className="text-slate-900">Move Ahead</span></span>
                <span className="text-blue-600 font-black italic">/</span>
                <span className="text-[10px] font-black uppercase text-slate-400">Response: <span className="text-blue-600">Stay Ahead</span></span>
            </div>
          </div>
        </motion.div>
      </header>

      {/* 🏛️ SERVICES SECTION */}
      <section id="services" className="py-32 px-6 max-w-7xl mx-auto scroll-mt-24">
        <motion.div 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-4 text-left"
        >
          <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none">Agency <br/> Solutions.</h2>
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] border-l-4 border-blue-600 pl-4 py-2">Simplifying Progress Since Day One</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {services.map((s, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 bg-white border border-slate-100 rounded-[3rem] hover:shadow-3xl hover:-translate-y-2 transition-all group cursor-default"
            >
              <div className="w-14 h-14 bg-slate-50 text-slate-900 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                {s.icon}
              </div>
              <h3 className="text-2xl font-black uppercase italic mb-3 tracking-tight">{s.title}</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-relaxed mb-6">{s.desc}</p>
              
              {/* Dynamic Tags for Admin/Secretarial */}
              {s.tags && (
                <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-50">
                    {s.tags.map(tag => (
                        <span key={tag} className="text-[8px] font-black uppercase px-3 py-1 bg-blue-50 text-blue-600 rounded-full">{tag}</span>
                    ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ⚡ OPPORTUNITY HUB (CSR) */}
      <section id="training" className="py-32 bg-slate-950 px-6 scroll-mt-24 rounded-t-[5rem] md:rounded-t-[10rem]">
        {/* Helper Anchors */}
        <div id="jobs" className="scroll-mt-32"></div>
        <div id="events" className="scroll-mt-32"></div>
        
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black uppercase italic text-blue-500 mb-4 tracking-tighter">The Opportunity Hub</h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.5em]">Curated CSR &middot; Empowering the Ecosystem</p>
          </div>
          
          <div className="grid gap-6">
             {items.map((item, idx) => (
               <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  key={item.id} 
                  className="bg-white/5 border border-white/10 p-5 rounded-[2.5rem] flex flex-col md:flex-row gap-6 items-center group hover:bg-white/10 transition-all shadow-2xl"
                >
                  <div className="w-24 h-24 bg-slate-800 rounded-3xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {item.image_url ? <img src={item.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" /> : <span className="text-[9px] font-black text-slate-600 uppercase italic">Precede</span>}
                  </div>
                  <div className="flex-1 text-center md:text-left">
                     <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-2">
                        <span className="text-[8px] font-black bg-blue-600 text-white px-3 py-1 rounded-full uppercase tracking-widest">{item.category}</span>
                        <span className="text-[8px] font-black bg-white/10 text-slate-400 px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1"><Clock size={10}/> {item.time_category || 'Active'}</span>
                     </div>
                     <h4 className="font-bold text-lg text-white mb-2 leading-tight">{item.title}</h4>
                     <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                       <span className="flex items-center gap-1.5"><MapPin size={12} className="text-blue-500"/> {item.region}</span>
                       <span className="flex items-center gap-1.5"><CircleDollarSign size={12} className="text-emerald-500"/> {item.price || item.salary_range || 'Free'}</span>
                     </div>
                  </div>
                  <a href={item.link} target="_blank" className="p-4 bg-white/10 rounded-full text-white group-hover:bg-blue-600 transition-all"><ArrowUpRight size={20}/></a>
               </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* 💬 CONTACT & DIRECT CHAT */}
      <section id="contact" className="py-32 px-6 text-center max-w-5xl mx-auto scroll-mt-24">
        <h2 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter mb-12 leading-none">Move ahead, <br/> stay ahead.</h2>
        
        {/* DIRECT MESSAGING GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-20 text-left">
          <a href="https://wa.me/YOUR_WHATSAPP_NUMBER" target="_blank" className="flex flex-col p-8 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 group transition-all hover:bg-emerald-500">
             <MessageSquare className="text-emerald-500 group-hover:text-white mb-4" size={24}/>
             <span className="text-[8px] font-black uppercase tracking-widest text-emerald-600 group-hover:text-emerald-100 mb-1">Direct Chat</span>
             <span className="text-xs font-black uppercase text-slate-900 group-hover:text-white">WhatsApp</span>
          </a>
          <a href="https://t.me/YOUR_TELEGRAM_USERNAME" target="_blank" className="flex flex-col p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100 group transition-all hover:bg-blue-500">
             <Send className="text-blue-500 group-hover:text-white mb-4" size={24}/>
             <span className="text-[8px] font-black uppercase tracking-widest text-blue-600 group-hover:text-blue-100 mb-1">Direct Message</span>
             <span className="text-xs font-black uppercase text-slate-900 group-hover:text-white">Telegram</span>
          </a>
          <div className="lg:col-span-2 flex items-center justify-between p-8 bg-slate-950 rounded-[2.5rem] group shadow-2xl shadow-blue-100">
             <div>
                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-blue-400 mb-1 block">Broadcast Channels</span>
                <span className="text-sm font-black uppercase text-white">Join the Community</span>
             </div>
             <div className="flex gap-2">
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors"><Instagram size={16}/></a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors"><Smartphone size={16}/></a>
             </div>
          </div>
        </div>

        <footer className="pt-20 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
           <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.6em]">Precede Concepts &middot; Accra Ghana &middot; 2026</span>
           <div className="flex gap-4">
              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1"><CheckCircle2 size={10}/> Value Delivered</span>
              <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-1"><CheckCircle2 size={10}/> Progress Simplified</span>
           </div>
        </footer>
      </section>

    </div>
  )
}