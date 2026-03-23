import { NextResponse } from 'next/server';
import { runGlobalSync } from '@/app/lib/scraper';
import { supabase } from '@/app/lib/supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized Request', { status: 401 });
  }

  try {
    const syncResult = await runGlobalSync();
    const featuredItems = syncResult.filter((item: any) => item.is_featured === true);

    if (featuredItems.length > 0) {
      await resend.emails.send({
        from: 'Precede Hub <onboarding@resend.dev>',
        to: 'precedeconcepts@gmail.com', // Your official Gmail
        subject: `🚀 [Precede Alert] Found ${featuredItems.length} High-Priority Items`,
        html: `
          <div style="font-family: sans-serif; padding: 30px; border: 1px solid #e2e8f0; border-radius: 20px;">
            <h2 style="color: #2563eb; text-transform: uppercase;">Precede Hub Scout</h2>
            <p>New items matching your hashtags (DJs, Artists, Tech) were identified.</p>
            <hr style="border:0; border-top:1px solid #f1f5f9; margin: 20px 0;" />
            ${featuredItems.map(item => `
              <div style="margin-bottom: 12px;">
                <p style="margin: 0; font-weight: bold;">${item.title}</p>
                <p style="margin: 0; font-size: 11px; color: #64748b;">Source: ${item.source_site}</p>
              </div>
            `).join('')}
            <br/>
            <a href="https://your-site.vercel.app/admin" style="background: #0f172a; color: white; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 12px;">Review in Hub</a>
          </div>
        `
      });
    }

    await supabase.from('sync_logs').insert({
      status: 'success',
      featured_count: featuredItems.length,
      executed_at: new Date().toISOString()
    });

    return NextResponse.json({ success: true, count: syncResult.length });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Automation Error' }, { status: 500 });
  }
}