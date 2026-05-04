'use client'

console.log("LOGIN FILE LOADED")

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react'

// ⚡ FIXED ADMIN EMAIL (required for Supabase login)
const SUPER_ADMIN_EMAIL = 'precedeconcepts@gmail.com'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: SUPER_ADMIN_EMAIL,
      password,
    })

    if (loginError) {
      setError(loginError.message)
      setLoading(false)
      return
    }

    // 🔐 VERIFY USER AFTER LOGIN (IMPORTANT)
    const { data } = await supabase.auth.getUser()

    if (!data.user || data.user.email !== SUPER_ADMIN_EMAIL) {
      setError('Unauthorized access')
      await supabase.auth.signOut()
      setLoading(false)
      return
    }

    router.push('/admin')
  }

  const inputClass = "w-full p-5 pl-14 bg-white/5 border-2 border-white/10 rounded-2xl font-bold text-white outline-none focus:border-[#1FC8C8] text-sm transition-all placeholder:text-white/30"

  return (
    <div className="h-screen bg-[#0A2A5E] flex items-center justify-center px-6 selection:bg-[#1FC8C8] selection:text-[#0A2A5E]">
      <div className="w-full max-w-md">
        
        {/* Branding */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#1FC8C8] rounded-2xl flex items-center justify-center font-black italic text-[#0A2A5E] text-2xl mx-auto mb-6 shadow-[0_0_30px_rgba(31,200,200,0.3)]">PC</div>
          <h1 className="text-3xl font-black uppercase italic text-white tracking-tighter">Control Hub</h1>
          <p className="text-[#1FC8C8] text-[10px] font-black uppercase tracking-[0.4em] mt-2">SUPER ADMIN ACCESS</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="bg-white/5 p-8 md:p-10 rounded-[3rem] border border-white/10 shadow-2xl backdrop-blur-md">
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-2xl flex items-start gap-3 text-red-400 text-xs font-bold leading-relaxed">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-5">
            {/* Locked Email Field */}
            <div className="relative group opacity-60">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40" size={20} />
              <input 
                type="email" 
                readOnly 
                value={SUPER_ADMIN_EMAIL}
                className={`${inputClass} cursor-not-allowed`}
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2">
                <Lock size={14} className="text-[#1FC8C8]" />
              </div>
            </div>

            {/* Password */}
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#1FC8C8] transition-colors" size={20} />
              <input 
                type="password" 
                required 
                autoFocus
                placeholder="Enter Vault Password" 
                className={inputClass}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading || !password}
            className="w-full mt-8 bg-[#1FC8C8] text-[#0A2A5E] p-5 rounded-2xl font-black uppercase text-sm tracking-[0.2em] shadow-xl hover:bg-white transition-all disabled:opacity-50 flex items-center justify-center gap-3 group"
          >
            {loading ? 'AUTHENTICATING...' : (
              <>
                AUTHORIZE <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  )
}