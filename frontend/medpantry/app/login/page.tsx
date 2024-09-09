import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "./submit-button";

export default function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect("/protected");
  };

  const signUp = async (formData: FormData) => {
    "use server";

    const origin = headers().get("origin");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect("/login?message=Check email to continue sign in process");
  };

return (
  <div className="flex items-center justify-center min-h-screen w-full bg-white">
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      {/* Back button */}
      <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-background bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{" "}
        Back
      </Link>
      {/* Form */}
      <form className="flex-1 flex flex-col justify-center gap-4 bg-white">
        <h1 className="text-3xl font-bold text-center text-background">
          Log In
        </h1>
        <p className="text-muted-foreground text-center">
          Enter your provided account to access Medical Pantry
        </p>
        {/* Email */}
        <label className="text-md text-background" htmlFor="email">
          Email address*
        </label>
        <input
          className="border border-background/20 rounded-md px-4 py-2 text-background mb-0"
          name="email"
          placeholder="Email"
          required
        />
        <small className="text-xs text-muted-foreground">
          We'll never share your email
        </small>
        
        {/* Password */}
        <label
          className="text-md flex justify-between items-center text-background"
          htmlFor="password"
        >
          Password*
          <Link
            href="#"
            className="text-sm font-medium text-muted-foreground hover:text-background"
            prefetch={false}
          >
            Forgot password?
          </Link>
        </label>

        <input
          className="border border-background/20 rounded-md px-4 py-2 text-background mb-0"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <small className="text-xs text-muted-foreground">
          Must include at least 8 characters and 1 number
        </small>

        <div className="flex flex-row justify-between">
          <SubmitButton
            formAction={signIn}
            className="bg-red-700 rounded-md px-4 py-2 text-card-foreground mb-2 min-w-full"
            pendingText="Logging In..."
          >
            Log In
          </SubmitButton>
          {/* Sign up button is currently commented out as we should not allow users to sign up */}
          {/* <SubmitButton
            formAction={signUp}
            className="border border-background/20 rounded-md px-4 py-2 text-background mb-2"
            pendingText="Signing Up..."
          >
            Sign Up
          </SubmitButton> */}
        </div>

        {searchParams?.message && (
          <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  </div>
);
}
