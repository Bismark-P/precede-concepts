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

  const BUSINESS_PHONE = "+233 (0)59 199 9544"
  const BUSINESS_EMAIL = "precedeconcepts@gmail.com"

  useEffect(() => { setMounted(true); fetchApproved(); }, [])

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
    const s = searchQuery.toLowerCase();
    const match = item.title?.toLowerCase().includes(s) || item.venue?.toLowerCase().includes(s);
    const catMatch = filter === 'all' || (filter === 'training' ? (item.category === 'training' || item.category === 'seminar') : item.category === filter);
    return match && catMatch;
  });

  const featuredItems = items.filter(i => i.is_featured && i.status === 'approved').slice(0, 6);

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
    <div className="bg-[#0A2A5E] font-sans text-slate-950 scroll-smooth overflow-x-hidden">
      {/* --- NAVIGATION (EXACT SYNC WITH nav.PNG) --- */}
      <nav className="fixed top-0 w-full z-[100] bg-[#0A2A5E]/90 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1FC8C8] rounded-xl flex items-center justify-center font-black italic text-[#0A2A5E] text-[12px] shadow-lg">PC</div>
            <span className="text-sm md:text-xl font-black uppercase italic tracking-tighter">PRECEDE CONCEPTS</span>
          </div>
          <div className="hidden xl:flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.1em]">
            <a href="#home">HOME</a> 
            <a href="#about">ABOUT</a> 
            <a href="#services">SERVICES</a>
            <button onClick={() => handleNavFilter('training')}>Training</button>
            <button onClick={() => handleNavFilter('job')}>Jobs</button>
            <button onClick={() => handleNavFilter('event')}>Events</button>
            <button onClick={() => handleNavFilter('place')} className="text-[#1FC8C8]">Places & Spaces</button>
            <a href="#contact" className="bg-[#1FC8C8] text-[#0A2A5E] px-5 py-2 rounded-full font-black ml-4 shadow-lg">CONTACT</a>
          </div>
          <button className="xl:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}><Menu size={28} /></button>
        </div>
      </nav>

      {/* --- HERO (EXACT SYNC WITH hp.PNG) --- */}
      <section id="home" className="h-screen flex items-center justify-center px-6 bg-[#0A2A5E] relative overflow-hidden text-center">
        <div className="z-10">
          <p className="text-[#1FC8C8] text-[8px] md:text-[11px] font-black uppercase tracking-[0.6em] mb-4 italic opacity-80">SIMPLIFYING PROGRESS, DELIVERING VALUE.</p>
          <h1 className="text-6xl md:text-[9rem] font-black tracking-tighter uppercase italic leading-[0.85] text-white">THE <span className="text-[#1FC8C8]">STANDARD</span> <br/> OF EXECUTION.</h1>
          <p className="text-white/40 text-[8px] md:text-[11px] font-black uppercase tracking-[0.4em] mt-10 italic">PROGRESS SIMPLIFIED — VALUE DELIVERED</p>
        </div>
      </section>

      {/* --- ABOUT US (PREMIUM POLISHED LAYOUT) --- */}
      <section id="about" className="h-screen bg-[#1FC8C8] flex items-center justify-center px-6 text-left">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 text-[#0A2A5E]">
          <h2 className="lg:w-1/3 text-6xl md:text-[8rem] font-black uppercase italic tracking-tighter leading-[0.8]">BEYOND A <br/> DIGITAL <br/> AGENCY.</h2>
          <div className="lg:w-2/3 border-l-[10px] border-[#0A2A5E] pl-12 flex flex-col justify-center gap-10">
            {/* Premium spaced font for first paragraph */}
            <p className="font-black text-lg md:text-xl italic uppercase tracking-[0.15em] leading-tight opacity-70">
              Precede Concepts bridges the gap between high-end professional services and accessible solutions in Ghana.
            </p>
            {/* Merged last two paragraphs */}
            <p className="text-xl md:text-2xl font-black uppercase leading-relaxed">
              We operate a dual-purpose ecosystem: a primary business executing top-tier digital & multimedia services, and a CSR hub driving traffic by curating vital community resources.
            </p>
            <div className="pt-8 border-t-2 border-[#0A2A5E]/20 text-[11px] font-black uppercase italic opacity-80 leading-relaxed">
              BUSINESS GROWTH: REGISTRATION, STRATEGIC CONSULTATION. <br/>
              IDENTITY & BRANDING: DESIGN, PRINTING, BANNERS, STICKERS. <br/>
              TECH: WEB DEV, WEB AUDIT, AI INTEGRATION. <br/>
              CAPACITY: SPECIALIZED TRAINING.
            </div>
          </div>
        </div>
      </section>

      {/* --- SERVICES (EXACT SYNC WITH P SERVICES.PNG) --- */}
      <section id="services" className="min-h-screen py-32 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-black uppercase italic text-[#0A2A5E] mb-20 tracking-tighter text-left">OUR SERVICES.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {services.map((s, i) => (
              <div key={i} className="p-10 bg-slate-50 border-2 border-slate-100 rounded-[3rem] transition-all hover:border-[#1FC8C8] group shadow-sm">
                <div className="flex items-center gap-5 mb-8 pb-8 border-b-2 border-slate-200/50">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#0F4C81] group-hover:bg-[#1FC8C8] group-hover:text-[#0A2A5E] transition-all">{s.icon}</div>
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

      {/* --- OPPORTUNITY HUB (EXACT SYNC WITH hub.PNG) --- */}
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
                  className="w-full p-6 pl-18 bg-white/10 border-2 border-white/10 rounded-[2rem] text-white outline-none focus:border-[#1FC8C8] font-black uppercase text-sm italic transition-all"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 bg-black/30 p-2 rounded-full border border-white/5">
              {['all', 'training', 'job', 'event', 'place'].map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-[#1FC8C8] text-[#0A2A5E] shadow-xl' : 'text-white/40 hover:text-white'}`}>
                  {f === 'place' ? 'PLACES & SPACES' : f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {featuredItems.length > 0 && filter === 'all' && searchQuery === '' && (
            <div className="mb-20">
              <div className="flex items-center gap-2 text-[#1FC8C8] mb-10 font-black uppercase italic text-sm tracking-widest"><Sparkles size={20}/> FEATURED PICKS</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                {featuredItems.map(item => <ScoutCard key={`f-${item.id}`} item={item} isFeatured />)}
              </div>
              <div className="h-px w-full bg-white/10 mt-20" />
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 mt-12">
            {filteredBySearch.map(item => <ScoutCard key={item.id} item={item} />)}
          </div>
        </div>
      </section>

      {/* --- CONTACT (EXACT SYNC WITH p5a.PNG) --- */}
      <section id="contact" className="h-screen bg-[#0A2A5E] flex items-center justify-center px-6 text-white text-left">
        <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-7xl lg:text-[9rem] font-black italic uppercase leading-[0.85] mb-2">MOVE AHEAD, <br/><span className="text-[#1FC8C8]">STAY AHEAD.</span></h2>
            <p className="text-white/30 text-[11px] font-black uppercase tracking-[0.5em] italic">PROGRESS SIMPLIFIED — VALUE DELIVERED</p>
          </div>
          <div className="bg-white/5 p-12 rounded-[4rem] border-4 border-white/10 shadow-2xl backdrop-blur-md">
            <div className="space-y-10 mb-12">
              <div className="flex items-center gap-8 text-left">
                <div className="p-6 bg-[#1FC8C8]/20 rounded-2xl text-[#1FC8C8]"><Phone size={36}/></div>
                <div><span className="text-[12px] font-black uppercase text-white/40 tracking-widest leading-none">CALL US</span><p className="text-4xl font-black italic tracking-tighter">0591999544</p></div>
              </div>
              <div className="flex items-center gap-8 text-left">
                <div className="p-6 bg-[#1FC8C8]/20 rounded-2xl text-[#1FC8C8]"><Mail size={36}/></div>
                <div><span className="text-[12px] font-black uppercase text-white/40 tracking-widest leading-none">EMAIL US</span><p className="text-2xl font-black italic tracking-tighter">precedeconcepts@gmail.com</p></div>
              </div>
            </div>
            <div className="flex flex-col gap-5">
               <div className="grid grid-cols-2 gap-5">
                  <a href={`https://wa.me/233591999544`} target="_blank" className="bg-white text-[#0A2A5E] p-6 rounded-[2rem] font-black uppercase italic text-xs flex items-center justify-center gap-3 hover:bg-[#1FC8C8] transition-all shadow-xl"><WhatsAppIcon /> WHATSAPP MESSAGE</a>
                  <a href={`https://whatsapp.com/channel/0029Vb7Mfjf5EjxpZuIIpA2W`} target="_blank" className="bg-white/10 border-2 border-white/10 p-6 rounded-[2rem] font-black uppercase italic text-xs flex items-center justify-center gap-3 hover:bg-white/20 transition-all"><Smartphone size={20}/> JOIN CHANNEL</a>
               </div>
               <button onClick={() => window.location.href = `mailto:${BUSINESS_EMAIL}`} className="bg-[#1FC8C8] text-[#0A2A5E] p-7 rounded-[2.5rem] font-black uppercase italic text-sm shadow-2xl hover:bg-white transition-all tracking-[0.2em]">SEND AN EMAIL</button>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER (EXACT SYNC WITH BRANDING) --- */}
      <footer className="bg-[#0A2A5E] py-12 border-t border-white/5 text-center">
          <div className="w-12 h-1 bg-[#1FC8C8] mx-auto mb-8 rounded-full opacity-20" />
          <p className="text-[#1FC8C8] font-black uppercase italic text-[12px] tracking-[0.4em]">PRECEDE CONCEPTS</p>
          <p className="text-white/20 font-black uppercase text-[9px] tracking-[0.2em] mt-2">ACCRA GHANA · © 2026</p>
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
        <span className="absolute top-4 left-4 text-[8px] font-black bg-[#1FC8C8] text-[#0A2A5E] px-3 py-1 rounded-full uppercase italic tracking-widest">{item.category}</span>
      </div>
      <div className="p-6 flex flex-col flex-1 text-left">
        <h4 className="font-black text-[16px] text-[#0A2A5E] uppercase italic leading-tight line-clamp-2 h-10 mb-3">{item.title}</h4>
        <div className="mb-5 text-left pb-4 border-b border-slate-100">
          <p className="text-[11px] font-black uppercase italic text-slate-500 leading-none">{targetDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
          <p className={`text-[10px] font-black uppercase italic mt-2 ${isToday ? 'text-red-600 animate-pulse' : isPast ? 'text-slate-300' : 'text-[#1FC8C8]'}`}>{isToday ? 'TODAY' : isPast ? 'PAST' : `${diff} DAYS LEFT`}</p>
        </div>
        <div className="mt-auto flex flex-col gap-4 text-left">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[12px] font-black text-[#0A2A5E] uppercase italic truncate"><MapPin size={14} className="text-[#1FC8C8] flex-shrink-0"/> {item.venue}</div>
            <a href={mapUrl} target="_blank" className="text-[8px] font-black text-blue-500 uppercase italic hover:text-[#1FC8C8] transition-colors ml-5">VIEW PRECISE LOCATION</a>
          </div>
          <a href={item.link} target="_blank" className="w-full py-3 bg-slate-50 text-[#0A2A5E] border border-slate-200 rounded-2xl text-[10px] font-black uppercase text-center group-hover:bg-[#0A2A5E] group-hover:text-white transition-all shadow-sm">VIEW DETAILS</a>
        </div>
      </div>
    </div>
  )
}