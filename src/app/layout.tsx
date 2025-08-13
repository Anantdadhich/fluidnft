import type { Metadata } from "next";
import { Bricolage_Grotesque, Lexend_Deca } from 'next/font/google';
import "./globals.css";
import { ThemeProvider } from "@/compo/Providers";
import WalletContextProvider from "@/compo/Walletconnect";
import { Toaster } from "@/compo/ui/sonner";



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
  title: "FluidNFT",
  description: "Instant NFT Liquidation",
  openGraph: {
    type: 'website',
    title: "FluidNFT",
    description: "Instant NFT Liquidation",

  }
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
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
      
          <WalletContextProvider>
            <main className="">
              {children}
            </main>
            <Toaster position="bottom-right" richColors />
          </WalletContextProvider>
         
        </ThemeProvider>
      </body>
    </html>
  );
}