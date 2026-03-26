import { supabase } from './supabase';

// 1. Interface matching the exact fields from the Admin Form
export interface EventData {
  category: 'event' | 'job' | 'training';
  sub_category: string;
  title: string;
  price_type: string; 
  price: string;
  time_category: string;
  duration: string;
  venue: string;
  region: string;
  salary_range: string;
  event_date: string;
  link: string;
  image_url: string;
  review_text: string;
  is_featured: boolean;
  rating: number;
}

/**
 * Pushes a manually curated scout to the Supabase 'jobs' table.
 * All entries are sent to the 'queued' status pending admin approval.
 */
export async function addManualEntry(formData: EventData) {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .insert([
        {
          ...formData,
          status: 'queued', // 🛑 Routes to the queue for your approval
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;

    // Log the action for the Control Hub history
    await supabase.from('sync_logs').insert([
      { 
        status: 'success', 
        details: `Manual Entry Queued: ${formData.title}`,
        executed_at: new Date().toISOString()
      }
    ]);

    return { success: true, data };
  } catch (error: any) {
    console.error('Collector Error:', error.message);
    return { success: false, error: error.message };
  }
}