import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?next=/account");
  }

  return (
    <main>
      <p>HagSpot account</p>
      <h1>Welcome back.</h1>
      <p>{user.email}</p>
    </main>
  );
}
