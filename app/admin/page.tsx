'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function AdminDashboard() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const [tab, setTab] = useState<'pending' | 'approved' | 'rejected'>('pending')
  const [search, setSearch] = useState('')
  const [role, setRole] = useState<string | null>(null)

  // 🔥 BULK
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // 🔥 ACTIVITY LOGS
  const [logs, setLogs] = useState<any[]>([])
  const [showLogs, setShowLogs] = useState(false)

  // pagination
  const [page, setPage] = useState(1)
  const pageSize = 10

  useEffect(() => {
    fetchUserRole()
    fetchAll()
  }, [])

  async function fetchUserRole() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    setRole(data?.role || null)
  }

  async function fetchAll() {
    setLoading(true)

    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      alert(error.message)
    } else {
      setItems(data || [])
    }

    setLoading(false)
  }

  async function fetchLogs(id: string) {
    const { data } = await supabase
      .from('opportunity_edits')
      .select('*')
      .eq('opportunity_id', id)
      .order('edited_at', { ascending: false })

    setLogs(data || [])
    setShowLogs(true)
  }

  // ACTION WRAPPER
  async function runAction(id: string, action: () => Promise<any>) {
    setActionLoading(id)
    try {
      const { error } = await action()
      if (error) throw error
      await fetchAll()
      setSelectedIds([])
    } catch (err: any) {
      alert(err.message)
    } finally {
      setActionLoading(null)
    }
  }

  // ACTIONS
  const approve = (id: string) =>
    runAction(id, async () =>
      await supabase.from('opportunities').update({ status: 'approved' }).eq('id', id)
    )

  const reject = (id: string) =>
    runAction(id, async () =>
      await supabase.from('opportunities').update({ status: 'rejected' }).eq('id', id)
    )

  // ⭐ UPDATED FEATURE LOGIC
  const toggleFeatured = (item: any) =>
    runAction(item.id, async () =>
      await supabase
        .from('opportunities')
        .update(
          item.is_featured
            ? {
                // ❌ UNFEATURE
                is_featured: false,
                priority: 0,
                featured_until: null,
              }
            : {
                // ⭐ ADMIN FEATURE (PERMANENT)
                is_featured: true,
                priority: 10,
                featured_until: null,
              }
        )
        .eq('id', item.id)
    )

  const setPriority = (id: string, value: number) =>
    runAction(id, async () =>
      await supabase.from('opportunities').update({ priority: value }).eq('id', id)
    )

  const remove = (id: string) => {
    if (!confirm('Delete this item permanently?')) return
    runAction(id, async () =>
      await supabase.from('opportunities').delete().eq('id', id)
    )
  }

  // 🔥 BULK FUNCTIONS
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    )
  }

  const selectPage = () => {
    const ids = paginated.map((i) => i.id)
    setSelectedIds(ids)
  }

  const bulkApprove = () => {
    if (!selectedIds.length) return
    if (!confirm('Approve selected?')) return

    runAction('bulk', async () =>
      await supabase.from('opportunities').update({ status: 'approved' }).in('id', selectedIds)
    )
  }

  const bulkReject = () => {
    if (!selectedIds.length) return
    if (!confirm('Reject selected?')) return

    runAction('bulk', async () =>
      await supabase.from('opportunities').update({ status: 'rejected' }).in('id', selectedIds)
    )
  }

  const bulkFeature = () => {
    if (!selectedIds.length) return
    if (!confirm('Feature selected?')) return

    runAction('bulk', async () =>
      await supabase.from('opportunities').update({ is_featured: true }).in('id', selectedIds)
    )
  }

  const bulkDelete = () => {
    if (!selectedIds.length) return
    if (!confirm('Delete selected?')) return

    runAction('bulk', async () =>
      await supabase.from('opportunities').delete().in('id', selectedIds)
    )
  }

  // FILTER
  const filtered = items
    .filter((i) => i.status === tab)
    .filter((i) => i.title?.toLowerCase().includes(search.toLowerCase()))

  // PAGINATION
  const totalPages = Math.ceil(filtered.length / pageSize)
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)

  if (loading) return <p className="p-6">Loading...</p>

  return (
    <div className="p-6 bg-[#0A2A5E] min-h-screen text-white">

      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* SEARCH */}
      <input
        placeholder="Search by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 p-3 rounded text-black w-full max-w-md"
      />

      {/* TABS */}
      <div className="flex gap-3 mb-6">
        {['pending', 'approved', 'rejected'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t as any)}
            className={`px-4 py-2 rounded ${
              tab === t ? 'bg-cyan-400 text-black' : 'bg-white/10'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* BULK BAR */}
      {selectedIds.length > 0 && (
        <div className="bg-white text-black p-3 rounded mb-4 flex gap-2 flex-wrap">
          <span>{selectedIds.length} selected</span>
          <button onClick={bulkApprove}>Approve</button>
          <button onClick={bulkReject}>Reject</button>
          <button onClick={bulkFeature}>Feature</button>
          {role === 'super_admin' && <button onClick={bulkDelete}>Delete</button>}
        </div>
      )}

      <button onClick={selectPage} className="mb-4">
        Select Page
      </button>

      {/* LIST */}
      <div className="space-y-4">
        {paginated.map((item) => {
          const isLoading = actionLoading === item.id

          return (
            <div key={item.id} className="bg-white text-black p-4 rounded-xl">

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(item.id)}
                  onChange={() => toggleSelect(item.id)}
                />

                <h2 className="font-bold">{item.title}</h2>
              </div>

              <p className="text-sm mt-1">
                {item.type} | {item.location}
              </p>

              <div className="flex flex-wrap gap-2 mt-3">

                {item.status === 'pending' && (
                  <>
                    <button disabled={isLoading} onClick={() => approve(item.id)}>Approve</button>
                    <button disabled={isLoading} onClick={() => reject(item.id)}>Reject</button>
                  </>
                )}

                {item.status === 'approved' && (
                  <>
                    <button onClick={() => toggleFeatured(item)}>
                      {item.is_featured ? 'Unfeature' : 'Feature'}
                    </button>
                    <input
                      type="number"
                      defaultValue={item.priority || 0}
                      onBlur={(e) => setPriority(item.id, Number(e.target.value))}
                    />
                  </>
                )}

                <button onClick={() => fetchLogs(item.id)}>Logs</button>

                {role === 'super_admin' && (
                  <button onClick={() => remove(item.id)}>Delete</button>
                )}

              </div>
            </div>
          )
        })}
      </div>

      {/* PAGINATION */}
      <div className="flex gap-2 mt-6">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button key={p} onClick={() => setPage(p)}>
            {p}
          </button>
        ))}
      </div>

      {/* ACTIVITY LOG MODAL */}
      {showLogs && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-6">
          <div className="bg-white text-black p-6 rounded max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h2 className="font-bold mb-4">Activity Logs</h2>

            {logs.map((log) => (
              <div key={log.id} className="border-b py-2 text-xs">
                <p>{new Date(log.edited_at).toLocaleString()}</p>
              </div>
            ))}

            <button onClick={() => setShowLogs(false)} className="mt-4">
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  )
}