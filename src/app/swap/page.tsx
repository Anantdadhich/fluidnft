'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { ArrowRightLeft, Rocket, Wand2 } from 'lucide-react';
import { Particles } from '@/components/magicui/particles';
import NFTSelector from '@/components/NftSelector';
import TokenSelector from '@/components/tokenselctor';
import SwapButton from '@/components/Swapbutton';
import NFTMinter from '@/components/Nftmint';
import { Card} from '@/components/ui/card';

interface NFT {
  mint: string;
  name: string;
  image: string;
}

export default function Swap() {
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [selectedToken, setSelectedToken] = useState('');
  const handleNFTSelect = (nft: NFT) => setSelectedNFT(nft);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Particles
          size={1}
          quantity={80}
          ease={0.5}
          color="#ffffff"
        />
      </div>
      
      <div className="relative z-10  mx-auto px-6 py-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10'>
            <div className='flex flex-col gap-2'>
              <h1 className='text-3xl md:text-4xl font-semibold bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent'>Swap or Mint NFTs</h1>
              <p className='text-gray-400 text-sm md:text-base'>Choose between swapping your NFTs for tokens or minting new NFTs with just one click</p>
            </div>
            <div>
              <WalletMultiButton className="rounded-lg bg-gradient-to-r from-slate-300 via-gray-200 to-slate-400 text-black font-semibold py-2 px-6 hover:opacity-90 transition-all" />
            </div>
          </div>
          
          <Card className=" p-6  bg-transparent">
            <Tabs defaultValue="account" className="w-full">
              <TabsList className="bg-white/10 backdrop-blur-md">
                <TabsTrigger className='text-md' value="account">
                  <div className="flex items-center gap-2">
                    <ArrowRightLeft className="w-4 h-4" />
                    <span>Swap NFTs</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger className='text-md' value="password">
                  <div className="flex items-center gap-2">
                    <Wand2 className="w-4 h-4" />
                    <span>Mint NFTs</span>
                  </div>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="account">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className='flex flex-col mt-8'
                >
                  <div className='flex flex-col md:flex-row items-center gap-16 relative'>
                    <div className="flex-1 w-full">
                      <NFTSelector selectedNFT={selectedNFT} onSelect={handleNFTSelect} />
                    </div>
                    
                    <div className='md:absolute flex shadow-xl rotate-90 md:rotate-0 items-center bg-primary/20 text-primary rounded-full justify-center md:top-[50%] border-2 border-primary/30 w-16 h-16 md:left-[50%] md:translate-x-[-50%] md:translate-y-[-50%] transition-all hover:bg-primary/30 '>
                      <ArrowRightLeft className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 w-full ">
                      <TokenSelector onSelect={setSelectedToken} />
                    </div>
                  </div>

                  {selectedNFT && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="mt-8"
                    >
                      <SwapButton
                        selectedNFT={selectedNFT}
                        selectedToken={selectedToken}
                      />
                    </motion.div>
                  )}
                </motion.div>
              </TabsContent>
              
              <TabsContent value="password">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className='flex flex-col mt-8'
                >
                  <NFTMinter />
                </motion.div>
              </TabsContent>
            </Tabs>
          </Card>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-12 text-center"
          >
            <div className="flex justify-center items-center gap-2 text-gray-400 text-sm">
              <Rocket className="w-4 h-4 text-primary" />
              <p>Get the best rates for your NFT swaps on Solana</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}