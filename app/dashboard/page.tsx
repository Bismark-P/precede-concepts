'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function Dashboard() {
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    fetchMine()
  }, [])

  async function fetchMine() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('opportunities')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false })

    setItems(data || [])
  }

  return (
    <div className="min-h-screen bg-[#0A2A5E] text-white p-6">
      <h1 className="text-2xl font-bold mb-6">My Submissions</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white text-black p-4 rounded">

            <h2 className="font-bold">{item.title}</h2>

            <p className="text-sm">
              Status: 
              <span className={`ml-2 ${
                item.status === 'approved'
                  ? 'text-green-600'
                  : item.status === 'pending'
                  ? 'text-yellow-600'
                  : 'text-red-600'
              }`}>
                {item.status}
              </span>
            </p>

          </div>
        ))}
      </div>
    </div>
  )
}