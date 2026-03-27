import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // This is the most important setting for your security.
    // It ensures the session is cleared when the tab/browser is closed.
    persistSession: false, 
    
    // This handles the automatic refresh of the token while the user is active.
    autoRefreshToken: true,
    
    // Renamed storageKey for consistency with your brand.
    storageKey: 'precede-concepts-auth',

    // Note: 'detectSessionInTabs' was removed to fix your TS error. 
    // Supabase handles multi-tab syncing via browser storage events 
    // automatically now.
  },
})