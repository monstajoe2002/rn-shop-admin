import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: authData } = await supabase.auth.getUser();
  if (authData.user) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", authData.user.id)
      .single();
    if (error || !data) {
      console.error("Error fetching data", error);
      return;
    }
    if (data.type === "admin") return redirect("/admin");
  }
  return <section>{children}</section>;
}
