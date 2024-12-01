"use client"
import React from 'react';
import sol from "../../public/sol.svg";
import usdc from "../../public/usdc.svg";
import circle from "../../public/circle-scribble.svg";
import usdt from "../../public/usdt.svg";
import Image from 'next/image'


import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { RainbowButton } from '@/Components/magicui/MagicButton';

const itemVariants = {
    hidden: { opacity: 0, y: -30, filter: "blur(10px)" },
    visible: (custom: number) => ({
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            duration: 1.4,
            delay: custom * 0.2, // 0.2 seconds delay multiplied by the custom value
        },
    }),
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: (custom: number) => ({
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delay: custom * 1
        },
    }),
}

const floatVariants = {
    hidden: { opacity: 0, scale: 0.5, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
    float: {
        y: [-20, 20],
        transition: {
            y: {
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
            }
        }
    }
};

const ExploreButton = () => {
    const router = useRouter();

    const handleClick = () => {
        router.push('/swap');
    };


    return (
        <button
            onClick={handleClick}
            className="overflow-hidden relative w-40 p-2 h-12 bg-primary text-background border-none rounded-md text-lg font-bold cursor-pointer z-10 group"
        >
          Swap NFT
            <span
                className="absolute w-44 h-32 -top-8 -left-2 bg-purple-200 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-500 duration-1000 origin-bottom"
            ></span>
            <span
                className="absolute w-44 h-32 -top-8 -left-2 bg-purple-400 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-700 duration-700 origin-bottom"
            ></span>
            <span
                className="absolute w-44 h-32 -top-8 -left-2 bg-purple-600 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-1000 duration-500 origin-bottom"
            ></span>
            <span
                className="group-hover:opacity-100 text-white text-center group-hover:duration-1000 duration-100 opacity-0 absolute top-2.5 left-10 z-10"
            >
                Click me!
            </span>
        </button>
    );
};

export default function Home() {
    return (
        <motion.main
            className='relative mb-[18rem] h-fit'
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div className='absolute opacity-80 dark:opacity-30 left-[50%] translate-x-[-50%] -bottom-[20rem] -z-[20] size-[3rem] md:size-[12rem] overflow-hidden rounded-full bg-gradient-to-t from-purple-400 to-purple-700 blur-[8em]'>
            </div>
            <div className='absolute opacity-80 dark:opacity-30 left-[15rem] translate-x-[-50%] -bottom-[12rem] -z-[20] size-[3rem] md:size-[14rem] overflow-hidden rounded-full bg-gradient-to-t from-blue-400 to-blue-700 blur-[8em]'>
            </div>
            <div className='absolute opacity-80 dark:opacity-30 right-[3rem]  -bottom-[10rem] -z-[20] size-[3rem] md:size-[12rem] overflow-hidden rounded-full bg-gradient-to-t from-green-400 to-green-700 blur-[8em]'>
            </div>

            <motion.section
                className=' my-4'

            >
                <aside className='flex relative flex-col items-center justify-start mt-12 border-red-500 h-[100vh] max-h-fit pb-7'>
                   
                    <motion.div
                        className='flex flex-col my-4 gap-4 px-2 text-center  items-center justify-center'
                        variants={itemVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.8 }}
                    >

                        <div className='w-full flex flex-col px-2 text-center items-center justify-center pt-6'>
                            <h1 className='text-4xl md:text-5xl font-extrabold lg:text-6xl'>Turn your NFTs into</h1>
                            <div className='w-fit relative'>
                                <h1 className='text-4xl z-[100] md:text-5xl font-extrabold lg:text-6xl '>Instant Tokens</h1>
                           
                            </div>
                        </div>

                        <p className='font-normal w-full md:w-[60%] dark:text-gray-300 text-xs md:text-base'>Unlock liquidity instantly by swapping your Solana NFTs for any SPL token be it USDC or USDT, at the best available price.</p>
                    </motion.div>


                    <div className='flex items-center gap-4 my-8'>
                        <ExploreButton />
                   
                    </div>
                    <motion.div
                        className='w-[7rem] h-[7rem] lg:w-[10rem] lg:h-[10rem] p-6 lg:p-6 bg-background/1 backdrop-blur-xl shadow-xl drop-shadow-[10px_16px_50px_#2874ca] rounded-full absolute top-[400px] lg:top-52 left-8 lg:left-52'
                        variants={floatVariants}
                        initial="hidden"
                        animate={["visible", "float"]}
                        transition={{
                            visible: { duration: 0.5 },
                        }}
                    >
                        <Image className='size-full' src={usdc} width={500} height={500} alt='sol' />
                    </motion.div>
                    <motion.div
                        className='w-[7rem] h-[7rem] lg:w-[10rem] lg:h-[10rem] p-6 lg:p-8 bg-background/1 backdrop-blur-xl shadow-xl drop-shadow-[10px_16px_50px_#b037d3] rounded-full absolute top-[550px] lg:top-[400px] lg:right-[500px]'
                        variants={floatVariants}
                        initial="hidden"
                        animate={["visible", "float"]}
                        transition={{
                            visible: { duration: 0.5 },
                        }}
                    >
                        <Image className='size-full' src={sol} width={500} height={500} alt='sol' />
                    </motion.div>
                    <motion.div
                        className='w-[7rem] h-[7rem] lg:w-[10rem] lg:h-[10rem] p-6 lg:p-6 bg-background/1 backdrop-blur-xl shadow-xl drop-shadow-[10px_16px_50px_#52af95] rounded-full absolute top-[410px] lg:top-40 right-8 lg:right-48'
                        variants={floatVariants}
                        initial="hidden"
                        animate={["visible", "float"]}
                        transition={{
                            visible: { duration: 0.5 },
                        }}
                    >
                        <Image className='size-full' src={usdt} width={500} height={500} alt='sol' />
                    </motion.div>
                </aside>
            </motion.section>
        </motion.main>
    )
}