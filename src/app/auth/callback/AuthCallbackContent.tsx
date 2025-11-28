"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Flex, Spinner, Text } from "@chakra-ui/react";
import { createClient } from "@/utils/supabase/client";

interface UserData {
  role: string;
  is_onboarded: boolean;
}

export default function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient();

      try {
        // Check for OAuth error
        const oauthError = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");

        if (oauthError) {
          console.error("OAuth error:", oauthError, errorDescription);
          setError("Authentication failed. Please try again.");
          setTimeout(() => router.push("/"), 2000);
          return;
        }

        // Get the code from URL
        const code = searchParams.get("code");

        if (code) {
          console.log("Exchanging code for session...");
          const { error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            console.error("Error exchanging code:", exchangeError);
            setError("Session creation failed.");
            setTimeout(() => router.push("/"), 2000);
            return;
          }
        }

        // Get current session with retry logic
        let session = null;
        let retries = 0;
        const maxRetries = 3;

        while (!session && retries < maxRetries) {
          const {
            data: { session: currentSession },
            error: sessionError,
          } = await supabase.auth.getSession();

          if (sessionError) {
            console.error("Session error:", sessionError);
            throw sessionError;
          }

          session = currentSession;

          if (!session && retries < maxRetries - 1) {
            console.log(
              `No session found, retrying... (${retries + 1}/${maxRetries})`
            );
            await new Promise((resolve) => setTimeout(resolve, 1000));
            retries++;
          }
        }

        if (!session) {
          console.error("No session found after retries");
          setError("Could not establish session.");
          setTimeout(() => router.push("/"), 2000);
          return;
        }

        const user = session.user;
        console.log("✅ User authenticated:", user.email);

        // Retry logic for fetching user data
        let userData: UserData | null = null;
        retries = 0;
        const maxUserRetries = 5;

        while (!userData && retries < maxUserRetries) {
          const { data, error: userError } = await supabase
            .from("users")
            .select("role, is_onboarded")
            .eq("id", user.id)
            .single<UserData>();

          if (!userError && data) {
            userData = data;
            console.log("✅ User found in database:", userData);
            break;
          }

          if (retries < maxUserRetries - 1) {
            console.log(
              `User not found in DB, waiting for trigger... (${retries + 1}/${maxUserRetries})`
            );
            await new Promise((resolve) => setTimeout(resolve, 1000));
            retries++;
          } else {
            console.error("User not found after retries. Trigger may have failed.");
            router.replace("/auth/onboard");
            return;
          }
        }

        if (!userData) {
          router.replace("/auth/onboard");
          return;
        }

        console.log("User data from DB:", userData);

        // ADMIN CHECK
        if (userData.role === "admin") {
          router.replace("/admin/properties");
          return;
        }

        // Onboarding check
        if (!userData.is_onboarded) {
          router.replace("/auth/onboard");
          return;
        }

        // Default
        router.replace("/dashboard/agent");
      } catch (error) {
        console.error("Error in auth callback:", error);
        setError("An unexpected error occurred.");
        setTimeout(() => router.push("/"), 2000);
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <Flex justify="center" align="center" minH="100vh" direction="column" gap={4}>
      <Spinner size="xl" color="purple.500" thickness="4px" />
      <Text fontSize="lg" fontWeight="medium">
        {error ? error : "Completing sign in..."}
      </Text>
      {!error && (
        <Text fontSize="sm" color="gray.600">
          Please wait while we set up your account
        </Text>
      )}
    </Flex>
  );
}
