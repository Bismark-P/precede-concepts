'use client'
import { Mail, Phone, MapPin, ArrowLeft, Send, MessageCircle } from 'lucide-react'

export default function Contact() {
  return (
    <div className="min-h-screen bg-white font-sans p-6 md:p-16">
      <nav className="mb-12 md:mb-20">
        <a href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 transition-all text-left">
          <ArrowLeft size={16}/> Return Home
        </a>
      </nav>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 md:gap-24 items-start text-left">
        <div>
          <h1 className="text-6xl md:text-9xl font-black uppercase italic tracking-tighter leading-[0.8] mb-8 text-slate-950">
            Let's <br/><span className="text-blue-600">Sync.</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] md:text-xs leading-loose tracking-widest max-w-sm mb-12">
            Based in Odorkor, Accra. Bridging the gap between global standards and local operational excellence.
          </p>
          
          <div className="space-y-6">
            <a href="mailto:precedeconcepts@gmail.com" className="flex items-center gap-4 text-slate-900 font-black italic uppercase hover:text-blue-600 transition-colors">
              <Mail className="text-blue-600" size={20}/> precedeconcepts@gmail.com
            </a>
            <a href="tel:+233591999544" className="flex items-center gap-4 text-slate-900 font-black italic uppercase hover:text-emerald-600 transition-colors">
              <Phone className="text-emerald-600" size={20}/> +233 591 999 544
            </a>
            <a href="https://wa.me/233591999544" target="_blank" className="flex items-center gap-4 text-slate-900 font-black italic uppercase hover:text-green-500 transition-colors">
              <MessageCircle className="text-green-500" size={20}/> WhatsApp Chat
            </a>
            <div className="flex items-center gap-4 text-slate-900 font-black italic uppercase">
              <MapPin className="text-orange-600" size={20}/> Odorkor, Accra - Ghana
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-8 md:p-12 rounded-[3rem] border border-slate-100 w-full">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="text-left">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Full Name</label>
              <input type="text" className="w-full p-4 bg-white border-none rounded-2xl focus:ring-2 focus:ring-blue-600 font-bold outline-none" placeholder="Your Name" />
            </div>
            <div className="text-left">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Inquiry</label>
              <textarea rows={4} className="w-full p-4 bg-white border-none rounded-2xl focus:ring-2 focus:ring-blue-600 font-bold outline-none" placeholder="How can we help?"></textarea>
            </div>
            <button className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-blue-100 flex items-center justify-center gap-3 hover:bg-slate-900 transition-all">
              Send Message <Send size={16}/>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}