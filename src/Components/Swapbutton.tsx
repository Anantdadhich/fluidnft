import { getSwapQuote } from "@/lib/jupiterapi";
import { getNFTPrice } from "@/lib/tensorapi";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { useState } from "react";


interface NFT {
    mint:string
}


interface SwapButtonProps {
    selectedNFT:NFT;
    selectedtoken:string
}

export  const  SwapButton =({selectedNFT,selectedtoken}:SwapButtonProps)=>{

    const {publicKey,signTransaction} =useWallet();
    const {connection} =useConnection()
    const [isLoading,setIsLoading]=useState(false)


    const hanldeSwap=async()=>{

        if(!publicKey || !signTransaction) {
            console.log("error")
            return
        }

        if(!selectedNFT || !selectedtoken) {
                   console.log("select nft and a token")
            return 
        }

        setIsLoading(true)


        try {
            const nftprice=await getNFTPrice(selectedNFT.mint)

            if(!nftprice){
                throw new Error("failed to get nft price ")
            }

            const swapqoute=await getSwapQuote('SOL',selectedtoken,nftprice)

            if(!swapqoute){
                   throw new Error("failed to get swap qoute ")
            }


            const response=await axios.post("https://qoute-api.jup.ag/v4/.swap",{
                qouteResponse:swapqoute,
                userPublicKey:publicKey.toBase58(),
                 wrapUnwrapSOL:true
            })

            const {swapTransaction}=response.data

            if(!swapTransaction){
                throw new Error("failed to create swap transaction ")
            }

             
        } catch (error) {
            console.log(error)
        }
    }
         return (
            <div>
        
            </div>
         )
}