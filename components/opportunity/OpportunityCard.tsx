'use client'

import { getCountdown } from '@/lib/utils/countdown'

export default function OpportunityCard({ item, onView }: any) {
  const countdown = item.deadline
    ? getCountdown(item.deadline)
    : null

  return (
    <div className="bg-white text-black p-5 rounded-2xl shadow-lg flex flex-col gap-3">

      <div className="flex justify-between items-center">
        <span className="text-xs font-bold bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full">
          {item.type}
        </span>

        {countdown && !countdown.expired && (
          <span className={`text-xs ${countdown.isToday ? 'text-red-600 animate-pulse' : ''}`}>
            {countdown.isToday
              ? 'Ends Today'
              : `${countdown.days}d ${countdown.hours}h`}
          </span>
        )}
      </div>

      <h3 className="font-bold text-lg">{item.title}</h3>

      <p className="text-sm text-gray-600">
        {item.data?.venue || item.location}
      </p>

      <button
        onClick={() => onView(item)}
        className="mt-auto bg-[#0A2A5E] text-white py-3 rounded-xl"
      >
        View More
      </button>
    </div>
  )
}