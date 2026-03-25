import { NextResponse } from 'next/server';

export async function GET() {
  // 🛑 Security Check: Preventing Automated Scraping
  console.log("Automation triggered but blocked by manual-mode override.");
  
  return NextResponse.json({ 
    success: false, 
    message: "Automated syncing is deactivated to prevent IP blocking. Precede Concepts is currently in Manual Curation Mode." 
  }, { status: 403 });
}