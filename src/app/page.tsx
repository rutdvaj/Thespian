"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Signup from "./auth/signup/page";
import { createClient } from "./utils/supabase/client";
import { useAuthStore } from "./_store/userstore";

export default function Home() {
  const supabase = createClient();
  const router = useRouter();
  const userStatus = useAuthStore((state) => state.user);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!error && user) {
        console.log(userStatus);
        router.push("/dashboard");
      }
    };

    checkUser();
  }, [supabase, userStatus, router]);

  return (
    <div className="">
      <Signup />
    </div>
  );
}
