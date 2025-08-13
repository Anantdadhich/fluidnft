"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Rocket, Zap, Shield, Wallet, LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/compo/ui/car";
import { Spotlight } from "@/compo/magic/spot";


interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.1 }}
    viewport={{ once: true }}
    className="h-full"
  >
    <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all duration-300 group h-full">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="bg-white/10 p-3 rounded-lg w-fit mb-4 group-hover:bg-white/15 transition-colors">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>
          <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export default function Home() {
  const router = useRouter();

  const features = [
    { 
      icon: Rocket, 
      title: "Instant Swaps", 
      description: "Lightning-fast NFT to token conversions with minimal slippage." 
    },
    { 
      icon: Zap, 
      title: "Best Rates", 
      description: "Maximize your returns with our optimized pricing algorithms." 
    },
    { 
      icon: Shield, 
      title: "Secure Transactions", 
      description: "Built with enterprise-grade Solana blockchain security." 
    },
    { 
      icon: Wallet, 
      title: "Multi-Wallet Support", 
      description: "Connect seamlessly with Phantom, Backpack, and more wallets." 
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black">
      
      {/* Background Spotlight */}
      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
        <motion.div
          animate={{ 
            rotate: [0, 2, -2, 0], 
            scale: [1, 1.02, 1] 
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 12, 
            ease: "easeInOut" 
          }}
        >
          <Spotlight className="w-[800px] h-[800px] opacity-40" fill="white" />
        </motion.div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              
              {/* Hero Content */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <div className="space-y-6">
                  <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-gray-400 to-gray-400 bg-clip-text text-transparent leading-tight">
                    Transform NFTs into Liquid Assets
                  </h1>
                  <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
                    Seamlessly convert your Solana NFTs into tokens with our cutting-edge DEX platform. 
                    Get the best rates, instant swaps, and maximum liquidity.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    onClick={() => router.push("/swap")}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-300 transition-colors duration-200"
                  >
                    Start Swap
                  </motion.button>
                  <motion.button
                    onClick={() => router.push("/swap")}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/5 transition-colors duration-200"
                  >
                    Learn More
                  </motion.button>
                </div>
              </motion.div>

              {/* Features Grid */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              >
                {features.map((feature, index) => (
                  <FeatureCard key={index} {...feature} />
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="container mx-auto px-6 py-16"
        >
        <div className="max-w-4xl mx-auto">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
    <div className="space-y-2">
      <div className="text-4xl font-bold text-white">2.5M+</div>
      <div className="text-gray-400">SOL Swapped</div>
    </div>
    <div className="space-y-2">
      <div className="text-4xl font-bold text-white">120K+</div>
      <div className="text-gray-400">NFT-to-Token Trades</div>
    </div>
    <div className="space-y-2">
      <div className="text-4xl font-bold text-white">30+</div>
      <div className="text-gray-400">Wallets & Marketplaces Supported</div>
    </div>
  </div>
</div>

        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="container mx-auto px-6 py-16"
        >
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12 text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-white">
                  Ready to fluidnft?
                </h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  Join thousands of traders who trust our platform for secure, fast, and profitable NFT-to-token swaps.
                </p>
              </div>
              <motion.button
                onClick={() => router.push("/swap")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                Get Started Now
              </motion.button>
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="border-t border-white/10">
          <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-gray-400 text-sm">
                © {new Date().getFullYear()} fluidnft .All rights reserved.
              </div>
              <div className="flex space-x-6 text-sm text-gray-400">
                <a href="#" className="hover:text-white transition-colors">Terms</a>
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Support</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}