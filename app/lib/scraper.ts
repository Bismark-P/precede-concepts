import axios from 'axios';
import * as cheerio from 'cheerio';
import Parser from 'rss-parser';
import { supabase } from './supabase';

const parser = new Parser();
const TAGS = ['#ghanajobs', '#accraevents', '#hiring', '#seminarghana'];

export async function runGlobalSync() {
  const findings: any[] = [];
  try {
    // RSS Sources
    const feed = await parser.parseURL('https://hnrss.org/jobs'); 
    feed.items.forEach(item => {
      findings.push({ title: item.title, link: item.link, company: 'RSS Hub', category: 'job', source_site: 'RSS', status: 'pending' });
    });

    // Web Targets
    const targets = [
      { name: 'LinkedIn', url: 'https://www.linkedin.com/jobs/search?keywords=Ghana', selector: '.base-search-card__title' },
      { name: 'TikTok', url: 'https://www.tiktok.com/search/video?q=jobs%20in%20ghana', selector: '.tiktok-1it4937-DivContainer' }
    ];

    for (const target of targets) {
      const { data } = await axios.get(target.url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const $ = cheerio.load(data);
      $(target.selector).each((i, el) => {
        const title = $(el).text().trim();
        const link = $(el).find('a').attr('href') || $(el).closest('a').attr('href');
        if (title && link) {
          findings.push({
            title, link, category: title.toLowerCase().includes('event') ? 'event' : 'job',
            source_site: target.name, status: 'pending'
          });
        }
      });
    }

    const { error } = await supabase.from('jobs').upsert(findings, { onConflict: 'link' });
    return { success: !error };
  } catch (err) { return { success: false }; }
}