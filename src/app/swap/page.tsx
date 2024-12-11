"use client"
import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";

;
import { Connect } from "@/Components/Walletconnect";

import { SparklesCore } from "@/Components/magicui/sparklescore";
import { Nftmint } from "@/Components/Nftmint";
import { SwapNFT } from "@/Components/SwapNFT";



export default function Swap() {
  const [connected, setConnected] = useState(false);

  return (
<div className="relative min-h-[80vh] flex flex-col items-center px-4 bg-gray-950 text-white">
 
 <SparklesCore particleColor="gray" maxSize={6}></SparklesCore>

  {/* Content Section */}
  <div className="relative w-full py-16">
    {/* Header Section */}
    <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
      <div className="flex flex-col items-center md:items-start gap-3 text-center md:text-left">
        <h1 className="text-4xl font-bold tracking-tight">NFT Swap</h1>
        <p className="text-gray-400 text-sm md:text-base leading-relaxed">
          Transform your NFTs into tokens seamlessly
        </p>
      </div>
      <div>
        <Connect />
      </div>
    </div>

    {/* Tabs Section */}
    <Tabs defaultValue="swap" className="w-full">
      {/* Tabs Navigation */}
      <div className="flex justify-center mb-6">
        <TabsList className="grid w-[400px] grid-cols-2 rounded-lg bg-gray-950">
          <TabsTrigger
            value="swap"
            className="text-lg text-white hover:bg-gray-700  rounded-md py-2"
          >
            Swap
          </TabsTrigger>
          <TabsTrigger
            value="mint"
            className="text-lg text-white hover:bg-gray-700 rounded-md py-2"
          >
            Mint
          </TabsTrigger>
        </TabsList>
      </div>

      {/* Tabs Content */}
      <TabsContent value="swap">
        <div className="flex justify-center py-8">
          <SwapNFT />
        </div>
      </TabsContent>

      <TabsContent value="mint">
        <div className="flex justify-center py-8">
        <Nftmint></Nftmint>
        </div>
      </TabsContent>
    </Tabs>
  </div>
</div>

  );
}