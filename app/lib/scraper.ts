import axios from 'axios';
import * as cheerio from 'cheerio';
import { supabase } from './supabase';

/**
 * MASTER KEYWORD & HASHTAG LIST
 * Optimized for case-insensitive substring matching.
 */
const TARGET_KEYWORDS = [
  // DJs & Talent
  '#DJSonatty', 'DJSonatty', '#DJSlyKing', 'DJSlyKing', '#DJWastyKay', 'DJWastyKay', 
  '#DJFaculty', 'DJFaculty', '#DJMensah', 'DJMensah', '#DJVirusky', 'DJVirusky', 
  '#DJKess', 'DJKess', '#GhanaDJ', 'AccraDJ', 'HypemanGhana', 'GhanaEventsMC', 'DJLifeGhana',
  
  // Artists
  'Medikal', 'Sarkodie', 'WendyShay', 'ShattaWale', 'JoeMettle', 'KwekuSmoke', 'GhanaMusic',
  
  // Events & Nightlife
  'MomoFest', 'PoolParty', 'Club', 'Nightlife', 'Stripper', 'AccraNightlife', 
  'GhanaParties', 'DettyDecember', 'AccraStayByPlan', 'PoolPartyGhana', 'GhanaNightlife', 
  'AccraEvents', 'GhanaLifestyle', 'LabadiVibes', 'EastLegonNightlife', 'GhanaGirls', 
  'GhanaBoys', 'PartyInGhana', 'AccraVibes', 'GhanaWeekend', 'NightlifeInAccra', 
  'GhanaNightclubs', 'AmapianoGhana', 'AfrobeatsGhana', 'TurnUpGhana', 'EnergyGiver', 
  'BeachParty', 'HouseParty', 'SexParty', 'CodedParty', 'CodedLocation',
  
  // Venues & Locations
  'KissLounge', 'AbrewananaPub', 'ElevenEleven', 'Eleven11', 'Sip', 'Dine', 
  'EastLegon', 'OsuAccra', 'Cantonments', 'AirportCityAccra', 'Kumasi', 'Takoradi', 'CapeCoast',
  
  // Tech & Digital (Precede Core)
  'DigitalGhana', 'GhanaTech', 'TechInGhana', 'AccraWorkshops', 'DigitalSkillsGhana', 
  'GhanaStartups', 'SkillUpGhana', 'GhanaEducation', 'AccraBusiness', 'DigitalMarketingGhana', 
  'GhanaSMEs', 'AccraSeminars', 'LearnDigitalGhana', 'TechSavvyGhana', 'FutureOfWorkGhana', 
  'GhanaTraining',
  
  // Industry & Awards
  'CharterhouseGH', 'TGMA', 'GhanaMusicAwards', 'TelecelGMA', 'GEA', 'EventGuideGhana', 
  'BeyondTheReturn', 'VisitGhana', 'GEPA', 'EventVendorsGhana'
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
      // Added timeout and headers to prevent being blocked
      const { data } = await axios.get(target.url, { 
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' },
        timeout: 10000 
      });
      
      const $ = cheerio.load(data);
      
      $(target.selector).each((i, el) => {
        const title = $(el).text().trim();
        const link = $(el).find('a').attr('href') || $(el).closest('a').attr('href');
        
        if (title && link) {
          const lowerTitle = title.toLowerCase();
          
          // CASE INSENSITIVE SUBSTRING CHECK
          // This captures if "Sarkodie" appears anywhere in the title
          const matchesKeyword = TARGET_KEYWORDS.some(keyword => 
            lowerTitle.includes(keyword.toLowerCase())
          );

          // SMART CATEGORIZATION
          const isEvent = lowerTitle.includes('party') || 
                          lowerTitle.includes('fest') || 
                          lowerTitle.includes('night') || 
                          lowerTitle.includes('concert') || 
                          lowerTitle.includes('club') ||
                          lowerTitle.includes('workshop') ||
                          lowerTitle.includes('seminar');

          findings.push({
            title, 
            link: link.startsWith('http') ? link : `${target.url}${link}`, 
            category: isEvent ? 'event' : 'job',
            source_site: target.name, 
            status: 'pending',
            // If it matches your specific list, it becomes a "Featured" recommendation automatically
            is_featured: matchesKeyword 
          });
        }
      });
    }

    // Upsert into Supabase (onConflict: link ensures no duplicates)
    if (findings.length > 0) {
      const { error } = await supabase.from('jobs').upsert(findings, { onConflict: 'link' });
      if (error) console.error('Supabase Error:', error);
    }
    
    return findings;
  } catch (err) {
    console.error('Scraper Execution Failed:', err);
    return [];
  }
}