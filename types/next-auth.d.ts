import NextAuth, { DefaultSession } from "next-auth";
import { DateTime } from "next-auth/providers/kakao";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      username: string | null;
      avatar: string | null;
      role: string | null;
      banner: string | null;
    } & DefaultSession["user"];
  }
}