import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(
  req: NextRequest,
  context: { params: Promise<unknown> } // ✅ FIXED
) {
  try {
    const { reference, opportunityId } = await req.json()

    // 🔒 VALIDATION
    if (!reference || !opportunityId) {
      return NextResponse.json(
        { success: false, message: 'Missing data' },
        { status: 400 }
      )
    }

    // 🔍 VERIFY WITH PAYSTACK
    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    )

    if (!verifyRes.ok) {
      return NextResponse.json(
        { success: false, message: 'Verification failed' },
        { status: 400 }
      )
    }

    const result = await verifyRes.json()

    // ❌ NOT SUCCESSFUL
    if (!result.status || result.data.status !== 'success') {
      return NextResponse.json(
        { success: false, message: 'Payment not successful' },
        { status: 400 }
      )
    }

    // 💰 VERIFY AMOUNT (GHS 50 = 5000 kobo)
    const expectedAmount = 5000

    if (result.data.amount < expectedAmount) {
      return NextResponse.json(
        { success: false, message: 'Incorrect payment amount' },
        { status: 400 }
      )
    }

    // ⏳ SET FEATURE EXPIRY (7 DAYS)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    // 🔥 SUPABASE ADMIN CLIENT (SERVER ONLY)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 🚀 UPDATE OPPORTUNITY
    const { error } = await supabase
      .from('opportunities')
      .update({
        is_featured: true,
        priority: 5,
        featured_until: expiresAt.toISOString(),
      })
      .eq('id', opportunityId)

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Promotion activated',
    })

  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Server error' },
      { status: 500 }
    )
  }
}