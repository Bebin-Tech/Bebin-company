import { siteUrl } from '@/lib/site-url';
import type { Metadata } from "next";
import "./globals.css";
import "./redesign.css";

export const metadata: Metadata = {
  title: { default: 'Bebin Tech — Academic Projects & Software Solutions', template: '%s | Bebin Tech' },
  description: 'Innovative Software Solutions for Students and Businesses. Final-year and college projects, ERP solutions, web applications, and mobile development by Bebin Tech.',
  metadataBase: new URL(siteUrl()),
  openGraph: { title:'Bebin Tech — Ideas into Innovation', description:'Academic projects and professional software development for students, colleges, startups, and businesses.', type:'website', images:['/bebin-logo.png'] },
  icons: {
    icon: "/bebin-logo.png",
    shortcut: "/bebin-logo.png",
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
