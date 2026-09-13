const requiredPublicVariables = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
] as const;

export function getPublicConfig() {
  const missing = requiredPublicVariables.filter((name) => !process.env[name]);
  if (missing.length) {
    throw new Error(`Missing required public environment variables: ${missing.join(", ")}`);
  }

  return {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabasePublishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  };
}
