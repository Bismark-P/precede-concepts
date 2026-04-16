'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from './lib/supabase'
import { 
  MapPin, Code2, Printer, 
  Smartphone, Phone, Mail, Menu, X, Users, 
  Search, ArrowUp, GraduationCap, Briefcase, 
  Shield, HeartHandshake, Ticket, CalendarPlus, FileText, ChevronRight, Sparkles
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
  const [selectedFlyer, setSelectedFlyer] = useState<any | null>(null)

  const BUSINESS_PHONE = "+233 (0)59 199 9544"
  const BUSINESS_EMAIL = "precedeconcepts@gmail.com"

  useEffect(() => { 
    setMounted(true); 
    fetchApproved(); 
    
    // Smooth scroll & Top Button
    const handleScroll = () => setShowTopBtn(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);

    // SPA Masked Routing (No Hash) via Intersection Observer
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
    
    if (data) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const activeItems: any[] = [];
      const pastItemIds: string[] = [];

      // Auto-Archiver Logic
      data.forEach(item => {
        const targetDate = new Date(item.event_date);
        targetDate.setHours(0, 0, 0, 0);

        if (targetDate < today) {
          pastItemIds.push(item.id); // Flag for archiving
        } else {
          activeItems.push(item); // Keep on the live hub
        }
      });

      // Update the UI instantly with only active items
      setItems(activeItems);

      // Silently move expired items to the "Past / Analytics" tab in the database
      if (pastItemIds.length > 0) {
        supabase.from('jobs')
          .update({ status: 'past' })
          .in('id', pastItemIds)
          .then(({ error }) => {
            if (error) console.error("Auto-archiver error:", error);
          });
      }
    }
  }

  const handleNavFilter = (filterId: string) => {
    setFilter(filterId);
    setIsMenuOpen(false);
    document.getElementById('hub')?.scrollIntoView({ behavior: 'smooth' });
  };

  const getCalendarLink = (flyer: any) => {
    if (!flyer) return '#';
    const title = encodeURIComponent(flyer.title);
    const details = encodeURIComponent(flyer.description || 'Precede Concepts Official Event/Training.');
    const location = encodeURIComponent(flyer.venue || 'Accra, Ghana');
    
    const d = new Date(flyer.event_date);
    const dateStr = d.toISOString().replace(/-|:|\.\d\d\d/g, "").slice(0, 8);
    const dates = `${dateStr}T090000Z/${dateStr}T170000Z`; 
  
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  };

  const filteredItems = items.filter(item => {
    const s = searchQuery.toLowerCase();
    
    // Calculate dates for smart 'today' and 'tomorrow' search functionality
    const itemDate = new Date(item.event_date);
    itemDate.setHours(0,0,0,0);
    
    const todayDate = new Date();
    todayDate.setHours(0,0,0,0);
    
    const tomorrowDate = new Date(todayDate);
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);

    const isItemToday = itemDate.getTime() === todayDate.getTime();
    const isItemTomorrow = itemDate.getTime() === tomorrowDate.getTime();

    const matchesTodaySearch = s.includes('today') && isItemToday;
    const matchesTomorrowSearch = s.includes('tomorrow') && isItemTomorrow;

    const match = item.title?.toLowerCase().includes(s) || 
                  item.venue?.toLowerCase().includes(s) || 
                  item.category?.toLowerCase().includes(s) ||
                  item.organizer_body?.toLowerCase().includes(s) ||
                  matchesTodaySearch || 
                  matchesTomorrowSearch;

    const catMatch = filter === 'all' || item.category === filter;
    return match && catMatch;
  });

  const precedeOfficial = items.filter(i => i.is_official || i.category === 'training').slice(0, 4);

  const divisions = [
    { title: 'ACADEMIC SERVICES', icon: <GraduationCap size={24}/>, desc: 'Assessment Curation & Exam Logistics', list: ['25-25-50 Matrix Mocks', 'Fidelity Exam Printing', 'Stationery Supply'] },
    { title: 'ADMIN SOLUTIONS', icon: <Briefcase size={24}/>, desc: 'Corporate Concierge & Logistics', list: ['Business Registration', 'Statutory Identity (Passports)', 'Document Logistics'] },
    { title: 'DIGITAL OPERATIONS', icon: <Code2 size={24}/>, desc: 'Technology & Systems', list: ['Full-Stack Development', 'IT Infrastructure', 'Brand Identity'] },
    { title: 'LEARNING & DEV', icon: <Shield size={24}/>, desc: 'Human Capital & Discipline', list: ['Cadet Training', 'Corporate Masterclasses', 'Career Consulting'] },
    { title: 'AGENCY OUTSOURCING', icon: <HeartHandshake size={24}/>, desc: 'Talent & Manpower', list: ['Pro-Talent Booking', 'Event Security/Staff', 'Fleet Outsourcing'] },
  ]

  const partnerLogos = ["GES", "WAEC", "PAYSTACK", "VERCEL", "SUPABASE", "NIN", "GRA", "ORC"];

  if (!mounted) return null

  return (
    <div className="bg-[#0A2A5E] font-sans text-slate-950 scroll-smooth overflow-x-hidden selection:bg-[#1FC8C8] selection:text-[#0A2A5E]">
      
      {/* --- LIGHTBOX MODAL --- */}
      <AnimatePresence>
        {selectedFlyer && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-[#0A2A5E]/80 backdrop-blur-md flex items-center justify-center p-4 md:p-12 cursor-pointer"
            onClick={() => setSelectedFlyer(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row shadow-2xl cursor-default"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-full md:w-1/2 bg-slate-900 min-h-[300px] relative">
                 {selectedFlyer.image_url && <img src={selectedFlyer.image_url} className="w-full h-full object-cover" />}
                 <button onClick={() => setSelectedFlyer(null)} className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white hover:text-black transition-all"><X size={20}/></button>
              </div>
              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between">
                 <div>
                   <span className="text-[10px] font-black bg-[#1FC8C8]/20 text-[#0F4C81] px-3 py-1 rounded-full uppercase italic">{selectedFlyer.category}</span>
                   <h2 className="text-3xl font-black uppercase italic text-[#0A2A5E] mt-4 mb-4 leading-none">{selectedFlyer.title}</h2>
                   <p className="text-sm font-medium text-slate-600 mb-6">{selectedFlyer.description || "Join us for this incredible opportunity curated for impact and growth."}</p>
                   
                   <div className="space-y-4 mb-8">
                     <div className="flex items-center gap-3 text-sm font-bold text-slate-800 uppercase italic"><MapPin size={16} className="text-[#1FC8C8]"/> {selectedFlyer.venue}</div>
                     <div className="flex items-center gap-3 text-sm font-bold text-slate-800 uppercase italic"><CalendarPlus size={16} className="text-[#1FC8C8]"/> {new Date(selectedFlyer.event_date).toDateString()}</div>
                   </div>
                 </div>
                 
                 <div>
                    <a 
                      href={getCalendarLink(selectedFlyer)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 bg-slate-100 text-[#0A2A5E] rounded-xl text-xs font-black uppercase italic hover:bg-slate-200 transition-all border border-slate-200 shadow-sm mb-4"
                    >
                      <CalendarPlus size={16} className="text-[#1FC8C8]" /> 
                      Add to Google Calendar
                    </a>
                    <a href={selectedFlyer.link} target="_blank" className="block w-full py-4 bg-[#0A2A5E] text-white rounded-xl text-xs font-black uppercase italic text-center hover:bg-[#1FC8C8] hover:text-[#0A2A5E] transition-all shadow-lg">REGISTER / VIEW FULL DETAILS</a>
                 </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- 🧭 NAVIGATION --- */}
      <nav className="fixed top-0 w-full z-[100] bg-[#0A2A5E]/90 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center text-white">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })}>
            <div className="w-9 h-9 bg-[#1FC8C8] rounded-lg flex items-center justify-center font-black italic text-[#0A2A5E] text-[11px] shadow-lg group-hover:scale-110 transition-transform duration-300">PC</div>
            <span className="text-sm md:text-lg font-black uppercase italic tracking-tighter">PRECEDE CONCEPTS</span>
          </div>
          <div className="hidden xl:flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.15em]">
            <a href="#home" onClick={() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-[#1FC8C8] transition-colors duration-300">HOME</a>
            <a href="#about" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-[#1FC8C8] transition-colors duration-300">ABOUT</a>
            <a href="#services" onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-[#1FC8C8] transition-colors duration-300">OUR DIVISIONS</a>
            <a href="#official" onClick={() => document.getElementById('official')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-[#1FC8C8] transition-colors duration-300">TRAINING</a>
            <a href="#hub" onClick={() => document.getElementById('hub')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-[#1FC8C8] transition-colors duration-300">OPPORTUNITIES</a>
            <a href="#contact" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="bg-[#1FC8C8] text-[#0A2A5E] px-6 py-2.5 rounded-full font-black ml-4 shadow-lg hover:bg-white transition-all transform hover:-translate-y-0.5">CONTACT</a>
          </div>
          <button className="xl:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}><Menu size={28} /></button>
        </div>
      </nav>

      {/* --- 📱 MOBILE MENU --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed inset-0 z-[200] bg-[#0A2A5E] flex flex-col p-8 text-white">
            <div className="flex justify-between items-center mb-12"><span className="font-black italic text-[#1FC8C8]">MENU</span><button onClick={() => setIsMenuOpen(false)}><X size={32}/></button></div>
            <div className="flex flex-col gap-8 text-2xl font-black italic uppercase">
              <a href="#home" onClick={() => { setIsMenuOpen(false); document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' }); }}>HOME</a>
              <a href="#about" onClick={() => { setIsMenuOpen(false); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }}>ABOUT</a>
              <a href="#services" onClick={() => { setIsMenuOpen(false); document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }); }}>OUR DIVISIONS</a>
              <a href="#official" onClick={() => { setIsMenuOpen(false); document.getElementById('official')?.scrollIntoView({ behavior: 'smooth' }); }}>TRAINING</a>
              <a href="#hub" onClick={() => { setIsMenuOpen(false); document.getElementById('hub')?.scrollIntoView({ behavior: 'smooth' }); }}>OPPORTUNITIES</a>
              <a href="#contact" onClick={() => { setIsMenuOpen(false); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }} className="bg-[#1FC8C8] text-[#0A2A5E] p-4 rounded-2xl text-center text-xl mt-4">CONTACT</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- 🚀 HERO --- */}
      <section id="home" className="min-h-screen flex items-center justify-center px-6 bg-[#0A2A5E] relative overflow-hidden text-center pt-20">
        <motion.div 
          className="z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <p className="text-[#1FC8C8] text-[12px] md:text-[16px] font-black uppercase tracking-[0.5em] mb-6 italic">MORE THAN A DIGITAL AGENCY.</p>
          <h1 className="text-5xl md:text-[8rem] lg:text-[10rem] font-black tracking-tighter uppercase italic leading-[0.8] text-white">BUILT FOR <br/>BUSINESS.</h1>
          <h1 className="text-5xl md:text-[8rem] lg:text-[10rem] font-black tracking-tighter uppercase italic leading-[0.8] text-[#1FC8C8] mt-2">DESIGNED FOR IMPACT.</h1>
          <p className="text-white/60 text-[10px] md:text-[14px] font-bold max-w-2xl mx-auto mt-8 uppercase tracking-widest leading-loose">
            We operate a dual-purpose ecosystem—delivering high-quality digital, administrative, and development services, while running a CSR hub that connects communities to vital resources.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mt-12">
            <button onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-white text-[#0A2A5E] rounded-full font-black uppercase italic tracking-widest text-xs hover:scale-105 transition-all">Explore Divisions</button>
            <button onClick={() => document.getElementById('hub')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-white/10 border border-white/20 text-white rounded-full font-black uppercase italic tracking-widest text-xs hover:bg-white/20 transition-all">Opportunity Hub</button>
          </div>
        </motion.div>
      </section>

      {/* --- 🔄 MARQUEE PARTNERS --- */}
      <div className="bg-[#1FC8C8] py-4 overflow-hidden border-y-4 border-[#0A2A5E]">
        <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite] gap-16 text-[#0A2A5E] font-black italic uppercase text-xl md:text-3xl tracking-tighter opacity-70 items-center">
          {[...partnerLogos, ...partnerLogos, ...partnerLogos].map((logo, i) => (
            <span key={i} className="flex items-center gap-4">{logo} <span className="text-white text-xs">●</span></span>
          ))}
        </div>
      </div>

      {/* --- 🏢 DIVISIONS (SERVICES) --- */}
      <section id="services" className="min-h-screen py-32 bg-slate-50 px-6">
        <div className="max-w-[1400px] mx-auto text-left">
          <motion.h2 
            initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black uppercase italic text-[#0A2A5E] mb-20 tracking-tighter leading-none"
          >
            OUR <br/><span className="text-[#1FC8C8]">DIVISIONS.</span>
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {divisions.map((s, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="p-8 bg-white border-2 border-slate-100 rounded-[2rem] transition-all hover:border-[#0A2A5E] hover:shadow-2xl group flex flex-col h-full"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-[#1FC8C8] group-hover:bg-[#0A2A5E] group-hover:text-white transition-all">{s.icon}</div>
                  <span className="text-slate-200 font-black italic text-4xl group-hover:text-[#1FC8C8]/20 transition-colors">0{i+1}</span>
                </div>
                <h3 className="text-xl font-black uppercase italic text-[#0A2A5E] leading-tight mb-2">{s.title}</h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6 border-b border-slate-100 pb-4">{s.desc}</p>
                <ul className="space-y-3 mb-8 flex-1">
                  {s.list.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-[11px] font-black text-slate-700 uppercase italic"><ChevronRight size={14} className="text-[#1FC8C8] flex-shrink-0"/> {item}</li>
                  ))}
                </ul>
                <button className="w-full py-3 bg-slate-50 text-[#0A2A5E] rounded-xl text-[10px] font-black uppercase italic tracking-widest group-hover:bg-[#1FC8C8] transition-all">BOOK SERVICE</button>
              </motion.div>
            ))}

            {/* THE 6TH HYBRID CARD */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
                className="bg-[#0A2A5E] rounded-[2rem] overflow-hidden flex flex-col shadow-2xl border-4 border-[#1FC8C8]/20"
            >
               {/* Ticketing Half */}
               <div onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="p-8 flex-1 border-b border-white/10 hover:bg-white/5 transition-colors cursor-pointer group">
                  <Ticket size={28} className="text-[#1FC8C8] mb-4 group-hover:scale-110 transition-transform"/>
                  <h3 className="text-xl font-black uppercase italic text-white mb-2">TICKETING & PAYMENTS</h3>
                  <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">End-to-end event revenue management.</p>
               </div>
               {/* Custom Request Half */}
               <div onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="p-8 flex-1 hover:bg-[#1FC8C8] group transition-colors cursor-pointer text-white hover:text-[#0A2A5E]">
                  <h3 className="text-xl font-black uppercase italic mb-2">CUSTOM INQUIRY?</h3>
                  <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">Not seeing your specific need? Tell us.</p>
                  <div className="mt-4 flex items-center gap-2 text-xs font-black uppercase italic"><FileText size={16}/> Submit Request</div>
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- 🎯 PRECEDE OFFICIAL (OWNED EVENTS) --- */}
      <section id="official" className="py-24 px-6 bg-[#0F4C81] border-b border-white/10">
        <div className="max-w-[1400px] mx-auto text-left">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <div className="flex items-center gap-2 text-[#1FC8C8] mb-4 font-black uppercase italic text-sm tracking-widest"><Shield size={20}/> PRECEDE OFFICIAL</div>
              <h2 className="text-4xl md:text-5xl font-black uppercase italic text-white tracking-tighter">CURATED BY US.</h2>
              <p className="text-white/60 text-[11px] font-bold uppercase tracking-widest mt-4 max-w-xl leading-relaxed">Exclusive Digital Trainings, Events, and Initiatives driven by the Precede Standard.</p>
            </div>
            <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="mt-6 md:mt-0 px-6 py-3 bg-[#1FC8C8] text-[#0A2A5E] rounded-full text-[10px] font-black uppercase italic tracking-widest hover:bg-white transition-all">BECOME A PARTNER</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {precedeOfficial.length > 0 ? precedeOfficial.map(item => (
              <div key={item.id} onClick={() => setSelectedFlyer(item)} className="bg-white/5 border border-white/10 p-4 rounded-[1.5rem] cursor-pointer hover:bg-white/10 transition-all hover:scale-105">
                <div className="h-40 bg-slate-900 rounded-xl mb-4 overflow-hidden relative">
                  {item.image_url && <img src={item.image_url} className="w-full h-full object-cover opacity-80" />}
                </div>
                <h4 className="font-black text-sm text-white uppercase italic leading-tight mb-2 line-clamp-2 h-10">{item.title}</h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-black text-[#1FC8C8] uppercase italic"><CalendarPlus size={12}/> {new Date(item.event_date).toLocaleDateString()}</div>
                  <span className="text-[8px] font-black bg-[#1FC8C8] text-[#0A2A5E] px-2 py-0.5 rounded-full uppercase italic tracking-widest">{item.category}</span>
                </div>
              </div>
            )) : (
              <div className="col-span-full p-12 border-2 border-dashed border-white/20 rounded-[2rem] text-center">
                 <p className="text-white/50 font-black italic uppercase tracking-widest">NO OFFICIAL INITIATIVES AT THIS MOMENT. CHECK BACK SOON.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* --- ⚡ OPPORTUNITY HUB (CSR) --- */}
      <section id="hub" className="min-h-screen py-32 px-6 bg-[#0A2A5E]">
        <div className="max-w-[1500px] mx-auto text-left">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-10">
            <div className="flex-1 w-full max-w-xl">
              <h2 className="text-5xl font-black uppercase italic text-white mb-2 tracking-tighter">CSR HUB.</h2>
              <p className="text-[#1FC8C8] text-[10px] font-black uppercase tracking-widest mb-8">Community Resources, Jobs & Market Gigs.</p>
              <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#1FC8C8]" size={24} />
                <input 
                  type="text" 
                  placeholder="SEARCH JOBS, EVENTS, ROLES, OR 'TODAY'..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-6 pl-18 bg-white/5 border-2 border-white/10 rounded-[2rem] text-white outline-none focus:border-[#1FC8C8] font-black uppercase text-sm italic transition-all placeholder:text-white/30"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 bg-black/30 p-2 rounded-full border border-white/5">
              {['all', 'job', 'event', 'place', 'marketplace'].map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-[#1FC8C8] text-[#0A2A5E] shadow-xl' : 'text-white/40 hover:text-white hover:bg-white/10'}`}>
                  {f === 'place' ? 'SPACES' : f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* EMPTY STATE OR RESULTS */}
          {filteredItems.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="w-full p-20 bg-white/5 rounded-[3rem] border-2 border-white/10 text-center flex flex-col items-center justify-center mt-12"
            >
               <Search size={48} className="text-white/20 mb-6" />
               <h3 className="text-2xl font-black text-white uppercase italic mb-2">NO RESULTS FOUND</h3>
               <p className="text-[12px] font-bold text-white/50 uppercase tracking-widest max-w-md mb-8">We couldn't find any opportunities matching your current search or filter in the hub.</p>
               <button onClick={() => {setSearchQuery(''); setFilter('all')}} className="px-8 py-3 bg-white text-[#0A2A5E] rounded-full text-[10px] font-black uppercase italic tracking-widest hover:bg-[#1FC8C8] transition-all">CLEAR FILTERS</button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-5 mt-12">
              {filteredItems.map(item => (
                <div key={item.id} onClick={() => setSelectedFlyer(item)} className="cursor-pointer h-full">
                  <ScoutCard item={item} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --- QUICK ACTION BANNER --- */}
      <section className="bg-white py-12 px-6">
         <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-4">
            <button className="px-6 py-4 bg-slate-100 border border-slate-200 text-[#0A2A5E] rounded-xl text-[10px] font-black uppercase italic tracking-widest hover:bg-[#1FC8C8] transition-all">APPLY FOR TUITION / IT CLASS</button>
            <button className="px-6 py-4 bg-slate-100 border border-slate-200 text-[#0A2A5E] rounded-xl text-[10px] font-black uppercase italic tracking-widest hover:bg-[#1FC8C8] transition-all">JOIN AS INTERN</button>
            <button className="px-6 py-4 bg-slate-100 border border-slate-200 text-[#0A2A5E] rounded-xl text-[10px] font-black uppercase italic tracking-widest hover:bg-[#1FC8C8] transition-all">OFFER YOUR SERVICE (GIGS)</button>
         </div>
      </section>

      {/* --- 💬 CONTACT & FOOTER --- */}
      <section id="contact" className="h-screen bg-[#0A2A5E] flex flex-col justify-between px-6 pt-24 pb-0 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-8 lg:gap-12 items-center flex-1">
          
          <motion.div 
            className="text-left"
            initial={{ y: 60, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <h2 className="text-[3.8rem] md:text-6xl lg:text-[7rem] font-black italic uppercase leading-[0.8] mb-2">
              MOVE AHEAD, <br/>
            </h2>
            <h2 className="text-[3.8rem] md:text-6xl lg:text-[7rem] font-black italic uppercase leading-[0.8] mb-6 text-[#1FC8C8]">
              STAY AHEAD.
            </h2>
            <p className="text-white/40 text-[10px] md:text-[11px] font-black uppercase tracking-[0.5em] italic">PROGRESS SIMPLIFIED — VALUE DELIVERED</p>
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
                  <a href={`https://wa.me/233591999544`} target="_blank" rel="noopener noreferrer" className="bg-white text-[#0A2A5E] p-5 rounded-[1.5rem] font-black uppercase italic text-[10px] md:text-xs flex items-center justify-center gap-3 hover:bg-[#1FC8C8] transition-all shadow-xl hover:-translate-y-1"><WhatsAppIcon /> WHATSAPP</a>
                  <a href={`https://whatsapp.com/channel/0029Vb7Mfjf5EjxpZuIIpA2W`} target="_blank" rel="noopener noreferrer" className="bg-white/10 border-2 border-white/10 p-5 rounded-[1.5rem] font-black uppercase italic text-[10px] md:text-xs flex items-center justify-center gap-3 hover:bg-white/20 transition-all hover:-translate-y-1"><Smartphone size={18}/> CHANNEL</a>
               </div>
               <button onClick={() => window.location.href = `mailto:${BUSINESS_EMAIL}`} className="bg-[#1FC8C8] text-[#0A2A5E] p-6 rounded-[2rem] font-black uppercase italic text-xs md:text-sm shadow-2xl hover:bg-white transition-all tracking-[0.2em] hover:-translate-y-1">SEND AN EMAIL</button>
            </div>
          </div>
        </div>

        {/* --- 🏁 UNIFIED FOOTER --- */}
        <div className="shrink-0 text-center pb-6 pt-6 border-t border-white/5 w-full">
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

  return (
    <div className={`group bg-white rounded-[1.5rem] overflow-hidden flex flex-col shadow-lg transition-all hover:scale-[1.03] h-full ${isFeatured ? 'border-[3px] border-[#1FC8C8] ring-4 ring-[#1FC8C8]/10' : 'border border-slate-100'}`}>
      <div className="h-16 bg-slate-900 relative">
        {item.image_url && <img src={item.image_url} className="w-full h-full object-cover opacity-80" />}
        <span className="absolute top-2 left-2 text-[6px] font-black bg-[#1FC8C8] text-[#0A2A5E] px-2 py-0.5 rounded-full uppercase italic tracking-widest">{item.category}</span>
      </div>
      
      <div className="p-4 flex flex-col flex-1 text-left pointer-events-none">
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
          </div>
          <div className="w-full py-2 bg-slate-50 text-[#0A2A5E] border border-slate-200 rounded-lg text-[8px] font-black uppercase text-center group-hover:bg-[#0A2A5E] group-hover:text-white transition-all shadow-sm mt-2">CLICK TO EXPAND</div>
        </div>
      </div>
    </div>
  )
}