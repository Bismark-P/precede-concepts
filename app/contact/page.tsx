'use client'
import { Mail, Phone, MapPin, ArrowLeft, Send } from 'lucide-react'

export default function Contact() {
  return (
    <div className="min-h-screen bg-white font-sans p-6 md:p-16">
      <nav className="mb-20">
        <a href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 transition-all">
          <ArrowLeft size={16}/> Return Home
        </a>
      </nav>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-24 items-start">
        <div>
          <h1 className="text-7xl md:text-9xl font-black uppercase italic tracking-tighter leading-[0.8] mb-10 text-slate-950">
            Let's <br/><span className="text-blue-600">Sync.</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase text-xs leading-loose tracking-widest max-w-sm mb-12">
            Based in Odorkor, Accra. Bridging the gap between global standards and local operational excellence.
          </p>
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-slate-900 font-black italic uppercase"><Mail className="text-blue-600" size={20}/> hello@precedeconcepts.com</div>
            <div className="flex items-center gap-4 text-slate-900 font-black italic uppercase"><MapPin className="text-orange-600" size={20}/> Odorkor, Accra - Ghana</div>
          </div>
        </div>
        <div className="bg-slate-50 p-8 md:p-12 rounded-[3rem] border border-slate-100">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Full Name</label>
              <input type="text" className="w-full p-4 bg-white border-none rounded-2xl focus:ring-2 focus:ring-blue-600 font-bold" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Your Message</label>
              <textarea rows={4} className="w-full p-4 bg-white border-none rounded-2xl focus:ring-2 focus:ring-blue-600 font-bold"></textarea>
            </div>
            <button className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-blue-100 flex items-center justify-center gap-3">
              Send Inquiry <Send size={16}/>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}