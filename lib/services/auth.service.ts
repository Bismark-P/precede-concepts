import { createClient } from "@/lib/supabase/server";

export async function getUserProfile() {
  const supabase = await createClient(); 

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error) return null;

  return {
    user,
    role: data.role,
  };
}