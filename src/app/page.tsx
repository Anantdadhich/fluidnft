"use client"

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Particles } from '@/Components/magicui/particles';
import { 
  Rocket, 
  Zap, 
  Shield, 
  Wallet, 

} from 'lucide-react';
import { Card, CardContent } from '@/Components/ui/card';



const FeatureCard = ({ icon: Icon, title, description }:any) => (
  <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:border-primary/50 transition-all duration-300 group hover:bg-transparent hover:cursor-pointer ">
    <CardContent className="p-6 space-y-4">
      <div className="bg-primary/10 p-3 rounded-xl w-fit group-hover:bg-primary/20 transition-all">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <div>
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-300 text-sm">{description}</p>
      </div>
    </CardContent>
  </Card>
);

export default function Home() {
  const router = useRouter();


  const features = [
    {
      icon: Rocket,
      title: "Instant Swaps",
      description: "Lightning-fast NFT to token conversions "
    },
    {
      icon: Zap,
      title: "Best Rates",
      description: " maximize your token returns"
    },
    {
      icon: Shield,
      title: "Secure Transactions",
      description: "Built with Solana blockchain security protocols"
    },
    {
      icon: Wallet,
      title: "Multi-Wallet Support",
      description: "Connect with Phantom, Backpack, and more"
    }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black overflow-hidden">

      <div className="absolute inset-0 z-0">
        <Particles 
          size={1}
          quantity={100}
          ease={0.5}
          color="#ffffff"
        
         
        />
      </div>

     
      <div className="relative z-10 container mx-auto px-6 py-12 grid md:grid-cols-2 gap-12 items-center mt-6">
     
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-6"
        >
          <h1 className="text-4xl md:text-6xl font-semibold  bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent leading-tight">
            Transform NFTs into Liquid Assets
          </h1>
          
          <p className="text-gray-400 max-w-xl text-lg">
            Seamlessly convert your Solana NFTs into tokens with our cutting-edge DEX platform. Get the best rates, instant swaps, and maximum liquidity.
          </p>

          <div className="flex space-x-4">
           <button 
            onClick={() => router.push("/swap")}
            className="px-6 rounded-lg py-3 bg-gradient-to-r from-slate-300 via-gray-200 to-slate-400 text-black text-sm md:text-base font-semibold shadow-lg transform hover:scale-105 transition-all"
          >
            Swap Now
          </button>
          
          </div>
        </motion.div>

       
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-6"
        >
  
          <div className="grid md:grid-cols-2 gap-4 mt-12 ">
            {features.map((feature, index) => (
              <FeatureCard 
                key={index} 
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>

         
        </motion.div>
      </div>
    </div>
  );
}