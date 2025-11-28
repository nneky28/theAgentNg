// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function AuthRedirect() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    checkAuthAndRedirect();
  }, []);

  const checkAuthAndRedirect = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsChecking(false);
        return;
      }

      // Fetch user data
      const { data: userData, error } = await supabase
        .from("users")
        .select("role, is_onboarded")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching user:", error);
        setIsChecking(false);
        return;
      }

      // ADMIN CHECK - Bypass onboarding
      if (userData?.role === "admin") {
        router.push("/admin/properties");
        return;
      }

      // Regular user - check onboarding
      if (!userData?.is_onboarded) {
        router.push("/auth/onboard");
        return;
      }

      // Onboarded regular user
      router.push("/dashboard/agent");
    } catch (error) {
      console.error("Auth redirect error:", error);
    } finally {
      setIsChecking(false);
    }
  };

  if (isChecking) {
    return null;
  }

  return null;
}