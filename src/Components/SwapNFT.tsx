/*
import { useState } from "react"
import { Card, CardContent } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@radix-ui/react-label";
import { ArrowDownUp } from "lucide-react";
import { RainbowButton } from "./magicui/MagicButton";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";


interface NFT {
  mint:string
}

interface SwapnftProps {
  selecteedNFT:NFT,
  selectedtoken:string
}


export const SwapNFT = () => {

     const [isloading,setisloadiing]=useState(false);
     const {publicKey ,signTransaction}=useWallet();
     const conneection=useConnection();
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



*/
"use client"
import React, { useState, useEffect } from "react";

import { Label } from "@radix-ui/react-label";
import { ArrowDownUp, Wallet, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { 

  Transaction, 

} from "@solana/web3.js";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";


// Tokens for swapping
const TOKENS = {
  SOL: "SOL",
  USDC: "USDC",
  USDT: "USDT"
};

interface NFT {
  mint: string;
  name: string;
  imageUrl?: string;
}

export const SwapNFT: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [selectedToken, setSelectedToken] = useState<string>(TOKENS.SOL);
  const [swapAmount, setSwapAmount] = useState<string>("");

  const { publicKey, signTransaction, connected } = useWallet();
  const { connection } = useConnection();

  // Fetch user's NFTs
  const fetchUserNFTs = async () => {
    if (!publicKey) return;

    try {
      setIsLoading(true);
    
      const mockNFTs: NFT[] = [
        { 
          mint: "1234", 
          name: "Cool Monkey #1", 
          imageUrl: "https://example.com/nft1.png" 
        },
        { 
          mint: "5678", 
          name: "Rare Penguin", 
          imageUrl: "https://example.com/nft2.png" 
        }
      ];
      setNfts(mockNFTs);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    } finally {
      setIsLoading(false);
    }
  };


  const estimateSwapValue = async () => {
    if (!selectedNFT) return;

    try {
     
      const baseValue = 0.1; // Example SOL value
      setSwapAmount(baseValue.toString());
    } catch (error) {
      console.error("Error estimating swap value:", error);
    }
  };

  // Handle NFT swap
  const handleSwap = async () => {
    if (!publicKey || !signTransaction || !selectedNFT) {
      alert("Please connect wallet and select an NFT");
      return;
    }

    try {
      setIsLoading(true);


      const transaction = new Transaction();

     
      const signed = await signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signed.serialize());
      await connection.confirmTransaction(signature);

      alert("Swap successful!");
    } catch (error) {
      console.error("Swap failed:", error);
      alert("Swap failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (connected) {
      fetchUserNFTs();
    }
  }, [connected, publicKey]);

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

            {/* Swap Amount */}
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

            {/* Swap Button */}
            <div className="pt-4">
              <button
                onClick={handleSwap}
                disabled={!selectedNFT || isLoading}
                className={`
                  w-full py-3 rounded-full font-semibold transition-all flex items-center justify-center
                  ${!selectedNFT || isLoading 
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }
                `}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Swap NFT"
                )}
              </button>
            </div>

            {/* Wallet Connection Hint */}
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