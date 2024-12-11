import { useState } from "react"
import { Card, CardContent } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@radix-ui/react-label";
import { ArrowDownUp } from "lucide-react";
import { RainbowButton } from "./magicui/MagicButton";
import { useWallet } from "@solana/wallet-adapter-react";

export const SwapNFT = () => {
    const [seleectedNft,setselectedNft]=useState("");
     const [isloading,setisloadiing]=useState(false);
     const {publicKey ,signTransaction}=useWallet();

     const handleSwap=()=>{
          try {
           
          } catch (error) {
            
          }
     }

  return (
    <div>
         <Card className="w-full max-w-md mx-auto bg-gray-950 ">
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="from-token">From</Label>
            <Input
              id="from-token"
              type="text"
              placeholder="Enter NFT ID or select from wallet"
              className="w-full"
            />
          </div>

          <div className="flex justify-center">
            <div className="bg-primary/10 p-2 rounded-full">
              <ArrowDownUp className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="to-token">To</Label>
            <Input
              id="to-token"
              type="text"
              placeholder="Amount of tokens to receive"
              className="w-full"
            />
          </div>

          <div className="pt-4">
            <RainbowButton className="w-full">
              Swap NFT
            </RainbowButton>
          </div>
        </div>
      </CardContent>
    </Card>
    </div>
  )
}


