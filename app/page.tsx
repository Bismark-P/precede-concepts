'use client'
import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from './lib/supabase'
import { 
  Code2, Phone, Mail, Menu, X, Sparkles, Search, 
  GraduationCap, Briefcase, Shield, HeartHandshake,
  Ticket, FileText, ChevronRight, ArrowUpRight, Share2, 
  AlertTriangle, Users, MapPin, Calendar, Globe, CheckCircle2, ArrowUp,
  Clock, Repeat, Banknote, Map, ExternalLink, Info
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
  const [hubLocation, setHubLocation] = useState('')
  const [hubDate, setHubDate] = useState('all')
  const [expiredLink, setExpiredLink] = useState(false)
  const [showTopBtn, setShowTopBtn] = useState(false)
  const [heroKey, setHeroKey] = useState(0)
  const [highlightedService, setHighlightedService] = useState<number | null>(null)
  const [selectedPost, setSelectedPost] = useState<any>(null); // NEW: Expanded View State
  const [isAdmin, setIsAdmin] = useState(false); // NEW: Admin Check
  const isScrollingManually = useRef(false)

  const services = [
    { title: 'ACADEMIC', icon: <GraduationCap size={28}/>, list: ['WAEC Mock Logistics', 'Fidelity Exam Printing', 'Result Management', 'School IT Systems', 'Stationery Supply'] },
    { title: 'ADMIN', icon: <Briefcase size={28}/>, list: ['Business Registration', 'Statutory IDs', 'Document Logistics', 'Printing', 'Corporate Concierge'] },
    { title: 'DIGITAL OPS', icon: <Code2 size={28}/>, list: ['Web Development', 'IT Support', 'Branding and Brand Identity', 'UI/UX Design', 'Social Media Mgt'] },
    { title: 'LEARNING & DEV', icon: <Shield size={28}/>, list: ['Cadet Training', 'Masterclasses', 'Career Consulting', 'Digital Literacy', 'Leadership Coaching'] },
    { title: 'AGENCY OUTSOURCING', icon: <HeartHandshake size={28}/>, list: ['Talent Booking', 'Event Staffing', 'Fleet Leasing', 'White-Label Tech', 'B2B Execution'] },
  ];

  useEffect(() => {
    setMounted(true);
    fetchApproved();
    checkAdmin();
    
    const hash = window.location.hash.replace('#', '');
    if (hash === 'marketplace') {
      setView('marketplace');
    } else if (['about', 'services', 'hub', 'contact'].includes(hash)) {
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }, []);

  async function checkAdmin() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.email === 'precedeconcepts@gmail.com') setIsAdmin(true);
  }

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

  useEffect(() => {
    if (items.length > 0 && view === 'home') {
      const params = new URLSearchParams(window.location.search);
      const postId = params.get('id');
      if (postId) {
        setTimeout(() => {
          const element = document.getElementById(`post-${postId}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.classList.add('ring-8', 'ring-[#1FC8C8]', 'scale-[1.03]');
            setTimeout(() => element.classList.remove('ring-8', 'ring-[#1FC8C8]', 'scale-[1.03]'), 3000);
          } else {
            setExpiredLink(true);
            document.getElementById('hub')?.scrollIntoView({ behavior: 'smooth' });
          }
        }, 800);
      }
    }
  }, [items, view]);

  async function fetchApproved() {
    const { data } = await supabase.from('jobs').select('*').eq('status', 'approved').order('created_at', { ascending: false })
    if (data) setItems(data);
  }

  // --- 🔄 REPOST LOGIC ---
  const handleRepost = async (item: any) => {
    const { id, created_at, ...repostData } = item; 
    const { error } = await supabase.from('jobs').insert([{ 
      ...repostData, 
      created_at: new Date().toISOString() 
    }]);
    if (!error) {
      alert("Post Reposted Successfully!");
      fetchApproved();
    }
  };

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

  const handleGlobalSearchEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const term = globalSearch.toLowerCase().trim();
      if (!term) return;
      const serviceIndex = services.findIndex(s => 
        s.title.toLowerCase().includes(term) || 
        s.list.some(l => l.toLowerCase().includes(term))
      );
      if (serviceIndex !== -1 || term.includes('brand') || term.includes('print')) {
        setView('home');
        navigateTo('services');
        let targetIndex = serviceIndex;
        if(term.includes('print') && targetIndex === -1) targetIndex = 1; 
        if(term.includes('brand') && targetIndex === -1) targetIndex = 2; 
        if (targetIndex !== -1) {
          setTimeout(() => {
            setHighlightedService(targetIndex);
            setTimeout(() => setHighlightedService(null), 4000); 
          }, 800);
        }
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

  const filteredItems = items.filter(item => {
    const term = (searchQuery).toLowerCase().trim();
    const locTerm = hubLocation.toLowerCase().trim();
    const matchesText = !term || item.title?.toLowerCase().includes(term) || item.category?.toLowerCase().includes(term) || item.description?.toLowerCase().includes(term);
    const matchesLoc = !locTerm || item.venue?.toLowerCase().includes(locTerm) || item.location?.toLowerCase().includes(locTerm) || item.region?.toLowerCase().includes(locTerm);
    const catMatch = filter === 'all' || item.category === filter;
    let dateMatch = true;
    if (hubDate !== 'all' && item.event_date) {
      const eDate = new Date(item.event_date);
      const today = new Date();
      today.setHours(0,0,0,0);
      if (hubDate === 'today') dateMatch = eDate.toDateString() === today.toDateString();
      else if (hubDate === 'upcoming') dateMatch = eDate >= today;
      else if (hubDate === 'past') dateMatch = eDate < today;
    }
    return matchesText && matchesLoc && catMatch && dateMatch;
  });

  const featured = filteredItems.filter(i => i.is_featured);
  const initiatives = filteredItems.filter(i => i.is_official);
  const generalPosts = filteredItems.filter(i => !i.is_official && !i.is_featured);

  if (!mounted) return null;

  return (
    <div className="bg-[#0A2A5E] font-sans selection:bg-[#1FC8C8] selection:text-[#0A2A5E]">
      
      {/* NAVIGATION & SEARCH REMAINS UNTOUCHED */}
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

      <div className="fixed top-[100px] right-6 z-[90] w-full max-w-[320px] hidden md:block">
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#1FC8C8]" size={16} />
          <input type="text" placeholder="Search Ecosystem..." value={globalSearch} onChange={(e) => setGlobalSearch(e.target.value)} onKeyDown={handleGlobalSearchEnter} className="w-full bg-[#0A2A5E]/60 backdrop-blur-xl border border-white/10 rounded-[1.5rem] py-3.5 pl-12 pr-6 text-white text-[10px] font-black uppercase italic tracking-[0.1em] outline-none focus:border-[#1FC8C8] transition-all shadow-2xl" />
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed inset-0 z-[200] bg-[#0A2A5E] flex flex-col p-8 text-white uppercase italic font-black">
             <div className="flex justify-between items-center mb-10 text-[#1FC8C8]">MENU <button onClick={() => setIsMenuOpen(false)}><X size={32}/></button></div>
             <div className="flex flex-col gap-8 text-2xl">
               <button onClick={() => navigateTo('home')}>HOME</button>
               <button onClick={() => navigateTo('about')}>ABOUT</button>
               <button onClick={() => navigateTo('services')}>SERVICES</button>
               <button onClick={() => handleNavFilter('job')}>JOBS</button>
               <button onClick={() => { setView('marketplace'); setIsMenuOpen(false); window.scrollTo(0,0); }}>MARKETPLACE</button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {view === 'home' ? (
          <motion.div key="home-view" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
            
            {/* HERO, ABOUT, SERVICES REMAINS UNTOUCHED */}
            <section id="home" className="h-screen flex flex-col items-center justify-center bg-[#0A2A5E] text-center px-6 pt-20">
              <motion.div key={heroKey} initial={{opacity:0, y:40}} animate={{opacity:1, y:0}} transition={{ duration: 0.8 }}>
                <p className="text-[#1FC8C8] text-sm md:text-lg font-black uppercase tracking-[0.5em] mb-4 italic">Progress Simplified, Value Delivered.</p>
                <h1 className="text-5xl md:text-[9.5rem] font-black tracking-tighter uppercase italic leading-[0.8] text-white">THE <span className="text-[#1FC8C8]">STANDARD</span> <br/> OF EXECUTION.</h1>
                <p className="text-white/40 text-sm md:text-lg font-black uppercase tracking-[0.4em] mt-8 italic">Simplifying Progress, Delivering Value.</p>
              </motion.div>
            </section>
            
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

            <section id="services" className="h-screen bg-white flex flex-col justify-center py-20 px-6">
              <div className="max-w-[1500px] mx-auto w-full">
                <h2 className="text-5xl md:text-7xl font-black uppercase italic mb-16 tracking-tighter text-[#0A2A5E] text-left">OUR SERVICES.</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8 items-start">
                  {services.map((s, i) => (
                    <div key={i} className={`bg-slate-50 border-[4px] rounded-[2rem] flex flex-col overflow-hidden group shadow-xl transition-all duration-300 hover:scale-[1.03] hover:border-[#0A2A5E] h-[450px] ${highlightedService === i ? 'ring-8 ring-[#1FC8C8] scale-[1.05] border-[#0A2A5E]' : 'border-[#1FC8C8]'}`}>
                      <div className="bg-[#1FC8C8] p-6 flex items-center gap-4 transition-colors group-hover:bg-[#0A2A5E] h-[90px] shrink-0">
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
                         <button onClick={() => navigateTo('contact')} className="mt-auto w-full py-4 rounded-xl text-[12px] font-black uppercase bg-[#0A2A5E] text-white hover:bg-[#1FC8C8] hover:text-[#0A2A5E] transition-all tracking-widest shadow-md">BOOK SERVICE</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* --- OPPORTUNITY HUB (UPDATED) --- */}
            <section id="hub" className="min-h-screen py-24 px-6 bg-[#0F4C81]">
              <div className="max-w-[1500px] mx-auto text-left text-white">
                <h2 className="text-6xl md:text-[8rem] font-black uppercase italic mb-16 tracking-tighter">OPPORTUNITY HUB.</h2>
                
                <div className="flex flex-col gap-6 mb-16 bg-white/5 border-4 border-white/10 p-8 rounded-[3rem] shadow-2xl">
                  <div className="w-full relative">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#1FC8C8]" size={24} />
                    <input type="text" placeholder="Search keyword..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full p-6 pl-16 bg-black/20 border-2 border-white/10 rounded-[2rem] text-white font-black uppercase text-sm italic outline-none focus:border-[#1FC8C8] transition-all"/>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'training', 'job', 'event', 'place'].map((f) => (
                      <button key={f} onClick={() => setFilter(f)} className={`px-8 py-3 rounded-full text-[11px] font-black uppercase transition-all ${filter === f ? 'bg-[#1FC8C8] text-[#0A2A5E]' : 'bg-white/5 text-white/40'}`}>{f}</button>
                    ))}
                  </div>
                </div>

                <div className="space-y-24 min-h-[400px]">
                  <div>
                    <h3 className="flex items-center gap-3 text-[#1FC8C8] mb-12 font-black uppercase italic text-sm tracking-[0.4em] border-b-4 border-white/10 pb-6"><CheckCircle2 size={24}/> 1. Initiatives & Picks</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[...initiatives, ...featured].map(item => (
                            <ScoutCard 
                                key={item.id} 
                                item={item} 
                                isAdmin={isAdmin} 
                                onRepost={() => handleRepost(item)} 
                                onView={() => setSelectedPost(item)} 
                            />
                        ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="flex items-center gap-3 text-white/40 mb-12 font-black uppercase italic text-sm tracking-[0.4em] border-b-4 border-white/5 pb-6">2. Archive</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {generalPosts.map(item => (
                            <ScoutCard 
                                key={item.id} 
                                item={item} 
                                isAdmin={isAdmin} 
                                onRepost={() => handleRepost(item)} 
                                onView={() => setSelectedPost(item)} 
                            />
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <footer id="contact" className="h-screen bg-[#0A2A5E] flex flex-col justify-center px-6 pt-32 pb-10 text-white relative overflow-hidden">
                <div className="max-w-[1600px] mx-auto w-full grid lg:grid-cols-2 gap-10 items-center flex-1">
                    <motion.div initial={{ y: 80, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
                        <h2 className="text-[4.5rem] md:text-[8rem] font-black italic uppercase leading-[0.8] mb-4 tracking-tighter text-left">MOVE <br/>AHEAD, <br/><span className="text-[#1FC8C8]">STAY <br/>AHEAD.</span></h2>
                    </motion.div>
                    <div className="bg-white/5 p-12 rounded-[4rem] border-2 border-white/10 backdrop-blur-xl shadow-3xl text-left">
                        <div className="space-y-10 mb-12">
                            <div className="flex items-center gap-8">
                                <div className="p-6 bg-[#1FC8C8]/10 rounded-2xl text-[#1FC8C8]"><Phone size={36}/></div>
                                <div><span className="text-[10px] font-black uppercase text-white/40 tracking-widest italic">VOICE LINE</span><p className="text-4xl md:text-6xl font-black italic tracking-tighter mt-1">0591999544</p></div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <a href="https://wa.me/233591999544" className="bg-white text-[#0A2A5E] p-6 rounded-2xl font-black uppercase italic text-[12px] text-center flex justify-center items-center gap-3 hover:bg-[#1FC8C8] transition-all shadow-xl"><WhatsAppIcon size={20}/> WHATSAPP</a>
                        </div>
                    </div>
                </div>
                <div className="text-center pt-8 border-t-2 border-white/5 w-full mt-auto"><p className="text-[#1FC8C8] font-black uppercase italic text-[10px] tracking-[0.8em]">PRECEDE CONCEPTS © 2026</p></div>
            </footer>
          </motion.div>
        ) : (
          <div className="pt-24 text-white p-20">Marketplace View Loaded</div>
        )}
      </AnimatePresence>

      {/* --- 🔎 EXPANDED VIEW MODAL (NEW) --- */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[300] bg-[#0A2A5E]/95 backdrop-blur-xl p-6 md:p-12 overflow-y-auto flex justify-center">
            <div className="max-w-5xl w-full relative">
              <button onClick={() => setSelectedPost(null)} className="fixed top-8 right-8 p-4 bg-white/10 rounded-full text-white hover:bg-[#1FC8C8] hover:text-[#0A2A5E] transition-all z-50 shadow-2xl"><X size={32}/></button>
              <div className="grid lg:grid-cols-2 gap-12 mt-12 mb-20">
                <div className="rounded-[3rem] overflow-hidden bg-slate-900 border-4 border-white/10 shadow-2xl">
                  {selectedPost.image_url ? <img src={selectedPost.image_url} className="w-full h-full object-cover" alt="Flyer" /> : <div className="w-full h-full flex flex-col items-center justify-center text-white/10 p-20 text-center uppercase font-black italic text-4xl leading-tight">Official<br/>Scout</div>}
                </div>
                <div className="text-left text-white flex flex-col justify-center space-y-8">
                  <div>
                    <span className="bg-[#1FC8C8] text-[#0A2A5E] px-4 py-2 rounded-xl text-[10px] font-black uppercase italic tracking-widest">{selectedPost.category}</span>
                    <h2 className="text-5xl md:text-7xl font-black italic uppercase leading-tight mt-4 tracking-tighter">{selectedPost.title}</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-6 py-8 border-y border-white/10">
                    <InfoRow icon={<Calendar/>} label="Date" value={new Date(selectedPost.event_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} />
                    <InfoRow icon={<MapPin/>} label="Venue" value={selectedPost.venue} />
                    <InfoRow icon={<Banknote/>} label={selectedPost.category === 'job' ? 'Salary' : 'Entry Fee'} value={selectedPost.price?.toLowerCase() === 'free' ? 'FREE ENTRY' : selectedPost.category === 'job' ? selectedPost.salary_range : selectedPost.price} />
                    <InfoRow icon={<Clock/>} label="Timing" value={selectedPost.time_category} />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-[#1FC8C8] font-black uppercase text-xs tracking-widest italic flex items-center gap-2"><Info size={14}/> Scout Description</h3>
                    <p className="text-white/70 leading-relaxed font-bold text-sm whitespace-pre-wrap">{selectedPost.description || 'Connecting you to the next big thing in the ecosystem.'}</p>
                  </div>
                  <div className="flex flex-wrap gap-4 pt-8">
                    {selectedPost.map_query && <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedPost.map_query)}`} target="_blank" className="flex-1 min-w-[200px] bg-white text-[#0A2A5E] p-5 rounded-2xl font-black uppercase italic text-center flex items-center justify-center gap-3 hover:bg-[#1FC8C8] transition-all shadow-xl"><Map size={20}/> Map View</a>}
                    {selectedPost.link && (selectedPost.price?.toLowerCase() === 'free' ? <div className="flex-1 min-w-[200px] bg-white/5 border-2 border-[#1FC8C8] text-[#1FC8C8] p-5 rounded-2xl font-black uppercase italic text-center flex items-center justify-center gap-3"><CheckCircle2 size={20}/> Free Entry</div> : <a href={selectedPost.link} target="_blank" className="flex-1 min-w-[200px] bg-[#1FC8C8] text-[#0A2A5E] p-5 rounded-2xl font-black uppercase italic text-center flex items-center justify-center gap-3 hover:bg-white transition-all shadow-xl"><ExternalLink size={20}/> {selectedPost.category === 'job' ? 'Apply' : selectedPost.category === 'training' ? 'Enroll' : 'Secure Tickets'}</a>)}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </div>
  )
}

function ScoutCard({ item, isAdmin, onRepost, onView }: any) {
  const isFree = item.price?.toLowerCase() === 'free';
  return (
    <div className="group bg-white rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl transition-all hover:scale-[1.02] border-4 border-transparent hover:border-[#1FC8C8] h-[550px]">
      <div className="h-56 bg-slate-900 relative overflow-hidden">
        {item.image_url ? <img src={item.image_url} className="w-full h-full object-cover opacity-80" alt="Scout" /> : <div className="w-full h-full flex items-center justify-center bg-[#0A2A5E] text-[#1FC8C8]/20"><Globe size={60}/></div>}
        <div className="absolute top-4 left-4 flex gap-2">
           <span className="text-[8px] font-black bg-[#1FC8C8] text-[#0A2A5E] px-3 py-1.5 rounded-lg uppercase italic z-10">{item.category}</span>
           {isFree && <span className="text-[8px] font-black bg-white text-[#0A2A5E] px-3 py-1.5 rounded-lg uppercase italic z-10 shadow-sm">FREE</span>}
        </div>
        {isAdmin && <button onClick={(e) => { e.stopPropagation(); onRepost(); }} className="absolute top-4 right-4 bg-orange-500 text-white p-3 rounded-xl shadow-xl hover:bg-orange-600 transition-all z-20"><Repeat size={14}/></button>}
      </div>
      <div className="p-8 flex flex-col flex-1 text-left">
        <h4 className="font-black text-xl uppercase italic leading-tight mb-4 text-[#0A2A5E] line-clamp-2 min-h-[3rem]">{item.title}</h4>
        <div className="space-y-3 mb-8">
           <div className="flex items-center gap-3 text-slate-400"><MapPin size={16} className="text-[#1FC8C8] shrink-0" /><span className="text-[10px] font-bold uppercase tracking-widest line-clamp-1">{item.venue}</span></div>
           <div className="flex items-center gap-3 text-slate-400"><Banknote size={16} className="text-[#1FC8C8] shrink-0" /><span className="text-[10px] font-bold uppercase tracking-widest">{item.category === 'job' ? item.salary_range : item.price}</span></div>
           <div className="flex items-center gap-3 text-slate-400"><Calendar size={16} className="text-[#1FC8C8] shrink-0" /><span className="text-[10px] font-bold uppercase tracking-widest">{new Date(item.event_date).toLocaleDateString('en-GB')}</span></div>
        </div>
        <button onClick={onView} className="mt-auto w-full bg-[#0A2A5E] text-white py-5 rounded-2xl font-black uppercase italic text-xs tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[#1FC8C8] hover:text-[#0A2A5E] transition-all">Explore Details <ChevronRight size={16}/></button>
      </div>
    </div>
  )
}

function InfoRow({ icon, label, value }: any) {
  return (
    <div className="flex gap-4 items-start">
      <div className="p-3 bg-white/5 rounded-xl text-[#1FC8C8] shrink-0">{icon}</div>
      <div>
        <p className="text-[9px] font-black uppercase text-white/40 tracking-[0.2em] mb-1">{label}</p>
        <p className="text-xs font-black uppercase italic tracking-wider">{value || 'TBD'}</p>
      </div>
    </div>
  )
}