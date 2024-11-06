import { createClient } from "@/utils/supabase/server";
import { QueryData } from "@supabase/supabase-js";
const supabase = createClient();

const ordersWithProductsQuery = supabase
  .from("order")
  .select("*, order_items:order_item(*, product(*)),users(*)")
  .order("created_at", { ascending: false });

export type OrdersWithProducts = QueryData<typeof ordersWithProductsQuery>;
