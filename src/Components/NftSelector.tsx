"use client"
import { useState, useEffect, useCallback } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { Metaplex } from "@metaplex-foundation/js"
import { Loader2, Wallet, Image as ImageIcon } from "lucide-react"
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { Button } from "@/components/ui/button"
import { DialogDescription } from '@radix-ui/react-dialog'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { RadioGroup, RadioGroupItem } from './ui/radiogroup'
import { Label } from '@radix-ui/react-label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Alert, AlertDescription } from './ui/alert'
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from './ui/dialog'

type NFT = {
  mint: string
  name: string
  image: string
}

interface NFTSelectorProps {
  onSelect: (nft: NFT) => void;
  selectedNFT: NFT | null;
}

export default function NFTSelector({ selectedNFT, onSelect }: NFTSelectorProps) {
  const [nfts, setNfts] = useState<NFT[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { publicKey, connected } = useWallet()
  const { connection } = useConnection()
  const [network, setNetwork] = useState<WalletAdapterNetwork>(WalletAdapterNetwork.Devnet)
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchNFTs = useCallback(async () => {
    if (!publicKey) return
    setIsLoading(true)
    setError(null)
    try {
      const metaplex = new Metaplex(connection)
      const nfts = await metaplex.nfts().findAllByOwner({ owner: publicKey })
      const nftData = nfts.map(nft => ({
        mint: nft.address.toBase58(),
        name: nft.name,
        image: nft.json?.image || ''
      }))
      setNfts(nftData)
    } catch (err) {
      console.error('Error fetching NFTs:', err)
      setError('Failed to load NFTs. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [publicKey, connection])

  useEffect(() => {
    if (connected && publicKey) {
      fetchNFTs()
    } else {
      setNfts([])
    }
  }, [connected, publicKey, fetchNFTs])

  const handleNFTSelect = (nft: NFT) => {
    onSelect(nft);
    setIsDialogOpen(false);
  }

  return (
    <Card className="w-full md:w-[90%] min-h-[20rem] max-h-fit bg-white/10 backdrop-blur-md border-white/20 hover:border-primary/30 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-xl bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">Choose Your NFT</CardTitle>
      </CardHeader>
      <CardContent className="min-h-[calc(20rem-4.8rem)] flex flex-col max-h-fit">
        <div className="h-full flex-1 flex flex-col">
          {connected ? (
            <div className="flex flex-col gap-4 h-full flex-1">
              <p className="text-xs text-gray-300">1. Select the network</p>
              
              <div className="block md:hidden">
                <Select onValueChange={(value) => setNetwork(value as WalletAdapterNetwork)} value={network}>
                  <SelectTrigger className="bg-white/5 border-white/20">
                    <SelectValue placeholder="Select network" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/10 backdrop-blur-md border-white/20">
                    <SelectItem value={WalletAdapterNetwork.Mainnet} className="hover:bg-white/20">Mainnet</SelectItem>
                    <SelectItem value={WalletAdapterNetwork.Devnet} className="hover:bg-white/20">Devnet</SelectItem>
                    <SelectItem value={WalletAdapterNetwork.Testnet} className="hover:bg-white/20">Testnet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <RadioGroup
                value={network}
                onValueChange={(value) => setNetwork(value as WalletAdapterNetwork)}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4  md:grid"
              >
                {['mainnet-beta', 'devnet', 'testnet'].map((net) => (
                  <div
                    key={net}
                    className={`flex items-center space-x-2 h-full rounded-md border-[3px] p-4 py-6 transition-all duration-300 hover:bg-[#b037d3]/5 ${
                      network === net 
                        ? 'border-[#efebf0] shadow-lg shadow-[#b037d3]/10' 
                        : 'border-white/10'
                    }`}
                  >
                    <RadioGroupItem
                      value={net}
                      id={net}
                      className="rounded-full peer sr-only"
                    />
                    <Label
                      htmlFor={net}
                      className="flex-grow flex items-center justify-between h-full cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{net.charAt(0).toUpperCase() + net.split('-')[0]?.slice(1)}</p>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-300">2. Select the NFT</p>
                <aside className="border-2 px-4 py-1 bg-[#b037d3] text-white rounded-full text-xs">
                  {nfts.length} NFTs
                </aside>
              </div>

              {isLoading ? (
                <div className="flex flex-1 items-center justify-center rounded-md border-[3px] border-white/10 p-4 py-6">
                  <Loader2 className="animate-spin h-8 w-8 text-[#b037d3]" />
                </div>
              ) : error ? (
                <Alert className="flex-1 rounded-md border-[3px] border-red-500/20 bg-red-500/10">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : nfts.length > 0 ? (
                <div className="flex flex-col gap-4">
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger className="h-fit" asChild>
                      <Button 
                        variant="outline" 
                        className="w-full h-[3rem] bg-white/5 border-white/20 hover:bg-[#b037d3]/10 hover:border-[#b037d3]/30"
                      >
                        Select an NFT
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[50rem] bg-white/10 backdrop-blur-md border-white/20">
                      <DialogHeader className="text-xl bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">
                        Your NFTs
                      </DialogHeader>
                      <DialogDescription className="text-sm text-gray-300">
                        Select the NFT which you want to swap
                      </DialogDescription>
                      <div className="grid gap-4 h-[50vh] overflow-auto py-4">
                        {nfts.map((nft) => (
                          <div 
                            key={nft.mint} 
                            className="flex items-center gap-4 p-4 border rounded-md border-white/20 hover:bg-[#b037d3]/5 cursor-pointer hover:border-[#b037d3]/30 transition-all duration-300"
                            onClick={() => handleNFTSelect(nft)}
                          >
                            {nft.image ? (
                              <Image 
                                src={nft.image} 
                                alt={nft.name} 
                                width={64}
                                height={64}
                                className="w-16 h-16 object-cover rounded-md" 
                              />
                            ) : (
                              <div className="w-16 h-16 bg-white/10 rounded-md flex items-center justify-center">
                                <ImageIcon className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <h3 className="font-semibold">{nft.name}</h3>
                              <p className="text-sm text-gray-400">{nft.mint.slice(0, 8)}...</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>

                  {selectedNFT && (
                    <div className="mt-4 p-4 rounded-md bg-[#b037d3]/10 border border-[#b037d3]/20">
                      <div className="flex items-center gap-4">
                        {selectedNFT.image ? (
                          <Image 
                            src={selectedNFT.image} 
                            alt={selectedNFT.name} 
                            width={64}
                            height={64}
                            className="w-16 h-16 object-cover rounded-md" 
                          />
                        ) : (
                          <div className="w-16 h-16 bg-white/10 rounded-md flex items-center justify-center">
                            <ImageIcon className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold">{selectedNFT.name}</p>
                          <p className="text-sm text-gray-400">{selectedNFT.mint.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-1 items-center justify-center rounded-md border-[3px] border-white/10 p-4 py-6">
                  <p className="text-sm text-gray-400">No NFTs found in your wallet.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm gap-4 text-center flex min-h-[calc(20rem-4.8rem)] items-center flex-col justify-center text-gray-400">
              <Wallet size={40} className="text-[#b037d3]" />
              <p className="w-full md:w-[50%]">Connect your wallet to view and select your NFTs.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}