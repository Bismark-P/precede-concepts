import { supabase } from './supabase';

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

export async function addManualEntry(formData: EventData) {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .insert([{ ...formData, status: 'queued', created_at: new Date().toISOString() }])
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    console.error('Collector Error:', error.message);
    return { success: false, error: error.message };
  }
}