'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from './lib/supabase'
import { 
  MapPin, ArrowUpRight, Code2, Palette, Printer, 
  Smartphone, Phone, Mail, Menu, X, Users, PlayCircle, 
  CheckCircle2, Send, Megaphone, Sparkles, Search, 
  Calendar, Map as MapIcon, ArrowUp
} from 'lucide-react'

const WhatsAppIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
)

export default function Home() {
  const [items, setItems] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showTopBtn, setShowTopBtn] = useState(false)

  const BUSINESS_PHONE = "+233 (0)59 199 9544"
  const BUSINESS_EMAIL = "precedeconcepts@gmail.com"

  useEffect(() => { 
    setMounted(true); 
    fetchApproved(); 
    const handleScroll = () => setShowTopBtn(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [])

  async function fetchApproved() {
    const { data } = await supabase.from('jobs').select('*').eq('status', 'approved').order('created_at', { ascending: false })
    if (data) setItems(data)
  }

  const handleNavFilter = (filterId: string) => {
    setFilter(filterId);
    setIsMenuOpen(false);
    document.getElementById('hub')?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredItems = items.filter(item => {
    const s = searchQuery.toLowerCase();
    const match = item.title?.toLowerCase().includes(s) || item.venue?.toLowerCase().includes(s) || item.category?.toLowerCase().includes(s);
    const catMatch = filter === 'all' || (filter === 'training' ? (item.category === 'training' || item.category === 'seminar') : item.category === filter);
    return match && catMatch;
  });

  const featured = items.filter(i => i.is_featured && i.status === 'approved').slice(0, 6);

  const services = [
    { title: 'ADMIN & SECRETARIAL', icon: <Printer size={20}/>, list: ['Printing & Photocopy', 'Document Binding', 'Scanning & Laminating'] },
    { title: 'GRAPHIC DESIGN', icon: <Palette size={20}/>, list: ['Logo & Branding', 'Flyers & Banners', 'UI/UX Visuals'] },
    { title: 'DIGITAL SOLUTIONS', icon: <Code2 size={20}/>, list: ['Web Development', 'Backend Systems', 'API Integrations'] },
    { title: 'DIGITAL MARKETING', icon: <Megaphone size={20}/>, list: ['Social Media Mgt.', 'SEO Optimization', 'Targeted Ads'] },
    { title: 'MEDIA PRODUCTION', icon: <PlayCircle size={20}/>, list: ['Content Creation', 'Video Editing', 'Photo Retouching'] },
    { title: 'AGENCY OUTSOURCING', icon: <Users size={20}/>, list: ['White-Label Tech', 'Remote Assistance', 'B2B Execution'] },
  ]

  if (!mounted) return null

  return (
    <div className="bg-[#0A2A5E] font-sans text-slate-950 scroll-smooth overflow-x-hidden selection:bg-[#1FC8C8] selection:text-[#0A2A5E]">
      {/* --- 🧭 NAVIGATION --- */}
      <nav className="fixed top-0 w-full z-[100] bg-[#0A2A5E]/90 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center text-white">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-10 h-10 bg-[#1FC8C8] rounded-xl flex items-center justify-center font-black italic text-[#0A2A5E] text-[12px] shadow-lg group-hover:scale-110 transition-transform">PC</div>
            <span className="text-sm md:text-xl font-black uppercase italic tracking-tighter">PRECEDE CONCEPTS</span>
          </div>
          <div className="hidden xl:flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.1em]">
            {['HOME', 'ABOUT', 'SERVICES'].map((link) => (
              <a key={link} href={`#${link.toLowerCase()}`} className="hover:text-[#1FC8C8] transition-colors duration-300">{link}</a>
            ))}
            <button onClick={() => handleNavFilter('training')} className="hover:text-[#1FC8C8] transition-colors">TRAINING</button>
            <button onClick={() => handleNavFilter('job')} className="hover:text-[#1FC8C8] transition-colors">JOBS</button>
            <button onClick={() => handleNavFilter('event')} className="hover:text-[#1FC8C8] transition-colors">EVENTS</button>
            <button onClick={() => handleNavFilter('place')} className="text-[#1FC8C8] hover:brightness-125 transition-all">PLACES & SPACES</button>
            <a href="#contact" className="bg-[#1FC8C8] text-[#0A2A5E] px-6 py-2.5 rounded-full font-black ml-4 shadow-lg hover:bg-white transition-all transform hover:-translate-y-1">CONTACT</a>
          </div>
          <button className="xl:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}><Menu size={28} /></button>
        </div>
      </nav>

      {/* --- 📱 MOBILE MENU --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed inset-0 z-[200] bg-[#0A2A5E] flex flex-col p-8 text-white">
            <div className="flex justify-between items-center mb-12"><span className="font-black italic text-[#1FC8C8]">MENU</span><button onClick={() => setIsMenuOpen(false)}><X size={32}/></button></div>
            <div className="flex flex-col gap-8 text-3xl font-black italic">
              <a href="#home" onClick={() => setIsMenuOpen(false)}>HOME</a>
              <a href="#about" onClick={() => setIsMenuOpen(false)}>ABOUT</a>
              <a href="#services" onClick={() => setIsMenuOpen(false)}>SERVICES</a>
              <button onClick={() => handleNavFilter('place')} className="text-left text-[#1FC8C8]">PLACES & SPACES</button>
              <a href="#contact" onClick={() => setIsMenuOpen(false)} className="bg-[#1FC8C8] text-[#0A2A5E] p-4 rounded-2xl text-center text-xl">CONTACT</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- 🚀 HERO --- */}
      <section id="home" className="h-screen flex items-center justify-center px-6 bg-[#0A2A5E] relative overflow-hidden text-center">
        <div className="z-10">
          <p className="text-[#1FC8C8] text-[8px] md:text-[11px] font-black uppercase tracking-[0.6em] mb-4 italic opacity-80">SIMPLIFYING PROGRESS, DELIVERING VALUE.</p>
          <h1 className="text-6xl md:text-[9rem] font-black tracking-tighter uppercase italic leading-[0.85] text-white select-none">THE <span className="text-[#1FC8C8]">STANDARD</span> <br/> OF EXECUTION.</h1>
          <p className="text-white/40 text-[8px] md:text-[11px] font-black uppercase tracking-[0.4em] mt-10 italic">PROGRESS SIMPLIFIED — VALUE DELIVERED</p>
        </div>
      </section>

      {/* --- 🏢 ABOUT US (FIXED OVERLAP & BREATHABLE) --- */}
      <section id="about" className="min-h-screen lg:h-screen bg-[#1FC8C8] flex items-center justify-center px-6 py-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.2fr_2fr] gap-16 items-center text-[#0A2A5E]">
          <div>
            <h2 className="text-6xl md:text-[8.5rem] font-black uppercase italic tracking-tighter leading-[0.8] mb-4">BEYOND A <br/> DIGITAL <br/> AGENCY.</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 italic">Move ahead, stay ahead.</p>
          </div>
          <div className="border-l-[12px] border-[#0A2A5E] pl-8 md:pl-16 flex flex-col gap-10">
            <p className="font-black text-sm md:text-lg italic uppercase tracking-[0.2em] leading-relaxed opacity-70">
              Precede Concepts bridges the gap between high-end professional services and accessible solutions in Ghana.
            </p>
            <p className="text-xl md:text-3xl font-black uppercase leading-[1.3]">
              We operate a dual-purpose ecosystem: a primary business executing top-tier digital & multimedia services, and a CSR hub driving traffic by curating vital community resources.
            </p>
            <div className="pt-10 border-t-4 border-[#0A2A5E]/10">
              <h4 className="font-black text-[10px] mb-4 tracking-[0.3em] opacity-40">CORE PILLARS</h4>
              <p className="text-[12px] md:text-[14px] font-bold uppercase italic leading-loose tracking-wide">
                BUSINESS GROWTH: Registration, Strategic Consultation. <br/>
                IDENTITY & BRANDING: Design, Printing, Banners, Stickers, Labels. <br/>
                TECH: Web Dev, Web Audit, AI Integration. <br/>
                CAPACITY: Specialized Training.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- 🛠️ SERVICES --- */}
      <section id="services" className="min-h-screen py-32 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-black uppercase italic text-[#0A2A5E] mb-20 tracking-tighter text-left">OUR SERVICES.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {services.map((s, i) => (
              <div key={i} className="p-10 bg-slate-50 border-2 border-slate-100 rounded-[3.5rem] transition-all hover:border-[#1FC8C8] group hover:shadow-2xl hover:-translate-y-2 duration-500">
                <div className="flex items-center gap-5 mb-8 pb-8 border-b-2 border-slate-200/50">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#0F4C81] group-hover:bg-[#1FC8C8] group-hover:text-[#0A2A5E] transition-all duration-500">{s.icon}</div>
                  <h3 className="text-lg font-black uppercase italic text-[#0A2A5E] leading-none">{s.title}</h3>
                </div>
                <ul className="space-y-4 text-left">
                  {s.list.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-[12px] font-black text-slate-500 uppercase italic"><CheckCircle2 size={16} className="text-[#1FC8C8] flex-shrink-0"/> {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- ⚡ OPPORTUNITY HUB --- */}
      <section id="hub" className="min-h-screen py-32 px-6 bg-[#0F4C81]">
        <div className="max-w-[1500px] mx-auto text-left">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-10">
            <div className="flex-1 w-full max-w-2xl">
              <h2 className="text-5xl font-black uppercase italic text-white mb-8 tracking-tighter">OPPORTUNITY HUB.</h2>
              <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#1FC8C8]" size={24} />
                <input 
                  type="text" 
                  placeholder="SEARCH LOCATIONS, RESTAURANTS, PUBS..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-6 pl-18 bg-white/10 border-2 border-white/10 rounded-[2rem] text-white outline-none focus:border-[#1FC8C8] font-black uppercase text-sm italic transition-all placeholder:text-white/20"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 bg-black/30 p-2 rounded-full border border-white/5">
              {['all', 'training', 'job', 'event', 'place'].map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-[#1FC8C8] text-[#0A2A5E] shadow-xl' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
                  {f === 'place' ? 'PLACES & SPACES' : f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {featured.length > 0 && filter === 'all' && !searchQuery && (
            <div className="mb-20">
              <div className="flex items-center gap-2 text-[#1FC8C8] mb-10 font-black uppercase italic text-sm tracking-widest"><Sparkles size={20}/> FEATURED PICKS</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                {featured.map(item => <ScoutCard key={`f-${item.id}`} item={item} isFeatured />)}
              </div>
              <div className="h-px w-full bg-white/10 mt-20" />
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 mt-12">
            {filteredItems.map(item => <ScoutCard key={item.id} item={item} />)}
          </div>
        </div>
      </section>

      {/* --- 💬 CONTACT --- */}
      <section id="contact" className="min-h-screen bg-[#0A2A5E] flex items-center justify-center px-6 text-white text-left">
        <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-7xl lg:text-[9.5rem] font-black italic uppercase leading-[0.8] mb-4">MOVE AHEAD, <br/><span className="text-[#1FC8C8]">STAY AHEAD.</span></h2>
            <p className="text-white/30 text-[11px] font-black uppercase tracking-[0.5em] italic">PROGRESS SIMPLIFIED — VALUE DELIVERED</p>
          </div>
          <div className="bg-white/5 p-12 rounded-[4.5rem] border-4 border-white/10 shadow-2xl backdrop-blur-sm">
            <div className="space-y-12 mb-12">
              <div className="flex items-center gap-8 group cursor-pointer">
                <div className="p-6 bg-[#1FC8C8]/20 rounded-3xl text-[#1FC8C8] group-hover:bg-[#1FC8C8] group-hover:text-[#0A2A5E] transition-all"><Phone size={36}/></div>
                <div><span className="text-[12px] font-black uppercase text-white/40 tracking-widest">VOICE</span><p className="text-4xl font-black italic tracking-tighter">0591999544</p></div>
              </div>
              <div className="flex items-center gap-8 group cursor-pointer">
                <div className="p-6 bg-[#1FC8C8]/20 rounded-3xl text-[#1FC8C8] group-hover:bg-[#1FC8C8] group-hover:text-[#0A2A5E] transition-all"><Mail size={36}/></div>
                <div><span className="text-[12px] font-black uppercase text-white/40 tracking-widest">MAIL</span><p className="text-2xl font-black italic tracking-tighter">precedeconcepts@gmail.com</p></div>
              </div>
            </div>
            <div className="flex flex-col gap-6">
               <div className="grid grid-cols-2 gap-6">
                  <a href={`https://wa.me/233591999544`} target="_blank" className="bg-white text-[#0A2A5E] p-6 rounded-[2rem] font-black uppercase italic text-xs flex items-center justify-center gap-3 hover:bg-[#1FC8C8] transition-all transform hover:-translate-y-1"><WhatsAppIcon /> WHATSAPP</a>
                  <a href={`https://whatsapp.com/channel/0029Vb7Mfjf5EjxpZuIIpA2W`} target="_blank" className="bg-white/10 border-2 border-white/10 p-6 rounded-[2rem] font-black uppercase italic text-xs flex items-center justify-center gap-3 hover:bg-white/20 transition-all transform hover:-translate-y-1"><Smartphone size={20}/> CHANNEL</a>
               </div>
               <button onClick={() => window.location.href = `mailto:${BUSINESS_EMAIL}`} className="bg-[#1FC8C8] text-[#0A2A5E] p-8 rounded-[3rem] font-black uppercase italic text-sm shadow-2xl hover:bg-white transition-all transform hover:-translate-y-1 tracking-[0.2em]">SEND AN EMAIL</button>
            </div>
          </div>
        </div>
      </section>

      {/* --- 🔝 RETURN TO TOP --- */}
      <AnimatePresence>
        {showTopBtn && (
          <motion.button 
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
            className="fixed bottom-10 right-10 z-[150] p-5 bg-[#1FC8C8] text-[#0A2A5E] rounded-2xl shadow-2xl hover:bg-white hover:scale-110 transition-all"
          >
            <ArrowUp size={28} />
          </motion.button>
        )}
      </AnimatePresence>

      <footer className="bg-[#0A2A5E] py-16 border-t border-white/5 text-center">
          <p className="text-[#1FC8C8] font-black uppercase italic text-[12px] tracking-[0.5em]">PRECEDE CONCEPTS</p>
          <p className="text-white/20 font-black uppercase text-[10px] tracking-[0.3em] mt-3">ACCRA GHANA · © 2026</p>
      </footer>
    </div>
  )
}

function ScoutCard({ item, isFeatured }: { item: any; isFeatured?: boolean }) {
  const targetDate = new Date(item.event_date);
  const today = new Date(); today.setHours(0,0,0,0);
  const diff = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
  const isToday = targetDate.toDateString() === today.toDateString();
  const isPast = targetDate < today && !isToday;
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.map_query || item.venue)}`;

  return (
    <div className={`group bg-white rounded-[2.5rem] overflow-hidden flex flex-col shadow-xl transition-all hover:scale-[1.03] h-full ${isFeatured ? 'border-4 border-[#1FC8C8] ring-8 ring-[#1FC8C8]/5' : 'border border-slate-100'}`}>
      <div className="h-28 bg-slate-900 relative">
        {item.image_url && <img src={item.image_url} className="w-full h-full object-cover opacity-80" />}
        <span className="absolute top-4 left-4 text-[7px] font-black bg-[#1FC8C8] text-[#0A2A5E] px-3 py-1 rounded-full uppercase italic tracking-widest">{item.category}</span>
      </div>
      <div className="p-6 flex flex-col flex-1 text-left">
        <h4 className="font-black text-[15px] text-[#0A2A5E] uppercase italic leading-tight line-clamp-2 h-9 mb-3">{item.title}</h4>
        <div className="mb-4 pb-3 border-b border-slate-100">
          <p className="text-[10px] font-black uppercase italic text-slate-500 leading-none">{targetDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
          <p className={`text-[9px] font-black uppercase italic mt-1.5 ${isToday ? 'text-red-600 animate-pulse' : isPast ? 'text-slate-300' : 'text-[#1FC8C8]'}`}>{isToday ? 'TODAY' : isPast ? 'PAST' : `${diff} DAYS LEFT`}</p>
        </div>
        <div className="mt-auto flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[12px] font-black text-[#0A2A5E] uppercase italic truncate"><MapPin size={14} className="text-[#1FC8C8] flex-shrink-0"/> {item.venue}</div>
            <a href={mapUrl} target="_blank" className="text-[8px] font-black text-blue-500 uppercase italic hover:text-[#1FC8C8] transition-colors ml-5 tracking-tighter">VIEW PRECISE LOCATION</a>
          </div>
          <a href={item.link} target="_blank" className="w-full py-2.5 bg-slate-50 text-[#0A2A5E] border border-slate-200 rounded-2xl text-[10px] font-black uppercase text-center group-hover:bg-[#0A2A5E] group-hover:text-white transition-all shadow-sm">VIEW DETAILS</a>
        </div>
      </div>
    </div>
  )
}