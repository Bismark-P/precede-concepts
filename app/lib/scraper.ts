import axios from 'axios';
import * as cheerio from 'cheerio';
import { supabase } from './supabase';

const TARGET_KEYWORDS = [
  '#DJSonatty', 'DJSonatty', '#DJSlyKing', 'DJSlyKing', '#MomoFest', 'MomoFest', 
  'Medikal', 'Sarkodie', 'WendyShay', 'ShattaWale', 'JoeMettle', 'PoolParty', 
  'Club', 'Nightlife', 'Stripper', 'AccraNightlife', 'CodedLocation', 'ElevenEleven', 
  'Sip', 'Dine', 'DigitalGhana', 'GhanaTech', 'TechInGhana', 'SkillUpGhana', 
  'GhanaSMEs', 'CharterhouseGH', 'TGMA', 'VisitGhana', 'Accra', 'EastLegon'
  // ... and all other keywords you provided
];

export async function runGlobalSync() {
  const findings: any[] = [];
  try {
    const targets = [
      { name: 'Jobberman', url: 'https://www.jobberman.com.gh/jobs', selector: '.mx-auto h3' },
      { name: 'LinkedIn', url: 'https://www.linkedin.com/jobs/search?keywords=Ghana', selector: '.base-search-card__title' },
      { name: 'Eventbrite Accra', url: 'https://www.eventbrite.com/d/ghana--accra/events/', selector: '.event-card__details h3' }
    ];

    for (const target of targets) {
      const { data } = await axios.get(target.url, { 
        headers: { 'User-Agent': 'Mozilla/5.0' },
        timeout: 10000 
      });
      const $ = cheerio.load(data);
      $(target.selector).each((i, el) => {
        const title = $(el).text().trim();
        const link = $(el).find('a').attr('href') || $(el).closest('a').attr('href');
        if (title && link) {
          const lowerTitle = title.toLowerCase();
          const matchesKeyword = TARGET_KEYWORDS.some(kw => lowerTitle.includes(kw.toLowerCase()));
          const isEvent = lowerTitle.includes('party') || lowerTitle.includes('fest') || lowerTitle.includes('club');

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
    return [];
  }
}