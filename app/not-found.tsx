"use client"

import { Link } from '@/components/ui/Link';
import { ArrowLeft } from 'lucide-react';
import { Player } from "@lottiefiles/react-lottie-player";
import React from 'react'

const NotFound = () => {
  return (
    <div className='flex gap-0 items-center justify-center w-full bg-light'>
      <div className='flex flex-col gap-4 w-1/3'>
        <p className='font-poppins text-3xl font-extrabold text-dark text-opacity-65'>Oh snap!</p>
        <p className='font-poppins text-[13px] font-semibold tracking-wide text-dark text-opacity-50 leading-relaxed'>
          Something went wrong with this page. <br />
          You can keep watching this Shiba Inu <br />
          eating his ramen or go back home <br />
          and take it from scratch.
        </p>
        <Link variant={'raw'} href='/' className='group flex items-center gap-1.5 w-fit rounded-lg border border-dark border-opacity-15 hover:border-opacity-25 border-b-2 duration-300 bg-white shadow-sm p-2.5 mt-2 font-bold tracking-wide text-sm text-opacity-50 transition-all'>
          <ArrowLeft strokeWidth={2.5} className='text-dark text-opacity-50 size-4 group-hover:text-opacity-75 transition-all' />
          Back to Home
        </Link>
      </div>

      <Player
        src={'/shiba.json'}
        autoplay
        loop
        speed={.5}
      />
    </div>
  )
}

export default NotFound;