'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Head from 'next/head' // Added for SEO
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
  const [showBackToTop, setShowBackToTop] = useState(false)

  const BUSINESS_EMAIL = "precedeconcepts@gmail.com"
  const BUSINESS_PHONE = "+233 (0)59 199 9544"

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
    let matchesFilter = filter === 'all' || item.category === filter;
    if (filter === 'training') matchesFilter = item.category === 'training' || item.category === 'seminar';
    return matchesSearch && matchesFilter;
  });

  const featuredItems = items.filter(i => i.is_featured && i.status === 'approved').slice(0, 6);
  const displayItems = filteredBySearch.slice(0, 18);

  const services = [
    { title: 'Admin & Printing', icon: <Printer size={20}/>, list: ['Professional Typing & Printing', 'Banner & Sticker Printing', 'Large Format Labels', 'Business Registration Assist', 'Binding & Lamination'] },
    { title: 'Graphic Architecture', icon: <Palette size={20}/>, list: ['Logo & Brand Identity', 'Business Cards & Flyers', 'Social Media Visuals', 'Packaging Design', 'Visual Branding'] },
    { title: 'Software Engineering', icon: <Code2 size={20}/>, list: ['Custom Web Development', 'Web Audit & Grading', 'API & Backend Systems', 'E-commerce Solutions', 'Mobile App Dev'] },
    { title: 'Growth Marketing', icon: <Megaphone size={20}/>, list: ['Social Media Strategy', 'SEO & Search Visibility', 'Targeted Google Ads', 'Content Marketing', 'Lead Generation'] },
    { title: 'Media Production', icon: <PlayCircle size={20}/>, list: ['Cinematic Video Editing', 'Product Photography', 'Corporate Multimedia', 'Drone Videography', 'Sound Engineering'] },
    { title: 'B2B Outsourcing', icon: <Users size={20}/>, list: ['Virtual Assistance', 'Technical Operations', 'Execution Support', 'White-Label Tech', 'Business Support'] },
  ]

  if (!mounted) return null

  return (
    <div className="bg-[#0A2A5E] font-sans text-slate-950 scroll-smooth overflow-x-hidden">
      <nav className="fixed top-0 w-full z-[100] bg-[#0A2A5E]/90 backdrop-blur-md border-b border-white/10 px-6 py-4 text-left">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#1FC8C8] rounded-lg flex items-center justify-center font-black italic text-[#0A2A5E] text-[10px] shadow-lg">PC</div>
            <span className="text-sm md:text-lg font-black tracking-tighter uppercase italic leading-none">Precede Concepts</span>
          </div>
          <div className="hidden xl:flex items-center gap-5 text-[9px] font-black uppercase tracking-[0.2em] text-white/70">
            <a href="#home">Home</a> <a href="#about">About Us</a> <a href="#services">Services</a>
            <button onClick={() => handleNavFilter('training')}>Training</button>
            <button onClick={() => handleNavFilter('job')}>Jobs</button>
            <button onClick={() => handleNavFilter('event')}>Events</button>
            <button onClick={() => handleNavFilter('place')}>Hotels & AirBnB</button>
            <a href="#contact" className="bg-[#1FC8C8] text-[#0A2A5E] px-5 py-2 rounded-full font-black">Contact Us</a>
          </div>
          <button className="xl:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}><Menu size={24} /></button>
        </div>
      </nav>

      {/* --- HERO --- */}
      <section id="home" className="h-screen flex items-center justify-center px-6 bg-[#0A2A5E] text-center relative overflow-hidden">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="z-10">
          <p className="text-[#1FC8C8] text-[10px] md:text-[14px] font-black uppercase tracking-[0.6em] mb-4">Simplifying progress, delivering value.</p>
          <h1 className="text-5xl md:text-8xl lg:text-[10rem] font-black tracking-tighter uppercase italic leading-[0.85] text-white text-left md:text-center">THE <span className="text-[#1FC8C8]">STANDARD</span> <br/> OF EXECUTION.</h1>
          <p className="text-white/40 text-[10px] md:text-[14px] font-black uppercase tracking-[0.4em] mt-6">Progress Simplified — Value Delivered</p>
        </motion.div>
      </section>

      {/* --- HUB (Integrated Search for Places) --- */}
      <section id="hub" className="min-h-screen py-32 px-6 bg-[#0F4C81]">
        <div className="max-w-[1400px] mx-auto text-left">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <h2 className="text-4xl font-black uppercase italic text-white tracking-tighter">Opportunity Hub</h2>
            <div className="flex flex-wrap justify-center gap-2 bg-black/20 p-1.5 rounded-full">
              {['all', 'training', 'job', 'event', 'place'].map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`px-5 py-2 rounded-full text-[8px] font-black uppercase tracking-widest ${filter === f ? 'bg-[#1FC8C8] text-[#0A2A5E]' : 'text-white/60'}`}>
                  {f === 'place' ? 'AirBnB & Hotels' : f}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {displayItems.map(item => <ScoutCard key={item.id} item={item} />)}
          </div>
        </div>
      </section>

      {/* --- ABOUT --- */}
      <section id="about" className="min-h-screen bg-[#1FC8C8] flex items-center justify-center px-6 text-left">
        <div className="max-w-6xl w-full flex flex-col lg:flex-row gap-12 text-[#0A2A5E]">
          <h2 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none">Beyond a <br/> Digital Agency.</h2>
          <div className="lg:flex-1 border-l-8 border-[#0A2A5E] pl-8">
            <p className="font-black text-2xl md:text-3xl italic mb-6 uppercase leading-tight">Your Partner for Business Registration, Web Audits, and Printing Excellence in Ghana.</p>
            <p className="opacity-70 text-[14px] font-black uppercase tracking-widest leading-loose">We deliver top-tier multimedia engineering and curate high-value resources for the modern entrepreneur. Whether you need an AirBnB grading or a full SaaS platform, we execute at the highest standard.</p>
          </div>
        </div>
      </section>

      {/* --- SERVICES (Keyword Optimized) --- */}
      <section id="services" className="min-h-screen py-32 bg-white px-6 text-left">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16"><h2 className="text-4xl font-black uppercase italic text-[#0A2A5E]">Our Services.</h2><p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.5em]">The Professional Portfolio</p></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((s, i) => (
              <div key={i} className="p-10 bg-slate-50 border-2 border-slate-100 rounded-[3rem] transition-all flex flex-col group shadow-sm hover:shadow-xl">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b-2 border-slate-200/50">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#0F4C81] group-hover:bg-[#1FC8C8] transition-all">{s.icon}</div>
                  <h3 className="text-sm font-black uppercase italic text-[#0A2A5E]">{s.title}</h3>
                </div>
                <ul className="space-y-4">
                  {s.list.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-[11px] font-black text-slate-500 uppercase italic"><CheckCircle2 size={14} className="text-[#1FC8C8]"/> {item}</li>
                  ))}
                  <li className="pt-2 text-[9px] font-black text-[#1FC8C8] uppercase tracking-widest italic border-t-2 border-slate-100 w-fit">AND MORE...</li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CONTACT --- */}
      <section id="contact" className="min-h-screen bg-[#0A2A5E] flex items-center justify-center px-6 text-white text-left">
        <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-12 items-center">
          <h2 className="text-7xl lg:text-[8rem] font-black italic uppercase leading-none">MOVE AHEAD, <br/><span className="text-[#1FC8C8]">STAY AHEAD.</span></h2>
          <div className="bg-white/5 p-10 rounded-[3rem] border-4 border-white/10">
            <div className="space-y-6 mb-10">
              <div className="flex items-center gap-4 text-left">
                <div className="p-4 bg-[#1FC8C8]/20 rounded-2xl text-[#1FC8C8]"><Phone size={24}/></div>
                <div><span className="text-[8px] font-black uppercase text-white/40">Call Us</span><p className="text-3xl font-black italic tracking-tighter">{BUSINESS_PHONE}</p></div>
              </div>
              <div className="flex items-center gap-4 text-left">
                <div className="p-4 bg-[#1FC8C8]/20 rounded-2xl text-[#1FC8C8]"><Mail size={24}/></div>
                <div><span className="text-[8px] font-black uppercase text-white/40">Email Us</span><p className="text-xl font-black italic tracking-tighter">{BUSINESS_EMAIL}</p></div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <a href={`https://wa.me/233591999544`} target="_blank" className="bg-white text-[#0A2A5E] p-5 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-2 hover:bg-[#1FC8C8] transition-all"><WhatsAppIcon /> WhatsApp</a>
                <a href={`https://whatsapp.com/channel/0029Vb7Mfjf5EjxpZuIIpA2W`} target="_blank" className="bg-white/10 border-2 border-white/10 p-5 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-2 hover:bg-[#1FC8C8] transition-all"><Smartphone size={16}/> JOIN CHANNEL</a>
              </div>
              <a href={`mailto:${BUSINESS_EMAIL}`} className="bg-[#1FC8C8] text-[#0A2A5E] p-6 rounded-2xl font-black uppercase text-xs flex items-center justify-center">Send us an Email</a>
            </div>
          </div>
        </div>
      </section>
      
      {/* --- BACK TO TOP --- */}
      <AnimatePresence>{showBackToTop && <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-8 right-8 z-[150] p-4 bg-[#1FC8C8] text-[#0A2A5E] rounded-2xl shadow-2xl hover:scale-110 transition-all"><ArrowUp size={24} /></motion.button>}</AnimatePresence>
    </div>
  )
}

function ScoutCard({ item }: { item: any }) {
  const targetDate = new Date(item.event_date);
  const today = new Date(); today.setHours(0,0,0,0);
  const diff = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
  const isToday = targetDate.toDateString() === today.toDateString();
  const isPast = targetDate < today && !isToday;

  return (
    <div className="group bg-white rounded-[1.5rem] overflow-hidden flex flex-col shadow-lg border border-slate-100 h-full transition-all hover:scale-[1.03]">
      <div className="h-24 bg-slate-900 relative">
        {item.image_url && <img src={item.image_url} className="w-full h-full object-cover opacity-80" />}
        <span className="absolute top-2 left-2 text-[7px] font-black bg-[#1FC8C8] text-[#0A2A5E] px-2 py-0.5 rounded-full uppercase">{item.category}</span>
      </div>
      <div className="p-4 flex flex-col flex-1 text-left">
        <h4 className="font-black text-[13px] text-[#0A2A5E] uppercase italic leading-tight line-clamp-2 h-9 mb-2 text-left">{item.title}</h4>
        <div className="mb-4 text-left">
          <p className="text-[10px] font-black uppercase italic text-slate-500">{targetDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
          <p className={`text-[9px] font-black uppercase italic mt-1 ${isToday ? 'text-red-600 animate-pulse' : isPast ? 'text-slate-300' : 'text-[#1FC8C8]'}`}>{isToday ? 'TODAY' : isPast ? 'PAST SCOUT' : `${diff} DAYS LEFT`}</p>
        </div>
        <div className="pt-3 border-t border-slate-100 mt-auto flex flex-col gap-3 text-left">
          <div className="flex items-center gap-2 text-[11px] font-black text-[#0A2A5E] uppercase italic truncate"><MapPin size={12} className="text-[#1FC8C8] flex-shrink-0"/> {item.venue}</div>
          <a href={item.link} target="_blank" className="w-full py-2 bg-slate-50 text-[#0A2A5E] border border-slate-200 rounded-lg text-[9px] font-black uppercase text-center group-hover:bg-[#0A2A5E] group-hover:text-white transition-all shadow-sm">View Details</a>
        </div>
      </div>
    </div>
  )
}