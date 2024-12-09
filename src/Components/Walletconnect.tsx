"use client "
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { UnsafeBurnerWalletAdapter } from "@solana/wallet-adapter-wallets";
import {clusterApiUrl} from "@solana/web3.js"
import { useMemo,FC } from "react";
import { WalletDisconnectButton, WalletModalProvider, WalletMultiButton } from  "@solana/wallet-adapter-react-ui"


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
    <WalletMultiButton></WalletMultiButton>
    <WalletDisconnectButton/>
   </WalletModalProvider>

   </WalletProvider>


</ConnectionProvider>
)


}