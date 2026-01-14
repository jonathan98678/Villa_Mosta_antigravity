import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Villa Mosta | Charming Accommodation in Mosta, Malta",
  description: "Experience authentic Maltese hospitality at Villa Mosta. A 3-bedroom homestay near the famous Mosta Rotunda with sun terrace, city views, and a 9.5 guest rating.",
  keywords: ["villa mosta", "mosta accommodation", "malta", "mosta rotunda", "maltese homestay", "holiday rental malta"],
  openGraph: {
    title: "Villa Mosta | Accommodation in Malta",
    description: "Experience authentic Maltese hospitality at Villa Mosta near the famous Rotunda.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="antialiased">
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#1c1917',
              color: '#fff',
              border: '1px solid #292524',
            },
          }}
        />
      </body>
    </html>
  );
}
