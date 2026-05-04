'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const enforceSecurity = async () => {
      // 1. Check session
      const { data: { session } } = await supabase.auth.getSession()

      // ❌ No session → redirect to login
      if (!session) {
        if (pathname !== '/admin/login') {
          router.push('/admin/login')
        }
        setLoading(false)
        return
      }

      // ✅ Session exists
      const userId = session.user.id
      const userEmail = session.user.email

      // 🔥 ADDED: fallback email check (SAFE FOR DEMO)
      const ADMIN_EMAIL = 'precedeconcepts@gmail.com'

      // 2. Check role from DB
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()

      // ❌ Not super_admin AND not fallback email → block
      if (
        (!profile || profile.role !== 'super_admin') &&
        userEmail !== ADMIN_EMAIL
      ) {
        router.push('/')
        return
      }

      // ✅ If logged in and on login page → redirect to dashboard
      if (pathname === '/admin/login') {
        router.push('/admin')
      }

      setLoading(false)
    }

    enforceSecurity()

    // 🔁 Listen for logout
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && pathname !== '/admin/login') {
        router.push('/admin/login')
      }
    })

    return () => subscription.unsubscribe()
  }, [pathname, router])

  // 🔒 Loading screen
  if (loading) {
    return (
      <div className="h-screen w-full bg-[#0A2A5E] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#1FC8C8]/30 border-t-[#1FC8C8] rounded-full animate-spin mb-4" />
        <p className="text-[#1FC8C8] font-black uppercase text-[10px] tracking-[0.5em] animate-pulse">
          VERIFYING CLEARANCE...
        </p>
      </div>
    )
  }

  return <>{children}</>
}