'use client'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { 
  Briefcase, Calendar, MapPin, ArrowUpRight, ShieldCheck, 
  Zap, Search, Users, Globe, PlayCircle, Lightbulb 
} from 'lucide-react'

export default function Home() {
  const [items, setItems] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true); fetchApproved(); }, [])

  async function fetchApproved() {
    const { data } = await supabase.from('jobs').select('*').eq('status', 'approved').order('created_at', { ascending: false })
    if (data) setItems(data)
  }

  if (!mounted) return null

  const jobs = items.filter(i => i.category !== 'event')
  const events = items.filter(i => i.category === 'event')

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 scroll-smooth">
      
      {/* MODERN STICKY NAV */}
      <nav className="sticky top-0 w-full z-[100] bg-white/70 backdrop-blur-xl border-b border-slate-200/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-xl font-black text-blue-950 tracking-tighter uppercase italic leading-none">Precede Concepts</span>
            <span className="text-[7px] font-bold text-blue-600 tracking-[0.3em] uppercase mt-1">Strategic Operations Hub</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <a href="#" className="hover:text-blue-600 transition-colors">Home</a>
            <a href="#services" className="hover:text-blue-600 transition-colors">Services</a>
            <a href="#about" className="hover:text-blue-600 transition-colors">About</a>
            <a href="#opportunities" className="hover:text-blue-600 transition-colors">Opportunities</a>
            <a href="/contact" className="text-blue-600 border-b-2 border-blue-600 pb-1">Contact Us</a>
          </div>

          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <Globe size={14} />
          </div>
        </div>
      </nav>

      {/* TRENDY HERO SECTION */}
      <header className="bg-white py-24 md:py-32 px-6 text-center overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30"></div>
        <div className="relative z-10">
          <h1 className="text-6xl md:text-9xl font-black mb-6 tracking-tight text-slate-950 uppercase italic leading-[0.85]">
            Lead with <br/><span className="text-blue-600">Precision.</span>
          </h1>
          <p className="text-slate-500 mt-8 max-w-2xl mx-auto font-bold text-sm md:text-lg leading-relaxed uppercase tracking-tighter italic">
            Excellence through constant learning, planning, and research. <br/>Your strategic partner in Ghana’s digital economy.
          </p>
        </div>
      </header>

      {/* 6-PILLAR BENTO GRID */}
      <section id="services" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Digital */}
          <div className="bg-white border border-slate-200 p-6 rounded-[2rem] flex flex-col h-[380px] justify-between group hover:border-blue-500 transition-all shadow-sm">
            <div>
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4"><Globe size={20} /></div>
              <h3 className="text-lg font-black uppercase italic mb-3">Digital Solutions</h3>
              <p className="text-xs text-slate-400 font-bold uppercase mb-4 tracking-widest">Web • Backend • Branding</p>
              <ul className="text-xs font-bold text-slate-600 space-y-2 uppercase opacity-80">
                <li>• Scalable Web Systems</li>
                <li>• Custom REST APIs</li>
                <li>• Minimalist Branding</li>
              </ul>
            </div>
            <button className="flex items-center justify-between w-full p-4 bg-slate-50 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
              <span className="text-[10px] font-black uppercase">View Details</span>
              <ArrowUpRight size={16} />
            </button>
          </div>

          {/* Card 2: Media (NEW) */}
          <div className="bg-white border border-slate-200 p-6 rounded-[2rem] flex flex-col h-[380px] justify-between group hover:border-indigo-500 transition-all shadow-sm">
            <div>
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4"><PlayCircle size={20} /></div>
              <h3 className="text-lg font-black uppercase italic mb-3">Media & Production</h3>
              <p className="text-xs text-slate-400 font-bold uppercase mb-4 tracking-widest">Church Media • Digital Assets</p>
              <ul className="text-xs font-bold text-slate-600 space-y-2 uppercase opacity-80">
                <li>• Church Media Training</li>
                <li>• Presentation Design</li>
                <li>• Content Creation</li>
              </ul>
            </div>
            <button className="flex items-center justify-between w-full p-4 bg-slate-50 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <span className="text-[10px] font-black uppercase">View Details</span>
              <ArrowUpRight size={16} />
            </button>
          </div>

          {/* Card 3: Training */}
          <div className="bg-white border border-slate-200 p-6 rounded-[2rem] flex flex-col h-[380px] justify-between group hover:border-orange-500 transition-all shadow-sm">
            <div>
              <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-4"><Calendar size={20} /></div>
              <h3 className="text-lg font-black uppercase italic mb-3">Training & Events</h3>
              <p className="text-xs text-slate-400 font-bold uppercase mb-4 tracking-widest">Hospitality • Intel</p>
              <ul className="text-xs font-bold text-slate-600 space-y-2 uppercase opacity-80">
                <li>• Hospitality Management</li>
                <li>• Event Scouting</li>
                <li>• Seminar Logistics</li>
              </ul>
            </div>
            <button className="flex items-center justify-between w-full p-4 bg-slate-50 rounded-2xl group-hover:bg-orange-600 group-hover:text-white transition-all">
              <span className="text-[10px] font-black uppercase">View Details</span>
              <ArrowUpRight size={16} />
            </button>
          </div>

          {/* Card 4: Opportunities */}
          <div className="bg-white border border-slate-200 p-6 rounded-[2rem] flex flex-col h-[380px] justify-between group hover:border-emerald-500 transition-all shadow-sm">
            <div>
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4"><Briefcase size={20} /></div>
              <h3 className="text-lg font-black uppercase italic mb-3">Opportunities</h3>
              <p className="text-xs text-slate-400 font-bold uppercase mb-4 tracking-widest">Jobs • Apprenticeships</p>
              <ul className="text-xs font-bold text-slate-600 space-y-2 uppercase opacity-80">
                <li>• Verified Job Feed</li>
                <li>• Internship Matching</li>
                <li>• Immersion Programs</li>
              </ul>
            </div>
            <button className="flex items-center justify-between w-full p-4 bg-slate-50 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <span className="text-[10px] font-black uppercase">View Details</span>
              <ArrowUpRight size={16} />
            </button>
          </div>

          {/* Card 5: Business Support */}
          <div className="bg-white border border-slate-200 p-6 rounded-[2rem] flex flex-col h-[380px] justify-between group hover:border-purple-500 transition-all shadow-sm">
            <div>
              <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-4"><Users size={20} /></div>
              <h3 className="text-lg font-black uppercase italic mb-3">Business Support</h3>
              <p className="text-xs text-slate-400 font-bold uppercase mb-4 tracking-widest">Admin • Outsourcing</p>
              <ul className="text-xs font-bold text-slate-600 space-y-2 uppercase opacity-80">
                <li>• Secretarial Services</li>
                <li>• Commercial Printing</li>
                <li>• Partner Referrals</li>
              </ul>
            </div>
            <button className="flex items-center justify-between w-full p-4 bg-slate-50 rounded-2xl group-hover:bg-purple-600 group-hover:text-white transition-all">
              <span className="text-[10px] font-black uppercase">View Details</span>
              <ArrowUpRight size={16} />
            </button>
          </div>

          {/* Card 6: Strategy (NEW) */}
          <div className="bg-slate-950 border border-slate-800 p-6 rounded-[2rem] flex flex-col h-[380px] justify-between group hover:bg-blue-600 transition-all shadow-2xl">
            <div>
              <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-white group-hover:text-blue-600"><Lightbulb size={20} /></div>
              <h3 className="text-lg font-black uppercase italic mb-3 text-white">Strategy & More</h3>
              <p className="text-xs text-slate-500 font-bold uppercase mb-4 tracking-widest group-hover:text-blue-100">Consultancy • Research</p>
              <ul className="text-xs font-bold text-slate-400 space-y-2 uppercase opacity-80 group-hover:text-white">
                <li>• Operations Planning</li>
                <li>• Data-Driven Research</li>
                <li>• Custom Projects</li>
              </ul>
            </div>
            <button className="flex items-center justify-between w-full p-4 bg-white/10 text-white rounded-2xl group-hover:bg-white group-hover:text-blue-600 transition-all">
              <span className="text-[10px] font-black uppercase">Inquire Now</span>
              <ArrowUpRight size={16} />
            </button>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 border-t border-slate-200 text-center">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">Precede Concepts &middot; Accra Ghana &middot; 2026</p>
      </footer>
    </div>
  )
}