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

// --- CUSTOM WHATSAPP SVG ICON ---
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

  // --- BUSINESS INFO ---
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

  // --- SEARCH & FILTER LOGIC ---
  const filteredBySearch = items.filter(item => {
    const matchesSearch = 
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.organizer_body?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.venue?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filter === 'all' 
      ? true 
      : (item.category?.toLowerCase() === filter.toLowerCase() || (filter === 'training' && item.category === 'seminar'));
    
    return matchesSearch && matchesFilter;
  });

  const featuredItems = filteredBySearch.filter(i => i.is_featured === true).slice(0, 6);
  const displayItems = filteredBySearch.slice(0, visibleCount);

  // --- UI CONFIG ---
  const hubFilters = [
    { id: 'all', label: 'All' },
    { id: 'training', label: 'Training' },
    { id: 'job', label: 'Jobs' },
    { id: 'event', label: 'Events' },
    { id: 'place', label: 'Places & Spaces' }
  ];

  const standardLinks = [{ name: 'Home', href: '#home' }, { name: 'About Us', href: '#about' }, { name: 'Services', href: '#services' }];
  const hubLinks = [
    { name: 'Training', filterId: 'training' }, 
    { name: 'Jobs', filterId: 'job' }, 
    { name: 'Events', filterId: 'event' },
    { name: 'Places & Spaces', filterId: 'place' }
  ];

  if (!mounted) return null

  return (
    <div className="bg-[#0A2A5E] font-sans text-slate-950 scroll-smooth">
      
      {/* 🧭 NAVIGATION */}
      <nav className="fixed top-0 w-full z-[100] bg-[#0A2A5E]/90 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#1FC8C8] rounded-lg flex items-center justify-center font-black italic text-[#0A2A5E] text-[10px] shadow-lg">PC</div>
            <span className="text-sm md:text-lg font-black tracking-tighter uppercase italic leading-none">Precede Concepts</span>
          </div>

          <div className="hidden xl:flex items-center gap-6 text-[9px] font-black uppercase tracking-[0.2em] text-white/70">
            {standardLinks.map((link) => <a key={link.name} href={link.href} className="hover:text-[#1FC8C8] transition-all">{link.name}</a>)}
            {hubLinks.map((link) => <a key={link.name} href="#hub" onClick={() => setFilter(link.filterId)} className="hover:text-[#1FC8C8] transition-all">{link.name}</a>)}
            <a href="#contact" className="bg-[#1FC8C8] text-[#0A2A5E] px-5 py-2.5 rounded-full font-black hover:bg-white transition-all ml-2">Contact Us</a>
          </div>
          <button className="xl:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
        </div>
      </nav>

      {/* [HERO, ABOUT, SERVICES SECTIONS - LAYOUT PRESERVED] */}
      <section id="home" className="min-h-screen lg:h-screen flex items-center justify-center px-6 pt-20 bg-[#0A2A5E] relative overflow-hidden">
        <div className="text-center w-full"><h1 className="text-5xl md:text-8xl lg:text-[10rem] font-black tracking-tighter uppercase italic leading-[0.9] text-white">THE <span className="text-[#1FC8C8]">STANDARD</span> <br/> OF EXECUTION.</h1></div>
      </section>

      {/* ⚡ 4. OPPORTUNITY HUB */}
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
                  className="w-full p-4 pl-14 bg-white/10 border-2 border-white/10 rounded-2xl text-white outline-none focus:border-[#1FC8C8] font-bold text-xs transition-all placeholder:text-white/20"
                />
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2 bg-black/20 p-1.5 rounded-full">
              {hubFilters.map((f) => (
                <button key={f.id} onClick={() => {setFilter(f.id); setVisibleCount(18);}} className={`px-5 py-2 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${filter === f.id ? 'bg-[#1FC8C8] text-[#0A2A5E]' : 'text-white/60'}`}>{f.label}</button>
              ))}
            </div>
          </div>

          {/* OUR PICKS */}
          {featuredItems.length > 0 && filter === 'all' && searchQuery === '' && (
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-6"><Sparkles size={18} className="text-[#1FC8C8]" /><h3 className="text-sm font-black uppercase tracking-[0.3em] text-[#1FC8C8] italic">Our Top Picks</h3></div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
                {featuredItems.map((item) => <ScoutCard key={`featured-${item.id}`} item={item} isFeatured={true} />)}
              </div>
              <div className="h-px w-full bg-white/10 mt-16"></div>
            </div>
          )}
          
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6"><h3 className="text-sm font-black uppercase tracking-[0.3em] text-white/40 italic">Latest Discoveries</h3></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
               {displayItems.length === 0 ? <div className="col-span-full text-center py-20 text-white/20 uppercase font-black text-xs tracking-widest">No matching results found.</div> : displayItems.map((item) => <ScoutCard key={item.id} item={item} />)}
            </div>
          </div>

          {filteredBySearch.length > visibleCount && (
            <div className="flex justify-center mt-12"><button onClick={() => setVisibleCount(prev => prev + 18)} className="px-10 py-4 bg-white/10 border border-white/20 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] hover:bg-[#1FC8C8] transition-all">View More</button></div>
          )}
        </div>
      </section>

      {/* [CONTACT & FOOTER - UNCHANGED] */}
      <section id="contact" className="h-screen w-full flex flex-col justify-between px-6 pt-24 pb-6 bg-[#0A2A5E] relative overflow-hidden text-white">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-8 items-center flex-1">
          <div className="text-left"><h2 className="text-5xl lg:text-[5.5rem] font-black italic uppercase leading-none mb-4 text-white">MOVE AHEAD, <br/><span className="text-[#1FC8C8]">STAY AHEAD.</span></h2></div>
          <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10">
             <div className="flex flex-col gap-6 mb-8 text-left">
               <div className="flex items-center gap-4"><div className="p-4 bg-[#1FC8C8]/20 rounded-2xl text-[#1FC8C8]"><Phone size={24}/></div><div className="text-left"><span className="text-[8px] font-black uppercase text-[#1FC8C8]">Call Us</span><p className="text-3xl font-black italic">{BUSINESS_PHONE}</p></div></div>
               <div className="flex items-center gap-4"><div className="p-4 bg-[#1FC8C8]/20 rounded-2xl text-[#1FC8C8]"><Mail size={24}/></div><div className="text-left"><span className="text-[8px] font-black uppercase text-[#1FC8C8]">Email Us</span><p className="text-xl font-black italic">{BUSINESS_EMAIL}</p></div></div>
             </div>
             <div className="flex flex-col sm:flex-row gap-3">
               <a href={`https://wa.me/233591999544`} target="_blank" className="flex-1 bg-white text-[#0A2A5E] p-5 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-2 hover:bg-[#1FC8C8] transition-all"><WhatsAppIcon /> Message</a>
               <a href={`https://whatsapp.com/channel/0029Vb7Mfjf5EjxpZuIIpA2W`} target="_blank" className="flex-1 bg-white/10 border border-white/10 p-5 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-2 hover:bg-white/20 transition-all"><Smartphone size={16}/> Channel</a>
             </div>
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
  const shortDate = targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  
  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const isToday = item.recurring_day === todayName || (targetDate.toDateString() === today.toDateString());
  const diffInDays = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const mapUrl = item.map_query 
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.map_query)}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.venue + " " + item.region)}`;

  return (
    <div className={`group bg-white rounded-[2rem] overflow-hidden flex flex-col shadow-2xl h-full border-2 ${isFeatured ? 'border-[#1FC8C8] ring-4 ring-[#1FC8C8]/10' : 'border-transparent'} hover:scale-[1.02] transition-all duration-300`}>
      <div className="h-28 lg:h-32 bg-slate-900 relative">
        {item.image_url && <img src={item.image_url} className="w-full h-full object-cover" />}
        <span className="absolute top-2 left-2 text-[6px] font-black bg-[#1FC8C8] text-[#0A2A5E] px-2 py-1 rounded-full uppercase">{item.category}</span>
        {isToday && <span className="absolute top-2 right-2 animate-pulse text-[6px] font-black bg-red-500 text-white px-2 py-1 rounded-full uppercase tracking-widest">Live Today</span>}
      </div>
      <div className="p-4 text-left flex flex-col flex-1">
        <div className="mb-2">
           <h4 className="font-black text-[10px] lg:text-[11px] text-[#0A2A5E] uppercase italic leading-tight line-clamp-2">{item.title}</h4>
           <p className="text-[7px] font-black text-[#1FC8C8] uppercase tracking-widest mt-1">Organised by: <span className="text-[#0A2A5E]">{item.organizer_body || "Precede Verified"}</span></p>
        </div>
        <div className="mb-3">
          <p className="text-[9px] font-black text-[#0A2A5E] uppercase italic flex items-center gap-1"><Calendar size={10}/> {item.recurring_day ? `Every ${item.recurring_day}` : `${dayName}, ${shortDate}`}</p>
          <p className={`text-[7px] font-bold uppercase tracking-widest mt-0.5 ${diffInDays <= 3 && diffInDays > 0 ? 'text-orange-500' : diffInDays === 0 ? 'text-[#1FC8C8]' : 'text-slate-400'}`}>
            {diffInDays === 0 ? "Happening Now" : diffInDays > 0 ? `${diffInDays} Days Left` : "Past Event"}
          </p>
        </div>
        <div className="pt-3 border-t border-slate-100 mt-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col gap-0.5">
               <div className="flex items-center gap-1 text-[8px] font-bold text-slate-400 uppercase truncate"><MapPin size={9}/> {item.venue}</div>
               <a href={mapUrl} target="_blank" className="text-[7px] font-black text-blue-500 hover:text-[#1FC8C8] uppercase flex items-center gap-1 transition-colors"><MapIcon size={9}/> View Precise Location</a>
            </div>
          </div>
          <a href={item.link} target="_blank" className="w-full py-2 bg-slate-50 border border-slate-100 rounded-xl text-[#0A2A5E] hover:bg-[#0A2A5E] hover:text-white transition-all text-[8px] font-black uppercase flex items-center justify-center gap-2">Join / Apply <ArrowUpRight size={10}/></a>
        </div>
      </div>
    </div>
  )
}