import React from 'react'
import SearchBar from './SearchBar'
import { Link } from './ui/Link'
import { twMerge } from 'tailwind-merge'
import CreateBtn from './CreateBtn'
import { UseUser } from '@/hooks/useUser'
import { dummyUsers } from '@/dummy/dummyData'
import ProfileCard from './ProfileCard'
import Sidebar from './Sidebar';
import { Button } from './ui/Button';
import { getAuthSession } from '@/utils/auth'
import { User } from '@prisma/client'

interface Props {
  children: React.ReactNode
}

const Navbar = async ({ children }: Props) => {
  const session = await getAuthSession()

  return (
    <div className='w-full min-h-screen bg-light antialiased overflow-y-auto relative'>
      <div className={twMerge('fixed top-0 inset-x-0 w-full h-20 bg-white z-30 flex items-center justify-between gap-5 transition-all',)}>
        <div className='w-[220px] items-start flex px-4 bg-white'>
          <Link href='/' className="flex items-center justify-center px-2">
            <p className="text-2xl text-primary font-bold">app logo</p>
          </Link>
        </div>

        <div className='flex items-center gap-5 w-full px-4'>
          <SearchBar />

          {session?.user != null ? (
            <React.Fragment>
              <CreateBtn />
              <ProfileCard
                user={session.user as User}
                href={`/${session.user.username}`}
                forNav
              />
            </React.Fragment>
          ) : (
            <Link href='/sign-in' variant={'nav'} className='rounded-md py-2 px-4 text-[13px] font-semibold tracking-wide hover:bg-black hover:brightness-105'>
              Sign In
            </Link>
          )}
        </div>


      </div>

      <main className='flex w-full min-h-screen gap-1 pl-[220px] relative overflow-y-auto pt-20'>
        <Sidebar />

        {children}
      </main>

    </div>
  )
}

export default Navbar