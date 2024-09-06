import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryProviders } from "@/providers/query-providers";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Personal Finance",
  description: "A Personal Finance App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ClerkProvider>
      <body className={inter.className}>
        <QueryProviders>

        {children}
        </QueryProviders>
        </body>
        </ClerkProvider>      
    </html>
  );
}
