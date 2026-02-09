'use client'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { 
  Briefcase, Calendar, MapPin, ArrowRight, ShieldCheck, 
  Zap, Search, Users, Globe 
} from 'lucide-react'

export default function Home() {
  const [items, setItems] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchApproved()
  }, [])

  async function fetchApproved() {
    const { data } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
    if (data) setItems(data)
  }

  if (!mounted) return null

  const jobs = items.filter(i => i.category !== 'event')
  const events = items.filter(i => i.category === 'event')

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 scroll-smooth">
      
      {/* PERSISTENT NAVIGATION */}
      <nav className="sticky top-0 w-full z-[100] bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-xl font-black text-blue-900 tracking-tighter uppercase italic leading-none">
              Precede Concepts
            </span>
            <span className="text-[8px] font-bold text-blue-500 tracking-[0.2em] uppercase mt-1">
              Strategic Hub
            </span>
          </div>

          <div className="hidden md:flex items-center gap-10 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <a href="#" className="hover:text-blue-600 transition-colors">Home</a>
            <a href="#services" className="hover:text-blue-600 transition-colors">Services</a>
            <a href="#about" className="hover:text-blue-600 transition-colors">About Us</a>
            <a href="#opportunities" className="hover:text-blue-600 transition-colors">Opportunities</a>
          </div>

          <div className="text-slate-300 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
            <Globe size={14} className="text-blue-600" /> Ghana
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="bg-gradient-to-br from-slate-950 via-blue-950 to-blue-900 text-white py-32 px-6 text-center">
        <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter uppercase italic">
          Precede Concepts
        </h1>
        <div className="flex flex-wrap justify-center items-center gap-3 text-blue-300 font-bold tracking-widest uppercase text-[10px] md:text-xs mb-10">
          <span>Digital Solutions</span> <span className="text-blue-800">|</span>
          <span>Training & Events</span> <span className="text-blue-800">|</span>
          <span>Opportunities</span> <span className="text-blue-800">|</span>
          <span>Business Support</span> <span className="text-blue-800">|</span>
          <span>And More</span>
        </div>
        <p className="text-blue-100 mt-8 max-w-3xl mx-auto font-medium text-lg md:text-xl leading-relaxed opacity-90">
          Committed to excellence through constant learning, planning, and research, 
          Precede Concepts is your strategic partner for today’s needs and whatever comes next.
        </p>
      </header>

      {/* ABOUT US SECTION */}
      <section id="about" className="py-24 px-6 max-w-6xl mx-auto border-b border-slate-100">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-xs font-black text-blue-600 uppercase tracking-[0.4em] mb-4">Our Commitment</h2>
            <h3 className="text-4xl font-black text-slate-900 mb-6 uppercase italic leading-tight">Driven by Research,<br/>Defined by Excellence</h3>
            <p className="text-slate-600 leading-relaxed mb-6 font-medium text-lg">
              Precede Concepts is a Ghana-based multi-disciplinary hub bridging the gap between 
              operational challenges and strategic growth. We are a team built on proactive innovation 
              and a constant drive for professional mastery.
            </p>
            <p className="text-slate-600 leading-relaxed font-medium">
              We lead by researching global digital standards to ensure every solution—from backend 
              infrastructure to business operations—is secure, data-driven, and forward-thinking. 
              At Precede Concepts, we don't just provide services; we provide the strategic 
              intelligence required to scale in a modern economy.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-8 bg-blue-50 rounded-3xl border border-blue-100 text-center">
              <Search className="mx-auto text-blue-600 mb-4" />
              <p className="text-[10px] font-black uppercase text-blue-900 tracking-widest">Research Driven</p>
            </div>
            <div className="p-8 bg-slate-900 rounded-3xl text-center text-white shadow-xl shadow-slate-200">
              <ShieldCheck className="mx-auto text-blue-400 mb-4" />
              <p className="text-[10px] font-black uppercase tracking-widest">Secure Ops</p>
            </div>
            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-200 text-center col-span-2">
              <Zap className="mx-auto text-orange-500 mb-4" />
              <p className="text-[10px] font-black uppercase text-slate-900 tracking-[0.4em]">Planning & Execution</p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES GRID (FIXED BOUNDING BOXES) */}
      <section id="services" className="py-24 bg-slate-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-xs font-black text-blue-600 uppercase tracking-[0.4em] mb-4">Our Services</h2>
            <p className="text-4xl font-black text-slate-900 tracking-tight italic uppercase">Five Pillars of Support</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Box 1: Digital */}
            <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] flex flex-col h-[450px] justify-between hover:shadow-2xl transition-all group">
              <div>
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Globe size={24} />
                </div>
                <h3 className="text-xl font-black mb-4 uppercase">Digital Solutions</h3>
                <ul className="space-y-3 text-slate-500 text-xs font-bold uppercase tracking-tight">
                  <li>• Web & Backend Development</li>
                  <li>• Graphic Design & Branding</li>
                  <li>• Digital Marketing Strategy</li>
                  <li>• Image Enhancement</li>
                </ul>
              </div>
              <button className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-blue-600 transition-colors">View Details</button>
            </div>

            {/* Box 2: Training */}
            <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] flex flex-col h-[450px] justify-between hover:shadow-2xl transition-all group">
              <div>
                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                  <Calendar size={24} />
                </div>
                <h3 className="text-xl font-black mb-4 uppercase">Training & Events</h3>
                <ul className="space-y-3 text-slate-500 text-xs font-bold uppercase tracking-tight">
                  <li>• Hospitality Management</li>
                  <li>• Church Media Operations</li>
                  <li>• Event Scouting & Intelligence</li>
                  <li>• Seminar Coordination</li>
                </ul>
              </div>
              <button className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-orange-600 transition-colors">View Details</button>
            </div>

            {/* Box 3: Opportunities */}
            <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] flex flex-col h-[450px] justify-between hover:shadow-2xl transition-all group">
              <div>
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Briefcase size={24} />
                </div>
                <h3 className="text-xl font-black mb-4 uppercase">Opportunities</h3>
                <ul className="space-y-3 text-slate-500 text-xs font-bold uppercase tracking-tight">
                  <li>• Verified Job Feed</li>
                  <li>• Internship Placements</li>
                  <li>• Immersion/Apprentice Programs</li>
                  <li>• Skills Acquisition</li>
                </ul>
              </div>
              <button className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-emerald-600 transition-colors">View Details</button>
            </div>

            {/* Box 4: Business Support */}
            <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] flex flex-col h-[450px] justify-between hover:shadow-2xl transition-all group">
              <div>
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <Users size={24} />
                </div>
                <h3 className="text-xl font-black mb-4 uppercase">Business Support</h3>
                <ul className="space-y-3 text-slate-500 text-xs font-bold uppercase tracking-tight">
                  <li>• Administrative & Secretarial</li>
                  <li>• Commercial Printing</li>
                  <li>• Strategic Outsourcing</li>
                  <li>• Operations Management</li>
                </ul>
              </div>
              <button className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-purple-600 transition-colors">View Details</button>
            </div>

            {/* Box 5: And More */}
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] flex flex-col h-[450px] justify-between hover:shadow-2xl transition-all group text-white">
              <div>
                <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Zap size={24} />
                </div>
                <h3 className="text-xl font-black mb-4 uppercase tracking-tighter italic">And More</h3>
                <ul className="space-y-3 text-slate-400 text-xs font-bold uppercase tracking-tight">
                  <li>• Custom Consultancy</li>
                  <li>• Data Analysis Projects</li>
                  <li>• Technology Research</li>
                  <li>• Strategic Partner Referrals</li>
                </ul>
              </div>
              <button className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-white hover:text-blue-600 transition-colors">Get In Touch</button>
            </div>
          </div>
        </div>
      </section>

      {/* DYNAMIC FEEDS */}
      <section id="opportunities" className="py-24 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-3 tracking-tighter uppercase italic text-blue-900 border-b-2 border-blue-900 pb-4 mb-10">
            <Briefcase /> Opportunities
          </h2>
          <div className="space-y-4">
            {jobs.length === 0 ? <p className="text-slate-400 italic">No vacancies found...</p> : 
              jobs.map(job => (
                <div key={job.id} className="p-6 bg-white border border-slate-200 rounded-2xl flex justify-between items-center group">
                  <h4 className="font-bold text-slate-800">{job.title}</h4>
                  <a href={job.link} target="_blank" className="text-blue-600 group-hover:translate-x-1 transition-transform"><ArrowRight size={18}/></a>
                </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-black flex items-center gap-3 tracking-tighter uppercase italic text-orange-600 border-b-2 border-orange-600 pb-4 mb-10">
            <Calendar /> Training & Events
          </h2>
          <div className="space-y-4">
            {events.length === 0 ? <p className="text-slate-400 italic">No seminars scheduled...</p> : 
              events.map(event => (
                <div key={event.id} className="p-6 bg-orange-50/50 border border-orange-100 rounded-2xl">
                  <h4 className="font-bold text-slate-900 mb-2">{event.title}</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase text-orange-600 flex items-center gap-1"><MapPin size={12}/> Accra</span>
                    <a href={event.link} target="_blank" className="text-xs font-black uppercase underline decoration-2 underline-offset-4">View Info</a>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="py-20 bg-slate-950 text-white text-center">
        <div className="mb-8 font-black text-2xl italic tracking-tighter opacity-50 uppercase">Precede Concepts</div>
        <p className="text-slate-500 text-[10px] tracking-[0.3em] uppercase max-w-xl mx-auto leading-loose px-6">
          Digital Solutions | Training & Events | Opportunities | Business Support | And More
        </p>
        <p className="mt-10 text-slate-600 text-[8px] uppercase tracking-widest italic">© 2026 Precede Concepts &middot; Strategic Operations Ghana</p>
      </footer>
    </div>
  )
}