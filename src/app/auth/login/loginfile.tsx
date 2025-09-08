"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/app/utils/supabase/client";
import { useState } from "react";
import { z } from "zod";
import { useAuthStore } from "@/app/_store/userstore";
import { useRouter } from "next/navigation";
import { redirect } from "next/navigation";

// Zod validation

export function LoginComp({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const loginSchema = z.object({
    email: z.email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
  });
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const supabase = createClient();
  const router = useRouter();

  // async login handler function

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const result = loginSchema.safeParse({ email, password: pass });

    if (!result.success) {
      console.log("validation failed.", result.error);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: pass,
      });

      if (error) {
        console.log("login failed", error.message);
        // Handle error state here
      } else {
        // console.log("login successful", data.user);
        // const userStatus = useAuthStore.getState().setUser(data.user);
        useAuthStore.getState().setUser(data.user);
        console.log("Updated user:", useAuthStore.getState().user);
        // Use router.push instead of redirect for client-side navigation
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  }

  // Validate first

  // const loginSchema =

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-1">
          <form className="p-6 md:p-8" onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your thespian account
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
                Login
              </Button>

              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="#" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
