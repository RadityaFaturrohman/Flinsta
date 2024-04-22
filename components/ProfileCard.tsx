"use client"

import { User } from '@prisma/client'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { Button } from './ui/Button'
import { Icon } from '@iconify/react/dist/iconify.js'
import { Link } from './ui/Link'
import { cn } from '@/utils/utils'
import { motion, AnimatePresence, MotionProps } from 'framer-motion'
import { signOut } from 'next-auth/react'
import FollowButton from './FollowButton'

interface CardProps {
  user: User,
  href: string,
  sizes?: 'medium' | 'default' | 'small' | 'verySmall',
  forNav?: boolean
  containerStyle?: StyleSheet,
  withFollow?: boolean,
  isFollow?: boolean
}

const ProfileCard = ({ user, href, sizes = 'default', forNav = false, containerStyle, withFollow = false, isFollow = false }: CardProps) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const presenceRef = useRef<HTMLDivElement>(null);

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

  const variantSizes: Record<string, { avatar: string; name: string }> = {
    medium: {
      avatar: 'w-9 h-9',
      name: 'font-semibold text-[15px]'
    },
    default: {
      avatar: 'w-9 h-9',
      name: 'font-semibold text-sm'
    },
    small: {
      avatar: 'w-[30px] h-[30px]',
      name: '',
    },
    verySmall: {
      avatar: 'w-6 h-6',
      name: ''
    }
  }

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        presenceRef.current &&
        !presenceRef.current.contains(event.target as Node)
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
      <div className={cn('flex items-center gap-2.5', containerStyle, forNav && 'gap-1')}>
        <Link
          href={href}
          variant={forNav ? 'icon' : 'raw'}
        >
          <Image
            src={user.avatar ?? '/default_avatar.png'}
            alt=''
            width={0}
            height={0}
            sizes='100vw'
            objectFit='cover'
            className={cn('cover rounded-full', variantSizes[sizes].avatar)}
          />
        </Link>

        {forNav ? (
          <Button
            variant={'icon'}
            size={'iconSmall'}
            onClick={() => setIsActive(prev => !prev)}
            ref={buttonRef}
          >
            <Icon icon='mingcute:down-fill' className='text-xl text-black' />
          </Button>
        ) : (
          <Link href={href}>
            <p className={cn('font-semibold text-sm text-black', variantSizes[sizes].name)}>{user.name}</p>
          </Link>
        )}

        {withFollow && (
          <FollowButton
            userId={user.id}
            isFollow={isFollow}
            variant='default'
          />
        )}
      </div>

      <AnimatePresence>
        {isActive && (
          <motion.div {...optionAnimation} className='absolute mt-2 -right-1 rounded-xl bg-white shadow-lg border border-light-grey' ref={presenceRef}>
            <div className='p-2 py-3 flex flex-col gap-3 w-72 '>
              <div className='flex flex-col gap-2 mb-1'>
                <p className='text-dark text-opacity-75 text-xs font-medium px-2'>Logged in as</p>
                <Link href={`/${user.username}`} className='flex gap-2.5 items-center px-2 justify-start rounded-lg bg-dark bg-opacity-0 hover:bg-opacity-5 py-1.5'>
                  <Image
                    src={user.avatar ?? '/default_avatar.png'}
                    alt=''
                    width={0}
                    height={0}
                    sizes='100vw'
                    objectFit='cover'
                    className='w-14 h-w-14 rounded-full'
                  />

                  <div className='flex flex-col max-w-full overflow-hidden truncate '>
                    <p className='text-base text-dark font-semibold'>{user.name}</p>
                    <p className='text-xs text-dark text-opacity-100'>@{user.username}</p>
                    <p className='text-xs text-dark text-opacity-65 text-ellipsis truncate mt-0.5'>{user.email}</p>
                  </div>
                </Link>
              </div>

              <div className='flex flex-col'>
                <p className='text-dark text-opacity-65 text-xs font-medium px-2 mb-1'>Your Account</p>

                <Button className='text-dark text-sm font-semibold py-2 bg-dark bg-opacity-0 hover:bg-opacity-5 text-left px-2 rounded justify-start'>
                  Add an existing account
                </Button>
              </div>

              <div className='flex flex-col'>
                <p className='text-dark text-opacity-65 text-xs font-medium px-2 mb-1'>Others</p>

                <Link href='/settings' className='text-dark text-sm font-semibold py-2 bg-dark bg-opacity-0 hover:bg-opacity-5 text-left px-2 rounded justify-start'>
                  Settings
                </Link>

                <Button onClick={() => {
                  signOut({
                    callbackUrl: `${window.location.origin}/`,
                  })
                }} className='text-dark text-sm font-semibold py-2 bg-dark bg-opacity-0 hover:bg-opacity-5 text-left px-2 rounded justify-start'>
                  Log out
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProfileCard