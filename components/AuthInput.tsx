"use client";

import React, { SetStateAction, useState } from 'react'
import { Icon } from '@iconify/react/dist/iconify.js'
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

type TextInputType = {
  icon?: string,
  label: string,
  value: string,
  setValue: React.Dispatch<SetStateAction<string>>,
  passwordToggle?: boolean,
  error?: string,
  setError?: React.Dispatch<SetStateAction<string>>
};

const AuthInput: React.FC<TextInputType> = ({ ...props }) => {
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [isHide, setIsHide] = useState<boolean>(true);

  const error = props.error ?? '';

  return (
    <div className='flex flex-col gap-1 items-start'>
      <div className='flex items-center p-3 py-2.5 rounded-lg gap-2.5 w-[300px] bg-dark bg-opacity-5'>
        {props.icon && (
          <Icon icon={props.icon} className={twMerge('text-dark text-opacity-45 text-xl transition-all', isFocus && 'text-opacity-75', error && 'text-red-600 text-opacity-100')} />
        )}

        <div className='w-full h-full relative -mt-[2px]'>
          <p
            className={twMerge(
              'absolute flex self-center text-dark text-opacity-45 text-[13px] mt-1.5 font-medium transition-all z-0 pointer-events-none',
              isFocus || props.value.length ? 'text-[9px] mt-0' : ''
            )}
          >
            {props.label}
          </p>
          <input
            value={props.value}
            onChange={(e) => props.setValue(e.target.value)}
            type={props.passwordToggle ? isHide ? 'password' : 'text' : "text"}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            className='w-full h-full bg-transparent focus:outline-none text-black text-opacity-75 text-xs font-medium pt-3'
          />
        </div>

        {props.passwordToggle && (
          <button onClick={() => setIsHide(hide => !hide)} className='p-1 ml-auto'>
            <Icon icon={isHide ? 'mdi:eye-outline' : 'tabler:eye-off'} className='text-dark text-opacity-45 text-lg' />
          </button>
        )}
      </div>
      <motion.div  className='relative'>
        <p className='text-red-600 font-medium absolute text-xs'>{error}</p>
      </motion.div>
    </div>
  )
}

export default AuthInput