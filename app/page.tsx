'use client'
import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from './lib/supabase'
import { 
  Code2, Phone, Mail, Menu, X, Sparkles, Search, 
  GraduationCap, Briefcase, Shield, HeartHandshake,
  Ticket, FileText, ChevronRight, ArrowUpRight, Share2, 
  AlertTriangle, MessageSquare, Instagram, Twitter, Linkedin, Facebook,
  CheckCircle2, ArrowUp, Users 
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
  const [view, setView] = useState<'home' | 'marketplace'>('home')
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [globalSearch, setGlobalSearch] = useState('')
  const [expiredLink, setExpiredLink] = useState(false)
  const [showTopBtn, setShowTopBtn] = useState(false)
  const [heroKey, setHeroKey] = useState(0)
  const isScrollingManually = useRef(false)

  const services = [
    { title: 'ACADEMIC', icon: <GraduationCap size={28}/>, list: ['WAEC Mock Logistics', 'Fidelity Exam Printing', 'Result Management', 'School IT Systems', 'Stationery Supply'] },
    { title: 'ADMIN', icon: <Briefcase size={28}/>, list: ['Business Registration', 'Statutory IDs', 'Document Logistics', 'Tax Prep & Filing', 'Corporate Concierge'] },
    { title: 'DIGITAL OPS', icon: <Code2 size={28}/>, list: ['Web Development', 'IT Support', 'Brand Identity', 'UI/UX Design', 'Social Media Mgt'] },
    { title: 'LEARNING & DEV', icon: <Shield size={28}/>, list: ['Cadet Training', 'Masterclasses', 'Career Consulting', 'Digital Literacy', 'Leadership Coaching'] },
    { title: 'AGENCY OUTSOURCING', icon: <HeartHandshake size={28}/>, list: ['Talent Booking', 'Event Staffing', 'Fleet Leasing', 'White-Label Tech', 'B2B Execution'] },
  ];

  // --- 🛰️ INITIAL LOAD & HASH ROUTING ---
  useEffect(() => {
    setMounted(true);
    fetchApproved();
    
    const hash = window.location.hash.replace('#', '');
    if (hash === 'marketplace') {
      setView('marketplace');
    } else if (['about', 'services', 'hub', 'contact'].includes(hash)) {
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }, []);

  // --- 🛰️ SCROLL OBSERVER ---
  useEffect(() => {
    const handleScroll = () => setShowTopBtn(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    
    const observer = new IntersectionObserver((entries) => {
      if (isScrollingManually.current || view === 'marketplace') return;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const newHash = id === 'home' ? '' : `#${id}`;
          if (window.location.hash !== newHash) {
            window.history.replaceState(null, '', newHash || window.location.pathname);
          }
        }
      });
    }, { threshold: 0.5 });
    
    ['home', 'about', 'services', 'hub', 'contact'].forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
        observer.disconnect();
        window.removeEventListener('scroll', handleScroll);
    }
  }, [view]);

  // --- 🔗 SHARABLE POST LOGIC ---
  useEffect(() => {
    if (items.length > 0 && view === 'home') {
      const params = new URLSearchParams(window.location.search);
      const postId = params.get('id');
      if (postId) {
        const element = document.getElementById(`post-${postId}`);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.classList.add('ring-8', 'ring-[#1FC8C8]');
          }, 800);
        } else {
          setExpiredLink(true);
          document.getElementById('hub')?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  }, [items, view]);

  async function fetchApproved() {
    const { data } = await supabase.from('jobs').select('*').eq('status', 'approved').order('created_at', { ascending: false })
    if (data) setItems(data);
  }

  const navigateTo = (id: string) => {
    setView('home');
    isScrollingManually.current = true;
    setIsMenuOpen(false);
    const newHash = id === 'home' ? '' : `#${id}`;
    window.history.pushState(null, '', newHash || window.location.pathname);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    if (id === 'home') setHeroKey(prev => prev + 1);
    setTimeout(() => { isScrollingManually.current = false; }, 1000);
  };

  const handleNavFilter = (filterId: string) => {
    setView('home');
    setFilter(filterId);
    navigateTo('hub');
  };

  // --- 🔍 SMART GLOBAL SEARCH LOGIC ---
  const handleGlobalSearchEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const term = globalSearch.toLowerCase();
      if (!term) return;

      const isService = services.some(s => s.title.toLowerCase().includes(term) || s.list.some(l => l.toLowerCase().includes(term)));
      if (isService || term.includes('brand') || term.includes('print')) {
        navigateTo('services');
        return;
      }
      
      if (term.includes('about') || term.includes('mission') || term.includes('business')) {
        navigateTo('about');
        return;
      }

      const hubMatch = items.some(i => i.title?.toLowerCase().includes(term) || i.category?.toLowerCase().includes(term));
      if (hubMatch) {
        setSearchQuery(globalSearch); 
        navigateTo('hub');
      } else {
        navigateTo('services'); 
      }
    }
  };

  // --- 🧠 SMART NATURAL LANGUAGE FILTERING LOGIC ---
  const filteredItems = items.filter(item => {
    const term = (searchQuery || globalSearch).toLowerCase().trim();

    // 1. Check Tabs First
    const catMatch = filter === 'all' || item.category === filter;
    if (!catMatch) return false;
    if (!term) return true;

    // 2. Setup Date Variables
    const itemDate = item.event_date ? new Date(item.event_date) : null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 3. Detect Natural Language Date Keywords
    let isDateSearch = false;
    let dateMatch = true;

    if (term.includes('today')) {
        isDateSearch = true;
        dateMatch = itemDate ? itemDate.toDateString() === today.toDateString() : false;
    } else if (term.includes('upcoming')) {
        isDateSearch = true;
        dateMatch = itemDate ? itemDate >= today : false;
    } else if (term.includes('past')) {
        isDateSearch = true;
        dateMatch = itemDate ? itemDate < today : false;
    }

    // 4. Detect Text/Location Keywords
    const cleanTerm = term.replace(/(today|upcoming|past)/g, '').trim();
    let textMatch = true;
    
    if (cleanTerm) {
        textMatch = (
            item.title?.toLowerCase().includes(cleanTerm) ||
            item.category?.toLowerCase().includes(cleanTerm) ||
            item.venue?.toLowerCase().includes(cleanTerm) ||
            item.location?.toLowerCase().includes(cleanTerm) ||
            item.region?.toLowerCase().includes(cleanTerm)
        );
    }

    // 5. Final Evaluation Engine
    if (isDateSearch && cleanTerm) {
        return dateMatch && textMatch; // Must match both date and text (e.g. "accra today")
    } else if (isDateSearch) {
        return dateMatch; // Only matching a date word
    } else {
        return textMatch; // Standard text search
    }
  });

  const featured = filteredItems.filter(i => i.is_featured);
  const initiatives = filteredItems.filter(i => i.is_official);
  const generalPosts = filteredItems.filter(i => !i.is_official && !i.is_featured);

  if (!mounted) return null;

  return (
    <div className="bg-[#0A2A5E] font-sans selection:bg-[#1FC8C8] selection:text-[#0A2A5E]">
      
      {/* --- 🧭 NAVIGATION --- */}
      <nav className="fixed top-0 w-full z-[100] bg-[#0A2A5E] border-b border-white/10 px-6 py-5">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center text-white relative">
          <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => navigateTo('home')}>
            <div className="w-10 h-10 bg-[#1FC8C8] rounded-lg flex items-center justify-center font-black italic text-[#0A2A5E] text-[12px]">PC</div>
            <span className="text-lg font-black uppercase italic tracking-tighter">PRECEDE CONCEPTS</span>
          </div>
          
          <div className="hidden xl:flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.15em]">
            <button onClick={() => navigateTo('home')} className="hover:text-[#1FC8C8] transition-colors">HOME</button>
            <button onClick={() => navigateTo('about')} className="hover:text-[#1FC8C8] transition-colors">ABOUT</button>
            <button onClick={() => navigateTo('services')} className="hover:text-[#1FC8C8] transition-colors">SERVICES</button>
            <button onClick={() => handleNavFilter('training')} className="hover:text-[#1FC8C8] transition-colors">TRAINING & SEMINARS</button>
            <button onClick={() => handleNavFilter('job')} className="hover:text-[#1FC8C8] transition-colors">JOBS</button>
            <button onClick={() => handleNavFilter('event')} className="hover:text-[#1FC8C8] transition-colors">EVENTS</button>
            <button onClick={() => handleNavFilter('place')} className="hover:text-[#1FC8C8] transition-colors">PLACES & SPACES</button>
            <button onClick={() => { setView('marketplace'); window.location.hash = 'marketplace'; window.scrollTo(0,0); }} className="hover:text-[#1FC8C8] transition-colors">MARKETPLACE</button>
            <button onClick={() => navigateTo('contact')} className="bg-[#1FC8C8] text-[#0A2A5E] px-6 py-2.5 rounded-full font-black ml-2 shadow-lg hover:bg-white transition-all transform hover:-translate-y-0.5">CONTACT</button>
          </div>
          <button className="xl:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}><Menu size={32} /></button>
        </div>
      </nav>

      {/* --- 🔍 FLOATING SEARCH VAULT (Right Side) --- */}
      <div className="fixed top-[100px] right-6 z-[90] w-full max-w-[320px] hidden md:block">
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#1FC8C8]" size={16} />
          <input 
            type="text" 
            placeholder="Search Ecosystem & Press Enter..." 
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            onKeyDown={handleGlobalSearchEnter}
            className="w-full bg-[#0A2A5E]/60 backdrop-blur-xl border border-white/10 rounded-[1.5rem] py-3.5 pl-12 pr-6 text-white text-[10px] font-black uppercase italic tracking-[0.1em] outline-none focus:border-[#1FC8C8] focus:bg-[#0A2A5E]/90 transition-all shadow-2xl placeholder:text-white/40"
          />
        </div>
      </div>

      {/* --- ⬆️ BACK TO TOP --- */}
      <AnimatePresence>
        {showTopBtn && (
          <motion.button 
            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }}
            onClick={() => navigateTo('home')}
            className="fixed bottom-8 right-8 z-[150] bg-[#1FC8C8] text-[#0A2A5E] p-4 rounded-2xl shadow-2xl border-4 border-[#0A2A5E] hover:bg-white transition-colors"
          ><ArrowUp size={24} /></motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {view === 'home' ? (
          <motion.div key="home-view" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
            
            {/* --- HERO SECTION --- */}
            <section id="home" className="h-screen flex flex-col items-center justify-center bg-[#0A2A5E] text-center px-6 pt-20">
              <motion.div key={heroKey} initial={{opacity:0, y:40}} animate={{opacity:1, y:0}} transition={{ duration: 0.8 }}>
                <p className="text-[#1FC8C8] text-sm md:text-lg font-black uppercase tracking-[0.5em] mb-4 italic">Progress Simplified, Value Delivered.</p>
                <h1 className="text-5xl md:text-[9.5rem] font-black tracking-tighter uppercase italic leading-[0.8] text-white">THE <span className="text-[#1FC8C8]">STANDARD</span> <br/> OF EXECUTION.</h1>
                <p className="text-white/40 text-sm md:text-lg font-black uppercase tracking-[0.4em] mt-8 italic">Simplifying Progress, Delivering Value.</p>
              </motion.div>
            </section>
            
            {/* --- ABOUT SECTION --- */}
            <section id="about" className="h-screen flex items-center justify-center bg-[#1FC8C8] px-6 py-24">
              <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-16 items-center w-full">
                <div className="flex flex-col text-left">
                  <h2 className="text-[4.5rem] md:text-[7.5rem] font-black uppercase italic tracking-tighter leading-[0.85]">
                    <span className="text-[#0A2A5E]">BEYOND</span><br/>
                    <span className="text-white">A DIGITAL</span><br/>
                    <span className="text-[#0A2A5E]">AGENCY.</span>
                  </h2>
                  <p className="text-[#0A2A5E] font-black uppercase tracking-[0.4em] text-[10px] md:text-xs mt-6 italic">Move ahead, stay ahead.</p>
                </div>
                <div className="flex flex-col justify-center text-left border-l-[6px] border-[#0A2A5E] pl-8 md:pl-12 py-2">
                  <h3 className="text-sm md:text-base font-black uppercase italic text-[#0A2A5E] mb-6 tracking-widest">Built for Business. Designed for Impact.</h3>
                  <p className="text-sm md:text-[15px] font-bold text-[#0A2A5E] leading-relaxed mb-8">
                    We operate a dual-purpose ecosystem—delivering high-quality digital, administrative, and development services, while running a CSR hub that connects communities to vital resources and opportunities.
                  </p>
                  <div className="h-[1px] w-full bg-[#0A2A5E]/20 mb-8"></div>
                  <ul className="space-y-5 text-[10px] md:text-xs text-[#0A2A5E] font-black italic uppercase leading-relaxed tracking-wider">
                     <li><span className="opacity-70">BUSINESS GROWTH:</span> REGISTRATION, DEVELOPMENT, STRATEGIC CONSULTATION.</li>
                     <li><span className="opacity-70">IDENTITY & BRANDING:</span> GRAPHIC DESIGN, BRANDING, PROFESSIONAL PRINTING, BANNERS, STICKERS, LABELS.</li>
                     <li><span className="opacity-70">TECH & INNOVATION:</span> IT SUPPORT, WEB DEVELOPMENT, WEB AUDIT & GRADING, AI INTEGRATION.</li>
                     <li><span className="opacity-70">CAPACITY BUILDING:</span> SPECIALIZED TRAINING, COMPUTING CONCEPTS.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* --- 🛠️ SERVICES SECTION --- */}
            <section id="services" className="h-screen bg-white flex flex-col justify-center py-20 px-6">
              <div className="max-w-[1500px] mx-auto w-full">
                <h2 className="text-5xl md:text-7xl font-black uppercase italic mb-16 tracking-tighter text-[#0A2A5E] text-left">OUR SERVICES.</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8 items-start">
                  {services.map((s, i) => (
                    <div key={i} className="bg-slate-50 border-[4px] border-[#1FC8C8] rounded-[2rem] flex flex-col overflow-hidden group shadow-xl transition-all duration-300 hover:scale-[1.03] hover:border-[#0A2A5E]">
                      <div className="bg-[#1FC8C8] p-6 flex items-center gap-4 transition-colors group-hover:bg-[#0A2A5E]">
                        <div className="bg-white p-2.5 rounded-xl text-[#0A2A5E] shrink-0">{s.icon}</div>
                        <h3 className="text-[14px] font-black uppercase italic text-[#0A2A5E] group-hover:text-white leading-tight">{s.title}</h3>
                      </div>
                      <div className="p-6 flex flex-col flex-1 bg-white">
                         <ul className="space-y-4 text-left mb-8">
                           {s.list.map((item, idx) => (
                             <li key={idx} className="flex items-start gap-3 text-[12px] font-black uppercase italic text-black leading-tight">
                               <ChevronRight size={16} className="shrink-0 text-[#0A2A5E] mt-0.5"/> {item}
                             </li>
                           ))}
                           <li className="flex items-start gap-3 text-[12px] font-black uppercase italic text-black leading-tight pt-2 border-t-2 border-slate-100">
                             <ChevronRight size={16} className="shrink-0 text-[#0A2A5E] mt-0.5"/> AND MORE...
                           </li>
                         </ul>
                         <button onClick={() => navigateTo('contact')} className="w-full py-4 mt-auto rounded-xl text-[12px] font-black uppercase bg-[#0A2A5E] text-white hover:bg-[#1FC8C8] hover:text-[#0A2A5E] transition-all tracking-widest shadow-md">BOOK SERVICE</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div onClick={() => navigateTo('contact')} className="bg-[#0A2A5E] p-8 rounded-[2rem] flex items-center justify-between group cursor-pointer hover:bg-[#1FC8C8] transition-all shadow-2xl">
                      <div className="text-white group-hover:text-[#0A2A5E] text-left">
                        <h3 className="text-xl md:text-2xl font-black italic uppercase leading-none mb-2"><Ticket size={28} className="inline mr-2 mb-1"/> TICKETING & PAYMENTS</h3>
                        <p className="text-[11px] font-black uppercase tracking-[0.1em] opacity-60 group-hover:text-black group-hover:opacity-100">Secure Revenue & Event Logistics.</p>
                      </div>
                      <ArrowUpRight className="text-[#1FC8C8] group-hover:text-[#0A2A5E]" size={28}/>
                   </div>
                   
                   <div className="flex flex-col justify-center items-center p-4">
                      <Sparkles className="text-[#0A2A5E]/20 mb-2" size={32} />
                      <h4 className="text-black font-black uppercase italic text-lg tracking-[0.4em]">AND MORE...</h4>
                   </div>

                   <div onClick={() => navigateTo('contact')} className="bg-[#1FC8C8] p-8 rounded-[2rem] flex items-center justify-between group cursor-pointer hover:bg-[#0A2A5E] transition-all shadow-2xl">
                      <div className="text-[#0A2A5E] group-hover:text-white text-left">
                        <h3 className="text-xl md:text-2xl font-black italic uppercase leading-none mb-2"><FileText size={28} className="inline mr-2 mb-1"/> CUSTOM ENQUIRY</h3>
                        <p className="text-[11px] font-black uppercase tracking-[0.1em] opacity-60 text-black group-hover:text-white group-hover:opacity-100">Bespoke Agency & Technical Requests.</p>
                      </div>
                      <ArrowUpRight className="text-[#0A2A5E] group-hover:text-white" size={28}/>
                   </div>
                </div>
              </div>
            </section>

            {/* --- OPPORTUNITY HUB --- */}
            <section id="hub" className="min-h-screen py-24 px-6 bg-[#0F4C81]">
              <div className="max-w-[1500px] mx-auto text-left text-white">
                <h2 className="text-6xl md:text-[8rem] font-black uppercase italic mb-16 tracking-tighter">OPPORTUNITY HUB.</h2>
                
                {/* Search & Filters Aligned Flex Row */}
                <div className="flex flex-col lg:flex-row items-center gap-6 mb-16 w-full">
                  <div className="w-full lg:w-[400px] relative">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#1FC8C8]" size={20} />
                    <input type="text" placeholder="Filter by keyword, location, or 'Today'..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full p-5 pl-14 bg-white/10 border-4 border-white/10 rounded-[2rem] text-white font-black uppercase text-sm italic outline-none focus:border-[#1FC8C8] shadow-3xl placeholder:text-white/30"/>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 bg-black/30 p-2 rounded-[2rem] border-2 border-white/10 w-full lg:w-auto">
                    {['all', 'training', 'job', 'event', 'place', 'marketplace'].map((f) => (
                      <button key={f} onClick={() => {
                        if(f === 'marketplace') { setView('marketplace'); window.location.hash='marketplace'; window.scrollTo(0,0); } 
                        else setFilter(f);
                      }} className={`px-8 py-3 rounded-full text-[11px] font-black uppercase transition-all whitespace-nowrap ${filter === f ? 'bg-[#1FC8C8] text-[#0A2A5E]' : 'text-white/40 hover:text-white'}`}>{f}</button>
                    ))}
                  </div>
                </div>

                <div className="space-y-20 min-h-[400px]">
                  <AnimatePresence>
                    {expiredLink && (
                      <motion.div initial={{opacity:0, y:-20}} animate={{opacity:1, y:0}} className="p-8 bg-red-500/10 border-4 border-red-500/30 rounded-[3rem] flex items-center justify-between backdrop-blur-md mb-10">
                        <div className="flex items-center gap-6">
                          <AlertTriangle className="text-red-500" size={32}/>
                          <div><p className="text-[10px] font-black uppercase opacity-50 tracking-widest">ACCESS DENIED</p><h4 className="font-black uppercase italic text-xl">Scout Expiry: Content No Longer Available.</h4></div>
                        </div>
                        <button onClick={() => {setExpiredLink(false); window.history.replaceState(null, '', '#hub')}} className="px-10 py-4 bg-white/10 hover:bg-white text-white hover:text-red-500 rounded-2xl text-[11px] font-black uppercase transition-all">DISMISS</button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* EMPTY STATE */}
                  {filteredItems.length === 0 ? (
                    <div className="py-24 flex flex-col items-center text-center border-4 border-white/5 rounded-[3rem] bg-white/5 shadow-inner">
                      <Search size={56} className="text-white/10 mb-6" />
                      <h3 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-widest">Nothing to display right now.</h3>
                      <p className="text-[#1FC8C8] text-sm font-black uppercase tracking-widest mt-2 opacity-80">Try adjusting your filters or check back later.</p>
                      <button onClick={() => { setSearchQuery(''); setGlobalSearch(''); setFilter('all'); }} className="mt-8 px-10 py-4 bg-[#1FC8C8] text-[#0A2A5E] font-black uppercase italic rounded-2xl text-xs hover:bg-white transition-colors shadow-lg">CLEAR FILTERS</button>
                    </div>
                  ) : (
                    <>
                      {/* Section 1 */}
                      {initiatives.length > 0 && (
                        <div>
                          <h3 className="flex items-center gap-3 text-[#1FC8C8] mb-8 font-black uppercase italic text-sm tracking-[0.4em] border-b-4 border-white/10 pb-4"><CheckCircle2 size={20}/> 1. Precede Initiatives & Opportunities</h3>
                          <div className="grid grid-cols-2 md:grid-cols-6 gap-6">{initiatives.map(item => <ScoutCard key={item.id} item={item} />)}</div>
                        </div>
                      )}

                      {/* Section 2 */}
                      {featured.length > 0 && (
                        <div>
                          <h3 className="flex items-center gap-3 text-[#1FC8C8] mb-8 font-black uppercase italic text-sm tracking-[0.4em] border-b-4 border-white/10 pb-4"><Sparkles size={20}/> 2. Featured Picks</h3>
                          <div className="grid grid-cols-2 md:grid-cols-6 gap-6">{featured.map(item => <ScoutCard key={item.id} item={item} isFeatured />)}</div>
                        </div>
                      )}

                      {/* Section 3 */}
                      {generalPosts.length > 0 && (
                        <div>
                          <h3 className="flex items-center gap-3 text-white/40 mb-8 font-black uppercase italic text-sm tracking-[0.4em] border-b-4 border-white/5 pb-4">3. All Posts</h3>
                          <div className="grid grid-cols-2 md:grid-cols-6 gap-6">{generalPosts.map(item => <ScoutCard key={item.id} item={item} />)}</div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </section>

            {/* --- 🏁 CONTACT & FOOTER (100vh PC Screen Fit) --- */}
            <footer id="contact" className="h-screen bg-[#0A2A5E] flex flex-col justify-center px-6 pt-32 pb-10 text-white relative overflow-hidden">
                <div className="max-w-[1600px] mx-auto w-full grid lg:grid-cols-2 gap-10 items-center flex-1">
                    <motion.div initial={{ y: 80, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
                        <h2 className="text-[4.5rem] md:text-[8rem] font-black italic uppercase leading-[0.8] mb-4 tracking-tighter text-left">MOVE <br/>AHEAD, <br/><span className="text-[#1FC8C8]">STAY <br/>AHEAD.</span></h2>
                        <div className="mt-8 flex gap-8 text-white/20 italic font-black text-xs uppercase tracking-widest">
                            <span className="hover:text-[#1FC8C8] cursor-pointer transition-colors">Instagram</span> 
                            <span className="hover:text-[#1FC8C8] cursor-pointer transition-colors">LinkedIn</span> 
                            <span className="hover:text-[#1FC8C8] cursor-pointer transition-colors">WhatsApp Channel</span>
                        </div>
                    </motion.div>

                    <div className="bg-white/5 p-12 rounded-[4rem] border-2 border-white/10 backdrop-blur-xl shadow-3xl text-left">
                        <div className="space-y-10 mb-12">
                            <div className="flex items-center gap-8">
                                <div className="p-6 bg-[#1FC8C8]/10 rounded-2xl text-[#1FC8C8]"><Phone size={36}/></div>
                                <div><span className="text-[10px] font-black uppercase text-white/40 tracking-widest italic">VOICE LINE</span><p className="text-4xl md:text-6xl font-black italic tracking-tighter mt-1">0591999544</p></div>
                            </div>
                            <div className="flex items-center gap-8">
                                <div className="p-6 bg-[#1FC8C8]/10 rounded-2xl text-[#1FC8C8]"><Mail size={36}/></div>
                                <div><span className="text-[10px] font-black uppercase text-white/40 tracking-widest italic">DIGITAL MAIL</span><p className="text-xl md:text-3xl font-black italic text-white opacity-80 mt-1">precedeconcepts@gmail.com</p></div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <a href="https://wa.me/233591999544" className="bg-white text-[#0A2A5E] p-6 rounded-2xl font-black uppercase italic text-[12px] text-center flex justify-center items-center gap-3 hover:bg-[#1FC8C8] transition-all shadow-xl"><WhatsAppIcon size={20}/> WHATSAPP</a>
                            <a href="#" className="bg-[#1FC8C8]/10 text-[#1FC8C8] p-6 border-2 border-[#1FC8C8]/20 rounded-2xl font-black uppercase italic text-[12px] text-center hover:bg-[#1FC8C8] hover:text-[#0A2A5E] transition-all shadow-xl">CHANNEL</a>
                            <button onClick={() => window.location.href='mailto:precedeconcepts@gmail.com'} className="bg-[#1FC8C8] text-[#0A2A5E] p-6 rounded-2xl font-black uppercase italic text-[12px] hover:bg-white transition-all shadow-xl">SEND EMAIL</button>
                        </div>
                    </div>
                </div>
                <div className="text-center pt-8 border-t-2 border-white/5 w-full mt-auto"><p className="text-[#1FC8C8] font-black uppercase italic text-[10px] tracking-[0.8em]">PRECEDE CONCEPTS · ACCRA GHANA · © 2026</p></div>
            </footer>
          </motion.div>
        ) : (
          /* --- MARKETPLACE (SHORTER HEIGHT) --- */
          <motion.div key="marketplace-view" initial={{opacity:0, y:50}} animate={{opacity:1, y:0}} exit={{opacity:0}} className="pt-[180px] h-screen bg-[#0A2A5E] px-6">
            <div className="max-w-[1500px] mx-auto text-left">
               <div className="flex items-center justify-between mb-16">
                  <h2 className="text-6xl md:text-[7rem] font-black uppercase italic text-white tracking-tighter">MARKETPLACE.</h2>
                  <button onClick={() => { setView('home'); window.location.hash=''; }} className="bg-[#1FC8C8] text-[#0A2A5E] px-8 py-4 rounded-2xl font-black uppercase italic flex items-center gap-2 hover:bg-white transition-colors">CLOSE <X size={20}/></button>
               </div>
               <div className="grid md:grid-cols-2 gap-8 max-w-5xl">
                  <div className="p-10 bg-white/5 border-4 border-white/10 rounded-[3rem] flex flex-col justify-between h-[300px]">
                     <div>
                       <Users size={40} className="text-[#1FC8C8] mb-4"/>
                       <h3 className="text-3xl font-black text-white uppercase italic mb-2">Hire Talent</h3>
                       <p className="text-white/40 text-xs font-black uppercase tracking-widest leading-loose">Access vetted Precede professionals.</p>
                     </div>
                     <button className="w-full p-4 bg-[#1FC8C8] text-[#0A2A5E] rounded-2xl font-black uppercase italic shadow-xl tracking-widest hover:bg-white transition-all">HIRE TALENT</button>
                  </div>
                  <div className="p-10 bg-white/10 border-4 border-white/20 rounded-[3rem] flex flex-col justify-between h-[300px]">
                     <div>
                       <Briefcase size={40} className="text-white mb-4"/>
                       <h3 className="text-3xl font-black text-white uppercase italic mb-2 text-[#1FC8C8]">Post Talent</h3>
                       <p className="text-white/40 text-xs font-black uppercase tracking-widest leading-loose">Join the ecosystem as a verified provider.</p>
                     </div>
                     <button className="w-full p-4 bg-white text-[#0A2A5E] rounded-2xl font-black uppercase italic shadow-xl tracking-widest hover:bg-[#1FC8C8] transition-all">POST TALENT</button>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
    </div>
  )
}

function ScoutCard({ item, isFeatured }: { item: any; isFeatured?: boolean }) {
  const targetDate = new Date(item.event_date);
  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    const shareUrl = `${window.location.origin}/#hub?id=${item.id}`;
    navigator.clipboard.writeText(shareUrl);
    alert("Post Link Secured.");
  };

  return (
    <div id={`post-${item.id}`} className={`group bg-white rounded-[1.5rem] overflow-hidden flex flex-col shadow-2xl transition-all h-full ${isFeatured ? 'ring-8 ring-[#1FC8C8]' : ''}`}>
      <div className="h-28 bg-slate-900 relative overflow-hidden">
        {item.image_url && <img src={item.image_url} className="w-full h-full object-cover opacity-60 group-hover:scale-125 transition-transform duration-1000" />}
        <span className="absolute top-3 left-3 text-[7px] font-black bg-[#1FC8C8] text-[#0A2A5E] px-3 py-1.5 rounded-md uppercase italic z-10">{item.category}</span>
      </div>
      <div className="p-5 flex flex-col flex-1 text-left text-black">
        <h4 className="font-black text-[12px] uppercase italic leading-tight mb-4 h-10">{item.title}</h4>
        <div className="mt-auto pt-4 border-t-2 border-slate-100 flex justify-between items-center">
          <p className="text-[9px] font-black uppercase text-slate-400 italic">{targetDate.toLocaleDateString('en-GB')}</p>
          <div className="flex gap-2">
            <button onClick={handleShare} className="p-2 bg-slate-100 text-[#0A2A5E] rounded-lg shadow-sm hover:bg-[#1FC8C8] transition-colors"><Share2 size={14}/></button>
            <a href={item.link} target="_blank" className="text-[10px] font-black uppercase bg-[#0A2A5E] text-white px-5 py-2.5 rounded-xl hover:bg-[#1FC8C8] hover:text-[#0A2A5E] transition-all">VIEW</a>
          </div>
        </div>
      </div>
    </div>
  )
}