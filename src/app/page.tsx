"use client"
import React from 'react'; 
import { useRouter } from 'next/navigation';
import { Particles } from '@/Components/magicui/particles';


export default function Home() {
    const router = useRouter();
    return  (
<div className="relative overflow-hidden bg-gray-50 dark:bg-gray-950 min-h-screen flex flex-col items-center justify-center px-6">
   
      <div className="absolute inset-0 z-0">
        <Particles
        
           
        
        />
       
      </div>

  
      <div className="relative z-10 flex flex-col items-center">
        <h2 className="text-center bg-gradient-to-r from-slate-300 to-slate-600 bg-clip-text text-transparent text-3xl md:text-5xl lg:text-7xl font-bold py-6 tracking-tight">
          Swap your Solana NFTs <br /> Into any Tokens
        </h2>
        <p className="max-w-2xl text-center text-base md:text-lg text-gray-700 dark:text-slate-400">
          Convert your NFTs into tokens effortlessly and get the best prices.
        </p>
        <div className="mt-6">
          <button
            onClick={() => router.push("/swap")}
            className="px-6 rounded-lg py-3 bg-gradient-to-r from-slate-300 via-slate-400 to-slate-500 text-black text-sm md:text-base font-semibold shadow-lg transform hover:scale-105 transition-all"
          >
            Swap Now
          </button>
        </div>
      </div>
    </div>
     
    )
} 