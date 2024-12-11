import { createUmi, generateSigner, keypairIdentity, percentAmount } from "@metaplex-foundation/umi";
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, SystemProgram } from "@solana/web3.js"
import { createNft, fetchDigitalAsset, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { Card, CardContent } from "./ui/card";
import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

  

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





export const Nftmint= ()=>{

   
    const wallet=useWallet();
   const [name,setname]=useState('');
   const [symbol,setsymbol]=useState('');
   const [image,setimage]=useState<File|null>(null);
   const [imageurl,setimageurl]=useState<string>("  ");
   const [walletbalance,setwalletbalance]=useState<number|null>(null);

   const handlenftmint=async()=>{
         if(!name || !symbol || !imageurl){
          alert("please fill details")
          return ;
         }

        await createnft(name,symbol,imageurl)
   }


const getBalance=async ()=>{
    if(!wallet.publicKey){
    return 
   }
 try {
   const balance=await connection.getBalance(wallet.publicKey);
  setwalletbalance(balance /LAMPORTS_PER_SOL);
 } catch (error) {
    alert("connect wallet");
    console.log(error)
 }
}







   const fileupload=(e:React.ChangeEvent<HTMLInputElement>)=>{
const file=e.target.files?.[0];

if(file) {
  setimage(file)


const reader=new FileReader()

reader.onloadend=()=>{
     setimageurl(reader.result as string)
}
reader.readAsDataURL(file)
   }

  }

 return (
  
  <Card className="w-full max-w-md mx-auto bg-gray-950 shadow-lg rounded-lg overflow-hidden">
  <CardContent className="space-y-6 p-6">
    <div className="space-y-6">

      <div className="space-y-2">
        <label htmlFor="name" className="block text-gray-300 text-sm font-medium">
          NFT Name
        </label>
        <input
          id="name"
          type="text"
          className="w-full p-3 bg-gray-900 text-gray-200 border border-gray-700 rounded focus:outline-none focus:ring focus:ring-indigo-500"
          value={name}
          placeholder="Enter NFT name"
          onChange={(e) => setname(e.target.value)}
        />
      </div>

  
      <div className="space-y-2">
        <label htmlFor="symbol" className="block text-gray-300 text-sm font-medium">
          Symbol
        </label>
        <input
          id="symbol"
          type="text"
          className="w-full p-3 bg-gray-900 text-gray-200 border border-gray-700 rounded focus:outline-none focus:ring focus:ring-indigo-500"
          value={symbol}
          placeholder="Enter symbol"
          onChange={(e) => setsymbol(e.target.value)}
        />
      </div>


      <div className="space-y-2">
        <label htmlFor="image" className="block text-gray-300 text-sm font-medium">
          Image Upload
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          className="w-full bg-gray-900 text-gray-400 border border-gray-700 rounded file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-gray-300 hover:file:bg-gray-700"
          onChange={fileupload}
        />
      </div>

      <div className="mt-4">
        <button
          onClick={handlenftmint}
          className="w-full py-3 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 transition-all"
        >
          Create
        </button>
      </div>
    </div>
  </CardContent>
</Card>


  
)

}