"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/car';
import { RadioGroup, RadioGroupItem } from './ui/radiogroup';
import { Label } from './ui/label';
import { Coins } from 'lucide-react';

const VALID_TOKENS = [
  {
    name: 'usdc',
    icon: <Coins className="h-5 w-5 text-blue-500 " />,
    color: 'border-blue-500 '
  },
  {
    name: 'usdt',
    icon: <Coins className="h-5 w-5 text-green-500" />,
    color: 'border-green-500'
  },
  {
    name: 'sol',
    icon: <Coins className="h-5 w-5 text-purple-500" />,
    color: 'border-purple-500'
  },
]

interface TokenSelectorProps {
  onSelect: (token: string) => void;
}

export default function TokenSelector({ onSelect }: TokenSelectorProps) {
  const [selectedToken, setSelectedToken] = useState<string>('')

  const handleTokenChange = (value: string) => {
    const token = VALID_TOKENS.find(t => t.name === value.toLowerCase());
    if (token) {
      setSelectedToken(value);
      onSelect(value);
    } else {
      console.error('Invalid token selected:', value);
      setSelectedToken('');
      onSelect('');
    }
  }
  
  return (
    <Card className="w-full md:w-[90%] min-h-[20rem] max-h-fit bg-white/10 backdrop-blur-md border-white/20 hover:border-primary/30 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-xl bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">Select Output Token</CardTitle>
      </CardHeader>
      <CardContent className="min-h-[calc(20rem-4.8rem)] flex flex-col max-h-fit">
        <div className="h-full flex-1 flex flex-col">
          <p className="text-xs text-gray-300 mb-4">Choose which token you want to receive</p>
          
          <RadioGroup
            onValueChange={handleTokenChange}
            value={selectedToken}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {VALID_TOKENS.map(token => (
              <div
                key={token.name}
                className={`flex items-center space-x-2 h-full text-white rounded-md border-[3px] p-4 py-6 transition-all duration-300 hover:bg-[#b037d3]/5 ${
                  selectedToken === token.name 
                    ? token.color + ' shadow-lg shadow-' + token.name + '/10' 
                    : 'border-white/10'
                }`}
              >
                <RadioGroupItem 
                  value={token.name} 
                  id={token.name} 
                  className="rounded-full peer sr-only" 
                />
                <Label 
                  htmlFor={token.name} 
                  className="flex-grow flex items-center justify-between h-full cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    {token.icon}
                    <p className="font-medium">{token.name.toUpperCase()}</p>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
          
          {selectedToken && (
            <div className="mt-6 p-4 rounded-md bg-primary/10 border border-primary/20">
              <p className="text-sm text-white">You will receive <span className="font-semibold text-primary text-white text-[15px]">{selectedToken.toUpperCase()}</span> tokens for your NFT</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}