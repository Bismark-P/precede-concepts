'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SubmitPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'job',
    location: '',
  })

  // 🔥 dynamic data object
  const [data, setData] = useState<any>({})

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleDataChange(e: any) {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: any) {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      alert('Login required')
      setLoading(false)
      return
    }

    const { error } = await supabase
      .from('opportunities')
      .insert({
        ...form,
        data,
        owner_id: user.id,
        status: 'pending',
      })

    setLoading(false)

    if (error) alert(error.message)
    else {
      alert('Submitted! Awaiting approval.')
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen bg-[#0A2A5E] text-white flex items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="bg-white text-black p-6 rounded-xl w-full max-w-xl space-y-4">

        <h1 className="text-xl font-bold">Submit Opportunity</h1>

        <input name="title" placeholder="Title" onChange={handleChange} required className="w-full p-3 border rounded" />
        <textarea name="description" placeholder="Description" onChange={handleChange} className="w-full p-3 border rounded" />

        <select name="type" onChange={handleChange} className="w-full p-3 border rounded">
          <option value="job">Job</option>
          <option value="event">Event</option>
          <option value="training">Training</option>
          <option value="place">Place</option>
          <option value="marketplace">Marketplace</option>
        </select>

        <input name="location" placeholder="Location" onChange={handleChange} className="w-full p-3 border rounded" />

        {/* 🔥 DYNAMIC FIELDS */}

        {form.type === 'job' && (
          <>
            <input name="salary" placeholder="Salary" onChange={handleDataChange} className="w-full p-3 border rounded" />
            <input name="company" placeholder="Company" onChange={handleDataChange} className="w-full p-3 border rounded" />
            <input name="work_model" placeholder="Remote / Onsite" onChange={handleDataChange} className="w-full p-3 border rounded" />
          </>
        )}

        {form.type === 'event' && (
          <>
            <input name="date" placeholder="Event Date" onChange={handleDataChange} className="w-full p-3 border rounded" />
            <input name="venue" placeholder="Venue" onChange={handleDataChange} className="w-full p-3 border rounded" />
            <input name="organizer" placeholder="Organizer" onChange={handleDataChange} className="w-full p-3 border rounded" />
          </>
        )}

        {form.type === 'training' && (
          <>
            <input name="duration" placeholder="Duration" onChange={handleDataChange} className="w-full p-3 border rounded" />
            <input name="certificate" placeholder="Certificate (Yes/No)" onChange={handleDataChange} className="w-full p-3 border rounded" />
          </>
        )}

        {form.type === 'place' && (
          <>
            <input name="price" placeholder="Price" onChange={handleDataChange} className="w-full p-3 border rounded" />
            <input name="capacity" placeholder="Capacity" onChange={handleDataChange} className="w-full p-3 border rounded" />
          </>
        )}

        {form.type === 'marketplace' && (
          <>
            <input name="business_name" placeholder="Business Name" onChange={handleDataChange} className="w-full p-3 border rounded" />
            <input name="price" placeholder="Price" onChange={handleDataChange} className="w-full p-3 border rounded" />
          </>
        )}

        <button disabled={loading} className="w-full bg-cyan-400 text-black py-3 rounded font-bold">
          {loading ? 'Submitting...' : 'Submit'}
        </button>

      </form>
    </div>
  )
}