
import type { Metadata } from "next";
import { Geist, Geist_Mono, Raleway, Montserrat } from "next/font/google";
import "./globals.css";
import Providers from "@/utils/Provider";
import { SessionProviders } from "./providers";
import { ReduxProvider } from "./ReduxProvider";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const raleway = Raleway({
  subsets: ['latin'],
  variable: '--font-raleway',
  weight: ['300', '400', '600'],
  style: ['italic', 'normal']
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['400']
});

export const metadata: Metadata = {
  title: "The Agent Ng",
  description: "Find the perfect property, the easy way.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
// Get this from https://dashboard.emailjs.com/admin/account
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
const CLIENT_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_CLIENT_TEMPLATE!;
const ADMIN_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_ADMIN_TEMPLATE!;

  console.log('EmailJS public key:', EMAILJS_PUBLIC_KEY);
console.log('EmailJS service ID:', EMAILJS_SERVICE_ID);
console.log('Client template ID:', CLIENT_TEMPLATE_ID);
console.log('Admin template ID:', ADMIN_TEMPLATE_ID); 
  return (
    <html lang="en" className={`${raleway.variable} ${montserrat.variable}`}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <SessionProviders>
            <Providers>
              {children}
            </Providers>
          </SessionProviders>
        </ReduxProvider>
      </body>
    </html>
  );
}