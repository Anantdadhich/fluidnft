"use client"
import { useState } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'



import { Transaction } from '@solana/web3.js'
import axios from 'axios'
import { trackEvent, trackException } from '@/lib/analytics'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { getSwapQuote } from '@/lib/jupiterapi'
import { getNFTPrice } from '@/lib/tensorapi'
import { Button } from './ui/button'


interface NFT {
  mint: string;
}

interface SwapButtonProps {
  selectedNFT: NFT;
  selectedToken: string;
}

export default function SwapButton({ selectedNFT, selectedToken }: SwapButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { publicKey, signTransaction } = useWallet()
  const { connection } = useConnection()

  const handleSwap = async () => {
    if (!publicKey || !signTransaction) {
      toast.error('Wallet not connected')
      trackEvent('Swap Attempt', { error: 'Wallet not connected' })
      return
    }
    if (!selectedNFT || !selectedToken) {
      toast.error('Please select an NFT and a token')
      trackEvent('Swap Attempt', { error: 'NFT or token not selected' })
      return
    }

    setIsLoading(true)
    try {
      const nftPrice = await getNFTPrice(selectedNFT.mint)
      if (!nftPrice) {
        throw new Error('Failed to get NFT price')
      }

      const swapQuote = await getSwapQuote('SOL', selectedToken, nftPrice)
      if (!swapQuote) {
        throw new Error('Failed to get swap quote')
      }

      const response = await axios.post('https://quote-api.jup.ag/v4/swap', {
        quoteResponse: swapQuote,
        userPublicKey: publicKey.toBase58(),
        wrapUnwrapSOL: true
      })

      const { swapTransaction } = response.data
      if (!swapTransaction) {
        throw new Error('Failed to create swap transaction')
      }

      const transaction = Transaction.from(Buffer.from(swapTransaction, 'base64'))
      const signedTransaction = await signTransaction(transaction)
      const txid = await connection.sendRawTransaction(signedTransaction.serialize())

      console.log(`Transaction sent: https://explorer.solana.com/tx/${txid}`)
      trackEvent('Swap Completed', {
        nftMint: selectedNFT.mint,
        toToken: selectedToken,
        amount: nftPrice
      })
      toast.success(`Swap completed successfully. Transaction ID: ${txid}`)
    } catch (error) {
      console.error('Swap failed:', error)
      const errorMessage = error instanceof Error ? error.message : 'Swap failed due to an unknown error'
      toast.error(errorMessage)
      trackException(errorMessage, false)
      trackEvent('Swap Failed', { error: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      className=" flex items-start justify-start rounded-lg my-6"
    >
      <Button
        onClick={handleSwap}
        className="font-bold py-6 px-6 rounded-lg transition duration-300 ease-in-out transform "
        disabled={!publicKey || !selectedNFT || !selectedToken || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className='animate-spin mr-2'/>
            Swapping NFT ...
          </>
        ) : 'Swap NFT'}
      </Button>
    </motion.div>
  )
}