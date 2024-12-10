import fs from "node:fs"
import Areweave from  "arweave"
(async ()=>{
    const arewav=Areweave.init({
         host:"localhost:3000",
         port:1984,
         protocol:"http",
         timeout:2000,
         logging:false
    })


    const host=arewav.getConfig().api.host;
    const port =arewav.getConfig().api.port;
    const protocol=arewav.getConfig().api.protocol;

    

const data=fs.readFileSync("")

const transaltion =await arewav.createTransaction({
    data:data
})

transaltion.addTag("Content-Type","image/png")


const wallet=await arewav.wallets.generate();
const address=await arewav.wallets.getAddress(wallet)

console.log("add",address)


await arewav.api.get(`/mint/${encodeURI(address)}/10000000000`)
 
await arewav.transactions.sign(transaltion,wallet);

const response=await arewav.transactions.post(transaltion);


const  id =transaltion.id;

  const imageUrl = id ? `${protocol}://${host}:${port}/${id}` : null;
  console.log("imageUrl", imageUrl);
 
  const metadata = {
    name: "Custom NFT #1",
    symbol: "CNFT",
    description: "A description about my custom NFT #1",
    seller_fee_basis_points: 500,
    external_url: "https://www.customnft.com/",
    attributes: [
      {
        trait_type: "NFT type",
        value: "Custom",
      },
    ],
    collection: {
      name: "Test Collection",
      family: "Custom NFTs",
    },
    properties: {
      files: [
        {
          uri: imageUrl,
          type: "image/png",
        },
      ],
      category: "image",
      maxSupply: 0,
      creators: [
        {
          address: "CBBUMHRmbVUck99mTCip5sHP16kzGj3QTYB8K3XxwmQx",
          share: 100,
        },
      ],
    },
    image: imageUrl,
  };
 
  const metadatastring=JSON.stringify(metadata)
  const metadataTransalation=await arewav.createTransaction({
    data:metadatastring
  });


metadataTransalation.addTag("Content-Type","application/json")

await arewav.transactions.sign(metadataTransalation,wallet)

 console.log("metadata txid", metadataTransalation.id);
 
  const txnResult = await arewav.transactions.post(metadataTransalation);
 
  console.log(txnResult);


})();


