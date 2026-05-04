import { supabase } from '@/lib/supabase/client';

type Opportunity = {
  id: string;
  status: string;
  is_featured?: boolean;
  priority?: number;
  featured_until?: string | null;
  [key: string]: any;
};

export async function getApprovedOpportunities() {
  const { data, error } = await supabase
    .from("opportunities")
    .select("*")
    .eq("status", "approved");

  if (error) {
    console.error("Fetch error:", error.message);
    return [];
  }

  const now = new Date();

  const cleaned: Opportunity[] = (data || []).map((item: Opportunity) => {
    // ✅ Only override UI state (DO NOT mutate DB here)
    if (
      item.featured_until &&
      new Date(item.featured_until) < now
    ) {
      return {
        ...item,
        is_featured: false,
        priority: 0,
      };
    }

    return item;
  });

  return cleaned;
}