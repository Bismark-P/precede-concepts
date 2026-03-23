import { NextResponse } from 'next/server';
import { runGlobalSync } from '@/app/lib/scraper';
import { supabase } from '@/app/lib/supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized Access', { status: 401 });
  }

  try {
    const syncResult = await runGlobalSync();
    const featuredItems = syncResult.filter((item: any) => item.is_featured === true);

    if (featuredItems.length > 0) {
      await resend.emails.send({
        from: 'Precede Hub <onboarding@resend.dev>',
        to: 'precedeconcepts@gmail.com', // Must be verified in Resend
        subject: `🚀 [Precede Alert] Found ${featuredItems.length} New Top Picks`,
        html: `
          <div style="font-family: sans-serif; padding: 40px; border: 1px solid #e2e8f0; border-radius: 30px;">
            <h1 style="color: #1e3a8a; text-transform: uppercase;">Precede Hub Scout</h1>
            <p>Hourly automation has identified new priority opportunities.</p>
            <hr style="border:0; border-top:1px solid #f1f5f9; margin: 20px 0;"/>
            ${featuredItems.map(item => `
              <div style="margin-bottom: 12px;">
                <p style="margin: 0; font-weight: bold; color: #0f172a;">${item.title}</p>
                <p style="margin: 0; font-size: 11px; color: #2563eb;">Source: ${item.source_site}</p>
              </div>
            `).join('')}
            <a href="https://your-site.vercel.app/admin" style="background: #2563eb; color: white; padding: 15px 30px; border-radius: 12px; text-decoration: none; display: inline-block; font-weight: bold; margin-top: 20px;">Review Opportunities</a>
          </div>
        `
      });
    }

    // Success Logging
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