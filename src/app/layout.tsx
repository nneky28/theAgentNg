
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
  metadataBase: new URL('https://theagent.ng'),
  title: {
    default: "The Agent Ng - Nigeria's Largest Real Estate Network",
    template: "%s | The Agent Ng"
  },
  description: "The Agent Ng is Nigeria's largest network of real estate agents. We help you find the perfect property to buy, rent, or short-let across Nigeria. Connect with verified agents and browse thousands of property listings the easy way.",
  keywords: [
    "real estate Nigeria",
    "property for sale Nigeria",
    "property for rent Nigeria",
    "real estate agents Nigeria",
    "buy property Nigeria",
    "rent property Nigeria",
    "short let Nigeria",
    "houses for sale Lagos",
    "apartments for rent Abuja",
    "The Agent Ng",
    "Nigerian property listings"
  ],
  authors: [{ name: "The Agent Ng" }],
  creator: "The Agent Ng",
  publisher: "The Agent Ng",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://theagent.ng",
    title: "The Agent Ng - Nigeria's Largest Real Estate Network",
    description: "Find the perfect property to buy, rent, or short-let across Nigeria. Connect with verified real estate agents.",
    siteName: "The Agent Ng",
    images: [
      {
        url: "/images/L1.png",
        width: 1200,
        height: 630,
        alt: "The Agent Ng - Nigeria's Largest Real Estate Network",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Agent Ng - Nigeria's Largest Real Estate Network",
    description: "Find the perfect property to buy, rent, or short-let across Nigeria.",
    images: ["/images/L1.png"],
    creator: "@theagentng",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "96b13816d6d7f425",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "The Agent Ng",
    "description": "Nigeria's largest network of real estate agents",
    "url": "https://theagent.ng",
    "logo": "https://theagent.ng/images/L1.png",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "49a Oyibo Adjahor Street",
      "addressLocality": "Lekki",
      "addressRegion": "Lagos",
      "addressCountry": "NG"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+234-805-303-4767",
      "contactType": "customer service",
      "email": "info@theagent.ng"
    },
    "sameAs": [
      "https://facebook.com/theagentng",
      "https://twitter.com/theagentng",
      "https://instagram.com/theagentng",
      "https://linkedin.com/company/theagentng"
    ]
  };

  return (
    <html lang="en" className={`${raleway.variable} ${montserrat.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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