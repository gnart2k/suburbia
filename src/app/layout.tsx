import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { WixClientContextProvider } from "@/context/wixContext";
import Script from "next/script";
import GeminiContainer from "@/components/bot/GeminiContainer";
import {
  ClerkProvider,
} from '@clerk/nextjs'
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Suburbia",
  description: "E-Commerce application with Next.js and Wix",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <head>
      <link 
            rel="preconnect" 
            href="https://fonts.googleapis.com"
          />
          <link 
            rel="preconnect" 
            href="https://fonts.gstatic.com" 
            crossOrigin="anonymous" 
          />
          <link 
            href="https://fonts.googleapis.com/css2?family=Fleur+De+Leah&display=swap" 
            rel="stylesheet" 
          />
          
        <Script
          src="/assets/scripts/lang-config.js"
          strategy="beforeInteractive"
        />
        <Script
          src="/assets/scripts/translation.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://translate.google.com/translate_a/element.js?cb=TranslateInit"
          strategy="afterInteractive"
        />
      </head>

      <body className={inter.className}>
        <div className="relative z-50 top-0 right-[200px]">
          <div className="fixed  top-[800px] right-[450px]  w-24 " >
            {
              // <GeminiContainer />
            }
          </div>
        </div>

        <WixClientContextProvider>
          <div className="sticky top-0 left-0 w-full z-50 bg-white/10 backdrop-blur-md w-full">
            <Navbar />
          </div>
          {children}
          <Footer />
        </WixClientContextProvider>
        <Toaster/>
      </body>
    </html>
    </ClerkProvider>
  );
}
