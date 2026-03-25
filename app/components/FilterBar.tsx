'use client'
import { Sun, SunMedium, Sunset, Moon, Briefcase, PartyPopper, GraduationCap } from 'lucide-react'

export default function FilterBar({ activeFilter, setActiveFilter }: any) {
  const filters = [
    { id: 'all', label: 'All', icon: null },
    { id: 'Morning', label: 'Morning', icon: <Sun size={14}/> },
    { id: 'Afternoon', label: 'Afternoon', icon: <SunMedium size={14}/> },
    { id: 'Evening', label: 'Evening', icon: <Sunset size={14}/> },
    { id: 'Night', label: 'Night', icon: <Moon size={14}/> },
    { id: 'job', label: 'Jobs', icon: <Briefcase size={14}/> },
    { id: 'event', label: 'Events', icon: <PartyPopper size={14}/> },
    { id: 'training', label: 'Training', icon: <GraduationCap size={14}/> },
  ]

  return (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 py-4 mb-6">
      <div className="flex gap-2 overflow-x-auto px-6 no-scrollbar">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              activeFilter === f.id 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105' 
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {f.icon} {f.label}
          </button>
        ))}
      </div>
    </div>
  )
}