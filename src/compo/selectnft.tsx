"use client"
import { useState, useEffect, useCallback } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { Metaplex } from "@metaplex-foundation/js"
import { Loader2, Wallet, Image as ImageIcon, Grid, ChevronDown } from "lucide-react"
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { DialogDescription } from '@radix-ui/react-dialog'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from './ui/car'
import { RadioGroup, RadioGroupItem } from './ui/radiogroup'
import { Label } from '@radix-ui/react-label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Alert, AlertDescription } from './ui/alert'
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from './ui/dialog'
import { Button } from './ui/butto'

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

  const networkOptions = [
    { value: WalletAdapterNetwork.Mainnet, label: 'Mainnet', description: 'Production network' },
    { value: WalletAdapterNetwork.Devnet, label: 'Devnet', description: 'Development network' },
    { value: WalletAdapterNetwork.Testnet, label: 'Testnet', description: 'Testing network' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-6"
    >
      <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Select Your NFT
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {connected ? (
            <>
              {/* Network Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-300 uppercase tracking-wider">
                  1. Choose Network
                </Label>
                
                {/* Desktop Network Selection */}
                <div className="hidden md:block">
                  <RadioGroup
                    value={network}
                    onValueChange={(value) => setNetwork(value as WalletAdapterNetwork)}
                    className="grid grid-cols-3 gap-4"
                  >
                    {networkOptions.map((option) => (
                      <motion.div
                        key={option.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`
                          relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-300
                          ${network === option.value 
                            ? 'border-white/40 bg-white/10' 
                            : 'border-white/20 hover:border-white/30 bg-white/5 hover:bg-white/8'
                          }
                        `}
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={option.value}
                          className="sr-only"
                        />
                        <Label
                          htmlFor={option.value}
                          className="cursor-pointer block"
                        >
                          <div className="text-center space-y-1">
                            <div className="font-semibold text-white">{option.label}</div>
                            <div className="text-xs text-gray-400">{option.description}</div>
                          </div>
                        </Label>
                      </motion.div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Mobile Network Selection */}
                <div className="md:hidden">
                  <Select onValueChange={(value) => setNetwork(value as WalletAdapterNetwork)} value={network}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select network" />
                      <ChevronDown className="h-4 w-4" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 backdrop-blur-md border-white/20">
                      {networkOptions.map((option) => (
                        <SelectItem 
                          key={option.value}
                          value={option.value} 
                          className="text-white hover:bg-white/20 focus:bg-white/20"
                        >
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-xs text-gray-400">{option.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* NFT Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-300 uppercase tracking-wider">
                    2. Choose NFT
                  </Label>
                  <div className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-white">
                    {nfts.length} NFTs
                  </div>
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center p-12 bg-white/5 rounded-lg border border-white/10">
                    <div className="text-center space-y-3">
                      <Loader2 className="animate-spin h-8 w-8 text-white mx-auto" />
                      <p className="text-sm text-gray-400">Loading your NFTs...</p>
                    </div>
                  </div>
                ) : error ? (
                  <Alert className="border-red-500/20 bg-red-500/10">
                    <AlertDescription className="text-red-400">{error}</AlertDescription>
                  </Alert>
                ) : nfts.length > 0 ? (
                  <div className="space-y-4">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button
                            variant="outline" 
                            className="w-full h-14 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300"
                          >
                            <Grid className="mr-2 h-5 w-5" />
                            Browse NFT Collection
                          </Button>
                        </motion.div>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl bg-black/90 backdrop-blur-md border-white/20">
                        <DialogHeader className="space-y-2">
                          <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                            Your NFT Collection
                          </h2>
                          <DialogDescription className="text-gray-300">
                            Select the NFT you want to swap for tokens
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-auto py-4">
                          {nfts.map((nft, index) => (
                            <motion.div 
                              key={nft.mint}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-white/20 cursor-pointer transition-all duration-300"
                              onClick={() => handleNFTSelect(nft)}
                            >
                              <div className="space-y-3">
                                {nft.image ? (
                                  <div className="relative aspect-square rounded-lg overflow-hidden bg-white/5">
                                    <Image 
                                      src={nft.image} 
                                      alt={nft.name} 
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="aspect-square bg-white/10 rounded-lg flex items-center justify-center">
                                    <ImageIcon className="h-12 w-12 text-gray-400" />
                                  </div>
                                )}
                                <div className="space-y-1">
                                  <h3 className="font-semibold text-white truncate">{nft.name}</h3>
                                  <p className="text-xs text-gray-400 font-mono">{nft.mint.slice(0, 8)}...</p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Selected NFT Display */}
                    <AnimatePresence>
                      {selectedNFT && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="p-4 bg-white/10 border border-white/20 rounded-lg"
                        >
                          <div className="flex items-center gap-4">
                            {selectedNFT.image ? (
                              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white/5">
                                <Image 
                                  src={selectedNFT.image} 
                                  alt={selectedNFT.name} 
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center">
                                <ImageIcon className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
                            <div className="flex-1 space-y-1">
                              <h3 className="font-semibold text-white">{selectedNFT.name}</h3>
                              <p className="text-sm text-gray-400 font-mono">{selectedNFT.mint.slice(0, 16)}...</p>
                              <div className="inline-flex items-center px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                                Selected
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="text-center p-12 bg-white/5 rounded-lg border border-white/10">
                    <Grid className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-400">No NFTs found in your wallet</p>
                    <p className="text-sm text-gray-500 mt-1">Make sure you are connected to the right network</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center p-12 space-y-4">
              <Wallet className="h-16 w-16 text-gray-400 mx-auto" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">Wallet Not Connected</h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  Connect your wallet to view and select your NFTs for swapping
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}