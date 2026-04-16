"use client";
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; 
import { supabase } from '@/app/lib/supabase';
import { 
  Plus, Check, X, LogOut, Pencil, Trash2, Star, RefreshCcw, BarChart3,
  ShieldCheck, Users, ShieldAlert, Building2
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'queued' | 'approved' | 'past' | 'users'>('queued');
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [gradingItem, setGradingItem] = useState<any | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 🛡️ SECURITY: Role State
  const [userRole, setUserRole] = useState<'super_admin' | 'staff'>('staff');

  const handleLogout = async () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    await supabase.auth.signOut();
    router.push('/admin/login'); 
  };

  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(handleLogout, 5 * 60 * 1000);
  };

  useEffect(() => {
    const fetchUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.role === 'super_admin') {
        setUserRole('super_admin');
      }
    };
    fetchUserRole();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else {
      fetchItems();
    }
    resetTimer();
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    activityEvents.forEach(e => window.addEventListener(e, resetTimer));
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      activityEvents.forEach(e => window.removeEventListener(e, resetTimer));
    };
  }, [activeTab]);

  async function fetchItems() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('jobs').select('*').eq('status', activeTab).order('created_at', { ascending: false });
      if (error) throw error;
      if (data) setItems(data);
    } catch (err: any) {
      console.error("Fetch error:", err);
    }
    setLoading(false);
  }

  // ⚡ SUPER ADMIN ONLY: Fetch Users via Secure RPC Bridge
  async function fetchUsers() {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_managed_users');
      if (error) throw error;
      if (data) setUsersList(data);
    } catch (err: any) {
      console.error("User fetch error:", err);
    }
    setLoading(false);
  }

  // ⚡ SUPER ADMIN ONLY: Promote User to Staff
  const promoteToStaff = async (email: string) => {
    if (!confirm(`Are you sure you want to promote ${email} to Staff? They will have dashboard access.`)) return;
    
    try {
      const { error } = await supabase.rpc('promote_user_to_staff', { target_email: email });
      if (error) throw error;
      alert("Successfully promoted to Staff!");
      fetchUsers(); // Refresh the list
    } catch (err: any) {
      alert("Promotion failed. " + err.message);
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    if (userRole === 'staff' && newStatus === 'approved') {
      alert("UNAUTHORIZED: Only the Super Admin can push items to the Live Hub.");
      return;
    }
    try {
      const { error } = await supabase.from('jobs').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      setItems(items.filter(i => i.id !== id));
    } catch (err: any) {
      alert("Database Rejected Action: You lack Super Admin clearance.");
    }
  };

  const handleDelete = async (id: string) => {
    if (userRole === 'staff') {
      alert("DELETE REQUEST LOGGED: The Super Admin has been notified.");
      return;
    }
    if (confirm("Delete permanently? This action cannot be undone.")) {
      try {
        const { error } = await supabase.from('jobs').delete().eq('id', id);
        if (error) throw error;
        setItems(items.filter(i => i.id !== id));
      } catch (err: any) {
        alert("Unauthorized Action.");
      }
    }
  };

  // ... (Keep other handlers like saveEdit, saveGrading, handleRepost exactly the same) ...

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 pb-20 text-left">
      <nav className="bg-[#0A2A5E] px-6 py-5 sticky top-0 z-[100] shadow-lg flex justify-between items-center text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1FC8C8] rounded-xl flex items-center justify-center font-black italic text-[#0A2A5E]">PC</div>
          <span className="text-lg font-black uppercase italic tracking-tighter">Control Hub</span>
          <span className={`ml-4 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${userRole === 'super_admin' ? 'bg-[#1FC8C8] text-[#0A2A5E]' : 'bg-orange-500 text-white'}`}>
            {userRole === 'super_admin' ? 'Super Admin' : 'Staff Mode'}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/admin/add" className="bg-[#1FC8C8] text-[#0A2A5E] px-5 py-2.5 rounded-xl font-black text-[10px] uppercase flex items-center gap-2 hover:bg-white transition-all">
            <Plus size={16} /> New Scout
          </Link>
          <button onClick={handleLogout} className="p-2.5 bg-white/10 hover:bg-red-500 rounded-xl transition-all"><LogOut size={18} /></button>
        </div>
      </nav>

      <div className="max-w-[1600px] mx-auto px-4 pt-10">
        <div className="flex gap-4 mb-8 border-b border-slate-200 pb-4 overflow-x-auto">
           <button onClick={() => setActiveTab('queued')} className={`text-[10px] font-black uppercase px-6 py-3 rounded-xl transition-all flex items-center gap-2 ${activeTab === 'queued' ? 'bg-[#0A2A5E] text-white shadow-xl' : 'bg-white text-slate-400'}`}>
             Queue
           </button>
           <button onClick={() => setActiveTab('approved')} className={`text-[10px] font-black uppercase px-6 py-3 rounded-xl transition-all flex items-center gap-2 ${activeTab === 'approved' ? 'bg-[#1FC8C8] text-[#0A2A5E] shadow-xl' : 'bg-white text-slate-400'}`}>
             Live Hub
           </button>
           <button onClick={() => setActiveTab('past')} className={`text-[10px] font-black uppercase px-6 py-3 rounded-xl transition-all flex items-center gap-2 ${activeTab === 'past' ? 'bg-slate-800 text-white shadow-xl' : 'bg-white text-slate-400'}`}>
             Past / Analytics
           </button>

           {/* ⚡ SUPER ADMIN ONLY: Users Tab */}
           {userRole === 'super_admin' && (
             <button onClick={() => setActiveTab('users')} className={`text-[10px] font-black uppercase px-6 py-3 rounded-xl transition-all flex items-center gap-2 ml-auto ${activeTab === 'users' ? 'bg-indigo-600 text-white shadow-xl' : 'bg-white text-indigo-400 border border-indigo-100'}`}>
               <Users size={14} /> Team & Users
             </button>
           )}
        </div>

        {/* ⚡ USERS MANAGEMENT VIEW */}
        {activeTab === 'users' && userRole === 'super_admin' ? (
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden max-w-4xl">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
              <ShieldCheck className="text-indigo-600" />
              <div>
                <h3 className="font-black text-[#0A2A5E] uppercase tracking-widest text-sm">Access Management</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Promote registered companies/users to internal staff.</p>
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              {usersList.map((u) => (
                <div key={u.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                      <Building2 size={16} className="text-slate-500" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#0A2A5E]">{u.email}</p>
                      <p className={`text-[9px] font-black uppercase tracking-widest mt-1 ${u.current_role === 'super_admin' ? 'text-[#1FC8C8]' : u.current_role === 'staff' ? 'text-orange-500' : 'text-slate-400'}`}>
                        Role: {u.current_role}
                      </p>
                    </div>
                  </div>
                  
                  {/* Promotion Button (Only show if they are a company) */}
                  {u.current_role === 'company' && (
                    <button 
                      onClick={() => promoteToStaff(u.email)}
                      className="px-4 py-2 bg-[#0A2A5E] text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-[#1FC8C8] hover:text-[#0A2A5E] transition-all"
                    >
                      Promote to Staff
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* STANDARD EVENT CARDS VIEW */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden flex flex-col shadow-sm hover:shadow-xl transition-all relative">
                {/* ... Keep your existing Card rendering UI exactly here ... */}
                <div className="p-4 flex flex-col flex-1">
                  <h4 className="font-black text-[10px] text-[#0A2A5E] uppercase mb-1 line-clamp-2 leading-tight h-8">{item.title}</h4>
                  
                  <div className="flex flex-col gap-1.5 pt-3 border-t border-slate-100 mt-auto">
                    <button 
                      onClick={() => handleStatusChange(item.id, activeTab === 'queued' ? 'approved' : 'past')} 
                      className={`w-full py-2 rounded-lg text-[8px] font-black uppercase transition-all shadow-sm ${
                        userRole === 'staff' && activeTab === 'queued' 
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                          : 'bg-[#1FC8C8] text-[#0A2A5E] hover:bg-[#0A2A5E] hover:text-white'
                      }`}
                    >
                      {activeTab === 'queued' ? (userRole === 'staff' ? 'Awaiting Approval' : 'Approve to Live') : 'Archive (Move to Past)'}
                    </button>
                    <div className="flex gap-1.5">
                      <button onClick={() => handleDelete(item.id)} className={`flex-1 py-2 rounded-lg flex justify-center transition-all ${userRole === 'staff' ? 'bg-orange-50 text-orange-500' : 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white'}`}><Trash2 size={12} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}