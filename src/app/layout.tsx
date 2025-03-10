import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Image from "next/image";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Jannea's 19th Birthday Party",
  description: "Jannea's 19th Birthday",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${poppins.variable} antialiased`}>
        <Image
          src="/overlay.png"
          alt="overlay"
          width={2000}
          height={2000}
          className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-50"
        />
        {children}
        <Image
          src="/overlay.png"
          alt="overlay"
          width={2000}
          height={2000}
          className="fixed top-0 left-0 w-full h-full opacity-50 pointer-events-none z-[99999]"
        />
      </body>
    </html>
  );
}
