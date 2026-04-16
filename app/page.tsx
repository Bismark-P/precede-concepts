'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from './lib/supabase'
import { 
  MapPin, Code2, Palette, Printer, 
  Smartphone, Phone, Mail, Menu, X, Users, PlayCircle, 
  CheckCircle2, Megaphone, Sparkles, Search, 
  ArrowUp, GraduationCap, Briefcase, Shield, HeartHandshake,
  Ticket, FileText, ChevronRight, ArrowUpRight
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
  const [globalSearch, setGlobalSearch] = useState('')
  const [showTopBtn, setShowTopBtn] = useState(false)
  const [heroKey, setHeroKey] = useState(0) 

  const BUSINESS_PHONE = "+233 (0)59 199 9544"
  const BUSINESS_EMAIL = "precedeconcepts@gmail.com"

  useEffect(() => { 
    setMounted(true); 
    fetchApproved(); 
    
    const handleScroll = () => setShowTopBtn(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);

    // SPA Masked Routing (No Hash Fragments)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          const id = entry.target.id;
          const path = id === 'home' ? '/' : `/${id}`;
          if (window.location.pathname !== path) {
            window.history.replaceState(null, '', path);
          }
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('section[id]').forEach(sec => observer.observe(sec));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    }
  }, [])

  async function fetchApproved() {
    const { data } = await supabase.from('jobs').select('*').eq('status', 'approved').order('created_at', { ascending: false })
    if (data) setItems(data); 
  }

  const navigateTo = (id: string) => {
    setIsMenuOpen(false);
    window.history.pushState(null, '', id === 'home' ? '/' : `/${id}`);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    if (id === 'home') setHeroKey(prev => prev + 1);
  };

  const handleNavFilter = (filterId: string) => {
    setFilter(filterId);
    setIsMenuOpen(false);
    document.getElementById('hub')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(globalSearch);
    document.getElementById('hub')?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredItems = items.filter(item => {
    const s = searchQuery.toLowerCase();
    const match = item.title?.toLowerCase().includes(s) || 
                  item.venue?.toLowerCase().includes(s) || 
                  item.category?.toLowerCase().includes(s) ||
                  item.organizer_body?.toLowerCase().includes(s);

    const catMatch = filter === 'all' || item.category === filter;
    return match && catMatch;
  });

  const featured = items.filter(i => i.is_featured && i.status === 'approved').slice(0, 6);

  // OPTION 3 WIREFRAME: The 5 Core Services
  const services = [
    { title: 'ACADEMIC', icon: <GraduationCap size={24}/>, list: ['WAEC Mock Logistics', 'Fidelity Exam Printing', 'Result Management', 'School IT Systems', 'Stationery Supply'] },
    { title: 'ADMIN', icon: <Briefcase size={24}/>, list: ['Business Registration', 'Statutory IDs', 'Document Logistics', 'Tax Prep & Filing', 'Corporate Concierge'] },
    { title: 'DIGITAL OPS', icon: <Code2 size={24}/>, list: ['Web Development', 'IT Infrastructure', 'Brand Identity', 'UI/UX Design', 'Cloud Integration'] },
    { title: 'LEARNING & DEV', icon: <Shield size={24}/>, list: ['Cadet Training', 'Masterclasses', 'Career Consulting', 'Digital Literacy', 'Leadership Coaching'] },
    { title: 'AGENCY OUTSOURCING', icon: <HeartHandshake size={24}/>, list: ['Talent Booking', 'Event Staffing', 'Fleet Leasing', 'White-Label Tech', 'B2B Execution'] },
  ];

  const partnerLogos = ["GES", "WAEC", "PAYSTACK", "VERCEL", "SUPABASE", "NIN", "GRA", "ORC"];

  if (!mounted) return null

  return (
    <div className="bg-[#0A2A5E] font-sans text-slate-950 scroll-smooth overflow-x-hidden selection:bg-[#1FC8C8] selection:text-[#0A2A5E]">
      
      {/* --- 🧭 NAVIGATION --- */}
      <nav className="fixed top-0 w-full z-[100] bg-[#0A2A5E]/90 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center text-white">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigateTo('home')}>
            <div className="w-9 h-9 bg-[#1FC8C8] rounded-lg flex items-center justify-center font-black italic text-[#0A2A5E] text-[11px] shadow-lg group-hover:scale-110 transition-transform duration-300">PC</div>
            <span className="text-sm md:text-lg font-black uppercase italic tracking-tighter">PRECEDE CONCEPTS</span>
          </div>
          
          {/* Desktop Links */}
          <div className="hidden xl:flex items-center gap-5 text-[9px] font-black uppercase tracking-[0.15em]">
            <button onClick={() => navigateTo('home')} className="hover:text-[#1FC8C8] transition-colors">HOME</button>
            <button onClick={() => navigateTo('about')} className="hover:text-[#1FC8C8] transition-colors">ABOUT US</button>
            <button onClick={() => navigateTo('services')} className="hover:text-[#1FC8C8] transition-colors">SERVICES</button>
            <button onClick={() => handleNavFilter('job')} className="hover:text-[#1FC8C8] transition-colors">JOBS</button>
            <button onClick={() => handleNavFilter('training')} className="hover:text-[#1FC8C8] transition-colors">TRAINING</button>
            <button onClick={() => handleNavFilter('event')} className="hover:text-[#1FC8C8] transition-colors">EVENTS</button>
            <button onClick={() => handleNavFilter('place')} className="hover:text-[#1FC8C8] transition-colors">SPACES</button>
            
            {/* Global Search Bar embedded in Nav */}
            <form onSubmit={handleGlobalSearch} className="relative ml-2">
               <input 
                 type="text" 
                 placeholder="Search site..." 
                 value={globalSearch}
                 onChange={e => setGlobalSearch(e.target.value)}
                 className="bg-white/10 border border-white/20 rounded-full py-1.5 pl-8 pr-4 text-xs italic focus:outline-none focus:border-[#1FC8C8] transition-all w-32 focus:w-48 text-white placeholder:text-white/40"
               />
               <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1FC8C8]" />
            </form>

            <button onClick={() => navigateTo('contact')} className="bg-[#1FC8C8] text-[#0A2A5E] px-6 py-2 rounded-full font-black ml-2 shadow-lg hover:bg-white transition-all transform hover:-translate-y-0.5">CONTACT</button>
          </div>
          <button className="xl:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}><Menu size={28} /></button>
        </div>
      </nav>

      {/* --- 📱 MOBILE MENU --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed inset-0 z-[200] bg-[#0A2A5E] flex flex-col p-8 text-white">
            <div className="flex justify-between items-center mb-8"><span className="font-black italic text-[#1FC8C8]">MENU</span><button onClick={() => setIsMenuOpen(false)}><X size={32}/></button></div>
            
            <form onSubmit={handleGlobalSearch} className="relative mb-8">
               <input 
                 type="text" placeholder="Global Search..." value={globalSearch} onChange={e => setGlobalSearch(e.target.value)}
                 className="w-full bg-white/10 border-2 border-white/20 rounded-xl py-3 pl-10 pr-4 text-sm font-black uppercase italic focus:outline-none focus:border-[#1FC8C8]"
               />
               <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1FC8C8]" />
            </form>

            <div className="flex flex-col gap-6 text-2xl font-black italic uppercase overflow-y-auto">
              <button onClick={() => navigateTo('home')} className="text-left">HOME</button>
              <button onClick={() => navigateTo('about')} className="text-left">ABOUT US</button>
              <button onClick={() => navigateTo('services')} className="text-left">SERVICES</button>
              <button onClick={() => handleNavFilter('job')} className="text-left">JOBS</button>
              <button onClick={() => handleNavFilter('training')} className="text-left">TRAINING</button>
              <button onClick={() => handleNavFilter('event')} className="text-left">EVENTS</button>
              <button onClick={() => handleNavFilter('place')} className="text-left">SPACES</button>
              <button onClick={() => navigateTo('contact')} className="bg-[#1FC8C8] text-[#0A2A5E] p-4 rounded-2xl text-center text-xl mt-4">CONTACT</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- 🚀 HERO (Original) --- */}
      <section id="home" className="h-screen flex items-center justify-center px-6 bg-[#0A2A5E] relative overflow-hidden text-center">
        <motion.div 
          key={heroKey} 
          className="z-10"
          initial={{ opacity: 0, scale: 1.05 }}
          whileInView={{ opacity: 1, scale: 1 }} 
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <p className="text-[#1FC8C8] text-[12px] md:text-[16px] font-black uppercase tracking-[0.5em] mb-6 italic opacity-100">PROGRESS SIMPLIFIED, VALUE DELIVERED.</p>
          <h1 className="text-6xl md:text-[9.5rem] font-black tracking-tighter uppercase italic leading-[0.8] text-white select-none">THE <span className="text-[#1FC8C8]">STANDARD</span> <br/> OF EXECUTION.</h1>
          <p className="text-white/60 text-[10px] md:text-[14px] font-black uppercase tracking-[0.4em] mt-8 italic">SIMPLIFYING PROGRESS, DELIVERING VALUE.</p>
        </motion.div>
      </section>

      {/* --- 🏢 ABOUT US (Original) --- */}
      <section id="about" className="h-screen flex items-center justify-center px-6 bg-[#1FC8C8]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-16 items-center text-[#0A2A5E] w-full">
          <div>
            <h2 className="text-[4rem] md:text-[6.5rem] lg:text-[7.5rem] font-black uppercase italic tracking-tighter leading-[0.8] mb-4">
              BEYOND <br/> 
              <span className="whitespace-nowrap">A <span className="text-white">DIGITAL</span></span> <br/> 
              AGENCY.
            </h2>
            <p className="text-[12px] md:text-[14px] font-black uppercase tracking-[0.4em] opacity-80 italic text-[#0A2A5E]">MOVE AHEAD, STAY AHEAD.</p>
          </div>
          
          <div className="border-l-[8px] border-[#0A2A5E] pl-8 md:pl-12 flex flex-col justify-center h-full">
            <div className="flex flex-col gap-6">
              <p className="font-black text-[13px] md:text-[15px] italic uppercase tracking-[0.2em] leading-loose opacity-80 max-w-[95%]">
                BUILT FOR BUSINESS. DESIGNED FOR IMPACT.
              </p>
              
              <p className="text-[13px] md:text-[15px] font-bold leading-relaxed max-w-[95%] opacity-90">
                We operate a dual-purpose ecosystem—delivering high-quality digital, administrative, and development services, while running a CSR hub that connects communities to vital resources and opportunities.
              </p>
              
              <div className="pt-6 mt-2 border-t-2 border-[#0A2A5E]/15">
                <p className="text-[11px] md:text-[13px] font-bold uppercase italic leading-loose tracking-wide opacity-90">
                  <span className="text-[#0A2A5E] font-black">BUSINESS GROWTH:</span> Registration, Development, Strategic Consultation. <br/>
                  <span className="text-[#0A2A5E] font-black">IDENTITY & BRANDING:</span> Graphic Design, Branding, Professional Printing, Banners, Stickers, Labels. <br/>
                  <span className="text-[#0A2A5E] font-black">TECH & INNOVATION:</span> IT Support, Web Development, Web Audit & Grading, AI Integration. <br/>
                  <span className="text-[#0A2A5E] font-black">CAPACITY BUILDING:</span> Specialized Training, Computing Concepts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 🛠️ SERVICES (Option 3 Wireframe) --- */}
      <section id="services" className="h-screen flex flex-col justify-center bg-white px-6 py-10 overflow-hidden">
        <div className="max-w-[1500px] mx-auto w-full">
          <h2 className="text-5xl md:text-6xl font-black uppercase italic text-[#0A2A5E] mb-12 tracking-tighter shrink-0">OUR SERVICES.</h2>
          
          {/* Horizontal Scroll Container (The 5 Cards) */}
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 custom-scrollbar mb-8">
            {services.map((s, i) => (
              <div key={i} className="min-w-[85vw] md:min-w-[320px] snap-center p-8 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] flex flex-col h-[400px] group hover:border-[#1FC8C8] transition-all hover:shadow-xl">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b-2 border-slate-200/50">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#0F4C81] shadow-sm">{s.icon}</div>
                  <h3 className="text-lg font-black uppercase italic text-[#0A2A5E] leading-none">{s.title}</h3>
                </div>
                
                <ul className="space-y-3 mb-4 flex-1 overflow-hidden">
                  {s.list.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-[11px] font-bold text-slate-600 uppercase tracking-widest"><ChevronRight size={14} className="text-[#1FC8C8] flex-shrink-0"/> {item}</li>
                  ))}
                </ul>
                <p className="text-[10px] font-black text-[#1FC8C8] uppercase tracking-widest italic mt-auto mb-4 border-t border-slate-200/50 pt-4">AND MORE...</p>
                
                {/* Book Service Button with Color Animation */}
                <button className="w-full py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 bg-[#1FC8C8] text-[#0A2A5E] group-hover:bg-[#0A2A5E] group-hover:text-white group-hover:shadow-lg group-hover:scale-[1.02]">
                  BOOK SERVICE
                </button>
              </div>
            ))}
          </div>

          {/* The 50/50 Split CTA Block */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0">
             <div onClick={() => navigateTo('contact')} className="bg-[#0A2A5E] p-6 rounded-3xl flex items-center justify-between cursor-pointer group border-2 border-[#0A2A5E] hover:border-[#1FC8C8] transition-all">
                <div>
                   <h3 className="text-xl font-black uppercase italic text-white flex items-center gap-3 mb-1"><Ticket className="text-[#1FC8C8]"/> TICKETING & PAYMENTS</h3>
                   <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">End-to-end event revenue management.</p>
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-[#1FC8C8] group-hover:bg-[#1FC8C8] group-hover:text-[#0A2A5E] transition-all">
                   <ArrowUpRight size={20}/>
                </div>
             </div>
             <div onClick={() => navigateTo('contact')} className="bg-[#1FC8C8] p-6 rounded-3xl flex items-center justify-between cursor-pointer group border-2 border-[#1FC8C8] hover:border-[#0A2A5E] transition-all text-[#0A2A5E]">
                <div>
                   <h3 className="text-xl font-black uppercase italic flex items-center gap-3 mb-1"><FileText/> CUSTOM QUERY?</h3>
                   <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">Not seeing your specific need? Tell us.</p>
                </div>
                <div className="w-10 h-10 bg-[#0A2A5E]/10 rounded-full flex items-center justify-center group-hover:bg-[#0A2A5E] group-hover:text-white transition-all">
                   <ArrowUpRight size={20}/>
                </div>
             </div>
          </div>

        </div>
      </section>

      {/* --- ⚡ OPPORTUNITY HUB --- */}
      <section id="hub" className="min-h-screen py-32 px-6 bg-[#0F4C81]">
        <div className="max-w-[1500px] mx-auto text-left">
          
          {/* Sell/Book Marketplace Banner */}
          <div className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 mb-16 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-sm shadow-xl">
             <div className="flex items-center gap-4 text-white">
                <div className="p-4 bg-[#1FC8C8]/20 rounded-2xl"><Briefcase size={28} className="text-[#1FC8C8]"/></div>
                <div>
                   <h3 className="text-lg font-black uppercase italic leading-none mb-1">THE MARKETPLACE</h3>
                   <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Hire a DJ, MC, or Event Planner — Or offer your own services.</p>
                </div>
             </div>
             <div className="flex gap-3 w-full md:w-auto">
                <button onClick={() => setFilter('marketplace')} className="flex-1 md:flex-none px-6 py-3 bg-[#1FC8C8] text-[#0A2A5E] rounded-xl text-[10px] font-black uppercase italic tracking-widest hover:bg-white transition-all">FIND STAFF</button>
                <button onClick={() => navigateTo('contact')} className="flex-1 md:flex-none px-6 py-3 bg-white/10 text-white border border-white/20 rounded-xl text-[10px] font-black uppercase italic tracking-widest hover:bg-white/20 transition-all">OFFER SERVICE</button>
             </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-10">
            <div className="flex-1 w-full max-w-xl">
              <h2 className="text-4xl md:text-5xl font-black uppercase italic text-white mb-8 tracking-tighter">PRECEDE INITIATIVES <br/><span className="text-[#1FC8C8]">AND OPPORTUNITIES.</span></h2>
              <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#1FC8C8]" size={24} />
                <input 
                  type="text" 
                  placeholder="SEARCH HUB LOCATIONS, JOBS, OR TYPE 'TODAY'..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-6 pl-18 bg-white/10 border-2 border-white/10 rounded-[2rem] text-white outline-none focus:border-[#1FC8C8] font-black uppercase text-sm italic transition-all placeholder:text-white/30"
                />
              </div>
            </div>
            
            {/* The 6 Tabs */}
            <div className="flex flex-wrap gap-2 bg-black/30 p-2 rounded-full border border-white/5">
              {['all', 'training', 'job', 'event', 'place', 'marketplace'].map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`px-6 md:px-8 py-3 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-[#1FC8C8] text-[#0A2A5E] shadow-xl' : 'text-white/40 hover:text-white hover:bg-white/10'}`}>
                  {f === 'place' ? 'SPACES' : f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {featured.length > 0 && filter === 'all' && !searchQuery && (
            <div className="mb-20">
              <div className="flex items-center gap-2 text-[#1FC8C8] mb-10 font-black uppercase italic text-sm tracking-widest"><Sparkles size={20}/> FEATURED PICKS</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-5">
                {featured.map(item => <ScoutCard key={`f-${item.id}`} item={item} isFeatured />)}
              </div>
              <div className="h-px w-full bg-white/10 mt-20" />
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-5 mt-12">
            {filteredItems.map(item => <ScoutCard key={item.id} item={item} />)}
          </div>
        </div>
      </section>

      {/* --- 💬 CONTACT, PARTNERSHIPS & FOOTER (100vh) --- */}
      <section id="contact" className="h-screen bg-[#0A2A5E] flex flex-col justify-between px-6 pt-24 pb-0 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-8 lg:gap-12 items-center flex-1">
          
          <motion.div 
            className="text-left"
            initial={{ y: 60, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <h2 className="text-[3.8rem] md:text-6xl lg:text-[7rem] font-black italic uppercase leading-[0.8] mb-2">MOVE AHEAD,</h2>
            <h2 className="text-[3.8rem] md:text-6xl lg:text-[7rem] font-black italic uppercase leading-[0.8] mb-10 text-[#1FC8C8]">STAY AHEAD.</h2>
            
            {/* The Action Board (Join, Partner, Intern, Tuition) */}
            <div className="grid grid-cols-2 gap-3 mb-10 border-t border-white/10 pt-10">
               <button className="p-4 bg-white/5 border border-white/10 rounded-2xl text-left hover:bg-[#1FC8C8] hover:text-[#0A2A5E] hover:border-[#1FC8C8] transition-colors group">
                  <span className="block text-[10px] font-black uppercase tracking-widest opacity-60 mb-1 group-hover:opacity-100">Collaborate</span>
                  <span className="block text-sm font-black italic uppercase">PARTNER US</span>
               </button>
               <button className="p-4 bg-white/5 border border-white/10 rounded-2xl text-left hover:bg-[#1FC8C8] hover:text-[#0A2A5E] hover:border-[#1FC8C8] transition-colors group">
                  <span className="block text-[10px] font-black uppercase tracking-widest opacity-60 mb-1 group-hover:opacity-100">Careers</span>
                  <span className="block text-sm font-black italic uppercase">JOIN / INTERN</span>
               </button>
               <button className="col-span-2 p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between hover:bg-[#1FC8C8] hover:text-[#0A2A5E] hover:border-[#1FC8C8] transition-colors group">
                  <div>
                    <span className="block text-[10px] font-black uppercase tracking-widest opacity-60 mb-1 group-hover:opacity-100">Academic Support</span>
                    <span className="block text-sm font-black italic uppercase">BOOK HOME TUITION / IT CLASS</span>
                  </div>
                  <ArrowUpRight size={20} className="opacity-50 group-hover:opacity-100" />
               </button>
            </div>
            
          </motion.div>
          
          <div className="bg-white/5 p-8 md:p-10 rounded-[3rem] border-4 border-white/10 shadow-2xl backdrop-blur-sm">
            <div className="space-y-8 mb-8 text-left">
              <div className="flex items-center gap-6 group cursor-pointer transition-all hover:translate-x-2">
                <div className="p-5 bg-[#1FC8C8]/20 rounded-3xl text-[#1FC8C8] group-hover:bg-[#1FC8C8] group-hover:text-[#0A2A5E] transition-colors"><Phone size={28}/></div>
                <div><span className="text-[10px] md:text-[11px] font-black uppercase text-white/40 tracking-widest leading-none">VOICE LINE</span><p className="text-3xl md:text-4xl font-black italic tracking-tighter">0591999544</p></div>
              </div>
              <div className="flex items-center gap-6 group cursor-pointer transition-all hover:translate-x-2">
                <div className="p-5 bg-[#1FC8C8]/20 rounded-3xl text-[#1FC8C8] group-hover:bg-[#1FC8C8] group-hover:text-[#0A2A5E] transition-colors"><Mail size={28}/></div>
                <div><span className="text-[10px] md:text-[11px] font-black uppercase text-white/40 tracking-widest leading-none">DIGITAL MAIL</span><p className="text-lg md:text-xl font-black italic tracking-tighter break-all">precedeconcepts@gmail.com</p></div>
              </div>
            </div>
            
            <div className="flex flex-col gap-5">
               <div className="grid grid-cols-2 gap-5">
                  <a href={`https://wa.me/233591999544`} target="_blank" className="bg-white text-[#0A2A5E] p-5 rounded-[1.5rem] font-black uppercase italic text-[10px] md:text-xs flex items-center justify-center gap-3 hover:bg-[#1FC8C8] transition-all shadow-xl hover:-translate-y-1"><WhatsAppIcon /> WHATSAPP</a>
                  <a href={`https://whatsapp.com/channel/0029Vb7Mfjf5EjxpZuIIpA2W`} target="_blank" className="bg-white/10 border-2 border-white/10 p-5 rounded-[1.5rem] font-black uppercase italic text-[10px] md:text-xs flex items-center justify-center gap-3 hover:bg-white/20 transition-all hover:-translate-y-1"><Smartphone size={18}/> CHANNEL</a>
               </div>
               <button onClick={() => window.location.href = `mailto:${BUSINESS_EMAIL}`} className="bg-[#1FC8C8] text-[#0A2A5E] p-6 rounded-[2rem] font-black uppercase italic text-xs md:text-sm shadow-2xl hover:bg-white transition-all tracking-[0.2em] hover:-translate-y-1">SEND AN EMAIL</button>
            </div>
          </div>
        </div>

        {/* --- 🔄 MARQUEE PARTNERS (Moved to bottom) --- */}
        <div className="w-full mt-auto mb-6 opacity-30 pointer-events-none">
          <div className="flex whitespace-nowrap animate-[marquee_30s_linear_infinite] gap-16 text-white font-black italic uppercase text-lg tracking-tighter items-center">
            {[...partnerLogos, ...partnerLogos, ...partnerLogos, ...partnerLogos].map((logo, i) => (
              <span key={i} className="flex items-center gap-4">{logo} <span className="text-[#1FC8C8] text-xs">●</span></span>
            ))}
          </div>
        </div>

        {/* --- 🏁 UNIFIED FOOTER --- */}
        <div className="shrink-0 text-center pb-6 border-t border-white/5 w-full pt-6">
          <p className="text-[#1FC8C8] font-black uppercase italic text-[10px] tracking-[0.5em]">PRECEDE CONCEPTS</p>
          <p className="text-white/20 font-black uppercase text-[8px] tracking-[0.3em] mt-2">ACCRA GHANA · © 2026</p>
        </div>
      </section>

      {/* --- 🔝 RETURN TO TOP --- */}
      <AnimatePresence>
        {showTopBtn && (
          <motion.button 
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
            className="fixed bottom-8 right-8 z-[150] p-4 md:p-5 bg-[#1FC8C8] text-[#0A2A5E] rounded-2xl shadow-2xl hover:bg-white hover:scale-110 transition-all"
          >
            <ArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>
      
      {/* Global Style for hiding scrollbar in Services Carousel */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  )
}

function ScoutCard({ item, isFeatured }: { item: any; isFeatured?: boolean }) {
  const targetDate = new Date(item.event_date);
  const today = new Date(); today.setHours(0,0,0,0);
  const diff = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
  const isToday = targetDate.toDateString() === today.toDateString();
  const isPast = targetDate < today && !isToday;
  
  let timeDisplay = '';
  if (isToday) timeDisplay = 'TODAY';
  else if (isPast) timeDisplay = 'PAST';
  else if (diff === 1) timeDisplay = 'TOMORROW';
  else timeDisplay = `${diff} DAYS MORE`;

  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.map_query || item.venue)}`;

  return (
    <div className={`group bg-white rounded-[1.5rem] overflow-hidden flex flex-col shadow-lg transition-all hover:scale-[1.03] h-full ${isFeatured ? 'border-[3px] border-[#1FC8C8] ring-4 ring-[#1FC8C8]/10' : 'border border-slate-100'}`}>
      <div className="h-16 bg-slate-900 relative">
        {item.image_url && <img src={item.image_url} className="w-full h-full object-cover opacity-80" />}
        <span className="absolute top-2 left-2 text-[6px] font-black bg-[#1FC8C8] text-[#0A2A5E] px-2 py-0.5 rounded-full uppercase italic tracking-widest">{item.category}</span>
      </div>
      
      <div className="p-4 flex flex-col flex-1 text-left">
        <h4 className="font-black text-[12px] text-[#0A2A5E] uppercase italic leading-tight line-clamp-2 h-8 mb-2 text-left">{item.title}</h4>
        
        <div className="mb-3 text-left pb-2 border-b border-slate-100 flex justify-between items-end">
          <p className="text-[9px] font-black uppercase italic text-slate-500 leading-none">{targetDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
          <p className={`text-[8px] md:text-[9px] font-black uppercase italic leading-none ${isToday ? 'text-red-600 animate-pulse' : isPast ? 'text-slate-300' : 'text-[#1FC8C8]'}`}>
            {timeDisplay}
          </p>
        </div>
        
        <div className="mt-auto flex flex-col gap-2 text-left">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5 text-[10px] font-black text-[#0A2A5E] uppercase italic truncate"><MapPin size={10} className="text-[#1FC8C8] flex-shrink-0"/> {item.venue}</div>
            <a href={mapUrl} target="_blank" className="text-[7px] font-black text-blue-500 uppercase italic hover:text-[#1FC8C8] transition-colors ml-4 tracking-wide">PRECISE LOCATION</a>
          </div>
          <a href={item.link} target="_blank" className="w-full py-2 bg-slate-50 text-[#0A2A5E] border border-slate-200 rounded-lg text-[8px] font-black uppercase text-center group-hover:bg-[#0A2A5E] group-hover:text-white transition-all shadow-sm">VIEW DETAILS</a>
        </div>
      </div>
    </div>
  )
}