import { PrismaAdapter } from "@auth/prisma-adapter";
import { getServerSession, ISODateString, NextAuthOptions } from "next-auth";
import { prisma } from "./prisma";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import DiscordProvider from "next-auth/providers/discord";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

export interface CustomSession {
  user?: CustomUser;
  expires: ISODateString;
}
export interface CustomUser {
  id?: string | null;
  name?: string | null;
  username?: string | null;
  email?: string | null;
  image?: string | null;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,

      profile(profile, tokens) {
        if (!profile.sub) {
          throw new Error('Profile id is missing in Google OAuth profile response');
        }
        console.log(profile)
        return {
          id: profile.sub,
          email: profile.email,
          username: profile.name, 
          name: profile.name,
          avatar: profile.picture,
        };
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      profile(profile, tokens) {
        if (!profile.id) {
          throw new Error('Profile id is missing in GitHub OAuth profile response');
        }
        console.log(profile)
        return {
          id: profile.id,
          email: profile.email || '', // Handle cases where email might be null
          name: profile.name || '', // Handle cases where name might be null
          avatar: profile.avatar_url || '', // Handle cases where avatar_url might be null
          username: profile.name, 
        };
      },
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
      
      profile(profile, tokens) {
        if (!profile.id) {
          throw new Error('Profile id is missing in Discord OAuth profile response');
        }
        return {
          id: profile.id,
          email: profile.email,
          username: profile.username, 
          name: profile.username,
        };
      },
    }),
    CredentialsProvider({
      name: "Sign in",
      id: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !(await compare(credentials.password, user.password!))) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username,
          role: user.role,
          avatar: user.avatar,
          banner: user.banner,
          randomKey: "Hey cool",
        };
      },
    }),
  ],
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          avatar: token.avatar,
          banner: token.banner,
          username: token.username,
          randomKey: token.randomKey,
          role: token.role,
          id: token.id,
        },
      };
    },
    jwt: ({ token, user, trigger, session }) => {
      if (trigger === "update" && session?.avatar) {
        token.avatar = session.avatar;
      }
      if (trigger === "update" && session?.name) {
        token.name = session.name;
      }
      if (user) {
        const u = user as unknown as any;
        return {
          ...token,
          id: u.id,
          avatar: u.avatar,
          banner: u.banner,
          username: u.username,
          randomKey: u.randomKey,
          role: u.role,
        };
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const getAuthSession = () => getServerSession(authOptions);
