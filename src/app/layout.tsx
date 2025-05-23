import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import CheckAuth from "@/components/CheckAuth";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  fallback: []
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={`${urbanist.className} bg-lightText text-lightText`}>
          <CheckAuth>{children}</CheckAuth>
          <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}
