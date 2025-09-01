import { NextAuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { OAuth2Client } from "google-auth-library";
import { connectToDataBase } from "./connectDB";
import type { Account, User as NextUserType } from "next-auth";
import User from "@/models/User";

interface NextAuthUserSignIn {
  user: NextUserType;
  account: Account | null;
}

const googleClient = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export const authOptions: NextAuthOptions = {
  providers: [
    // ✅ OTP + Email Credentials
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials): Promise<NextAuthUser | null> {
        await connectToDataBase();
        const { email, otp } = credentials as any;
        const user = await User.findOne({ email, otp });
        if (!user) {
          throw new Error("Email or OTP is invalid");
        }
        return {
          id: user._id as string,
          name: user.name,
          email: user.email,
        };
      },
    }),

    // ✅ Normal Google OAuth login (button login)
    // GoogleProvider({
    //   clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // }),

    // ✅ Google One Tap Provider
    CredentialsProvider({
      id: "googleonetap",
      name: "googleonetap",
      credentials: {
        credential: { type: "text" },
      },
      authorize: async (credentials): Promise<NextAuthUser | null> => {
        const token = credentials?.credential;
        const ticket = await googleClient.verifyIdToken({
          idToken: token!,
          audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        });
        const payload = ticket.getPayload();
        if (!payload) {
          throw new Error("does not have payload");
        }
        const { email, name } = payload;
        await connectToDataBase();
        try {
          const user = await User.findOne({ email });
          if (user) {
            return {
              id: user._id as string,
              name: user.name,
              email: user.email,
            };
          } else {
            throw new Error("User not found");
            return null;
          }
        } catch (error: any) {
          throw new Error(error.message);
        }
      },
    }),
  ],

  pages: {
    signIn: "/signin",
    error: "/signin",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXT_AUTH_SECRET,
};
