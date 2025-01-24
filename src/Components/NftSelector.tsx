import { Metaplex } from "@metaplex-foundation/js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useCallback, useEffect, useState } from "react";
import { Card, CardHeader, CardTitle } from "./ui/card";


type NFT= {
  mint: string;
  name: string;
  imageUrl?: string;
}

interface nftselectorProps{
  onSelect:(nft:NFT) =>void;
  selectedNft:NFT |null
}


export const NFTSelector=({onSelect,selectedNft}:nftselectorProps)=>{
    const [isLoading, setIsLoading] = useState(false);
     const [nfts, setNfts] = useState<NFT[]>([]);
     
     const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
     const [selectedToken, setSelectedToken] = useState<string>();
  
      const [isdialogopen,setisdialogopen]=useState(false);
     const { publicKey,  connected } = useWallet();
 
     const {connection}=useConnection();

     
 const fetchNFTs=useCallback(async()=>{
    if(!publicKey) return 

    setIsLoading(true);
    try {
      const metaplex=new Metaplex(connection)
      const nfts=await metaplex.nfts().findAllByOwner({owner:publicKey}) ;
      const nftdata=nfts.map(nft => ({
         mint:nft.address.toBase58(),
         name:nft.name,
         image:nft.json?.image || " "
      }))
      setNfts(nftdata)
    } catch (error) {
        console.log(error)
    } finally {
      setIsLoading(false)
    }

 },[publicKey,connection])
    
  

  useEffect(()=>{
     if(connected && publicKey){
         fetchNFTs()
     } else{
      setNfts([])
     }
  })
  
  const handleNFTSelect =(nft:NFT) =>{
    onSelect(nft);
    setisdialogopen(false)
  }

   return (
      <Card className="w-full md:pr-4 md:w-[50%] min-h-[20rem] max-h-fit">
        <CardHeader>
     <CardTitle className="text-xl">Choose NFT</CardTitle>
    
        </CardHeader>
 
      </Card>
   )

   
  
    
}