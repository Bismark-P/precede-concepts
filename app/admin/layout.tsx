'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/app/lib/supabase'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const enforceSecurity = async () => {
      // 1. Check for an active session
      const { data: { session } } = await supabase.auth.getSession()

      // 2. If NO session and they are trying to access an admin page, kick them to login
      if (!session && pathname !== '/admin/login') {
        router.push('/admin/login')
      } 
      // 3. If they DO have a session and are on the login page, push them to the dashboard
      else if (session && pathname === '/admin/login') {
        router.push('/admin')
      }
      
      setLoading(false)
    }

    enforceSecurity()

    // 4. Listen for logouts and kick them out immediately
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && pathname !== '/admin/login') {
        router.push('/admin/login')
      }
    })

    return () => subscription.unsubscribe()
  }, [pathname, router])

  // Premium loading screen while verifying credentials
  if (loading) {
    return (
      <div className="h-screen w-full bg-[#0A2A5E] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#1FC8C8]/30 border-t-[#1FC8C8] rounded-full animate-spin mb-4" />
        <p className="text-[#1FC8C8] font-black uppercase text-[10px] tracking-[0.5em] animate-pulse">VERIFYING CLEARANCE...</p>
      </div>
    )
  }

  return <>{children}</>
}