'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getApprovedOpportunities } from '@/lib/services/opportunity.service'
import OpportunityCard from '@/components/opportunity/OpportunityCard'

export default function Home() {
  const [items, setItems] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
    fetchApproved()
  }, [])

  async function fetchApproved() {
    const data = await getApprovedOpportunities()
    setItems(data || [])
  }

  // 🔥 HANDLE URL OPEN (DEEP LINK)
  useEffect(() => {
    if (!items.length) return

    const params = new URLSearchParams(window.location.search)
    const id = params.get('id')

    if (id) {
      const found = items.find((item) => item.id === id)
      if (found) setSelectedItem(found)
    }
  }, [items])

  // 🔥 UPDATE URL WHEN MODAL OPENS
  function handleView(item: any) {
    setSelectedItem(item)
    window.history.pushState(null, '', `/?id=${item.id}`)
  }

  // 🔥 CLOSE MODAL + RESET URL
  function closeModal() {
    setSelectedItem(null)
    window.history.pushState(null, '', '/')
  }

  const filteredItems = items.filter((item) => {
    const term = searchQuery.toLowerCase()

    const matchesText =
      !term ||
      item.title?.toLowerCase().includes(term) ||
      item.type?.toLowerCase().includes(term)

    const matchesCategory =
      filter === 'all' || item.type === filter

    return matchesText && matchesCategory
  })

  if (!mounted) return null

  return (
    <div className="bg-[#0A2A5E] text-white min-h-screen">

      {/* HERO */}
      <motion.section
        className="h-screen flex flex-col items-center justify-center text-center px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-cyan-400 text-sm tracking-[0.3em] mb-4 uppercase">
            Progress Simplified, Value Delivered.
          </p>

          <h1 className="text-5xl md:text-8xl font-black italic leading-tight">
            THE <span className="text-cyan-400">STANDARD</span> <br />
            OF EXECUTION.
          </h1>
        </motion.div>
      </motion.section>

      {/* HUB */}
      <section className="px-6 py-16 max-w-6xl mx-auto">

        <h2 className="text-3xl font-bold mb-8">
          Opportunity Hub
        </h2>

        <input
          placeholder="Search opportunities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full mb-6 p-3 rounded-lg text-black"
        />

        <div className="flex gap-2 mb-8 flex-wrap">
          {['all', 'job', 'event', 'training', 'place', 'marketplace'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full ${
                filter === f ? 'bg-cyan-400 text-black' : 'bg-white/10'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <OpportunityCard
              key={item.id}
              item={item}
              onView={handleView}
            />
          ))}
        </div>
      </section>

      {/* MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white text-black rounded-2xl max-w-2xl w-full p-6 relative">

            <button
              onClick={closeModal}
              className="absolute top-4 right-4"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-4">
              {selectedItem.title}
            </h2>

            <p className="text-sm text-gray-500 mb-2 uppercase">
              {selectedItem.type}
            </p>

            {(selectedItem.data?.venue || selectedItem.location) && (
              <p>📍 {selectedItem.data?.venue || selectedItem.location}</p>
            )}

            {selectedItem.deadline && (
              <p className="text-red-500 mt-2">
                Deadline: {new Date(selectedItem.deadline).toLocaleString()}
              </p>
            )}

            {selectedItem.description && (
              <p className="mt-4">{selectedItem.description}</p>
            )}

            {/* 🔥 SHARE BUTTON */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href)
                alert('Link copied!')
              }}
              className="mt-6 bg-cyan-400 text-black px-4 py-2 rounded"
            >
              Copy Link
            </button>

          </div>
        </div>
      )}
    </div>
  )
}