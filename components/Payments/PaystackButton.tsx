'use client'

declare global {
  interface Window {
    PaystackPop: any
  }
}

type Props = {
  email: string
  amount: number
  onSuccess: (reference: string) => void
}

export default function PaystackButton({ email, amount, onSuccess }: Props) {
  const handlePay = () => {
    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
      email,
      amount,
      currency: 'GHS',

      callback: function (response: any) {
        onSuccess(response.reference)
      },

      onClose: function () {
        alert('Payment cancelled')
      },
    })

    handler.openIframe()
  }

  return (
    <button
      onClick={handlePay}
      className="bg-yellow-400 text-black py-2 px-3 rounded text-sm font-bold"
    >
      Promote
    </button>
  )
}