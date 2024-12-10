"use client"
import React from 'react';
import sol from "../../public/sol.svg";
import usdc from "../../public/usdc.svg";
import usdt from "../../public/usdt.svg";
import Image from 'next/image'
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Particles } from '@/Components/magicui/particles';
import { BackgroundLines } from '@/Components/ui/backgroundlines';
import { RainbowButton } from '@/Components/magicui/MagicButton';

const itemVariants = {
    hidden: { opacity: 0, y: -30, filter: "blur(10px)" },
    visible: (custom: number) => ({
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            duration: 1.4,
            delay: custom * 0.2, // 0.2 seconds delay multiplied by the custom value
        },
    }),
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: (custom: number) => ({
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delay: custom * 1
        },
    }),
}

const floatVariants = {
    hidden: { opacity: 0, scale: 0.5, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
    float: {
        y: [-20, 20],
        transition: {
            y: {
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
            }
        }
    }
};




  





export default function Home() {
    const router = useRouter();
    return  (
<div className="relative overflow-hidden bg-gray-50 dark:bg-neutral-950 min-h-screen flex flex-col items-center justify-center px-6">
   
      <div className="absolute inset-0 z-0">
        <Particles
        
           
        
        />
      </div>

    
      <div className="relative z-10 flex flex-col items-center">
        <h2 className="text-center bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600 dark:from-gray-200 dark:to-gray-50 text-3xl md:text-5xl lg:text-7xl font-bold py-6 tracking-tight">
          Swap your NFTs <br /> Into Tokens
        </h2>
        <p className="max-w-2xl text-center text-base md:text-lg text-gray-700 dark:text-gray-400">
          Convert your NFTs into tokens effortlessly and get the best prices.
        </p>
        <div className="mt-6">
          <button
            onClick={() => router.push("/swap")}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-sm md:text-base font-semibold rounded-md shadow-lg transform hover:scale-105 transition-all"
          >
            Swap Now
          </button>
        </div>
      </div>
    </div>
     
    )
}