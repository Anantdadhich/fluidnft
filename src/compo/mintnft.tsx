"use client"
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { Loader2, Upload, Wallet, ImageIcon } from "lucide-react";
import { useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, Connection, clusterApiUrl } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { percentAmount, generateSigner } from '@metaplex-foundation/umi';
import { createBundlrUploader } from '@metaplex-foundation/umi-uploader-bundlr';
import { createNft } from '@metaplex-foundation/mpl-token-metadata';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Input } from './ui/input';
import { Button } from './ui/butto';
import { Textarea } from './ui/textarea';
import { Card, CardContent } from './ui/car';
import { Label } from './ui/label';

export default function NFTMinter() {
  const wallet = useWallet();
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const network = WalletAdapterNetwork.Devnet;

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const connection = useMemo(() => new Connection(endpoint), [endpoint]);
  
  const umi = useMemo(() => {
    const umi = createUmi(endpoint).use(mplTokenMetadata());

    if (wallet.publicKey) {
      umi.use(walletAdapterIdentity(wallet));
    }

    return umi;
  }, [endpoint, wallet]);

  useEffect(() => {
    if (wallet.publicKey) {
      checkBalance();
    }
  }, [wallet.publicKey]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setImage(acceptedFiles[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] }
  })

  const checkBalance = async () => {
    if (!wallet.publicKey) {
      toast.error('Wallet not connected');
      return;
    }
    
    try {
      const balance = await connection.getBalance(wallet.publicKey);
      const balanceInSol = balance / LAMPORTS_PER_SOL;
      setWalletBalance(balanceInSol);
      console.log(`Wallet balance: ${balanceInSol} SOL`);
      
      if (balanceInSol < 0.05) {
        toast.warning(`Low balance: ${balanceInSol.toFixed(4)} SOL. Minimum 0.05 SOL recommended for minting.`);
      }
    } catch (error) {
      console.error('Error checking balance:', error);
      toast.error('Failed to check wallet balance. Using default Solana devnet endpoint.');
      
      try {
        const fallbackConnection = new Connection(clusterApiUrl(network));
        const balance = await fallbackConnection.getBalance(wallet.publicKey);
        setWalletBalance(balance / LAMPORTS_PER_SOL);
      } catch (fallbackError) {
        console.error('Fallback balance check failed:', fallbackError);
      }
    }
  };

  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  const mintNFT = async () => {
    if (!wallet.publicKey || !image) {
      toast.error('Please connect wallet and upload an image');
      return;
    }
    
    setIsLoading(true);

    try {
      await checkBalance();
      console.log("Starting NFT minting process...");
      
      const imageDataUrl = await toBase64(image);
      console.log("Image converted to base64");

      console.log("Creating bundlr uploader with endpoint:", endpoint);
      const bundlrUploader = createBundlrUploader(umi);
      
      console.log("Uploading metadata...");
      const uri = await bundlrUploader.uploadJson({
        name,
        description,
        image: imageDataUrl,
      });
      console.log("Metadata uploaded, URI:", uri);

      console.log("Generating mint signer...");
      const mint = generateSigner(umi);
      
      console.log("Creating NFT with params:", {
        mint: mint.publicKey,
        name,
        uri,
      });
      
      const { signature } = await createNft(umi, {
        mint,
        name,
        uri,
        sellerFeeBasisPoints: percentAmount(5),
      }).sendAndConfirm(umi);

      console.log("NFT created. Signature:", signature);
      toast.success(`NFT minted successfully! Mint address: ${mint.publicKey}`);
    } catch (error) {
      console.error('Error minting NFT:', error);
      let errorMessage = 'Failed to mint NFT. ';
      
      if (error instanceof Error) {
        errorMessage += error.message;
        
        if (error.message.includes("insufficient funds")) {
          errorMessage = "Insufficient funds for transaction. Please add more SOL to your wallet.";
        } else if (error.message.includes("failed to fetch")) {
          errorMessage = "Network connection issue. Please check your internet connection and try again.";
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full space-y-8"
    >
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
          Create Your NFT
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Upload your artwork and mint it as an NFT on the Solana blockchain
        </p>
      </div>

      {/* Main Form */}
      <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
        <CardContent className="p-8">
          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Left Column - Form Fields */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              <div className="space-y-3">
                <Label htmlFor="nft-name" className="text-sm font-medium text-gray-300 uppercase tracking-wider">
                  NFT Name
                </Label>
                <Input
                  id="nft-name"
                  type="text"
                  placeholder="Enter your NFT name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-white/40 focus:ring-0 h-12"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="nft-description" className="text-sm font-medium text-gray-300 uppercase tracking-wider">
                  Description
                </Label>
                <Textarea
                  id="nft-description"
                  placeholder="Describe your NFT..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-white/40 focus:ring-0 resize-none"
                />
              </div>
              
              {/* Wallet Balance Section */}
              <div className="space-y-3 p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium text-gray-300 uppercase tracking-wider">
                    Wallet Balance
                  </Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={checkBalance}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-colors"
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    Refresh
                  </Button>
                </div>
                <div className="text-2xl font-bold text-white">
                  {walletBalance !== null ? `${walletBalance.toFixed(4)} SOL` : 'Connect wallet to view balance'}
                </div>
                {walletBalance !== null && walletBalance < 0.05 && (
                  <p className="text-sm text-yellow-400">
                    ⚠️ Low balance. Minimum 0.05 SOL recommended for minting.
                  </p>
                )}
              </div>
            </motion.div>

            {/* Right Column - Image Upload */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-300 uppercase tracking-wider">
                  Upload Artwork
                </Label>
                <div
                  {...getRootProps()}
                  className={`
                    relative p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-all duration-300 h-64
                    ${isDragActive 
                      ? 'border-white/40 bg-white/10' 
                      : 'border-white/20 hover:border-white/30 bg-white/5 hover:bg-white/10'
                    }
                  `}
                >
                  <input {...getInputProps()} />
                  {image ? (
                    <div className="h-full flex flex-col items-center justify-center space-y-4">
                      <ImageIcon className="h-12 w-12 text-green-400" />
                      <div className="space-y-1">
                        <p className="text-lg font-medium text-white">{image.name}</p>
                        <p className="text-sm text-gray-400">
                          {(image.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <p className="text-xs text-gray-500">Click or drag to replace</p>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center space-y-4">
                      <Upload className="h-12 w-12 text-gray-400" />
                      <div className="space-y-1">
                        <p className="text-lg font-medium text-white">
                          {isDragActive ? 'Drop your image here' : 'Upload your artwork'}
                        </p>
                        <p className="text-sm text-gray-400">
                          Drag & drop an image, or click to browse
                        </p>
                      </div>
                      <p className="text-xs text-gray-500">
                        Supports JPG, PNG, GIF up to 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Mint Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={mintNFT}
                  disabled={!name || !description || !image || isLoading || !wallet.publicKey}
                  className="w-full h-12 bg-white text-black font-semibold hover:bg-gray-100 disabled:bg-gray-600 disabled:text-gray-400 transition-colors duration-200"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Minting NFT...
                    </>
                  ) : (
                    <>
                      <ImageIcon className="mr-2 h-5 w-5" />
                      Mint NFT
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </CardContent>
      </Card>

   
    </motion.div>
  )
}