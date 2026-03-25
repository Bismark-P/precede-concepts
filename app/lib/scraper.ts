import axios from 'axios';
import * as cheerio from 'cheerio';
import { supabase } from './supabase';

// All keywords broken down into lowercase root words for maximum coverage
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
  'truth', 'dare', 'grind', 'xmas', 'christmas', 'pooley', 'sugar' , 'bhim', 'blacksheriff', 'blacko', 'shay', 'medikal', 'portey', 'dj', 'baddest'
];

export async function runGlobalSync() {
  const findings: any[] = [];
  try {
    const targets = [
      { name: 'Jobberman', url: 'https://www.jobberman.com.gh/jobs', selector: '.mx-auto h3' },
      { name: 'LinkedIn', url: 'https://www.linkedin.com/jobs/search?keywords=Ghana', selector: '.base-search-card__title' },
      { name: 'Eventbrite', url: 'https://www.eventbrite.com/d/ghana--accra/events/', selector: '.event-card__details h3' }
    ];

    for (const target of targets) {
      const { data } = await axios.get(target.url, { 
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
        timeout: 10000 
      });
      const $ = cheerio.load(data);
      $(target.selector).each((i, el) => {
        const title = $(el).text().trim();
        const link = $(el).find('a').attr('href') || $(el).closest('a').attr('href');
        
        if (title && link) {
          const lowerTitle = title.toLowerCase();
          
          // Checks if any of the root words are inside the title
          const matchesKeyword = TARGET_KEYWORDS.some(kw => lowerTitle.includes(kw));
          
          const isEvent = lowerTitle.includes('party') || lowerTitle.includes('fest') || lowerTitle.includes('club') || lowerTitle.includes('night') || lowerTitle.includes('pub') || lowerTitle.includes('dj');

          findings.push({
            title, 
            link: link.startsWith('http') ? link : `${target.url}${link}`, 
            category: isEvent ? 'event' : 'job',
            source_site: target.name, 
            status: 'pending',
            is_featured: matchesKeyword 
          });
        }
      });
    }

    if (findings.length > 0) {
      await supabase.from('jobs').upsert(findings, { onConflict: 'link' });
    }
    return findings;
  } catch (err) {
    console.error("Sync Error:", err);
    return [];
  }
}