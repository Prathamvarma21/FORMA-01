import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Navbar } from "@/components/navigation/Navbar";
import { CartDrawer } from "@/components/navigation/CartDrawer";
import { CustomCursor } from "@/components/ui/CustomCursor";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FRAME / 01 — 3D Art Gallery Exhibition 2026",
  description: "An immersive, two-sided perspective 3D art exhibition corridor with original curated contemporary editions.",
  keywords: ["art gallery", "3D web", "digital exhibition", "contemporary art", "fine art prints"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} font-sans`}>
      <body className="font-sans bg-[#F7F6F2] text-[#111111] antialiased selection:bg-[#111111] selection:text-[#F7F6F2]">
        <CartProvider>
          <CustomCursor />
          <Navbar />
          <CartDrawer />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
