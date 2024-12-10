"use client "
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { UnsafeBurnerWalletAdapter } from "@solana/wallet-adapter-wallets";
import {clusterApiUrl} from "@solana/web3.js"
import { useMemo,FC } from "react";
import { WalletDisconnectButton, WalletModalProvider, WalletMultiButton } from  "@solana/wallet-adapter-react-ui"
require('@solana/wallet-adapter-react-ui/styles.css');

export const Connect:FC=()=>{

  const network=WalletAdapterNetwork.Devnet;
  
  const enpoint=useMemo(()=>
     clusterApiUrl(network)
  ,
[network])


  const wallet=useMemo(()=>
  [
    new UnsafeBurnerWalletAdapter()
  ]
  
,[network])


return (
    <ConnectionProvider endpoint={enpoint}>
   <WalletProvider wallets={wallet} autoConnect>
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