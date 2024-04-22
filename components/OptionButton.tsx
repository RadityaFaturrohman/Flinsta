"use client";

import React, { useEffect, useRef, useState } from 'react'
import { Button } from './ui/Button'
import { Ellipsis } from 'lucide-react';
import { AnimatePresence, MotionProps, motion } from 'framer-motion';
import { Link } from './ui/Link';
import { cn } from '@/utils/utils';

interface ButtonProps {
  variant?: 'default' | 'darken'
}

const OptionButton = ({ variant = 'default' }: ButtonProps) => {
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

  const variants = {
    default: {
      button: "bg-[#f7f7f7] bg-opacity-100",
      icon: 'text-dark text-opacity-65 group-hover:text-opacity-100'
    },
    darken: {
      button: "bg-dark bg-opacity-5 group hover:bg-opacity-10 duration-200 active:bg-opacity-100",
      icon: 'text-dark group-active:text-white'
    }
  }

  return (
    <div className="relative">
      <Button
        variant={'icon'}
        size={'iconBig'}
        className={cn('group', variants[variant].button)}
        ref={buttonRef}
        onClick={() => setIsShow(prev => !prev)}
      >
        <Ellipsis className={cn('w-6 h-6 transition-all', variants[variant].icon)} />
      </Button>

      <AnimatePresence>
        {isShow && (
          <motion.div {...optionAnimation} className='absolute border border-light-grey rounded-lg shadow-md' ref={contentRef}>
            <div className='flex flex-col gap-1 p-3 bg-white w-36'>
              <Link href='' className='text-sm'>Download Image</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default OptionButton