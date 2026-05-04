'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getApprovedOpportunities } from '@/lib/services/opportunity.service'
import OpportunityCard from '@/components/opportunity/OpportunityCard'
import PaystackButton from '@/components/Payments/PaystackButton' // ✅ ADDED

export default function Home() {
  const [items, setItems] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)

  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedWorkModel, setSelectedWorkModel] = useState('')
  const [selectedPriceRange, setSelectedPriceRange] = useState('')

  const [sortOption, setSortOption] = useState('latest')

  const [selectedItem, setSelectedItem] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
    fetchApproved()
  }, [])

  async function fetchApproved() {
    const data = await getApprovedOpportunities()
    setItems(data)
  }

  useEffect(() => {
    if (!items.length) return

    const params = new URLSearchParams(window.location.search)
    const id = params.get('id')

    if (id) {
      const found = items.find((item) => item.id === id)
      if (found) setSelectedItem(found)
    }
  }, [items])

  function handleView(item: any) {
    setSelectedItem(item)
    window.history.pushState(null, '', `/?id=${item.id}`)
  }

  function closeModal() {
    setSelectedItem(null)
    window.history.pushState(null, '', '/')
  }

  const filteredItems = items
    .filter((item) => {
      const term = searchQuery.toLowerCase()
      const d = item.data || {}

      const matchesText =
        !term ||
        item.title?.toLowerCase().includes(term) ||
        item.description?.toLowerCase().includes(term) ||
        item.type?.toLowerCase().includes(term)

      const matchesType =
        filter === 'all' || item.type === filter

      const matchesLocation =
        !selectedLocation ||
        item.location?.toLowerCase().includes(selectedLocation.toLowerCase()) ||
        d.address?.toLowerCase().includes(selectedLocation.toLowerCase())

      const matchesWorkModel =
        !selectedWorkModel ||
        d.work_model === selectedWorkModel

      const matchesPrice =
        !selectedPriceRange ||
        (() => {
          const value = parseInt(d.price || d.salary || 0)
          if (selectedPriceRange === 'low') return value < 100000
          if (selectedPriceRange === 'mid') return value >= 100000 && value < 500000
          if (selectedPriceRange === 'high') return value >= 500000
          return true
        })()

      return (
        matchesText &&
        matchesType &&
        matchesLocation &&
        matchesWorkModel &&
        matchesPrice
      )
    })
    .sort((a, b) => {
      const now = new Date().getTime()

      const aDeadline = a.deadline ? new Date(a.deadline).getTime() : Infinity
      const bDeadline = b.deadline ? new Date(b.deadline).getTime() : Infinity

      const aExpired = aDeadline < now
      const bExpired = bDeadline < now

      if (aExpired && !bExpired) return 1
      if (!aExpired && bExpired) return -1

      if (a.is_featured && !b.is_featured) return -1
      if (!a.is_featured && b.is_featured) return 1

      if ((a.priority || 0) !== (b.priority || 0)) {
        return (b.priority || 0) - (a.priority || 0)
      }

      if (sortOption === 'latest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }

      if (sortOption === 'expiring') {
        return aDeadline - bDeadline
      }

      if (sortOption === 'value') {
        const aValue = parseInt(a.data?.price || a.data?.salary || 0)
        const bValue = parseInt(b.data?.price || b.data?.salary || 0)
        return bValue - aValue
      }

      return 0
    })

  const precedeItems = filteredItems.filter((i) => i.priority >= 10)

  const featuredItems = filteredItems.filter(
    (i) => i.is_featured && i.priority < 10
  )

  const generalItems = filteredItems.filter(
    (i) => !i.is_featured && i.priority < 10
  )

  if (!mounted) return null

  const isExpired = (item: any) =>
    item.deadline && new Date(item.deadline) < new Date()

  return (
    <div className="bg-[#0A2A5E] text-white min-h-screen">

      {/* HERO */}
      <motion.section className="h-screen flex flex-col items-center justify-center text-center px-6">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-cyan-400 text-sm mb-4 uppercase">
            Progress Simplified, Value Delivered.
          </p>

          <h1 className="text-5xl md:text-8xl font-black italic">
            THE <span className="text-cyan-400">STANDARD</span>
          </h1>
        </motion.div>
      </motion.section>

      {/* HUB */}
      <section className="px-6 py-16 max-w-6xl mx-auto">

        {/* 🟦 PRECEDE */}
        {precedeItems.length > 0 && (
          <>
            <h2 className="text-3xl font-bold mb-6">Precede Initiatives & Opportunities</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {precedeItems.map((item) => (
                <div key={item.id} className="relative">
                  {item.is_featured && (
                    <span className="absolute top-3 left-3 z-10 bg-yellow-400 text-black text-[10px] font-black px-3 py-1 rounded-full shadow">
                      ⭐ PROMOTED
                    </span>
                  )}
                  <OpportunityCard item={item} onView={handleView} />
                </div>
              ))}
            </div>
          </>
        )}

        {/* 🟨 FEATURED */}
        {featuredItems.length > 0 && (
          <>
            <h2 className="text-3xl font-bold mb-6">Featured</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {featuredItems.map((item) => (
                <div key={item.id} className="relative">
                  {item.is_featured && (
                    <span className="absolute top-3 left-3 z-10 bg-yellow-400 text-black text-[10px] font-black px-3 py-1 rounded-full shadow">
                      ⭐ PROMOTED
                    </span>
                  )}
                  <OpportunityCard item={item} onView={handleView} />
                </div>
              ))}
            </div>
          </>
        )}

        <h2 className="text-3xl font-bold mb-8">Opportunity Hub</h2>

        {/* ✅ EMPTY STATE ADDED */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20 text-white/60 font-bold">
            No opportunities available yet.
          </div>
        )}

        {/* SEARCH */}
        <input
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full mb-6 p-3 rounded-lg text-black"
        />

        {/* TYPE FILTER */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['all', 'job', 'event', 'training', 'place', 'marketplace'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded ${
                filter === f ? 'bg-cyan-400 text-black' : 'bg-white/10'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* ADVANCED FILTERS */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">

          <input
            placeholder="Location"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="p-3 rounded text-black"
          />

          <select
            value={selectedWorkModel}
            onChange={(e) => setSelectedWorkModel(e.target.value)}
            className="p-3 rounded text-black"
          >
            <option value="">Work Model</option>
            <option value="remote">Remote</option>
            <option value="onsite">Onsite</option>
            <option value="hybrid">Hybrid</option>
          </select>

          <select
            value={selectedPriceRange}
            onChange={(e) => setSelectedPriceRange(e.target.value)}
            className="p-3 rounded text-black"
          >
            <option value="">Price Range</option>
            <option value="low">Below 100k</option>
            <option value="mid">100k - 500k</option>
            <option value="high">500k+</option>
          </select>

          <button
            onClick={() => {
              setSelectedLocation('')
              setSelectedWorkModel('')
              setSelectedPriceRange('')
              setSearchQuery('')
              setFilter('all')
              setSortOption('latest')
            }}
            className="bg-red-500 text-white rounded px-4"
          >
            Reset
          </button>

        </div>

        {/* SORT */}
        <div className="flex gap-4 mb-6">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="p-3 rounded text-black"
          >
            <option value="latest">Latest</option>
            <option value="expiring">Expiring Soon</option>
            <option value="value">Highest Value</option>
          </select>
        </div>

        {/* UPDATED GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {generalItems.map((item) => (
            <div key={item.id} className="relative">
              {item.is_featured && (
                <span className="absolute top-3 left-3 z-10 bg-yellow-400 text-black text-[10px] font-black px-3 py-1 rounded-full shadow">
                  ⭐ PROMOTED
                </span>
              )}
              <OpportunityCard
                item={item}
                onView={handleView}
                isActive={selectedItem?.id === item.id}
              />
            </div>
          ))}
        </div>
      </section>

      {/* MODAL unchanged */}
    </div>
  )
}