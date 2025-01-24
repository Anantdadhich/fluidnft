"use client "

import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";

import { useMemo, ReactNode, FC } from "react";
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';

import { WalletModalProvider, WalletMultiButton } from  "@solana/wallet-adapter-react-ui"
require('@solana/wallet-adapter-react-ui/styles.css');


export const Connect:FC=()=>{

  const endpoint = useMemo(() => "https://api.devnet.solana.com", []);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);


return (
    <ConnectionProvider endpoint={endpoint}>
   <WalletProvider wallets={wallets} autoConnect>
 <WalletModalProvider>
   <div className="flex-col gap-3">
 <WalletMultiButton style={{
   
    backgroundColor:'#0a0a23',
    color: '#fff',
  
    borderRadius:'10px'
 }}>Connect</WalletMultiButton>

    </div>
 </WalletModalProvider>
   



   </WalletProvider>


</ConnectionProvider>
)


}