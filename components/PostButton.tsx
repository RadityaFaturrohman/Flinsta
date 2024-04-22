"use client";

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link';
import { Icon } from '@iconify/react'
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { UseModal } from '@/hooks/useModal';
import Auth from './Modals/Auth';

const PostButton = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const menuRef = useRef<any>(null);
  const [menuHeight, setMenuHeight] = useState(0);

  useEffect(() => {
    setMenuHeight(menuRef.current?.clientHeight);
  }, [menuHeight]);

  const menu = {
    closed: {
      height: 0,
      transition: {
        type: 'linear',
        duration: .4
      }
    },
    open: {
      height: menuHeight,
      transition: {
        type: 'linear',
        duration: .4,
      }
    }
  }

  const menuItem = {
    closed: { opacity: 0, x: -5, transition: { type: 'linear', duration: .3 } },
    open: { opacity: 1, x: 0, transition: { type: 'linear', duration: .3 } },
  }

  const MotionLink = motion(Link);

  const { openModal } = UseModal();

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsExpanded(prev => !prev)}
        className='flex flex-row items-center w-full px-[15px] py-3 gap-2 rounded-md bg-light-grey bg-opacity-0 hover:bg-opacity-40 transition-all group'
      >
        <Icon icon='ic:round-add' className='text-dark text-xl group-hover:scale-105' />
        <p className='text-dark text-sm font-medium'>Create</p>
        <Icon icon='ion:chevron-down' className={twMerge('text-dark text-sm ml-auto transition-all duration-300', isExpanded && 'rotate-180')} />
      </motion.button>

      <motion.div animate={isExpanded ? 'open' : 'closed'} variants={menu} className='relative w-full px-[25px] overflow-hidden'>
        <motion.div ref={menuRef} className='absolute gap-1.5 flex-col flex border-l-2 border-l-light-grey px-3 w-11/12'>
          <MotionLink variants={menuItem} href='/pin-tool' className='py-1.5 bg-dark bg-opacity-0 hover:bg-opacity-5 px-2 rounded'>
            <p className='text-dark text-[13px] font-medium'>Create Pin</p>
          </MotionLink>

          <motion.button onClick={() => openModal(<Auth />)} variants={menuItem} className='text-dark text-[13px] font-medium py-1.5 bg-dark bg-opacity-0 hover:bg-opacity-5 text-left px-2 rounded'>
            Create Board
          </motion.button>
        </motion.div>
      </motion.div>
    </>
  )
}

export default PostButton