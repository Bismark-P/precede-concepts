import { supabase } from './supabase';

// 1. This must match the Admin Page exactly to stop the error
export interface EventData {
  category: 'event' | 'job' | 'training' | 'sports' | 'others' | 'seminar';
  title: string;
  price_type?: string; 
  price?: string;
  time_category?: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  venue?: string;
  region?: string;
  salary_range?: string;
  job_type?: string;
  deadline?: string;
  link?: string;
  image_url?: string;
  review_text?: string;
  is_featured?: boolean;
  rating?: number;
}

/**
 * Pushes a manually curated scout to the Supabase 'jobs' table.
 * All entries start with 'approved' status since they come from the Admin.
 */
export async function addManualEntry(formData: EventData) {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .insert([
        {
          ...formData,
          status: 'approved', // Auto-approve admin entries
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;

    // Log the action for the Control Hub history
    await supabase.from('sync_logs').insert([
      { 
        status: 'success', 
        details: `Manual Entry Added: ${formData.title}`,
        executed_at: new Date().toISOString()
      }
    ]);

    return { success: true, data };
  } catch (error: any) {
    console.error('Collector Error:', error.message);
    return { success: false, error: error.message };
  }
}