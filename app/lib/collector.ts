import { supabase } from './supabase';

// Use the same keywords you defined for consistency
const TARGET_KEYWORDS = [
  'djsonatty', 'djslyking', 'momofest', 'medikal', 'sarkodie', 'wendyshay', 
  'shattawale', 'joemettle', 'pool', 'party', 'indomie', 'kuamieugene', 
  'kwekusmoke', 'bbc', 'coded', 'club', 'nightlife', 'stripper', 'accra', 
  'eleveneleven', 'sip', 'dine', 'digital', 'ghana', 'tech', 'skillup', 
  'sme', 'charterhouse', 'tgma', 'visitghana', 'eastlegon', 'monday', 
  'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 
  'manager', 'social', 'media', 'job', 'work', 'fun', 'oasis', 'garage', 
  'night', 'kruna', 'cloud9', 'monaco', 'walako', 'soho', 'beach', 'sales', 
  'training', 'event', 'abrewanana', 'abrewa', 'nana', 'pub', 'kumasi', 
  'cape coast', 'elmina', 'jbc', 'house', 'blue top', 'villa', 'ace', 
  'easter', 'salah', 'fest', 'happiness', 'osu', 'independence', 'republic', 
  'bash', 'hookup', 'dance', 'twerk', 'tema', 'hard', 'lounge', 'west', 
  'revival', 'stonebwoy', 'lasmid', 'car', 'wash', 'live', 'band', 'kiss', 
  'bliss', 'casino', 'skybar', 'bar', 'detty', 'dirty', 'masquerade', 'mask', 
  'freak', 'baddie', 'bitch', 'rapperholic', 'kofimole', 'boob', 'ass', 
  'truth', 'dare', 'grind', 'xmas', 'christmas', 'pooley', 'sugar' , 'bhim', 
  'blacksheriff', 'blacko', 'shay', 'medikal', 'portey', 'dj', 'baddest'
];

interface EventData {
  title: string;
  link: string;
  venue?: string;
  price?: string;
  category: 'event' | 'job' | 'training';
  region?: string;
  image_url?: string;
}

export async function addManualEntry(data: EventData) {
  try {
    // 1. Auto-detect if it should be featured based on your keywords
    const isAutoFeatured = TARGET_KEYWORDS.some(kw => 
      data.title.toLowerCase().includes(kw)
    );

    // 2. Prepare the payload for Supabase
    const payload = {
      ...data,
      is_featured: isAutoFeatured,
      status: 'pending', // Always goes to pending for your final approval
      source_site: data.link.includes('tiktok.com') ? 'TikTok' : 
                   data.link.includes('instagram.com') ? 'Instagram' : 
                   data.link.includes('facebook.com') ? 'Facebook' : 'Manual Entry',
      created_at: new Date().toISOString(),
    };

    // 3. Upsert into Supabase (prevents duplicate links)
    const { data: result, error } = await supabase
      .from('jobs')
      .upsert([payload], { onConflict: 'link' });

    if (error) throw error;

    return { success: true, message: 'Entry added successfully!', result };
  } catch (error: any) {
    console.error('Collector Error:', error.message);
    return { success: false, error: error.message };
  }
}