'use client'
import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from './lib/supabase'
import { 
  Code2, Phone, Mail, Menu, X, Sparkles, Search, 
  GraduationCap, Briefcase, Shield, HeartHandshake,
  Ticket, FileText, ChevronRight, ArrowUpRight, Share2, 
  AlertTriangle, MessageSquare, Instagram, Twitter, Linkedin, Facebook,
  CheckCircle2 //
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
  const [expiredLink, setExpiredLink] = useState(false)
  const [heroKey, setHeroKey] = useState(0)
  const isScrollingManually = useRef(false)

  useEffect(() => {
    setMounted(true);
    fetchApproved();
    const sections = ['home', 'about', 'services', 'hub', 'contact'];
    const observerOptions = { threshold: 0.6 };
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
    }, observerOptions);
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
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
    isScrollingManually.current = true;
    setIsMenuOpen(false);
    const newPath = id === 'home' ? '/' : `/${id}`;
    window.history.pushState(null, '', newPath);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    if (id === 'home') setHeroKey(prev => prev + 1);
    setTimeout(() => { isScrollingManually.current = false; }, 1000);
  };

  const handleNavFilter = (filterId: string) => {
    setFilter(filterId);
    navigateTo('hub');
  };

  const filteredItems = items.filter(item => {
    const s = searchQuery.toLowerCase();
    const match = item.title?.toLowerCase().includes(s) || item.venue?.toLowerCase().includes(s);
    const catMatch = filter === 'all' || item.category === filter;
    return match && catMatch;
  });

  const featured = items.filter(i => i.is_featured);
  const initiatives = items.filter(i => i.is_official); // New logic for Initiatives

  const services = [
    { title: 'ACADEMIC', icon: <GraduationCap size={24}/>, list: ['WAEC Mock Logistics', 'Fidelity Exam Printing', 'Result Management', 'School IT Systems', 'Stationery Supply'] },
    { title: 'ADMIN', icon: <Briefcase size={24}/>, list: ['Business Registration', 'Statutory IDs', 'Document Logistics', 'Tax Prep & Filing', 'Corporate Concierge'] },
    { title: 'DIGITAL OPS', icon: <Code2 size={24}/>, list: ['Web Development', 'IT Infrastructure', 'Brand Identity', 'UI/UX Design', 'Cloud Integration'] },
    { title: 'LEARNING & DEV', icon: <Shield size={24}/>, list: ['Cadet Training', 'Masterclasses', 'Career Consulting', 'Digital Literacy', 'Leadership Coaching'] },
    { title: 'AGENCY OUTSOURCING', icon: <HeartHandshake size={24}/>, list: ['Talent Booking', 'Event Staffing', 'Fleet Leasing', 'White-Label Tech', 'B2B Execution'] },
  ];

  if (!mounted) return null;

  return (
    <div className="bg-[#0A2A5E] font-sans text-slate-950 selection:bg-[#1FC8C8] selection:text-[#0A2A5E]">
      
      {/* --- 🧭 NAVIGATION --- */}
      <nav className="fixed top-0 w-full z-[100] bg-[#0A2A5E]/95 backdrop-blur-md border-b border-white/10 px-6 py-5">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center text-white">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigateTo('home')}>
            <div className="w-10 h-10 bg-[#1FC8C8] rounded-lg flex items-center justify-center font-black italic text-[#0A2A5E] text-[12px]">PC</div>
            <span className="text-lg font-black uppercase italic tracking-tighter">PRECEDE CONCEPTS</span>
          </div>
          
          <div className="hidden xl:flex items-center gap-8 text-[12px] font-black uppercase tracking-[0.15em]">
            <button onClick={() => navigateTo('home')} className="hover:text-[#1FC8C8] transition-colors">HOME</button>
            <button onClick={() => navigateTo('about')} className="hover:text-[#1FC8C8] transition-colors">ABOUT</button>
            <button onClick={() => navigateTo('services')} className="hover:text-[#1FC8C8] transition-colors">SERVICES</button>
            <button onClick={() => handleNavFilter('job')} className="hover:text-[#1FC8C8] transition-colors">JOBS</button>
            <button onClick={() => handleNavFilter('training')} className="hover:text-[#1FC8C8] transition-colors">TRAINING</button>
            <button onClick={() => handleNavFilter('event')} className="hover:text-[#1FC8C8] transition-colors">EVENTS</button>
            <button onClick={() => navigateTo('contact')} className="bg-[#1FC8C8] text-[#0A2A5E] px-8 py-3 rounded-full font-black ml-4 shadow-lg hover:bg-white transition-all transform hover:-translate-y-0.5">CONTACT</button>
          </div>
          <button className="xl:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}><Menu size={32} /></button>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed inset-0 z-[200] bg-[#0A2A5E] flex flex-col p-8 text-white">
            <div className="flex justify-between items-center mb-8"><span className="font-black italic text-[#1FC8C8]">MENU</span><button onClick={() => setIsMenuOpen(false)}><X size={32}/></button></div>
            <div className="flex flex-col gap-8 text-3xl font-black italic uppercase">
              <button onClick={() => navigateTo('home')}>HOME</button>
              <button onClick={() => navigateTo('about')}>ABOUT</button>
              <button onClick={() => navigateTo('services')}>SERVICES</button>
              <button onClick={() => handleNavFilter('job')}>JOBS</button>
              <button onClick={() => navigateTo('contact')}>CONTACT</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- HERO SECTION --- */}
      <section id="home" className="h-screen flex items-center justify-center bg-[#0A2A5E] text-center px-6">
        <motion.div key={heroKey} initial={{opacity:0, y:30}} animate={{opacity:1, y:0}}>
          <p className="text-[#1FC8C8] text-[16px] font-black uppercase tracking-[0.5em] mb-6 italic">PROGRESS SIMPLIFIED, VALUE DELIVERED.</p>
          <h1 className="text-5xl md:text-[9.5rem] font-black tracking-tighter uppercase italic leading-[0.8] text-white">THE <span className="text-[#1FC8C8]">STANDARD</span> <br/> OF EXECUTION.</h1>
        </motion.div>
      </section>
      
      {/* --- ABOUT SECTION --- */}
      <section id="about" className="min-h-screen flex items-center justify-center bg-[#1FC8C8] py-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_1.5fr] gap-16 text-[#0A2A5E]">
          <div><h2 className="text-[5rem] md:text-[6.5rem] font-black uppercase italic tracking-tighter leading-[0.8] mb-4 text-left">BEYOND <br/><span className="text-white">DIGITAL</span><br/>AGENCY.</h2></div>
          <div className="border-l-[4px] md:border-l-[8px] border-[#0A2A5E] pl-6 md:pl-12 flex flex-col justify-center font-bold text-lg md:text-xl leading-relaxed text-left">
            <p>We operate a dual-purpose ecosystem—delivering high-quality digital, administrative, and development services, while running a CSR hub that connects communities to vital resources and opportunities.</p>
          </div>
        </div>
      </section>

      {/* --- 🛠️ SERVICES SECTION --- */}
      <section id="services" className="min-h-screen bg-white z-10 relative flex flex-col justify-center py-20 md:py-32">
        <div className="max-w-[1500px] mx-auto w-full px-6">
          <h2 className="text-4xl md:text-6xl font-black uppercase italic text-[#0A2A5E] mb-12 tracking-tighter text-left">OUR SERVICES.</h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 md:gap-6 mb-12 items-stretch">
            {services.map((s, i) => (
              <div key={i} className="p-6 md:p-8 bg-slate-50 border-2 border-slate-100 rounded-[2rem] flex flex-col h-full group hover:border-[#1FC8C8] transition-all">
                <div className="flex flex-col gap-4 mb-4 pb-4 border-b-2 border-slate-200/50 text-left">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#0F4C81]">{s.icon}</div>
                  <h3 className="text-[12px] md:text-sm font-black uppercase italic text-[#0A2A5E] leading-tight">{s.title}</h3>
                </div>
                <ul className="space-y-2 mb-6 flex-1 text-left">{s.list.slice(0, 4).map((item, idx) => (<li key={idx} className="flex items-center gap-2 text-[9px] md:text-[10px] font-black text-slate-500 uppercase italic leading-tight"><ChevronRight size={12} className="text-[#1FC8C8] shrink-0"/> {item}</li>))}</ul>
                <button onClick={() => navigateTo('contact')} className="w-full py-4 rounded-xl text-[10px] md:text-[11px] font-black uppercase bg-[#1FC8C8] text-[#0A2A5E] group-hover:bg-[#0A2A5E] group-hover:text-white transition-all tracking-widest">BOOK SERVICE</button>
              </div>
            ))}
            {/* 6th Card: And More */}
            <div className="p-6 md:p-8 bg-slate-900 border-2 border-slate-800 rounded-[2rem] flex flex-col justify-center items-center text-center h-full group">
               <Sparkles className="text-[#1FC8C8] mb-4" size={32} />
               <h3 className="text-white font-black uppercase italic text-sm tracking-widest">AND MORE...</h3>
               <p className="text-[9px] text-white/40 uppercase font-black mt-2">Customized Agency Solutions</p>
            </div>
          </div>
          
          {/* Ticketing & Custom Enquiry Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-10">
             <div className="bg-[#0A2A5E] p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-between group cursor-pointer hover:ring-8 hover:ring-[#1FC8C8]/10 transition-all text-left shadow-2xl">
                <div className="text-white">
                  <h3 className="text-xl md:text-2xl font-black italic uppercase flex items-center gap-3 mb-1"><Ticket className="text-[#1FC8C8]"/> TICKETING & PAYMENTS</h3>
                  <p className="text-[9px] md:text-xs font-bold opacity-40 uppercase tracking-[0.2em]">Secure revenue and event logistics.</p>
                </div>
                <ArrowUpRight className="text-[#1FC8C8]" size={28}/>
             </div>
             <div className="bg-[#1FC8C8] p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-between group cursor-pointer hover:ring-8 hover:ring-[#0A2A5E]/10 transition-all text-left shadow-2xl">
                <div className="text-[#0A2A5E]">
                  <h3 className="text-xl md:text-2xl font-black italic uppercase flex items-center gap-3 mb-1"><FileText/> CUSTOM ENQUIRY</h3>
                  <p className="text-[9px] md:text-xs font-bold opacity-40 uppercase tracking-[0.2em]">Bespoke agency and technical requests.</p>
                </div>
                <ArrowUpRight className="text-[#0A2A5E]" size={28}/>
             </div>
          </div>
        </div>
      </section>

      {/* --- HUB SECTION --- */}
      <section id="hub" className="min-h-screen py-20 md:py-32 px-6 bg-[#0F4C81] relative">
        <div className="max-w-[1500px] mx-auto">
          
          <AnimatePresence>
            {expiredLink && (
              <motion.div initial={{opacity:0, y:-20}} animate={{opacity:1, y:0}} exit={{opacity:0}} className="mb-10 p-6 md:p-8 bg-red-500/10 border-2 border-red-500/30 rounded-[2rem] flex items-center justify-between backdrop-blur-md">
                <div className="flex items-center gap-4 text-left">
                  <div className="p-3 bg-red-500 text-white rounded-xl shrink-0"><AlertTriangle size={20}/></div>
                  <div className="text-white"><p className="text-[8px] font-black uppercase opacity-50 tracking-widest">ACCESS ALERT</p><h4 className="font-black uppercase italic text-sm md:text-lg">This scout has expired or is no longer available.</h4></div>
                </div>
                <button onClick={() => {setExpiredLink(false); window.history.replaceState(null, '', '/hub')}} className="shrink-0 ml-4 px-4 md:px-8 py-2 md:py-3 bg-white/10 hover:bg-white text-white hover:text-red-500 rounded-xl text-[9px] font-black uppercase transition-all">DISMISS</button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-10">
            <div className="flex-1 w-full max-w-xl text-left">
              <h2 className="text-4xl md:text-5xl font-black uppercase italic text-white mb-8 tracking-tighter underline underline-offset-[12px] decoration-[#1FC8C8]">OPPORTUNITY HUB.</h2>
              <div className="relative"><Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#1FC8C8]" size={20} /><input type="text" placeholder="SEARCH HUB..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full p-5 md:p-6 pl-14 md:pl-18 bg-white/10 border-2 border-white/10 rounded-[2rem] text-white font-black uppercase text-xs md:text-sm italic outline-none focus:border-[#1FC8C8] shadow-2xl"/></div>
            </div>
            <div className="flex flex-wrap gap-2 bg-black/30 p-1.5 md:p-2 rounded-[2rem] border border-white/5 w-full md:w-auto overflow-x-auto no-scrollbar">
              {['all', 'training', 'job', 'event', 'place', 'marketplace'].map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`px-5 md:px-8 py-2 md:py-3 rounded-full text-[9px] md:text-[10px] font-black uppercase transition-all whitespace-nowrap ${filter === f ? 'bg-[#1FC8C8] text-[#0A2A5E]' : 'text-white/40 hover:text-white'}`}>{f}</button>
              ))}
            </div>
          </div>

          {/* Collapsible Headers: Initiatives */}
          <div className="mb-20">
            <h3 className="flex items-center gap-2 text-[#1FC8C8] mb-8 font-black uppercase italic text-xs tracking-[0.3em] text-left border-b border-white/10 pb-4"><CheckCircle2 size={16}/> Precede Initiatives & Opportunities</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5">{initiatives.map(item => <ScoutCard key={item.id} item={item} />)}</div>
          </div>

          {/* Collapsible Headers: Featured */}
          <div className="mb-20">
            <h3 className="flex items-center gap-2 text-[#1FC8C8] mb-8 font-black uppercase italic text-xs tracking-[0.3em] text-left border-b border-white/10 pb-4"><Sparkles size={16}/> Featured Picks</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5">{featured.map(item => <ScoutCard key={item.id} item={item} isFeatured />)}</div>
          </div>

          {/* Posts */}
          <div className="mb-20">
             <h3 className="flex items-center gap-2 text-white/40 mb-8 font-black uppercase italic text-[10px] tracking-[0.4em] text-left border-b border-white/5 pb-4">Standard Posts</h3>
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5">{filteredItems.filter(i => !i.is_official && !i.is_featured).map(item => <ScoutCard key={item.id} item={item} />)}</div>
          </div>

          {/* MARKETPLACE BANNER */}
          <div className="mt-20 md:mt-32 w-full bg-white/5 border border-white/10 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 md:gap-12 backdrop-blur-xl shadow-3xl">
             <div className="flex items-center gap-6 md:gap-8 text-white text-left">
                <div className="p-4 md:p-6 bg-[#1FC8C8] rounded-2xl md:rounded-3xl text-[#0A2A5E] shrink-0"><Briefcase size={32} /></div>
                <div><h3 className="text-xl md:text-3xl font-black uppercase italic mb-1 tracking-tighter">THE MARKETPLACE</h3><p className="text-[10px] md:text-sm font-bold text-white/30 uppercase tracking-[0.2em] leading-relaxed">Book a Pro or offer your specific talent.</p></div>
             </div>
             <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full md:w-auto">
                <button onClick={() => setFilter('marketplace')} className="w-full md:w-auto px-10 md:px-12 py-5 md:py-6 bg-[#1FC8C8] text-[#0A2A5E] rounded-2xl text-[12px] md:text-[14px] font-black uppercase italic tracking-widest hover:bg-white transition-all shadow-xl">FIND TALENT</button>
                <button onClick={() => navigateTo('contact')} className="w-full md:w-auto px-10 md:px-12 py-5 md:py-6 bg-white/10 text-white border-2 border-white/10 rounded-2xl text-[12px] md:text-[14px] font-black uppercase italic tracking-widest hover:bg-white/20 transition-all">JOIN AS PRO</button>
             </div>
          </div>
        </div>
      </section>

      {/* --- 🏁 CONTACT & FOOTER SECTION --- */}
      <footer id="contact" className="h-screen bg-[#0A2A5E] flex flex-col justify-between px-6 py-12 md:py-24 text-white text-left relative overflow-hidden">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center flex-1 z-10">
          <div>
             <h2 className="text-[4rem] md:text-[7.5rem] font-black italic uppercase leading-[0.8] mb-4 tracking-tighter">MOVE <br/>AHEAD,</h2>
             <h2 className="text-[4rem] md:text-[7.5rem] font-black italic uppercase leading-[0.8] text-[#1FC8C8] tracking-tighter">STAY <br/>AHEAD.</h2>
             {/* Social Logos Placeholder */}
             <div className="mt-12 md:mt-16 flex gap-6 md:gap-8">
                {/* <a href="#" className="hover:text-[#1FC8C8] transition-all"><Instagram size={24}/></a> 
                <a href="#" className="hover:text-[#1FC8C8] transition-all"><Twitter size={24}/></a> 
                <a href="#" className="hover:text-[#1FC8C8] transition-all"><Linkedin size={24}/></a> 
                <a href="#" className="hover:text-[#1FC8C8] transition-all"><Facebook size={24}/></a> 
                */}
                <span className="text-[9px] font-black tracking-[0.5em] text-white/20 uppercase italic">Social Clearance Pending</span>
             </div>
          </div>

          <div className="bg-white/5 p-8 md:p-12 rounded-[3rem] border-2 border-white/10 shadow-3xl backdrop-blur-xl">
            <div className="space-y-8 md:space-y-10 mb-10">
              <div className="flex items-center gap-6 group">
                <div className="p-6 md:p-8 bg-[#1FC8C8]/10 rounded-2xl md:rounded-[2rem] text-[#1FC8C8] group-hover:bg-[#1FC8C8] group-hover:text-[#0A2A5E] transition-all shrink-0"><Phone size={32}/></div>
                <div><span className="text-[9px] md:text-xs font-black uppercase text-white/30 tracking-widest italic">VOICE CLEARANCE</span><p className="text-3xl md:text-4xl font-black italic mt-1 tracking-tighter leading-none underline decoration-[#1FC8C8]">0591999544</p></div>
              </div>
              <div className="flex items-center gap-6 group">
                <div className="p-6 md:p-8 bg-[#1FC8C8]/10 rounded-2xl md:rounded-[2rem] text-[#1FC8C8] group-hover:bg-[#1FC8C8] group-hover:text-[#0A2A5E] transition-all shrink-0"><Mail size={32}/></div>
                <div className="overflow-hidden">
                  <span className="text-[9px] md:text-xs font-black uppercase text-white/30 tracking-widest italic">SECURE MAIL</span>
                  <p className="text-lg md:text-xl font-black italic mt-1 truncate">precedeconcepts@gmail.com</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <a href="https://wa.me/233591999544" className="bg-white text-[#0A2A5E] p-5 rounded-2xl font-black uppercase italic text-[11px] text-center hover:bg-[#1FC8C8] transition-all flex justify-center items-center gap-2 shadow-xl"><WhatsAppIcon size={18}/> WHATSAPP</a>
              <a href="#" className="bg-[#1FC8C8]/10 text-[#1FC8C8] p-5 border-2 border-[#1FC8C8]/30 rounded-2xl font-black uppercase italic text-[11px] text-center hover:bg-[#1FC8C8] hover:text-[#0A2A5E] transition-all flex justify-center items-center gap-2"><MessageSquare size={16}/> CHANNEL</a>
              <button onClick={() => window.location.href='mailto:precedeconcepts@gmail.com'} className="bg-[#1FC8C8] text-[#0A2A5E] p-5 rounded-2xl font-black uppercase italic text-[11px] hover:bg-white transition-all shadow-xl tracking-widest">SEND EMAIL</button>
            </div>
          </div>
        </div>
        <div className="text-center pt-10 border-t border-white/5 w-full relative z-10"><p className="text-[#1FC8C8] font-black uppercase italic text-[9px] md:text-[11px] tracking-[0.6em]">PRECEDE CONCEPTS ACCRA · © 2026</p></div>
      </footer>

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
    alert("Copied to clipboard!");
  };

  return (
    <div id={`post-${item.id}`} className={`group bg-white rounded-[1.2rem] md:rounded-[1.5rem] overflow-hidden flex flex-col shadow-lg transition-all hover:scale-[1.03] h-full ${isFeatured ? 'ring-4 ring-[#1FC8C8]' : ''}`}>
      <div className="h-20 md:h-24 bg-slate-900 relative overflow-hidden">
        {item.image_url && <img src={item.image_url} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" alt={item.title} />}
        <span className="absolute top-2 left-2 md:top-3 md:left-3 text-[6px] md:text-[7px] font-black bg-[#1FC8C8] text-[#0A2A5E] px-2 py-1 md:py-1.5 rounded-md uppercase italic z-10">{item.category}</span>
      </div>
      <div className="p-3 md:p-5 flex flex-col flex-1 text-left">
        <h4 className="font-black text-[10px] md:text-[11px] text-[#0A2A5E] uppercase italic leading-tight line-clamp-2 mb-3 h-8 md:h-10">{item.title}</h4>
        <div className="mt-auto pt-3 md:pt-4 border-t border-slate-100 flex justify-between items-center">
          <p className="text-[8px] md:text-[9px] font-black uppercase text-slate-400 italic">{targetDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</p>
          <div className="flex gap-1.5 md:gap-2">
            <button onClick={handleShare} className="p-2 md:p-2.5 bg-slate-50 text-slate-400 rounded-lg md:rounded-xl hover:bg-[#1FC8C8] hover:text-[#0A2A5E] transition-all"><Share2 size={12}/></button>
            <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-[8px] md:text-[9px] font-black uppercase bg-[#0A2A5E] text-white px-3 md:px-5 py-2 md:py-2.5 rounded-lg md:rounded-xl hover:bg-[#1FC8C8] hover:text-[#0A2A5E] transition-all">VIEW</a>
          </div>
        </div>
      </div>
    </div>
  )
}