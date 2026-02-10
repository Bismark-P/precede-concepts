'use client'
import { Mail, Phone, MapPin, ArrowLeft } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white font-sans p-6 md:p-12">
      <a href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 mb-12">
        <ArrowLeft size={16}/> Back to Home
      </a>

      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-20">
        <div>
          <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.85] mb-8">
            Let's <br/><span className="text-blue-600">Connect.</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase text-sm leading-loose max-w-md">
            Whether you need digital solutions, business support, or strategic planning, 
            Precede Concepts is ready to execute.
          </p>
        </div>

        <div className="bg-slate-50 p-10 rounded-[3rem] space-y-8">
          <div className="flex gap-6 items-center">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-600"><Mail /></div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Us</p>
              <p className="font-bold text-lg italic">hello@precedeconcepts.com</p>
            </div>
          </div>
          <div className="flex gap-6 items-center">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-emerald-600"><Phone /></div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Call/WhatsApp</p>
              <p className="font-bold text-lg italic">+233 [Your Number]</p>
            </div>
          </div>
          <div className="flex gap-6 items-center">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-orange-600"><MapPin /></div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Our Location</p>
              <p className="font-bold text-lg italic">Odorkor, Accra - Ghana</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}