"use client"

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Card, CardContent } from "@/Components/ui/card";
import { Connect } from "@/Components/Walletconnect";
import { SparklesCore } from "@/Components/magicui/sparklescore";
import { Nftmint } from "@/Components/Nftmint";
import { SwapNFT } from "@/Components/SwapNFT";
import { 
  Replace, 
  PlusCircle, 

} from "lucide-react";

export default function SwapPage() {
  const [activeTab, setActiveTab] = useState("swap");

  const tabAnimations = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black overflow-hidden text-white">
      {/* Sparkle Background */}
      <div className="absolute inset-0 z-0">
        <SparklesCore 
          particleColor="white" 
          minSize={0.6}
          maxSize={1.4}
          particleDensity={50}
        
      
        />
      </div>

    
      <div className="relative z-10 container mx-auto px-6 py-16">
     
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-center justify-between mb-12"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">
              NFT Swap Hub
            </h1>
            <p className="text-gray-400 mt-3 max-w-xl">
              Transform your digital assets instantly. Swap, mint, and maximize your Solana NFT potential.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Connect />
          </div>
        </motion.div>

        
        <Card className="bg-transparent border-none">
          <CardContent className="p-6">
          
            <Tabs 
              defaultValue="swap" 
              className="w-full"
              onValueChange={setActiveTab}
            >
              <div className="flex justify-center mb-8">
                <TabsList className="grid grid-cols-2 w-full max-w-md bg-gray-900 p-1 rounded-full">
                  <TabsTrigger 
                    value="swap" 
                    className={`
                      rounded-full py-2 text-base flex items-center justify-center gap-2
                      ${activeTab === 'swap' 
                        ? 'bg-primary text-black' 
                        : 'text-gray-400 hover:text-white'}
                    `}
                  >
                    <Replace className="w-5 h-5" /> Swap
                  </TabsTrigger>
                  <TabsTrigger 
                    value="mint" 
                    className={`
                      rounded-full py-2 text-base flex items-center justify-center gap-2
                      ${activeTab === 'mint' 
                        ? 'bg-primary text-black' 
                        : 'text-gray-400 hover:text-white'}
                    `}
                  >
                    <PlusCircle className="w-5 h-5" /> Mint
                  </TabsTrigger>
                </TabsList>
              </div>


              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  {...tabAnimations}
                  transition={{ duration: 0.3 }}
                >
                  <TabsContent value="swap" className="w-full">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                      className="flex justify-center"
                    >
                      <SwapNFT />
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="mint" className="w-full">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                      className="flex justify-center"
                    >
                      <Nftmint />
                    </motion.div>
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </Tabs>
            
      
            
          </CardContent>
        </Card>
      </div>
    </div>
  );
}