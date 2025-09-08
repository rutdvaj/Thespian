"use client";
import Signup from "./auth/signup/page";
import { createClient } from "./utils/supabase/client";
import { redirect } from "next/navigation";
import { useAuthStore } from "./_store/userstore";

export default async function Home() {
  const supabase = createClient();
  const userStatus = useAuthStore((state) => state.user);
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (!error && user) {
    console.log(userStatus);
    redirect("/dashboard");
  }
  return (
    <div className="">
      <Signup />
    </div>
  );
}
