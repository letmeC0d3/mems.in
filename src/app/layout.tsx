import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mems.in"),
  title: "mems.in | Free Meme Generator & Custom URL Shortener",
  description: "The best free online memes generator, meme creator online, and custom URL shortener with reaction screens. Create dank memes, search templates, and shorten links.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "mems.in | Free Meme Generator & Custom URL Shortener",
    description: "The best free online memes generator, meme creator online, and custom URL shortener with reaction screens. Create dank memes, search templates, and shorten links.",
    url: "https://mems.in",
    siteName: "mems.in",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "mems.in | Free Meme Generator & Custom URL Shortener",
    description: "The best free online memes generator, meme creator online, and custom URL shortener with reaction screens.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var storedTheme = localStorage.getItem('theme');
                  var theme = 'dark';
                  if (storedTheme === 'light' || storedTheme === 'dark') {
                    theme = storedTheme;
                  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
                    theme = 'light';
                  }
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Analytics />
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-DR08V26QN6"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-DR08V26QN6');
          `}
        </Script>
      </body>
    </html>
  );
}
