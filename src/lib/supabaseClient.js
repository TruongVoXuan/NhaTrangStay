import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://faqujsauvpnglqqfzvcg.supabase.co";
const supabaseKey = "sb_publishable_AtFsz3qsMbJ3_qp-W4DE6g_k1KCvB28";

export const supabase = createClient(supabaseUrl, supabaseKey);