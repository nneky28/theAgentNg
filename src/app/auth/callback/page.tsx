import { Suspense } from "react";
import AuthCallbackContent from "./AuthCallbackContent";

export default function AuthCallback() {
  return (
    <Suspense fallback={<div>Loading authentication...</div>}>
      <AuthCallbackContent />
    </Suspense>
  );
}
