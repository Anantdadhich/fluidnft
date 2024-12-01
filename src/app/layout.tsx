import type { Metadata } from "next";
import { Bricolage_Grotesque, Lexend_Deca } from 'next/font/google';
import "./globals.css";
import { ThemeProvider } from "@/Components/Providers";


const mainFont = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "500", "600", "700", "800"],
  variable: '--font-main'
});

const secondaryFont = Lexend_Deca({
  subsets: ["latin"],
  weight: ["100", "200", "300", "500", "600", "700", "800"],
  variable: '--font-secondary'
});



export const metadata: Metadata = {
  title: "Mint",
  description: "Instant NFT Liquidation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${mainFont.variable} ${secondaryFont.variable} font-mainFont antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
      
            <main className=" max-w-7xl mx-auto px-4 min-h-[calc(100vh-21.8rem)]">
              {children}
            </main>
           
        </ThemeProvider>
      </body>
    </html>
  );
}