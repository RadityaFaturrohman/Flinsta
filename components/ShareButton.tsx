"use client";

import React, { useEffect, useRef, useState } from 'react'
import { Button } from './ui/Button'
import { Send } from 'lucide-react'
import { cn } from '@/utils/utils'
import { motion, AnimatePresence, MotionProps } from 'framer-motion'
import { FacebookShareButton, FacebookIcon, TwitterIcon, TwitterShareButton  } from 'react-share'

interface ButtonProps {
  withLabel?: boolean
  label?: 'Pin' | 'User' | 'Board'
  position?: 'left' | 'right'
}

const ShareButton = ({ withLabel = false, label = 'Pin', position = 'right' }: ButtonProps) => {
  const [isShow, setIsShow] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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
        setIsShow(false);
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
        variant={'icon'}
        size={withLabel ? 'default' :'iconBig'}
        onClick={() => setIsShow(prev => !prev)}
        className='bg-[#f7f7f7] group bg-opacity-100 gap-1.5 flex items-center'
        ref={buttonRef}
      >
        <Send className={cn('w-5 h-5 text-dark text-opacity-65 group-hover:text-opacity-100 transition-all')} />

        {withLabel && (
          <p className='font-bold text-xs text-dark text-opacity-65 group-hover:text-opacity-100 transition-all'>Share</p>
        )}
      </Button>

      <AnimatePresence>
        {isShow && (
          <motion.div {...optionAnimation} className={cn('absolute mt-2')} ref={contentRef}>
            <div className='flex flex-col p-3 bg-white rounded-xl border-light-grey shadow gap-8 w-40'>
              <p className='text-dark font-medium text-[13px]'>Share</p>

              <div className='flex flex-col items-start justify-start'>
                <TwitterShareButton url='' className='flex items-center gap-2'>
                  <TwitterIcon className='w-5 h-5 rounded-full' />
                  <p className='text-dark font-medium text-xs'>Twitter</p>
                </TwitterShareButton>
                <FacebookShareButton url='' className='flex items-center gap-2'>
                  <FacebookIcon className='w-5 h-5 rounded-full' />
                  <p className='text-dark font-medium text-xs'>Facebook</p>
                </FacebookShareButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ShareButton