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
  const [visibleCount, setVisibleCount] = useState(18)
  const [searchQuery, setSearchQuery] = useState('')
  const [showBackToTop, setShowBackToTop] = useState(false)

  const BUSINESS_EMAIL = "precedeconcepts@gmail.com"
  const BUSINESS_PHONE = "0591999544"

  useEffect(() => { 
    setMounted(true); 
    fetchApproved(); 
    const handleScroll = () => setShowBackToTop(window.scrollY > 800);
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

  const filteredBySearch = items.filter(item => {
    const searchLow = searchQuery.toLowerCase();
    const matchesSearch = item.title?.toLowerCase().includes(searchLow) || 
                          item.organizer_body?.toLowerCase().includes(searchLow) || 
                          item.venue?.toLowerCase().includes(searchLow);
    let matchesFilter = filter === 'all';
    if (!matchesFilter) {
      if (filter === 'training') matchesFilter = item.category === 'training' || item.category === 'seminar';
      else matchesFilter = item.category === filter;
    }
    return matchesSearch && matchesFilter;
  });

  const featuredItems = items.filter(i => i.is_featured === true && i.status === 'approved').slice(0, 6);
  const displayItems = filteredBySearch.slice(0, visibleCount);

  const hubFilters = [
    { id: 'all', label: 'All' },
    { id: 'event', label: 'Events' },
    { id: 'training', label: 'Training' },
    { id: 'job', label: 'Jobs' },
    { id: 'place', label: 'Places & Spaces' }
  ];

  if (!mounted) return null

  return (
    <div className="bg-[#0A2A5E] font-sans text-slate-950 scroll-smooth overflow-x-hidden">
      {/* --- 🧭 NAVIGATION --- */}
      <nav className="fixed top-0 w-full z-[100] bg-[#0A2A5E]/90 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#1FC8C8] rounded-lg flex items-center justify-center font-black italic text-[#0A2A5E] text-[10px] shadow-lg">PC</div>
            <span className="text-sm md:text-lg font-black tracking-tighter uppercase italic leading-none">Precede Concepts</span>
          </div>
          <div className="hidden xl:flex items-center gap-5 text-[9px] font-black uppercase tracking-[0.2em] text-white/60">
            <a href="#home" className="hover:text-[#1FC8C8]">Home</a>
            <a href="#about" className="hover:text-[#1FC8C8]">About Us</a>
            <a href="#services" className="hover:text-[#1FC8C8]">Services</a>
            <div className="h-4 w-px bg-white/20 mx-2" />
            <button onClick={() => handleNavFilter('event')} className="hover:text-[#1FC8C8] uppercase">Events</button>
            <button onClick={() => handleNavFilter('training')} className="hover:text-[#1FC8C8] uppercase">Training</button>
            <button onClick={() => handleNavFilter('job')} className="hover:text-[#1FC8C8] uppercase">Jobs</button>
            <button onClick={() => handleNavFilter('place')} className="hover:text-[#1FC8C8] uppercase whitespace-nowrap">Places & Spaces</button>
            <a href="#contact" className="bg-[#1FC8C8] text-[#0A2A5E] px-5 py-2.5 rounded-full font-black ml-2 hover:bg-white transition-all">Contact Us</a>
          </div>
          <button className="xl:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
        </div>
      </nav>

      {/* --- 📱 MOBILE MENU --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed inset-0 z-[200] bg-[#0A2A5E] flex flex-col p-8 text-left text-white">
            <div className="flex justify-between items-center mb-10">
              <span className="font-black italic uppercase text-[#1FC8C8] tracking-widest text-xs">Navigation</span>
              <button onClick={() => setIsMenuOpen(false)}><X size={28} /></button>
            </div>
            <div className="flex flex-col gap-6 overflow-y-auto">
               <a href="#home" onClick={() => setIsMenuOpen(false)} className="text-3xl font-black uppercase italic">Home</a>
               <a href="#about" onClick={() => setIsMenuOpen(false)} className="text-3xl font-black uppercase italic text-white/50">About Us</a>
               <a href="#services" onClick={() => setIsMenuOpen(false)} className="text-3xl font-black uppercase italic text-white/50">Services</a>
               <div className="h-px bg-white/10 my-2" />
               {hubFilters.map(f => (
                 <button key={f.id} onClick={() => handleNavFilter(f.id)} className="text-xl font-black uppercase italic text-left text-white/40">{f.label}</button>
               ))}
               <a href="#contact" onClick={() => setIsMenuOpen(false)} className="bg-[#1FC8C8] text-[#0A2A5E] p-5 rounded-2xl font-black uppercase text-center mt-6 shadow-xl">Start Project</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- 🚀 HERO --- */}
      <section id="home" className="h-screen flex items-center justify-center px-6 bg-[#0A2A5E] relative overflow-hidden text-center border-b-8 border-[#1FC8C8]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="z-10">
          <p className="text-[#1FC8C8] text-[10px] md:text-[14px] font-black uppercase tracking-[0.6em] mb-4 italic">Simplifying progress, delivering value.</p>
          <h1 className="text-5xl md:text-8xl lg:text-[10rem] font-black tracking-tighter uppercase italic leading-[0.85] text-white">THE <span className="text-[#1FC8C8]">STANDARD</span> <br/> OF EXECUTION.</h1>
          <p className="text-white/40 text-[10px] md:text-[14px] font-black uppercase tracking-[0.4em] mt-6 italic">Progress Simplified — Value Delivered</p>
        </motion.div>
      </section>

      {/* --- 🏢 ABOUT --- */}
      <section id="about" className="h-screen flex items-center justify-center px-6 bg-[#1FC8C8] border-b-8 border-[#0A2A5E]">
        <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-12 items-center text-[#0A2A5E]">
          <h2 className="lg:flex-1 text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none text-left">Beyond a <br/> Digital Agency.</h2>
          <div className="lg:flex-[1.5] border-l-8 border-[#0A2A5E] pl-8 text-left">
             <p className="font-black text-2xl md:text-3xl italic mb-8 leading-tight uppercase">At Precede Concepts, we don’t just build digital products; we architect the infrastructure for your success.</p>
             <p className="text-lg font-black uppercase tracking-widest leading-relaxed mb-6">Our mission is to bridge the gap between high-tier corporate execution and the agile needs of modern entrepreneurship in Ghana. From professional media production to robust backend engineering, we deliver excellence without compromise.</p>
             <div className="flex gap-4">
                <div className="bg-[#0A2A5E] text-[#1FC8C8] px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest italic shadow-lg">Multimedia Mastery</div>
                <div className="bg-[#0A2A5E] text-[#1FC8C8] px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest italic shadow-lg">Tech Infrastructure</div>
             </div>
          </div>
        </div>
      </section>

      {/* --- 🛠️ SERVICES --- */}
      <section id="services" className="py-24 bg-white border-b-8 border-[#0F4C81]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-black uppercase italic text-[#0A2A5E] mb-16">The Professional Portfolio.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Admin & Secretarial', icon: <Printer size={24}/>, list: ['High-Volume Printing', 'Document Architecture', 'Professional Scanning'] },
              { title: 'Graphic Architecture', icon: <Palette size={24}/>, list: ['Brand Identity Design', 'Marketing Collateral', 'High-Fidelity UI/UX'] },
              { title: 'Backend Engineering', icon: <Code2 size={24}/>, list: ['Node.js & NestJS Systems', 'API Development', 'Database Optimization'] },
              { title: 'Growth Marketing', icon: <Megaphone size={24}/>, list: ['Social Media Strategy', 'SEO Domination', 'Performance Ads'] },
              { title: 'Media Production', icon: <PlayCircle size={24}/>, list: ['Cinematic Video Editing', 'Commercial Photography', 'Content Strategy'] },
              { title: 'B2B Outsourcing', icon: <Users size={24}/>, list: ['White-Label Tech Ops', 'Remote Support', 'Execution Support'] },
            ].map((cat, i) => (
              <div key={i} className="p-10 bg-slate-50 border-2 border-slate-100 rounded-[3rem] hover:border-[#1FC8C8] transition-all flex flex-col text-left group shadow-sm hover:shadow-2xl">
                <div className="flex items-center gap-5 mb-6 pb-6 border-b-2 border-slate-200/50">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#0F4C81] group-hover:bg-[#1FC8C8] group-hover:text-[#0A2A5E] transition-all">{cat.icon}</div>
                  <h3 className="text-lg font-black uppercase italic text-[#0A2A5E] leading-none">{cat.title}</h3>
                </div>
                <ul className="space-y-4">{cat.list.map((sub, idx) => <li key={idx} className="flex items-center gap-3 text-[12px] font-black text-slate-500 uppercase italic tracking-widest"><CheckCircle2 size={16} className="text-[#1FC8C8]"/> {sub}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- ⚡ HUB --- */}
      <section id="hub" className="py-24 bg-[#0F4C81] border-b-8 border-[#0A2A5E]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
            <div className="w-full md:w-1/2 text-left">
              <h2 className="text-4xl font-black uppercase italic text-white tracking-tighter mb-4 italic">Opportunity Hub.</h2>
              <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#1FC8C8]" size={20} />
                <input type="text" placeholder="Search for opportunities..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full p-5 pl-16 bg-white/10 border-4 border-white/10 rounded-[2rem] text-white outline-none focus:border-[#1FC8C8] font-black uppercase italic text-sm transition-all" />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 bg-black/30 p-2 rounded-full border-2 border-white/10">
              {hubFilters.map(f => (
                <button key={f.id} onClick={() => {setFilter(f.id); setVisibleCount(18);}} className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all ${filter === f.id ? 'bg-[#1FC8C8] text-[#0A2A5E] shadow-xl' : 'text-white/40 hover:text-white'}`}>{f.label}</button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {displayItems.map((item) => <ScoutCard key={item.id} item={item} />)}
          </div>
        </div>
      </section>

      {/* --- 💬 CONTACT --- */}
      <section id="contact" className="h-screen flex flex-col justify-between px-6 pt-24 pb-12 bg-[#0A2A5E] text-white">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center flex-1 text-left">
          <h2 className="text-6xl lg:text-[7rem] font-black italic uppercase leading-[0.9]">MOVE AHEAD, <br/><span className="text-[#1FC8C8]">STAY AHEAD.</span></h2>
          <div className="bg-white/5 p-10 rounded-[3.5rem] border-4 border-white/10 backdrop-blur-xl shadow-2xl">
             <div className="flex flex-col gap-8 mb-12">
               <div className="flex items-center gap-6"><div className="p-5 bg-[#1FC8C8]/20 rounded-2xl text-[#1FC8C8] shadow-inner"><Phone size={32}/></div><p className="text-4xl font-black italic tracking-tighter">{BUSINESS_PHONE}</p></div>
               <div className="flex items-center gap-6"><div className="p-5 bg-[#1FC8C8]/20 rounded-2xl text-[#1FC8C8] shadow-inner"><Mail size={32}/></div><p className="text-2xl font-black italic tracking-tighter">{BUSINESS_EMAIL}</p></div>
             </div>
             <div className="flex flex-col gap-4">
                <a href={`https://wa.me/233591999544`} target="_blank" className="bg-white text-[#0A2A5E] p-6 rounded-[2rem] font-black uppercase italic text-[12px] flex items-center justify-center gap-3 hover:bg-[#1FC8C8] transition-all shadow-xl tracking-[0.2em]"><WhatsAppIcon /> Chat on WhatsApp</a>
                <a href={`https://whatsapp.com/channel/0029Vb7Mfjf5EjxpZuIIpA2W`} target="_blank" className="bg-white/10 border-4 border-white/10 p-6 rounded-[2rem] font-black uppercase italic text-[12px] flex items-center justify-center gap-3 hover:bg-[#1FC8C8] hover:text-[#0A2A5E] transition-all tracking-[0.2em]"><Smartphone size={20}/> Join WhatsApp Channel</a>
                <button onClick={() => window.location.href = `mailto:${BUSINESS_EMAIL}`} className="w-full py-6 bg-[#1FC8C8] text-[#0A2A5E] rounded-[2rem] font-black uppercase italic text-[14px] shadow-2xl hover:bg-white transition-all tracking-[0.3em] mt-4 flex justify-center items-center gap-3"><Send size={20} /> Send us an Email</button>
             </div>
          </div>
        </div>
        <div className="text-center pt-8 border-t border-white/10 opacity-30 text-[10px] font-black uppercase italic tracking-[0.8em]">© 2026 Accra Ghana · PC Ecosystem</div>
      </section>

      {/* --- 🚀 TOP --- */}
      <AnimatePresence>{showBackToTop && <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-12 right-12 z-[150] p-6 bg-[#1FC8C8] text-[#0A2A5E] rounded-[2rem] shadow-2xl"><ArrowUp size={28} /></motion.button>}</AnimatePresence>
    </div>
  )
}

function ScoutCard({ item, isFeatured = false }: { item: any, isFeatured?: boolean }) {
  const targetDate = new Date(item.event_date);
  const dayName = targetDate.toLocaleDateString('en-US', { weekday: 'long' });
  const shortDate = targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const diffInDays = Math.ceil((targetDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const mapUrl = item.map_query ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.map_query)}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.venue)}`;

  return (
    <div className={`bg-white rounded-[2rem] overflow-hidden flex flex-col shadow-2xl h-full border-4 ${isFeatured ? 'border-[#1FC8C8]' : 'border-transparent'} hover:scale-[1.03] transition-all duration-300`}>
      <div className="h-28 bg-slate-900 relative">
        {item.image_url && <img src={item.image_url} className="w-full h-full object-cover opacity-80" />}
        <span className="absolute top-3 left-3 text-[8px] font-black bg-[#1FC8C8] text-[#0A2A5E] px-3 py-1 rounded-full uppercase italic tracking-widest">{item.category}</span>
      </div>
      <div className="p-5 text-left flex flex-col flex-1">
        <h4 className="font-black text-[13px] lg:text-[15px] text-[#0A2A5E] uppercase italic leading-tight line-clamp-2 h-9 mb-2">{item.title}</h4>
        <p className="text-[9px] font-black text-[#1FC8C8] uppercase tracking-[0.2em] mb-4 italic truncate">By: {item.organizer_body || "Precede Verified"}</p>
        <div className="mb-4 flex justify-between items-center bg-slate-50 p-3 rounded-2xl border-2 border-slate-100">
          <div className="text-[10px] font-black text-[#0A2A5E] uppercase italic flex items-center gap-2"><Calendar size={12}/> {item.recurring_day ? `Every ${item.recurring_day}` : `${dayName}, ${shortDate}`}</div>
          <p className={`text-[10px] font-black uppercase italic ${diffInDays <= 3 && diffInDays >= 0 ? 'text-orange-500' : 'text-slate-400'}`}>{diffInDays <= 0 ? "LIVE" : `${diffInDays}D`}</p>
        </div>
        <div className="pt-4 border-t-2 border-slate-100 mt-auto">
          <div className="flex flex-col gap-1 mb-4 overflow-hidden">
             <div className="text-[11px] font-black text-slate-500 uppercase truncate flex items-center gap-2 italic"><MapPin size={12}/> {item.venue}</div>
             <a href={mapUrl} target="_blank" className="text-[9px] font-black text-blue-500 uppercase italic hover:text-[#1FC8C8]">📍 View on Maps</a>
          </div>
          <a href={item.link} target="_blank" className="w-full py-4 bg-[#0A2A5E] text-white rounded-[1.5rem] font-black uppercase italic text-[11px] flex items-center justify-center gap-2 hover:bg-[#1FC8C8] hover:text-[#0A2A5E] transition-all shadow-lg tracking-widest">View Details <ArrowUpRight size={14}/></a>
        </div>
      </div>
    </div>
  )
}