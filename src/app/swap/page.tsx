"use client"
import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Card, CardContent } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";

import { ArrowDownUp} from "lucide-react";
import { RainbowButton } from "@/Components/magicui/MagicButton";
import { Label } from "@/Components/ui/label";
import { Connect } from "@/Components/Walletconnect";

const SwapInterface = () => {
  return (
    <Card className="w-full max-w-md mx-auto ">
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
  );
};

export default function Swap() {
  const [connected, setConnected] = useState(false);

  return (
    <div className="min-h-[80vh] flex flex-col items-center px-4

">
      <div className=" w-full py-16">
       
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
          <div className="flex flex-col items-center md:items-start gap-2">
            <h1 className="text-4xl font-bold">NFT Swap</h1>
            <p className="text-gray-400 text-sm">
              Transform your NFTs into tokens seamlessly
            </p>
          </div>
          <div>  
          <Connect /> 
          </div>
        </div>

        <Tabs defaultValue="swap" className="w-full ">
          <div className="flex justify-center mb-6">
            <TabsList className="grid w-[400px] grid-cols-2">
              <TabsTrigger value="swap" className="text-lg">
                Swap
              </TabsTrigger>
              <TabsTrigger value="mint" className="text-lg">
                Mint
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="swap">
            <div className="flex justify-center ">
              <SwapInterface  />
            </div>
          </TabsContent>
  
          <TabsContent value="mint">
            <div className="flex justify-center">
             
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}