import { siteUrl } from '@/lib/site-url';
import type { Metadata } from "next";
import "./globals.css";
import "./redesign.css";
import "./commerce.css";
import "./blue-glass.css";

export const metadata: Metadata = {
  title: { default: 'Bebin Tech — Academic Projects & Software Solutions', template: '%s | Bebin Tech' },
  description: 'Innovative Software Solutions for Students and Businesses. Final-year and college projects, ERP solutions, web applications, and mobile development by Bebin Tech.',
  metadataBase: new URL(siteUrl()),
  verification: process.env.GOOGLE_SITE_VERIFICATION ? {google:process.env.GOOGLE_SITE_VERIFICATION} : undefined,
  openGraph: { title:'Bebin Tech — Ideas into Innovation', description:'Academic projects and professional software development for students, colleges, startups, and businesses.', type:'website', images:['/bebin-logo-clear.webp'] },
  icons: {
    icon: "/bebin-icon.png",
    shortcut: "/bebin-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
