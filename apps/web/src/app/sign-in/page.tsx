import { Suspense } from "react";
import { SignInForm } from "./sign-in-form";

export default function SignInPage() {
  return (
    <main>
      <p>HagSpot</p>
      <h1>Sign in to reserve a space.</h1>
      <Suspense fallback={<p>Loading sign-in...</p>}>
        <SignInForm />
      </Suspense>
    </main>
  );
}
