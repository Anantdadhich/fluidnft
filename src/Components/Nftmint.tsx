/*
const connection=new Connection(clusterApiUrl("devnet"))

async function createnft(name:string,symbol:string,imageurl:string){
      
 try {


 const user=Keypair.generate();
 const fromairdropSig=await connection.requestAirdrop(user.publicKey,LAMPORTS_PER_SOL)

 console.log(`the key pair ${user.publicKey.toBase58()}`)


//@ts-ignore
 const umi=createUmi(clusterApiUrl("devnet"))

 const keypair=umi.eddsa.createKeypairFromSecretKey(user.secretKey);

 const signer=keypairIdentity(keypair)

 umi.use(signer)
 umi.use(mplTokenMetadata())

 const mint =generateSigner(umi)

 const {signature}=await createNft(umi,{
  name:name,
  symbol:symbol,
  mint:mint,
  uri:imageurl,
  sellerFeeBasisPoints:percentAmount(0),
  creators:[
    {
      address:keypair.publicKey,
      verified:true,
      share:100 
    }
  ],

 }).sendAndConfirm(umi)
 console.log(`NFT created success ${signature}`) ;

 
 const createdNft=await fetchDigitalAsset(umi,mint.publicKey)
console.log("nft creaated ",createdNft)  
 } catch (error) {
     console.log("Error creating ",error)
 }
}

*/
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { createUmi, generateSigner, percentAmount } from "@metaplex-foundation/umi";
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { useWallet } from "@solana/wallet-adapter-react";
import { motion } from "framer-motion";
import { PlusCircle, Upload } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { useDropzone } from "react-dropzone";
import { createBundlrUploader } from '@metaplex-foundation/umi-uploader-bundlr';

export const Nftmint = () => {
  const wallet = useWallet();
  const [name, setName] = useState('');
  const [description, setdescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [walletBalance, setwalletBalance] = useState<number|null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const network = WalletAdapterNetwork.Devnet;

  const endpoint = useMemo(() => {
    if (network === WalletAdapterNetwork.Devnet) {
      const quicknodeurl = process.env.NEXT_PUBLIC_QUICKNODE_URL;
      const quicknodeapikey = process.env.NEXT_PUBLIC_QUICKNODE_API_KEY; // Fixed variable name

      if (quicknodeapikey && quicknodeurl) {
        return `${quicknodeurl}/${quicknodeapikey}`;
      }
      return clusterApiUrl(network);
    }
    return clusterApiUrl(network);
  }, [network]);

  const connection = useMemo(() => new Connection(endpoint), [endpoint]);

  const umi = useMemo(() => {
    //@ts-ignore
    const umi = createUmi(endpoint).use(mplTokenMetadata());
    if (wallet.publicKey) {
      umi.use(walletAdapterIdentity(wallet));
    }
    return umi;
  }, [endpoint, wallet]);

  useEffect(() => {
    console.log("Current endpoint", endpoint);
  }, [endpoint]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setImage(file);
  
    const preview = await toBase64(file);
    setImagePreview(preview);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    }
  });

  const checkbalance = async () => {
    if (!wallet.publicKey) return;

    try {
      const balance = await connection.getBalance(wallet.publicKey);
      setwalletBalance(balance / LAMPORTS_PER_SOL);
      console.log(`wallet balance ${balance / LAMPORTS_PER_SOL} Sol`);
    } catch (error) {
      console.error("error", error);
    }
  };

  const mintNFT = async () => {
    if (!wallet.publicKey || !image) return;
    setIsLoading(true);

    try {
      await checkbalance();
      if (walletBalance === null || walletBalance < 0.05) {
        throw new Error("Insufficient balance");
      }

      const imagedataurl = await toBase64(image);
      const bundlrUploader = createBundlrUploader(umi);

      const uri = await bundlrUploader.uploadJson({
        name,
        description,
        image: imagedataurl
      });

      const mint = generateSigner(umi);
      const { signature } = await createNft(umi, {
        mint,
        name,
        uri,
        sellerFeeBasisPoints: percentAmount(5),
      }).sendAndConfirm(umi);

      console.log("nft created ", signature);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md"
    >
      <Card className="bg-white/5 backdrop-blur-lg border-white/10 shadow-2xl">
        <CardContent className="space-y-6 p-6">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">
              Mint Your NFT
            </h2>
            <p className="text-gray-400 text-sm mt-2">
              Create a unique digital asset on Solana
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-gray-300 text-sm font-medium mb-2">
                NFT Name
              </label>
              <input
                id="name"
                type="text"
                className="w-full p-3 bg-gray-900 text-gray-200 border border-gray-700 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                value={name}
                placeholder="Enter NFT name"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-gray-300 text-sm font-medium mb-2">
                Description
              </label>
              <input
                id="description"
                type="text"
                className="w-full p-3 bg-gray-900 text-gray-200 border border-gray-700 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                value={description}
                placeholder="Enter description"
                onChange={(e) => setdescription(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Image Upload
              </label>
              <div {...getRootProps()} className="flex items-center justify-center w-full">
                <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer bg-gray-900 hover:bg-gray-800 transition-all">
                  <input {...getInputProps()} />
                  {imagePreview ? (
                    <img 
                      src={imagePreview}
                      alt="Preview" 
                      className="max-h-full max-w-full object-contain rounded-lg"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <Upload className="w-10 h-10 text-gray-500 mb-2" />
                      <p className="text-sm text-gray-400">
                        {isDragActive ? "Drop the file here" : "Click to upload or drag and drop"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, or GIF (MAX. 800x400px)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={mintNFT}
              disabled={isLoading || !image || !name || !description}
              className={`
                w-full py-3 rounded-full font-semibold transition-all flex items-center justify-center
                ${(isLoading || !image || !name || !description)
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }
              `}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">🔄</span>
                  Minting...
                </>
              ) : (
                <>
                  <PlusCircle className="mr-2 w-5 h-5" />
                  Create NFT
                </>
              )}
            </motion.button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Nftmint;