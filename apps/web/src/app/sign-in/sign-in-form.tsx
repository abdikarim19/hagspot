"use client";

import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getSafeRedirectPath } from "@/lib/auth";
import { createClient } from "@/lib/supabase/browser";

export function SignInForm() {
  const searchParams = useSearchParams();
  const redirectTo = getSafeRedirectPath(searchParams.get("next"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage(error.message);
      setIsLoading(false);
      return;
    }

    window.location.assign(redirectTo);
  }

  async function handleSignUp() {
    setIsLoading(true);
    setMessage("");

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({ email, password });

    setMessage(error?.message ?? "Check your email to confirm your account.");
    setIsLoading(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email
        <input
          autoComplete="email"
          onChange={(event) => setEmail(event.target.value)}
          required
          type="email"
          value={email}
        />
      </label>
      <label>
        Password
        <input
          autoComplete="current-password"
          minLength={8}
          onChange={(event) => setPassword(event.target.value)}
          required
          type="password"
          value={password}
        />
      </label>
      <button disabled={isLoading} type="submit">
        {isLoading ? "Signing in..." : "Sign in"}
      </button>
      <button disabled={isLoading} onClick={handleSignUp} type="button">
        Create account
      </button>
      {message ? <p role="status">{message}</p> : null}
    </form>
  );
}
