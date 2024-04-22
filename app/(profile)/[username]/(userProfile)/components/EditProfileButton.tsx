"use client";

import EditProfile from '@/components/Modals/EditProfile'
import { Button } from '@/components/ui/Button'
import { UseModal } from '@/hooks/useModal'
import { PencilLine } from 'lucide-react'
import React from 'react'

const EditProfileButton = () => {
  const { openModal } = UseModal();

  return (
    <Button
      variant={'icon'}
      size={'default'}
      onClick={() => openModal(<EditProfile />)}
      className='bg-[#f7f7f7] group bg-opacity-100 gap-1.5 flex items-center'
    >
      <PencilLine strokeWidth={1.5} className='w-5 h-5 text-dark text-opacity-65 group-hover:text-opacity-100 transition-all' />

      <p className='font-bold text-xs text-dark text-opacity-65 group-hover:text-opacity-100 transition-all'>Edit Profile</p>
    </Button>
  )
}

export default EditProfileButton