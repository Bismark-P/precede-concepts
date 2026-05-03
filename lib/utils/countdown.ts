export function getCountdown(deadline: string) {
  const now = new Date().getTime()
  const target = new Date(deadline).getTime()

  const diff = target - now

  if (diff <= 0) {
    return { expired: true }
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)

  return {
    expired: false,
    days,
    hours,
    isToday: days === 0,
  }
}