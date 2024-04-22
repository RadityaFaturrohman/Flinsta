"use client"

import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Icon } from '@iconify/react/dist/iconify.js';
import Link from 'next/link';

type SearchHistoryType = {
  isActive: boolean
}

const SearchHistory: React.FC<SearchHistoryType> = ({ isActive }) => {
  const searchHistory = ['Makima', 'Outfit', "Dazai bar"];

  const searchByHistory = (query: string) => {

  }

  return (
    <AnimatePresence>
      {isActive && searchHistory.length && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { type: 'linear' } }} exit={{ opacity: 0, transition: { type: 'linear' } }} className='absolute w-full py-2 bg-light shadow-lg mt-2 transition-all rounded-lg'>
          {searchHistory.map((item, index) => (
            <Link href='/discover' key={index} className='w-full py-1.5 px-3.5 flex items-center gap-2 justify-between bg-dark bg-opacity-0 hover:bg-opacity-5'>
              <p className='text-xs text-dark font-semibold'>{item}</p>
              <button>
                <Icon icon='ic:round-close' className='text-lg text-primary' />
              </button>
            </Link>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SearchHistory