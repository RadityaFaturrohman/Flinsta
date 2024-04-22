"use client"

import { useRouter } from 'next/navigation'
import React from 'react'
import { Button } from './ui/Button'
import { Icon } from '@iconify/react'

const BackBtn = () => {
  const router = useRouter()

  return (
    <Button size={'icon'} className='group w-9 h-9 shadow-lg bg-light' onClick={() => router.back()}>
      <Icon icon="mingcute:arrow-left-line" className='text-lg text-dark text-opacity-75 group-hover:text-opacity-100 transition-opacity' />
    </Button>
  )
}

export default BackBtn