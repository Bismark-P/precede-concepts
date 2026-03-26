"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { 
  Plus, Check, X, MapPin, Calendar, Clock, 
  ExternalLink, Sparkles, AlertCircle 
} from 'lucide-react';

// Interface matching our database structure
interface QueuedItem {
  id: string;
  category: string;
  sub_category: string;
  title: string;
  venue: string;
  event_date: string;
  time_category: string;
  price: string;
  price_type: string;
  image_url: string;
}

export default function AdminDashboard() {
  const [queuedItems, setQueuedItems] = useState<QueuedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Fetch only items that are waiting in the queue
  useEffect(() => {
    fetchQueuedItems();
  }, []);

  async function fetchQueuedItems() {
    setLoading(true);
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'queued')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching queue:", error);
    } else {
      setQueuedItems(data || []);
    }
    setLoading(false);
  }

  // Action: Approve & Send Live
  const handleApprove = async (id: string) => {
    setProcessingId(id);
    const { error } = await supabase
      .from('jobs')
      .update({ status: 'approved' })
      .eq('id', id);

    if (!error) {
      // Remove the item from the local state so it disappears from the screen
      setQueuedItems(queuedItems.filter(item => item.id !== id));
    } else {
      alert("Error approving item.");
    }
    setProcessingId(null);
  };

  // Action: Reject & Delete
  const handleReject = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this scout?")) return;
    
    setProcessingId(id);
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);

    if (!error) {
      setQueuedItems(queuedItems.filter(item => item.id !== id));
    } else {
      alert("Error deleting item.");
    }
    setProcessingId(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 pb-20">
      
      {/* 🧭 ADMIN NAVBAR */}
      <nav className="bg-[#0A2A5E] px-6 py-5 sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1FC8C8] rounded-xl flex items-center justify-center font-black italic text-[#0A2A5E] text-xs shadow-lg">PC</div>
            <div className="flex flex-col text-left">
              <span className="text-lg font-black tracking-tighter uppercase italic text-white leading-none">Control Hub</span>
              <span className="text-[7px] font-bold text-[#1FC8C8] tracking-[0.4em] uppercase mt-1">Admin Dashboard</span>
            </div>
          </div>

          <a href="/admin/add" className="bg-[#1FC8C8] text-[#0A2A5E] px-5 py-2.5 rounded-xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-white transition-all flex items-center gap-2 shadow-lg">
             <Plus size={16} /> <span className="hidden sm:inline">New Scout</span>
          </a>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-10 md:pt-16">
        
        {/* HEADER SECTION */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-5xl font-black uppercase italic text-[#0A2A5E] tracking-tighter mb-2 flex items-center gap-3">
            Pending Queue <span className="bg-[#1FC8C8] text-[#0A2A5E] text-xl md:text-3xl px-4 py-1 rounded-full">{queuedItems.length}</span>
          </h1>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">
            Review and approve submissions before they go live on the Precede Hub.
          </p>
        </div>

        {/* LOADING STATE */}
        {loading ? (
           <div className="w-full py-20 flex flex-col items-center justify-center text-slate-400">
             <Clock size={40} className="animate-spin mb-4 text-[#0A2A5E]/20" />
             <p className="font-black uppercase tracking-widest text-[10px]">Fetching Queue...</p>
           </div>
        ) : (
          <div className="space-y-4 md:space-y-6">
            
            {/* EMPTY STATE */}
            {queuedItems.length === 0 && (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-16 text-center flex flex-col items-center justify-center shadow-sm">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                   <Sparkles size={32} className="text-[#1FC8C8]" />
                </div>
                <h3 className="text-2xl font-black uppercase italic text-[#0A2A5E] mb-2">You are all caught up!</h3>
                <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest max-w-sm">
                  There are zero pending scouts in the queue. Click "New Scout" above to add more opportunities.
                </p>
              </div>
            )}

            {/* QUEUE LIST */}
            {queuedItems.map((item) => (
              <div key={item.id} className="bg-white border border-slate-200 rounded-3xl md:rounded-[2.5rem] p-4 md:p-6 flex flex-col lg:flex-row gap-6 items-start lg:items-center shadow-md hover:shadow-xl transition-all">
                
                {/* 1. Thumbnail Preview */}
                <div className="w-full lg:w-48 h-40 lg:h-32 bg-slate-900 rounded-2xl overflow-hidden flex-shrink-0 relative border border-slate-100">
                  {item.image_url ? (
                    <img src={item.image_url} alt="Flyer" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-black italic text-white/30 text-[10px] uppercase">No Image</div>
                  )}
                  <span className="absolute top-2 left-2 text-[8px] font-black bg-[#1FC8C8] text-[#0A2A5E] px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm">
                    {item.category}
                  </span>
                </div>

                {/* 2. Core Information */}
                <div className="flex-1 w-full space-y-3">
                  <h4 className="font-black text-lg md:text-xl text-[#0A2A5E] leading-tight uppercase italic tracking-tight pr-4">
                    {item.title}
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-3 text-slate-500">
                    <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase truncate">
                      <MapPin size={14} className="text-[#0A2A5E] flex-shrink-0"/> {item.venue || 'No Venue Listed'}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase truncate">
                      <Calendar size={14} className="text-[#0A2A5E] flex-shrink-0"/> {item.event_date || 'No Date'}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest">{item.sub_category}</span>
                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest">{item.price_type} {item.price && `- ${item.price}`}</span>
                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest">{item.time_category}</span>
                  </div>
                </div>

                {/* 3. Action Buttons */}
                <div className="w-full lg:w-auto flex flex-row lg:flex-col gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  <button 
                    onClick={() => handleApprove(item.id)}
                    disabled={processingId === item.id}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-[#1FC8C8] text-[#0A2A5E] rounded-xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-[#1FC8C8]/30 hover:bg-[#0A2A5E] hover:text-white transition-all disabled:opacity-50"
                  >
                    <Check size={16} /> Approve
                  </button>
                  
                  <button 
                    onClick={() => handleReject(item.id)}
                    disabled={processingId === item.id}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-red-100 text-red-500 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-red-50 hover:border-red-200 transition-all disabled:opacity-50"
                  >
                    <X size={16} /> Reject
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}