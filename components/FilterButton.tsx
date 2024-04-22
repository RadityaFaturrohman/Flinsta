"use client"

import React, { useEffect, useRef, useState } from 'react'
import { Button } from './ui/Button';
import { ArrowDownUp } from 'lucide-react';
import { motion, AnimatePresence, MotionProps } from 'framer-motion';
import { cn } from '@/utils/utils';

interface ButtonProps {
  position?: 'left' | 'right'
}

const FilterButton = ({ position = 'left' }: ButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isShow, setIsShow] = useState(false);

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
      <Button ref={buttonRef} onClick={() => setIsShow(prev => !prev)} className='group bg-slate-100 flex items-center gap-1.5 border border-dark border-opacity-45 rounded-lg py-1.5 px-2.5 hover:border-opacity-75 hover:bg-opacity-0 duration-300 transition-all'>
        <p className='font-bold text-xs text-dark text-opacity-45 group-hover:text-opacity-75 transition-all'>Sort by</p>
        <ArrowDownUp className='size-3.5 text-dark text-opacity-45 group-hover:text-opacity-75 transition-all' />
      </Button>

      <AnimatePresence>
        {isShow && (
          <motion.div {...optionAnimation} ref={contentRef} className={cn('absolute bg-white rounded-xl shadow border border-light-grey mt-2', `${position}-0`)}>
            <div className='w-64 p-4'>
              <p className='text-xs text-dark opacity-45 font-medium'>Sort by</p>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FilterButton