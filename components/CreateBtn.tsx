"use client"

import React, { useEffect, useRef, useState } from 'react'
import { Button } from './ui/Button'
import { Icon } from '@iconify/react/dist/iconify.js'
import { motion, AnimatePresence, MotionProps } from 'framer-motion'
import { Link } from './ui/Link'
import { UseModal } from '@/hooks/useModal'
import CreateBoard from './Modals/CreateBoard'

const CreateBtn = () => {
  const [isActive, setIsActive] = useState<boolean>(false)
  const buttonRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { openModal } = UseModal()

  const optionAnimation = {
    initial: {
      width: 0,
      height: 0,
      opacity: 0,
    },
    animate: {
      width: 'auto',
      height: 'auto',
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.2,
        duration: 0.35
      },
    },
    exit: {
      width: 0,
      height: 0,
      opacity: 0,
      transition: {
        type: "spring",
        bounce: 0,
        duration: 0.35
      },
    }
  } satisfies MotionProps;

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        contentRef.current &&
        !contentRef.current.contains(event.target as Node)
      ) {
        setIsActive(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div className='relative'>
      <Button 
        onClick={() => setIsActive(prev => !prev)}
        variant={'ghost'} 
        className='px-5 py-2 bg-black bg-opacity-5 hover:bg-opacity-10'
        ref={buttonRef}
      >
        <Icon icon='ic:round-plus' className='text-black text-opacity-75' />
        Create
      </Button>

      <AnimatePresence>
        {isActive && (
          <motion.div 
            {...optionAnimation} 
            className='absolute left-0 mt-2 rounded-xl bg-white shadow-lg overflow-hidden border border-light-grey'
            ref={contentRef}
          >
            <div className='flex flex-col gap-1 w-32'>
              <Link href='/pin-creator' className='w-full text-dark text-[13px] font-semibold py-2 bg-dark bg-opacity-0 hover:bg-opacity-5 text-left px-4 rounded justify-start'>
                Create Pin
              </Link>

              <Button onClick={() => openModal(<CreateBoard />)} className='w-full text-dark text-[13px] font-semibold py-2 bg-dark bg-opacity-0 hover:bg-opacity-5 text-left px-4 rounded justify-start'>
                Create Board
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CreateBtn