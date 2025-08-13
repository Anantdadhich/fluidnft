"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { ArrowRightLeft, Rocket, Wand2 } from "lucide-react";
import { Card } from "@/compo/ui/car";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/compo/ui/tab";
import NFTSelector from "@/compo/selectnft";
import TokenSelector from "@/compo/tokenselctor";
import SwapButton from "@/compo/buttonswap";
import NFTMinter from "@/compo/mintnft";

interface NFT {
  mint: string;
  name: string;
  image: string;
}

export default function Swap() {
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [selectedToken, setSelectedToken] = useState("");
  const handleNFTSelect = (nft: NFT) => setSelectedNFT(nft);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-950 to-black overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-white/10 blur-3xl opacity-40 pointer-events-none" />

      <div className="relative z-10 mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-14">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-gray-300 to-gray-400 bg-clip-text text-transparent">
                Swap or Mint NFTs
              </h1>
              <p className="text-lg text-gray-300 max-w-xl leading-relaxed">
                Exchange your Solana NFTs for tokens in seconds or mint fresh
                NFTs instantly — all with the power of lightning-fast
                blockchain tech.
              </p>
            </div>
            <WalletMultiButton className="rounded-lg bg-white text-black font-semibold py-3 px-8 hover:bg-gray-300 transition-colors" />
          </div>

          {/* Main Card */}
          <Card className="p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg">
            <Tabs defaultValue="swap" className="w-full">
              <TabsList className="bg-white/10 backdrop-blur-sm rounded-lg p-1 flex gap-2">
                <TabsTrigger
                  value="swap"
                  className="flex items-center gap-2 px-4 py-2 text-white/80 hover:text-white transition rounded-md data-[state=active]:bg-white/20"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                  Swap NFTs
                </TabsTrigger>
                <TabsTrigger
                  value="mint"
                  className="flex items-center gap-2 px-4 py-2 text-white/80 hover:text-white transition rounded-md data-[state=active]:bg-white/20"
                >
                  <Wand2 className="w-4 h-4" />
                  Mint NFTs
                </TabsTrigger>
              </TabsList>

              {/* Swap Tab */}
              <TabsContent value="swap">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="flex flex-col mt-10"
                >
                  <div className="flex flex-col md:flex-row items-center gap-16 relative">
                    {/* NFT Selector */}
                    <div className="flex-1 w-full">
                      <NFTSelector selectedNFT={selectedNFT} onSelect={handleNFTSelect} />
                    </div>

                    {/* Swap Icon */}
                    <div className="md:absolute flex rotate-90 md:rotate-0 items-center justify-center w-16 h-16 rounded-full bg-white/10 border border-white/20 text-white shadow-lg md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
                      <ArrowRightLeft className="w-5 h-5" />
                    </div>

                    {/* Token Selector */}
                    <div className="flex-1 w-full">
                      <TokenSelector onSelect={setSelectedToken} />
                    </div>
                  </div>

                  {/* Swap Button */}
                  {selectedNFT && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="mt-10 flex justify-center"
                    >
                      <SwapButton selectedNFT={selectedNFT} selectedToken={selectedToken} />
                    </motion.div>
                  )}
                </motion.div>
              </TabsContent>

              {/* Mint Tab */}
              <TabsContent value="mint">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="flex flex-col mt-10"
                >
                  <NFTMinter />
                </motion.div>
              </TabsContent>
            </Tabs>
          </Card>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-14 text-center"
          >
            <div className="flex justify-center items-center gap-2 text-gray-300 text-sm">
              <Rocket className="w-4 h-4 text-white" />
              <p>Best rates & instant liquidity for your NFT swaps</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
