"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../_store/userstore";
import { createClient } from "../utils/supabase/client";
import { redirect } from "next/navigation";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  console.log("ProtectedRoute mounted, user in store:", user);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();

        if (error || !data?.user) {
          console.log("No authenticated user, redirecting to signup");
          // router.replace("/auth/signup");
          redirect("/auth/login");
          setIsAuthorized(false);
        } else {
          console.log("User authenticated:", data.user.email);
          useAuthStore.getState().setUser(data.user);
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        router.replace("/auth/signup");
        setIsAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Optional: Listen to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        useAuthStore.getState().clearUser();
        router.replace("/auth/signup");
        setIsAuthorized(false);
      } else if (event === "SIGNED_IN" && session) {
        useAuthStore.getState().setUser(session.user);
        setIsAuthorized(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [router, supabase]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Only render children if authorized
  if (!isAuthorized) {
    return null; // or a custom unauthorized component
  }

  return <>{children}</>;
}
