"use client";

import React from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Auth from '@/components/Modals/Auth';

const Page = () => {
  const router = useRouter();

  const backdropAnimation = {
    open: {
      opacity: 1,
      zIndex: 50,
      transition: {
        duration: .2,
        type: 'linear',
        // delayChildren: .2
      }
    }
  }

  const modalAnimation = {
    closed: {
      y: -10,
      opacity: 0,
      transition: {
        type: 'linear',
        duration: .4,
      }
    },
    open: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        bounce: 0,
        duration: .4
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={'open'}
      variants={backdropAnimation}
      exit={{ opacity: 0 }}
      className='fixed inset-0 w-full h-screen justify-center items-center flex bg-black bg-opacity-25 z-auto'
    >
      <button onClick={() => router.back()} className='w-full h-screen' style={{ backgroundColor: 'rgba(0,0,0,0.35)' }} />
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: -1 }}
        animate={'open'}
        variants={modalAnimation}
        className='absolute flex self-center z-[9999999] bg-light p-4 rounded-xl transition-all border border-[rgba(0,0,0,.5)]'
      >
        <Auth />
      </motion.div>
    </motion.div>
  )
}

export default Page