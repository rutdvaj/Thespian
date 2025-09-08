"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { createClient } from "@/app/utils/supabase/client";
import { redirect } from "next/navigation";
import { useAuthStore } from "@/app/_store/userstore";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  // const [loading, isLoading] = useState(false);

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const supabase = createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: pass,
    });
    if (error) {
      console.log("signup failed", error.message);
    }
    if (user) {
      // insert profile with default role
      await supabase.from("profiles").insert({
        id: user.id, // Include user ID if your profiles table has an id column
        email: user.email,
        created_at: new Date().toISOString(), // Format as ISO string
        role: "user", // default role
      });
      console.log("signup successful", user);
      useAuthStore.getState().setUser(user);
      redirect("/dashboard");
    } else {
      console.log("signup failed");
    }
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-1">
          <form className="p-6 md:p-8" onSubmit={handleSignup}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Sign up for your thespian account
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  onChange={(e) => setPass(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                SignUp
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        Already have an account ? <a href="/auth/login">Login</a>
      </div>
    </div>
  );
}
