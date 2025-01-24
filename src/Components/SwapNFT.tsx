"use client"
import React, { useState, useEffect } from "react";

import { Label } from "@radix-ui/react-label";
import { ArrowDownUp, Wallet, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";


const TOKENS = {
  SOL: "SOL",
  USDC: "USDC",
  USDT: "USDT"
};

type NFT= {
  mint: string;
  name: string;
  imageUrl?: string;
}

interface nftselectorProps{
  onSelect:(nft:NFT) =>void;
  selectedNft:NFT |null
}

export const SwapNFT = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [nfts, setNfts] = useState<NFT[]>([]);
  
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [selectedToken, setSelectedToken] = useState<string>(TOKENS.SOL);
  const [swapAmount, setSwapAmount] = useState<string>("");

   const [isdialogopen,setisdialogopen]=useState(false);
  const { publicKey, signTransaction, connected } = useWallet();
  const { connection } = useConnection();


  const estimateSwapValue = async () => {
    if (!selectedNFT) return;

    try {
     
      const baseValue = 0.1; // Example SOL value
      setSwapAmount(baseValue.toString());
    } catch (error) {
      console.error("Error estimating swap value:", error);
    }
  };


 
  useEffect(() => {
    if (selectedNFT) {
      estimateSwapValue();
    }
  }, [selectedNFT]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md"
    >
      <Card className="bg-white/5 backdrop-blur-lg border-white/10 shadow-2xl">
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-4">
     
            <div className="space-y-2">
              <Label htmlFor="from-nft">From NFT</Label>
              <div className="relative">
                <select
                  id="from-nft"
                  className="w-full p-3 bg-gray-900 text-gray-200 border border-gray-700 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                  value={selectedNFT?.mint || ''}
                  onChange={(e) => {
                    const nft = nfts.find(n => n.mint === e.target.value);
                    setSelectedNFT(nft || null);
                  }}
                >
                  <option value="">Select NFT to Swap</option>
                  {nfts.map((nft) => (
                    <option key={nft.mint} value={nft.mint}>
                      {nft.name}
                    </option>
                  ))}
                </select>
                {isLoading && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <RefreshCw className="w-4 h-4 animate-spin text-gray-400" />
                  </div>
                )}
              </div>
            </div>

          
            <div className="flex justify-center">
              <div className="bg-primary/10 p-2 rounded-full">
                <ArrowDownUp className="w-5 h-5" />
              </div>
            </div>

           
            <div className="space-y-2">
              <Label htmlFor="to-token">To Token</Label>
              <select
                id="to-token"
                className="w-full p-3 bg-gray-900 text-gray-200 border border-gray-700 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                value={selectedToken}
                onChange={(e) => setSelectedToken(e.target.value)}
              >
                {Object.values(TOKENS).map((token) => (
                  <option key={token} value={token}>
                    {token}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Estimated Swap Amount</Label>
              <Input
                type="text"
                value={swapAmount}
                readOnly
                className="w-full bg-gray-800 text-gray-300 cursor-not-allowed"
                placeholder="Estimated token amount"
              />
            </div>

    
            <div className="pt-4">
               <SwapButton></SwapButton>
            </div>

            {!connected && (
              <div className="text-center text-sm text-yellow-500 flex items-center justify-center">
                <Wallet className="mr-2 w-4 h-4" />
                Please connect your wallet to swap NFTs
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SwapNFT;