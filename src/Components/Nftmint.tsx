"use client"
import { useState } from "react";
import { RainbowButton } from "./magicui/MagicButton";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ImageIcon, Upload } from "lucide-react";

const Nftmint = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e:any) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Mint Your NFT</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
    
        <div className="space-y-2">
          <Label htmlFor="nft-image">NFT Image</Label>
          <div className="relative">
            <Input
              id="nft-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <div 
              className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => document.getElementById('nft-image').click()}
            >
              {previewUrl ? (
                <div className="relative aspect-square w-full max-w-[200px] mx-auto">
                  <img
                    src={previewUrl}
                    alt="NFT Preview"
                    className="rounded-lg object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="py-8 flex flex-col items-center gap-2 text-muted-foreground">
                  <Upload className="w-8 h-8" />
                  <p>Click to upload image</p>
                  <p className="text-sm">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
            </div>
          </div>
        </div>

       
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nft-name">NFT Name</Label>
            <Input
              id="nft-name"
              type="text"
              placeholder="Enter NFT name"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nft-description">NFT Description</Label>
            <Input
              id="nft-description"
              type="text"
              placeholder="Enter NFT Description"
              className="w-full"
            />
          </div>

          <RainbowButton className="w-full">
            {selectedFile ? "Mint NFT" : "Select Image to Mint"}
          </RainbowButton>
        </div>
      </CardContent>
    </Card>
  );
};

export default Nftmint;