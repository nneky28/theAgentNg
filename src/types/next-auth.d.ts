
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's unique identifier */
      id: string;
      // Add other properties to the user object here
      // role?: string;
    } & DefaultSession["user"]
  }

  interface User {
    // Add your custom user properties here
    id: string;
    // role?: string;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** The user's unique identifier */
    id?: string;
    // Add other properties to the token here
    // role?: string;
  }
}