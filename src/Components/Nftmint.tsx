"use client"
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { Loader2, Upload, Wallet } from "lucide-react";
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
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';

export default function NFTMinter() {
  const wallet = useWallet();
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const network = WalletAdapterNetwork.Devnet;

  // Use Solana's public devnet endpoint instead of QuickNode to avoid authorization issues
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const connection = useMemo(() => new Connection(endpoint), [endpoint]);
  
  const umi = useMemo(() => {
    const umi = createUmi(endpoint).use(mplTokenMetadata());

    if (wallet.publicKey) {
      umi.use(walletAdapterIdentity(wallet));
    }

    return umi;
  }, [endpoint, wallet]);

  // Check balance when wallet connects
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
      
      // Try with default endpoint as fallback
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
      // Refresh balance before minting
      await checkBalance();

      // Proceed with minting even with low balance - the transaction might still succeed
      console.log("Starting NFT minting process...");
      
      // Convert image to base64
      const imageDataUrl = await toBase64(image);
      console.log("Image converted to base64");

      // Create bundlr uploader with proper configuration
      console.log("Creating bundlr uploader with endpoint:", endpoint);
      const bundlrUploader = createBundlrUploader(umi);
      
      // Upload metadata to Arweave via Bundlr
      console.log("Uploading metadata...");
      const uri = await bundlrUploader.uploadJson({
        name,
        description,
        image: imageDataUrl,
      });
      console.log("Metadata uploaded, URI:", uri);

      // Create NFT
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
        sellerFeeBasisPoints: percentAmount(5), // 5%
      }).sendAndConfirm(umi);

      console.log("NFT created. Signature:", signature);
      toast.success(`NFT minted successfully! Mint address: ${mint.publicKey}`);
    } catch (error) {
      console.error('Error minting NFT:', error);
      let errorMessage = 'Failed to mint NFT. ';
      
      if (error instanceof Error) {
        errorMessage += error.message;
        
        // Provide more helpful messages for common errors
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
    <Card className="w-full bg-white/10 backdrop-blur-md border-white/20 hover:border-primary/30 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-xl bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">Mint New NFT</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nft-name" className="text-sm text-gray-300">NFT Name</Label>
              <Input
                id="nft-name"
                type="text"
                placeholder="Enter NFT name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white/5 border-white/20 focus:border-[#b037d3]/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nft-description" className="text-sm text-gray-300">NFT Description</Label>
              <Textarea
                id="nft-description"
                placeholder="Enter NFT description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="bg-white/5 border-white/20 focus:border-[#b037d3]/50"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-sm text-gray-300">Wallet Balance</Label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={checkBalance}
                  className="bg-white/5 border-white/20 hover:bg-[#b037d3]/10 hover:border-[#b037d3]/30"
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  Check Balance
                </Button>
              </div>
              <p className="text-sm font-medium text-gray-200">
                {walletBalance !== null ? `${walletBalance.toFixed(4)} SOL` : 'Click "Check Balance" to view'}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm text-gray-300">NFT Image</Label>
              <div
                {...getRootProps()}
                className={`p-4 border-2 border-dashed rounded-md text-center cursor-pointer transition-colors h-40 bg-white/5
                            ${isDragActive ? 'border-[#b037d3] bg-[#b037d3]/10' : 'border-white/20 hover:border-[#b037d3]/30'}`}
              >
                <input {...getInputProps()} />
                {image ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-sm text-gray-200">{image.name}</p>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center space-y-2">
                    <Upload className="h-8 w-8 text-gray-400" />
                    <p className="text-sm text-gray-400">Drag & drop an image here, or click to select</p>
                  </div>
                )}
              </div>
            </div>
            <Button
              onClick={mintNFT}
              disabled={!name || !description || !image || isLoading || !wallet.publicKey}
              className="w-full "
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isLoading ? 'Minting...' : 'Mint NFT'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}