"use client"

import { UseUser } from '@/hooks/useUser'
import { AnimatePresence, motion, MotionProps, Variants } from "framer-motion";
import { Icon } from '@iconify/react/dist/iconify.js';
import Image from 'next/image'
import React, { useState } from 'react'

const UserProfile = () => {
  const { user } = UseUser();

  const [isShown, setIsShown] = useState < boolean > (false);

  const menuTransition = {
    initial: { y: -14, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'linear',
        duration: .4,
        delayChildren: .2,
        staggerChildren: .03
      }
    },
    exit: {
      y: -14,
      opacity: 0,
      transition: {
        type: 'linear',
        duration: .4
      }
    }
  } satisfies MotionProps;

  const itemMenu = {
    variants: {
      closed: {
        opacity: 0,
        transition: {
          type: 'linear',
          duration: .4,
        }
      },
      open: {
        opacity: 1,
        transition: {
          type: 'linear',
          duration: .4,
        }
      }
    },
    transition: { opacity: { duration: 0.2 } },
  } satisfies MotionProps;

  return (
    <div className='relative'>
      <AnimatePresence>
        {isShown && (
          <motion.div
            {...menuTransition}
            className='absolute w-[210px] bg-light shadow-lg z-[1] left-1 bottom-[84px] p-2 rounded-md'
          >
            <motion.button {...itemMenu} className='w-full py-2 text-dark font-semibold text-xs bg-dark bg-opacity-0 hover:bg-opacity-5 transition-all text-left rounded px-2'>Add an existing account</motion.button>
            <motion.button {...itemMenu} className='w-full py-2 text-dark font-semibold text-xs bg-dark bg-opacity-0 hover:bg-opacity-5 transition-all text-left rounded px-2'>Log out</motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className='flex py-5 mt-auto w-full border-light-grey flex-row items-center gap-2.5 pl-4 pr-2'>
        <div className='relative w-9 h-9 rounded-full'>
          <Image
            src={user?.avatar ?? '/default_avatar.png'}
            alt='User Avatar'
            fill
            objectFit='cover'
            className='rounded-full object-cover'
          />
        </div>

        <div className=''>
          <p className='font-semibold text-[13px] text-dark'>{user?.name ?? 'Fell'}</p>
          <p className='-mt-1 font-medium text-xs text-[#b5b5b5]'>@{user?.username ?? 'iyhmh'}</p>
        </div>

        <motion.button
          whileTap={{ scale: .95 }}
          className='ml-auto p-1'
          onBlur={() => setIsShown(false)}
          onClick={() => setIsShown(show => !show)}
        >
          <Icon icon='iwwa:option' className='text-dark text-lg text-opacity-75' />
        </motion.button>
      </div>
    </div>
  )
}

export default UserProfile