import { createClient } from "@/lib/supabase/server";

export async function getApprovedOpportunities() {
  const supabase = await createClient(); 

  const { data, error } = await supabase
    .from("opportunities")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}