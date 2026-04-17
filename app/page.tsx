'use client'
import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from './lib/supabase'
import { 
  Code2, Phone, Mail, Menu, X, Sparkles, Search, 
  GraduationCap, Briefcase, Shield, HeartHandshake,
  Ticket, FileText, ChevronRight, ArrowUpRight, Share2, 
  AlertTriangle, MessageSquare, Instagram, Twitter, Linkedin, Facebook,
  CheckCircle2, ArrowUp, Globe, ShoppingBag, Users 
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

  useEffect(() => {
    setMounted(true);
    fetchApproved();
    const handleScroll = () => setShowTopBtn(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    
    const sections = ['home', 'about', 'services', 'hub', 'contact'];
    const observer = new IntersectionObserver((entries) => {
      if (isScrollingManually.current) return;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const newPath = id === 'home' ? '/' : `/${id}`;
          if (window.location.pathname !== newPath) {
            window.history.replaceState(null, '', newPath);
          }
        }
      });
    }, { threshold: 0.5 });
    
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
        observer.disconnect();
        window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  useEffect(() => {
    if (items.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const postId = params.get('id');
      if (postId) {
        const element = document.getElementById(`post-${postId}`);
        if (element) {
          setExpiredLink(false);
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
  }, [items]);

  async function fetchApproved() {
    const { data } = await supabase.from('jobs').select('*').eq('status', 'approved').order('created_at', { ascending: false })
    if (data) setItems(data);
  }

  const navigateTo = (id: string) => {
    setView('home');
    isScrollingManually.current = true;
    setIsMenuOpen(false);
    const newPath = id === 'home' ? '/' : `/${id}`;
    window.history.pushState(null, '', newPath);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    if (id === 'home') setHeroKey(prev => prev + 1);
    setTimeout(() => { isScrollingManually.current = false; }, 1000);
  };

  const handleNavFilter = (filterId: string) => {
    setView('home');
    setFilter(filterId);
    navigateTo('hub');
  };

  const filteredItems = items.filter(item => {
    const term = (globalSearch || searchQuery).toLowerCase();
    return (
      item.title?.toLowerCase().includes(term) || 
      item.category?.toLowerCase().includes(term)
    ) && (filter === 'all' || item.category === filter);
  });

  const featured = items.filter(i => i.is_featured);
  const initiatives = items.filter(i => i.is_official);

  const services = [
    { title: 'ACADEMIC', icon: <GraduationCap size={28}/>, list: ['WAEC Mock Logistics', 'Fidelity Exam Printing', 'Result Management', 'School IT Systems', 'Stationery Supply'] },
    { title: 'ADMIN', icon: <Briefcase size={28}/>, list: ['Business Registration', 'Statutory IDs', 'Document Logistics', 'Tax Prep & Filing', 'Corporate Concierge'] },
    { title: 'DIGITAL OPS', icon: <Code2 size={28}/>, list: ['Web Development', 'IT Infrastructure', 'Brand Identity', 'UI/UX Design', 'Cloud Integration'] },
    { title: 'LEARNING & DEV', icon: <Shield size={28}/>, list: ['Cadet Training', 'Masterclasses', 'Career Consulting', 'Digital Literacy', 'Leadership Coaching'] },
    { title: 'AGENCY OUTSOURCING', icon: <HeartHandshake size={28}/>, list: ['Talent Booking', 'Event Staffing', 'Fleet Leasing', 'White-Label Tech', 'B2B Execution'] },
  ];

  if (!mounted) return null;

  return (
    <div className="bg-[#0A2A5E] font-sans selection:bg-[#1FC8C8] selection:text-[#0A2A5E]">
      
      {/* --- 🧭 NAVIGATION --- */}
      <nav className="fixed top-0 w-full z-[100] bg-[#0A2A5E] border-b border-white/10 px-6 py-5">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center text-white">
          <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => navigateTo('home')}>
            <div className="w-10 h-10 bg-[#1FC8C8] rounded-lg flex items-center justify-center font-black italic text-[#0A2A5E] text-[12px]">PC</div>
            <span className="text-lg font-black uppercase italic tracking-tighter">PRECEDE CONCEPTS</span>
          </div>
          
          <div className="hidden xl:flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.15em]">
            <button onClick={() => navigateTo('home')} className="hover:text-[#1FC8C8]">HOME</button>
            <button onClick={() => navigateTo('about')} className="hover:text-[#1FC8C8]">ABOUT</button>
            <button onClick={() => navigateTo('services')} className="hover:text-[#1FC8C8]">SERVICES</button>
            <button onClick={() => handleNavFilter('training')} className="hover:text-[#1FC8C8]">TRAINING</button>
            <button onClick={() => handleNavFilter('job')} className="hover:text-[#1FC8C8]">JOBS</button>
            <button onClick={() => handleNavFilter('event')} className="hover:text-[#1FC8C8]">EVENTS</button>
            <button onClick={() => handleNavFilter('place')} className="hover:text-[#1FC8C8]">PLACES & SPACES</button>
            <button onClick={() => { setView('marketplace'); window.scrollTo(0,0); }} className="hover:text-[#1FC8C8]">MARKETPLACE</button>
            <button onClick={() => navigateTo('contact')} className="bg-[#1FC8C8] text-[#0A2A5E] px-5 py-2 rounded-full font-black ml-2 shadow-lg">CONTACT</button>
          </div>
          <button className="xl:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}><Menu size={32} /></button>
        </div>
      </nav>

      {/* --- 🔍 FLOATING SEARCH VAULT (Under Nav) --- */}
      <div className="fixed top-[95px] left-1/2 -translate-x-1/2 w-full max-w-2xl z-[90] px-6">
        <div className="relative group overflow-hidden rounded-full border border-white/10 bg-[#0A2A5E]/40 backdrop-blur-xl shadow-2xl">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#1FC8C8]" size={18} />
          <input 
            type="text" 
            placeholder="Search entire Precede ecosystem..." 
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="w-full py-4 pl-16 pr-6 bg-transparent text-white text-[11px] font-black uppercase italic tracking-[0.2em] outline-none focus:bg-white/5 transition-all placeholder:text-white/30"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'home' ? (
          <motion.div key="home-view" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
            
            {/* --- HERO SECTION (Centered) --- */}
            <section id="home" className="h-screen flex flex-col items-center justify-center bg-[#0A2A5E] text-center px-6 relative">
              <motion.div key={heroKey} initial={{opacity:0, y:40}} animate={{opacity:1, y:0}} transition={{ duration: 0.8 }}>
                <p className="text-[#1FC8C8] text-sm md:text-lg font-black uppercase tracking-[0.5em] mb-4 italic">Progress Simplified, Value Delivered.</p>
                <h1 className="text-5xl md:text-[9rem] font-black tracking-tighter uppercase italic leading-[0.8] text-white">THE <span className="text-[#1FC8C8]">STANDARD</span> <br/> OF EXECUTION.</h1>
                <p className="text-white/40 text-sm md:text-xl font-black uppercase tracking-[0.4em] mt-8 italic">Simplifying Progress, Delivering Value.</p>
              </motion.div>
            </section>
            
            {/* --- ABOUT SECTION (Restored sc 2.png Design) --- */}
            <section id="about" className="h-screen flex items-center justify-center bg-[#1FC8C8] px-6">
              <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_1.8fr] gap-12 text-[#0A2A5E] items-center">
                <div className="flex flex-col text-left">
                  <h2 className="text-[4rem] md:text-[6.5rem] font-black uppercase italic tracking-tighter leading-[0.8] mb-2">BEYOND <br/><span className="text-white">A DIGITAL</span><br/>AGENCY.</h2>
                  <p className="font-black italic uppercase tracking-[0.2em] opacity-40 text-sm">Move Ahead, Stay Ahead.</p>
                </div>
                <div className="flex flex-col justify-center text-left border-l-[10px] border-[#0A2A5E] pl-12 h-full py-10">
                  <h2 className="text-2xl md:text-4xl font-black uppercase italic leading-tight mb-6">Built for Business. Designed for Impact.</h2>
                  <h3 className="text-lg md:text-xl font-black uppercase italic leading-relaxed opacity-90 text-black">
                    We operate a dual-purpose ecosystem—delivering high-quality digital, administrative, and development services, while running a CSR hub that connects communities to vital resources and opportunities.
                  </h3>
                </div>
              </div>
            </section>

            {/* --- 🛠️ SERVICES SECTION (Tightened) --- */}
            <section id="services" className="h-screen bg-white flex flex-col justify-center py-10">
              <div className="max-w-[1500px] mx-auto w-full px-6">
                <h2 className="text-5xl md:text-6xl font-black uppercase italic mb-8 tracking-tighter text-left text-[#0A2A5E]">OUR SERVICES.</h2>
                
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                  {services.map((s, i) => (
                    <div key={i} className="bg-slate-50 border-4 border-[#1FC8C8] rounded-[2rem] flex flex-col h-[400px] overflow-hidden group shadow-lg transition-all hover:scale-105 hover:border-[#0A2A5E]">
                      <div className="bg-[#1FC8C8] p-5 flex items-center gap-3 h-[80px]">
                        <div className="bg-white p-2 rounded-lg text-[#0A2A5E] shrink-0">{s.icon}</div>
                        <h3 className="text-[14px] font-black uppercase italic text-black leading-tight">{s.title}</h3>
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                         <ul className="space-y-2 text-left mb-4">
                           {s.list.map((item, idx) => (
                             <li key={idx} className="flex items-start gap-2 text-[12px] font-black uppercase italic text-black leading-tight">
                               <ChevronRight size={14} className="shrink-0 text-[#0A2A5E]"/> {item}
                             </li>
                           ))}
                         </ul>
                         <button onClick={() => navigateTo('contact')} className="mt-auto w-full py-4 rounded-xl text-[11px] font-black uppercase bg-[#0A2A5E] text-white hover:bg-[#1FC8C8] hover:text-[#0A2A5E] transition-all tracking-widest shadow-md">BOOK SERVICE</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Trio Section (Tight to Grid) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                   <div className="bg-[#0A2A5E] p-6 rounded-[2rem] flex items-center justify-between group cursor-pointer hover:bg-[#1FC8C8] transition-all h-[90px] shadow-2xl">
                      <div className="text-white group-hover:text-[#0A2A5E] text-left">
                        <h3 className="text-lg md:text-xl font-black italic uppercase leading-none mb-1"><Ticket size={24} className="inline mr-2"/> TICKETING & PAYMENTS</h3>
                        <p className="text-[12px] font-black uppercase tracking-[0.1em] opacity-40 text-white group-hover:text-black">SECURE REVENUE AND EVENT LOGISTICS.</p>
                      </div>
                      <ArrowUpRight className="text-[#1FC8C8] group-hover:text-[#0A2A5E]" size={24}/>
                   </div>
                   <div className="flex flex-col justify-center items-center h-[90px]"><h4 className="text-black font-black uppercase italic text-lg tracking-[0.4em]">AND MORE...</h4></div>
                   <div className="bg-[#1FC8C8] p-6 rounded-[2rem] flex items-center justify-between group cursor-pointer hover:bg-[#0A2A5E] transition-all h-[90px] shadow-2xl">
                      <div className="text-[#0A2A5E] group-hover:text-white text-left">
                        <h3 className="text-lg md:text-xl font-black italic uppercase leading-none mb-1"><FileText size={24} className="inline mr-2"/> CUSTOM ENQUIRY</h3>
                        <p className="text-[12px] font-black uppercase tracking-[0.1em] opacity-40 text-black group-hover:text-white">BESPOKE AGENCY AND TECHNICAL REQUESTS.</p>
                      </div>
                      <ArrowUpRight className="text-[#0A2A5E] group-hover:text-white" size={24}/>
                   </div>
                </div>
              </div>
            </section>

            {/* --- OPPORTUNITY HUB --- */}
            <section id="hub" className="min-h-screen py-24 px-6 bg-[#0F4C81]">
              <div className="max-w-[1500px] mx-auto text-left text-white">
                <h2 className="text-6xl md:text-[8rem] font-black uppercase italic mb-16 tracking-tighter">OPPORTUNITY HUB.</h2>
                <div className="flex flex-wrap gap-2 bg-black/30 p-2 rounded-full border-2 border-white/10 mb-20">
                    {['all', 'training', 'job', 'event', 'place', 'marketplace'].map((f) => (
                      <button key={f} onClick={() => setFilter(f)} className={`px-10 py-3 rounded-full text-[11px] font-black uppercase transition-all whitespace-nowrap ${filter === f ? 'bg-[#1FC8C8] text-[#0A2A5E]' : 'text-white/40 hover:text-white'}`}>{f}</button>
                    ))}
                </div>
                <div className="space-y-24">
                  <div>
                    <h3 className="flex items-center gap-3 text-[#1FC8C8] mb-12 font-black uppercase italic text-sm tracking-[0.4em] border-b-4 border-white/10 pb-6"><CheckCircle2 size={24}/> Precede Initiatives</h3>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-6">{initiatives.map(item => <ScoutCard key={item.id} item={item} />)}</div>
                  </div>
                </div>
              </div>
            </section>

            {/* --- 🏁 CONTACT & FOOTER (100vh) --- */}
            <footer id="contact" className="h-screen bg-[#0A2A5E] flex flex-col justify-center px-6 pt-32 pb-10 text-white relative overflow-hidden">
                <div className="max-w-[1600px] mx-auto w-full grid lg:grid-cols-2 gap-10 items-center flex-1">
                    <motion.div initial={{ y: 150, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
                        <h2 className="text-[4rem] md:text-[8rem] font-black italic uppercase leading-[0.8] mb-4 tracking-tighter text-left">MOVE <br/>AHEAD, <br/><span className="text-[#1FC8C8]">STAY <br/>AHEAD.</span></h2>
                        <div className="mt-8 flex gap-6 text-white/20 italic font-black text-xs uppercase tracking-widest"><span>Instagram</span> <span>LinkedIn</span> <span>WhatsApp Channel</span></div>
                    </motion.div>

                    <div className="bg-white/5 p-12 rounded-[4rem] border-2 border-white/10 backdrop-blur-3xl shadow-3xl text-left">
                        <div className="space-y-10 mb-10">
                            <div className="flex items-center gap-6">
                                <div className="p-6 bg-[#1FC8C8]/10 rounded-2xl text-[#1FC8C8]"><Phone size={32}/></div>
                                <div><span className="text-[10px] font-black uppercase text-white/40 tracking-widest italic">VOICE LINE</span><p className="text-3xl md:text-6xl font-black italic mt-1 tracking-tighter">0591999544</p></div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="p-6 bg-[#1FC8C8]/10 rounded-2xl text-[#1FC8C8]"><Mail size={32}/></div>
                                <div><span className="text-[10px] font-black uppercase text-white/40 tracking-widest italic">DIGITAL MAIL</span><p className="text-xl md:text-2xl font-black italic text-white opacity-80">precedeconcepts@gmail.com</p></div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <a href="https://wa.me/233591999544" className="bg-white text-[#0A2A5E] p-6 rounded-2xl font-black uppercase italic text-[12px] text-center flex justify-center items-center gap-3 hover:bg-[#1FC8C8] transition-all"><WhatsAppIcon size={20}/> WHATSAPP CHAT</a>
                            <a href="#" className="bg-[#1FC8C8]/10 text-[#1FC8C8] p-6 border-2 border-[#1FC8C8]/20 rounded-2xl font-black uppercase italic text-[12px] text-center flex justify-center items-center gap-2">CHANNEL</a>
                            <button onClick={() => window.location.href='mailto:precedeconcepts@gmail.com'} className="bg-[#1FC8C8] text-[#0A2A5E] p-6 rounded-2xl font-black uppercase italic text-[12px] hover:bg-white transition-all">SEND EMAIL</button>
                        </div>
                    </div>
                </div>
                <div className="text-center pt-10 border-t-2 border-white/5 w-full"><p className="text-[#1FC8C8] font-black uppercase italic text-[10px] tracking-[0.8em]">PRECEDE CONCEPTS · ACCRA GHANA · © 2026</p></div>
            </footer>
          </motion.div>
        ) : (
          /* --- MARKETPLACE PAGE --- */
          <motion.div key="marketplace-view" initial={{opacity:0, y:100}} animate={{opacity:1, y:0}} exit={{opacity:0}} className="pt-[220px] h-screen bg-[#0A2A5E] px-6">
            <div className="max-w-[1500px] mx-auto text-left">
               <div className="flex items-center justify-between mb-20">
                  <h2 className="text-6xl md:text-[8rem] font-black uppercase italic text-white tracking-tighter">MARKETPLACE.</h2>
                  <button onClick={() => setView('home')} className="bg-[#1FC8C8] text-[#0A2A5E] px-10 py-5 rounded-2xl font-black uppercase italic flex items-center gap-3">CLOSE <X size={24}/></button>
               </div>
               <div className="grid md:grid-cols-2 gap-10 max-w-4xl">
                  <div className="p-12 bg-white/5 border-4 border-white/10 rounded-[3rem] h-[300px] flex flex-col justify-between">
                     <div><Users size={56} className="text-[#1FC8C8] mb-6"/><h3 className="text-4xl font-black text-white uppercase italic">Hire Talent</h3></div>
                     <button className="w-full p-5 bg-[#1FC8C8] text-[#0A2A5E] rounded-2xl font-black uppercase italic tracking-widest shadow-xl">EXPLORE CHANNELS</button>
                  </div>
                  <div className="p-12 bg-white/10 border-4 border-white/20 rounded-[3rem] h-[300px] flex flex-col justify-between">
                     <div><Briefcase size={56} className="text-white mb-6"/><h3 className="text-4xl font-black text-white uppercase italic text-[#1FC8C8]">Post Talent</h3></div>
                     <button className="w-full p-5 bg-white text-[#0A2A5E] rounded-2xl font-black uppercase italic tracking-widest">JOIN NETWORK</button>
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
    const shareUrl = `${window.location.origin}/hub?id=${item.id}`;
    navigator.clipboard.writeText(shareUrl);
    alert("Post Link Secured.");
  };

  return (
    <div id={`post-${item.id}`} className={`group bg-white rounded-[1.5rem] md:rounded-[2rem] overflow-hidden flex flex-col shadow-2xl transition-all h-full ${isFeatured ? 'ring-8 ring-[#1FC8C8]' : ''}`}>
      <div className="h-28 bg-slate-900 relative overflow-hidden">
        {item.image_url && <img src={item.image_url} className="w-full h-full object-cover opacity-60 group-hover:scale-125 transition-transform duration-1000" />}
        <span className="absolute top-3 left-3 text-[7px] font-black bg-[#1FC8C8] text-[#0A2A5E] px-3 py-1.5 rounded-md uppercase italic z-10">{item.category}</span>
      </div>
      <div className="p-5 flex flex-col flex-1 text-left text-black">
        <h4 className="font-black text-[12px] uppercase italic leading-tight mb-4 h-10">{item.title}</h4>
        <div className="mt-auto pt-4 border-t-2 border-slate-50 flex justify-between items-center">
          <p className="text-[9px] font-black uppercase text-slate-400 italic">{targetDate.toLocaleDateString('en-GB')}</p>
          <div className="flex gap-2">
            <button onClick={handleShare} className="p-2 bg-slate-100 text-[#0A2A5E] rounded-lg shadow-sm"><Share2 size={14}/></button>
            <a href={item.link} target="_blank" className="text-[10px] font-black uppercase bg-[#0A2A5E] text-white px-5 py-2.5 rounded-xl">VIEW</a>
          </div>
        </div>
      </div>
    </div>
  )
}