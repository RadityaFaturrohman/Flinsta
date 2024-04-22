"use client"

import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { twMerge } from 'tailwind-merge'
import SearchHistory from './SearchHistory'
import { cn } from '@/utils/utils'

const SearchBar = () => {
  const [search, setSearch] = useState < string > ('');
  const [isActive, setIsActive] = useState < boolean > (false);

  const clearSearch = () => {
    search.length && setSearch('');
  }

  return (
    <div className='relative flex-1'>
      <div className={cn('py-2 px-4 rounded-full bg-dark bg-opacity-5 w-full flex flex-row items-center gap-2 transition-all hover:bg-opacity-10', isActive && 'bg-opacity-10')}>
        <Icon icon='iconamoon:search' className='text-xl text-dark text-opacity-75 group-active:text-opacity-100' />
        <input
          type="text"
          placeholder='Seach'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setIsActive(true)}
          onBlur={() => setIsActive(false)}
          className='w-full h-full py-1 font-normal text-sm outline-none border-none bg-transparent text-dark placeholder:font-normal group'
        />
        <motion.button
          whileTap={{ scale: .95 }}
          onClick={() => clearSearch()}
          className={twMerge('p-1 opacity-0 transition-all cursor-default hidden', search.length && 'opacity-70 hover:opacity-100 cursor-pointer flex')}
        >
          <Icon icon='ic:round-close' className='text-lg text-dark' />
        </motion.button>
      </div>

      <SearchHistory isActive={isActive} />
    </div>
  )
}

export default SearchBar