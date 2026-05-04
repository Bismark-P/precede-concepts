'use client'

import { useEffect, useRef } from 'react'
import { getCountdown } from '@/lib/utils/countdown'
import PaystackButton from '@/components/Payments/PaystackButton' // ✅ ADD

type Props = {
  item: any
  onView: (item: any) => void
  isActive?: boolean
}

export default function OpportunityCard({ item, onView, isActive }: Props) {
  const ref = useRef<HTMLDivElement | null>(null)

  const countdown = item.deadline
    ? getCountdown(item.deadline)
    : null

  const isExpired = countdown?.expired

  useEffect(() => {
    if (isActive && ref.current) {
      ref.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [isActive])

  return (
    <div
      ref={ref}
      className={`p-5 rounded-2xl shadow-lg flex flex-col gap-3 transition-all
        ${isActive ? 'border-2 border-cyan-500 scale-[1.02]' : ''}
        ${isExpired ? 'bg-gray-200 text-gray-500 opacity-70' : 'bg-white text-black'}
      `}
    >
      {/* TYPE + STATUS */}
      <div className="flex justify-between items-center">

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase bg-cyan-200 text-cyan-800 px-3 py-1 rounded-full">
            {item.type}
          </span>

          {item.is_featured && (
            <span className="bg-yellow-400 text-black px-2 py-1 text-xs rounded font-bold">
              ⭐ Featured
            </span>
          )}
        </div>

        {isExpired ? (
          <span className="text-xs font-bold text-gray-500">Expired</span>
        ) : countdown ? (
          <span
            className={`text-xs font-bold ${
              countdown.isToday ? 'text-red-600 animate-pulse' : 'text-gray-500'
            }`}
          >
            {countdown.isToday
              ? 'Ends Today'
              : `${countdown.days}d ${countdown.hours}h`}
          </span>
        ) : null}
      </div>

      {/* TITLE */}
      <h3 className="font-bold text-lg leading-tight line-clamp-2">
        {item.title}
      </h3>

      {/* LOCATION */}
      {(item.data?.venue || item.location) && (
        <p className="text-sm">
          📍 {item.data?.venue || item.location}
        </p>
      )}

      {/* 🔥 PROMOTE BUTTON */}
      {!isExpired && item.status === 'approved' && !item.is_featured && (
        <PaystackButton
          email="user@email.com" // 🔥 replace later with real user email
          amount={5000} // GHS 50
          onSuccess={async (ref) => {
            await fetch('/api/paystack/verify' as string, {
              method: 'POST',
              body: JSON.stringify({
                reference: ref,
                opportunityId: item.id,
              }),
            })

            alert('Listing promoted successfully!')
          }}
        />
      )}

      {/* VIEW MORE */}
      <button
        onClick={() => onView(item)}
        className="mt-auto bg-[#0A2A5E] text-white py-3 rounded-xl hover:bg-cyan-400 hover:text-black transition"
      >
        View More
      </button>
    </div>
  )
}