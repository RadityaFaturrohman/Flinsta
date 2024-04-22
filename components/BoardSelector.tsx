"use client"

import { dummyAlbums } from '@/dummy/dummyData';
import { AnimatePresence, MotionProps, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react'
import { Button } from './ui/Button';
import Image from 'next/image';
import { ChevronDown, Lock, LockKeyhole } from 'lucide-react';
import { Board, Photo, Pin, PinOnBoards, User } from '@prisma/client';

interface ButtonProps {
  value: Board
  & {
    Pins: PinOnBoards & {
      photos: any;
      pin: Pin & {
        photos: Photo[]
      }
    }[];
  };
  onSelect: (board: Board) => void;
}

const BoardSelector = ({ value, onSelect }: ButtonProps) => {
  const [isShow, setIsShow] = useState(false)

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
      <div className='flex flex-col gap-1'>
        <label htmlFor={'select'} className='text-dark text-opacity-65 text-xs font-medium tracking-wide cursor-pointer ml-1'>Board</label>
        <button
          id='select'
          onClick={() => setIsShow(prev => !prev)}
          className="focus:outline-none focus:ring p-2 border-2 border-dark border-opacity-15 rounded-xl pl-3 font-medium text-dark hover:border-opacity-35 transition-all tracking-wide text-sm flex items-center text-opacity-45 justify-between"
        >
          {value ? (
            <div className='flex items-center gap-2.5'>
              <Image
                src={value.Pins[0].photos[0]}
                alt=''
                width={0}
                height={0}
                sizes='100vw'
                style={{ objectFit: 'cover' }}
                className='w-10 h-10 rounded-lg'
              />

              <p className='tracking-wide text-dark text-sm font-semibold'>{value.name}</p>
            </div>
          ) : (
            <p>Add to board</p>
          )}
          <ChevronDown />
        </button>
      </div>

      <AnimatePresence>
        {isShow && (
          <motion.div {...optionAnimation} className='absolute mt-2 rounded-xl bg-white shadow-lg' ref={contentRef}>
            <div className='p-2 py-3 flex flex-col gap-2 w-80 max-h-40 overflow-y-auto'>
              <p className='text-dark text-opacity-65 text-xs font-medium px-2'>Your Boards</p>
              {dummyAlbums.map((item, index) => (
                <Button
                  key={index}
                  onClick={() => {
                    onSelect(item)
                    setIsShow(false);
                  }}
                  className='group text-dark text-sm font-semibold py-2 bg-dark bg-opacity-0 hover:bg-opacity-5 text-left px-2 rounded justify-start flex items-center gap-2.5 tracking-wide'>
                  <Image
                    src={item.Pins[0].photos[0]}
                    alt=''
                    width={0}
                    height={0}
                    sizes='100vw'
                    style={{ objectFit: 'cover' }}
                    className='w-10 h-10 rounded-lg'
                  />

                  <p>{item.name}</p>

                  {item.privacy === 'private' && (
                    <Lock strokeWidth={3} className='text-dark ml-auto mr-1.5 w-4 h-4 transition-all duration-100' />
                  )}
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default BoardSelector