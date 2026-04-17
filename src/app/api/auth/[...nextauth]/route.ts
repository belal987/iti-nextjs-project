import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          console.log("Authorize attempt for:", credentials?.email);
          await connectDB();

          const user = await User.findOne({ email: credentials?.email }).select("+password");
          if (!user) {
            console.log("User not found:", credentials?.email);
            return null;
          }

          const isValid = await bcrypt.compare(credentials?.password ?? "", user.password);
          if (!isValid) {
            console.log("Invalid password for:", credentials?.email);
            return null;
          }

          console.log("Login successful for:", credentials?.email);
          return { id: user._id.toString(), email: user.email, name: user.name };
        } catch (error) {
          console.error("Auth authorize error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };