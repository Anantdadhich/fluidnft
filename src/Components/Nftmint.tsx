import { createUmi, generateSigner, keypairIdentity, percentAmount } from "@metaplex-foundation/umi";
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, SystemProgram } from "@solana/web3.js"
import { createNft, fetchDigitalAsset, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { Card } from "./ui/card";
import { useState } from "react";


async function createnft(name:string,symbol:string,imageurl:string){
      
 try {
  const connection=new Connection(clusterApiUrl("devnet"))

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

   
 
   const [name,setname]=useState('');
   const [symbol,setsymbol]=useState('');
   const [image,setimage]=useState<File|null>(null);
   const [imageurl,setimageurl]=useState<string>("");

   const handlenftmint=async()=>{
         if(!name || !symbol || !imageurl){
          alert("please fill details")
          return ;
         }

        await createnft(name,symbol,imageurl)
   }




 return (
  <div className="containert">
    <Card className="">
    <h1 className="text-xl font-bold">Create an NFT</h1>
        

    </Card>

  </div>
)

}