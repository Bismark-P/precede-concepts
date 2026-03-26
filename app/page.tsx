'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from './lib/supabase'
import { 
  MapPin, ArrowUpRight, Code2, Palette, Database, 
  CircleDollarSign, Printer, Smartphone, Phone, Mail, 
  Menu, X, Users, PlayCircle, CheckCircle2, Send, Megaphone, 
  Sparkles, Search, Calendar, Map as MapIcon
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

  const BUSINESS_EMAIL = "precedeconcepts@gmail.com"
  const BUSINESS_PHONE = "0591999544"

  useEffect(() => { 
    setMounted(true); 
    fetchApproved(); 
  }, [])

  async function fetchApproved() {
    const { data } = await supabase.from('jobs').select('*').eq('status', 'approved').order('created_at', { ascending: false })
    if (data) setItems(data)
  }

  const handleMailTo = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `mailto:${BUSINESS_EMAIL}?subject=New Inquiry for Precede Concepts`;
  };

  // --- RESTORED FEATURED & HUB LOGIC ---
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

  // Featured shows regardless of search to keep the Hub looking active
  const featuredItems = items.filter(i => i.is_featured === true && i.status === 'approved').slice(0, 6);
  const displayItems = filteredBySearch.slice(0, visibleCount);

  const hubFilters = [
    { id: 'all', label: 'All' },
    { id: 'training', label: 'Training' },
    { id: 'job', label: 'Jobs' },
    { id: 'event', label: 'Events' },
    { id: 'place', label: 'Places & Spaces' }
  ];

  if (!mounted) return null

  return (
    <div className="bg-[#0A2A5E] font-sans text-slate-950 scroll-smooth">
      <nav className="fixed top-0 w-full z-[100] bg-[#0A2A5E]/90 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-white text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#1FC8C8] rounded-lg flex items-center justify-center font-black italic text-[#0A2A5E] text-[10px] shadow-lg">PC</div>
            <span className="text-sm md:text-lg font-black tracking-tighter uppercase italic leading-none">Precede Concepts</span>
          </div>
          <div className="hidden xl:flex items-center gap-6 text-[9px] font-black uppercase tracking-[0.2em] text-white/70">
            <a href="#home" className="hover:text-[#1FC8C8] transition-all">Home</a>
            <a href="#about" className="hover:text-[#1FC8C8] transition-all">About</a>
            <a href="#services" className="hover:text-[#1FC8C8] transition-all">Services</a>
            <a href="#hub" className="hover:text-[#1FC8C8] transition-all">The Hub</a>
            <a href="#contact" className="bg-[#1FC8C8] text-[#0A2A5E] px-5 py-2.5 rounded-full font-black ml-2 transition-all hover:bg-white">Contact Us</a>
          </div>
          <button className="xl:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
        </div>
      </nav>

      {/* 🚀 RESTORED HERO WITH MOTION & SUBHEADERS */}
      <section id="home" className="min-h-screen lg:h-screen flex items-center justify-center px-6 pt-20 bg-[#0A2A5E] relative overflow-hidden text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10"
        >
          <p className="text-[#1FC8C8] text-[10px] md:text-[12px] font-black uppercase tracking-[0.6em] mb-4">Simplifying progress, delivering value.</p>
          <h1 className="text-5xl md:text-8xl lg:text-[10rem] font-black tracking-tighter uppercase italic leading-[0.85] text-white">
            THE <span className="text-[#1FC8C8]">STANDARD</span> <br/> OF EXECUTION.
          </h1>
          <p className="text-white/40 text-[10px] md:text-[12px] font-black uppercase tracking-[0.4em] mt-6">Progress Simplified — Value Delivered</p>
        </motion.div>
        
        {/* Floating Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#1FC8C8] rounded-full blur-[120px]" />
          <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 7, repeat: Infinity }} className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#0F4C81] rounded-full blur-[150px]" />
        </div>
      </section>

      {/* About (Design Intact) */}
      <section id="about" className="min-h-screen lg:h-screen w-full flex items-center justify-center px-6 pt-20 bg-[#1FC8C8]">
        <div className="max-w-6xl mx-auto w-full flex flex-col lg:flex-row gap-12 items-center">
          <h2 className="lg:flex-1 text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-[#0A2A5E] leading-none text-center lg:text-left">Beyond a <br/> Digital Agency.</h2>
          <div className="lg:flex-[1.5] border-l-4 lg:border-l-8 border-[#0A2A5E] pl-6 text-[#0A2A5E] text-left">
             <p className="font-black text-lg md:text-2xl leading-relaxed italic mb-6">Precede Concepts bridges the gap between high-end professional services and accessible "hustle-friendly" solutions in Ghana.</p>
             <p className="text-[#0A2A5E]/70 text-xs font-black uppercase tracking-widest leading-loose">We operate a dual-purpose ecosystem: A primary business executing top-tier multimedia services, and a Hub curating vital community resources.</p>
          </div>
        </div>
      </section>

      {/* Services (Design Intact) */}
      <section id="services" className="min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-12 bg-white">
        <div className="w-full max-w-7xl mx-auto">
          <div className="text-center mb-10 text-[#0A2A5E]"><h2 className="text-4xl font-black uppercase italic">Our Services.</h2><p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.5em]">Comprehensive Business Solutions</p></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Admin & Secretarial', icon: <Printer size={20}/>, list: ['Printing & Photocopy', 'Document Binding', 'Scanning & Laminating'] },
              { title: 'Graphic Design', icon: <Palette size={20}/>, list: ['Logo & Branding', 'Flyers & Banners', 'UI/UX Visuals'] },
              { title: 'Digital Solutions', icon: <Code2 size={20}/>, list: ['Web Development', 'Backend Systems', 'API Integrations'] },
              { title: 'Digital Marketing', icon: <Megaphone size={20}/>, list: ['Social Media Mgt.', 'SEO Optimization', 'Targeted Ads'] },
              { title: 'Media Production', icon: <PlayCircle size={20}/>, list: ['Content Creation', 'Video Editing', 'Photo Retouching'] },
              { title: 'Agency Outsourcing', icon: <Users size={20}/>, list: ['White-Label Tech', 'Remote Assistance', 'B2B Execution'] },
            ].map((cat, i) => (
              <div key={i} className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] hover:border-[#1FC8C8] transition-all flex flex-col text-left group">
                <div className="flex items-center gap-4 mb-5 pb-5 border-b border-slate-200/50">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#0F4C81] group-hover:scale-110 transition-transform">{cat.icon}</div>
                  <h3 className="text-sm font-black uppercase italic text-[#0A2A5E]">{cat.title}</h3>
                </div>
                <ul className="space-y-3">{cat.list.map((sub, idx) => <li key={idx} className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase"><CheckCircle2 size={12} className="text-[#1FC8C8]"/> {sub}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ⚡ THE HUB (RESTORED FEATURED PICKS) */}
      <section id="hub" className="min-h-screen w-full flex flex-col items-center px-4 md:px-6 pt-32 pb-20 bg-[#0F4C81] scroll-mt-0">
        <div className="w-full max-w-[1400px] mx-auto flex flex-col">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="w-full md:w-1/2 text-left">
              <h2 className="text-3xl md:text-4xl font-black uppercase italic text-white tracking-tighter mb-6">Opportunity Hub</h2>
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#1FC8C8]" size={18} />
                <input 
                  type="text" 
                  placeholder="Search titles, venues, or hosts..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-4 pl-14 bg-white/10 border-2 border-white/10 rounded-2xl text-white outline-none focus:border-[#1FC8C8] font-bold text-xs"
                />
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-2 bg-black/20 p-1.5 rounded-full">
              {hubFilters.map((f) => (
                <button key={f.id} onClick={() => {setFilter(f.id); setVisibleCount(18);}} className={`px-5 py-2 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${filter === f.id ? 'bg-[#1FC8C8] text-[#0A2A5E]' : 'text-white/60'}`}>{f.label}</button>
              ))}
            </div>
          </div>

          {/* OUR PICKS - ALWAYS VISIBLE IF DATA EXISTS */}
          {featuredItems.length > 0 && filter === 'all' && searchQuery === '' && (
            <div className="mb-16 text-left">
              <div className="flex items-center gap-3 mb-6"><Sparkles size={18} className="text-[#1FC8C8]" /><h3 className="text-sm font-black uppercase tracking-[0.3em] text-[#1FC8C8] italic">Our Top Picks</h3></div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {featuredItems.map((item) => <ScoutCard key={`f-${item.id}`} item={item} isFeatured={true} />)}
              </div>
              <div className="h-px w-full bg-white/10 mt-16"></div>
            </div>
          )}
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {displayItems.length > 0 ? displayItems.map((item) => <ScoutCard key={item.id} item={item} />) : <div className="col-span-full py-20 text-white/20 font-black uppercase italic text-center">No results found in this category.</div>}
          </div>

          {filteredBySearch.length > visibleCount && (
            <div className="flex justify-center mt-12"><button onClick={() => setVisibleCount(prev => prev + 18)} className="px-10 py-4 bg-white/10 border border-white/20 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#1FC8C8] transition-all">View More</button></div>
          )}
        </div>
      </section>

      {/* Contact Section (Restored mailto button) */}
      <section id="contact" className="h-screen w-full flex flex-col justify-between px-6 pt-24 pb-6 bg-[#0A2A5E] relative overflow-hidden text-white">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-8 items-center flex-1">
          <div className="text-left"><h2 className="text-5xl lg:text-[5.5rem] font-black italic uppercase leading-none mb-4">MOVE AHEAD, <br/><span className="text-[#1FC8C8]">STAY AHEAD.</span></h2></div>
          <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 text-left">
             <div className="flex flex-col gap-6 mb-8">
               <div className="flex items-center gap-4"><div className="p-4 bg-[#1FC8C8]/20 rounded-2xl text-[#1FC8C8]"><Phone size={24}/></div><div><span className="text-[8px] font-black uppercase text-[#1FC8C8]">Call Us</span><p className="text-3xl font-black italic">{BUSINESS_PHONE}</p></div></div>
               <div className="flex items-center gap-4"><div className="p-4 bg-[#1FC8C8]/20 rounded-2xl text-[#1FC8C8]"><Mail size={24}/></div><div><span className="text-[8px] font-black uppercase text-[#1FC8C8]">Email Us</span><p className="text-xl font-black italic">{BUSINESS_EMAIL}</p></div></div>
             </div>
             <div className="flex flex-col sm:flex-row gap-3 mb-4">
               <a href={`https://wa.me/233591999544`} target="_blank" className="flex-1 bg-white text-[#0A2A5E] p-5 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-2 hover:bg-[#1FC8C8] transition-all"><WhatsAppIcon /> Message</a>
               <a href={`https://whatsapp.com/channel/0029Vb7Mfjf5EjxpZuIIpA2W`} target="_blank" className="flex-1 bg-white/10 border border-white/10 p-5 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-2 hover:bg-white/20 transition-all"><Smartphone size={16}/> Channel</a>
             </div>
             <button onClick={handleMailTo} className="w-full py-5 bg-[#1FC8C8] text-[#0A2A5E] rounded-2xl font-black uppercase text-xs hover:bg-white transition-all shadow-xl flex justify-center items-center gap-3"><Send size={16} /> Send an Email</button>
          </div>
        </div>
        <div className="text-center pt-6 border-t border-white/10"><span className="text-white/30 text-[8px] font-black uppercase tracking-[0.5em]">Accra Ghana · © 2026</span></div>
      </section>
    </div>
  )
}

function ScoutCard({ item, isFeatured = false }: { item: any, isFeatured?: boolean }) {
  const targetDate = new Date(item.event_date);
  const today = new Date(); today.setHours(0,0,0,0);
  const dayName = targetDate.toLocaleDateString('en-US', { weekday: 'long' });
  const shortDate = targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const isToday = item.recurring_day === todayName || (targetDate.toDateString() === today.toDateString());
  const diffInDays = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const mapUrl = item.map_query ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.map_query)}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.venue)}`;

  return (
    <div className={`group bg-white rounded-[2rem] overflow-hidden flex flex-col shadow-2xl h-full border-2 ${isFeatured ? 'border-[#1FC8C8] ring-4 ring-[#1FC8C8]/10' : 'border-transparent'} hover:scale-[1.02] transition-all duration-300`}>
      <div className="h-28 lg:h-32 bg-slate-900 relative">
        {item.image_url && <img src={item.image_url} className="w-full h-full object-cover" />}
        <span className="absolute top-2 left-2 text-[6px] font-black bg-[#1FC8C8] text-[#0A2A5E] px-2 py-1 rounded-full uppercase">{item.category}</span>
        {isToday && <span className="absolute top-2 right-2 animate-pulse text-[6px] font-black bg-red-50 text-white px-2 py-1 rounded-full uppercase tracking-widest">Live Today</span>}
      </div>
      <div className="p-4 text-left flex flex-col flex-1">
        <h4 className="font-black text-[10px] lg:text-[11px] text-[#0A2A5E] uppercase italic leading-tight line-clamp-2 mb-1 h-8">{item.title}</h4>
        <p className="text-[7px] font-black text-[#1FC8C8] uppercase tracking-widest mb-2 italic">Organised by: {item.organizer_body || "Precede Verified"}</p>
        <div className="mb-3">
          <p className="text-[9px] font-black text-[#0A2A5E] uppercase italic flex items-center gap-1"><Calendar size={10}/> {item.recurring_day ? `Every ${item.recurring_day}` : `${dayName}, ${shortDate}`}</p>
          <p className={`text-[7px] font-bold uppercase mt-0.5 ${diffInDays <= 3 && diffInDays >= 0 ? 'text-orange-500' : 'text-slate-400'}`}>{diffInDays === 0 ? "Happening Now" : diffInDays > 0 ? `${diffInDays} Days Left` : "Past Event"}</p>
        </div>
        <div className="pt-3 border-t border-slate-100 mt-auto">
          <div className="flex flex-col gap-0.5 overflow-hidden mb-3">
             <div className="flex items-center gap-1 text-[8px] font-bold text-slate-400 uppercase truncate"><MapPin size={9}/> {item.venue}</div>
             <a href={mapUrl} target="_blank" className="text-[7px] font-black text-blue-500 uppercase flex items-center gap-1 hover:text-[#1FC8C8] transition-all"><MapIcon size={9}/> View Location</a>
          </div>
          <a href={item.link} target="_blank" className="w-full py-2 bg-slate-50 border border-slate-100 rounded-xl text-[#0A2A5E] hover:bg-[#0A2A5E] hover:text-white transition-all text-[8px] font-black uppercase flex items-center justify-center gap-2">Join / Apply <ArrowUpRight size={10}/></a>
        </div>
      </div>
    </div>
  )
}