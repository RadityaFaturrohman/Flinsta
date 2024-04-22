import FollowButton from '@/components/FollowButton';
import OptionButton from '@/components/OptionButton';
import ShareButton from '@/components/ShareButton';
import { Tabs } from '@/components/Tabs';
import { Button } from '@/components/ui/Button';
import { getAuthSession } from '@/utils/auth';
import { prisma } from '@/utils/prisma';
import { prismaExclude } from '@/utils/prisma_function';
import { cn } from '@/utils/utils';
import { MapPin } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import React from 'react'
import EditProfileButton from './components/EditProfileButton';
import { getSession } from 'next-auth/react';
import { dummyUsers } from '@/dummy/dummyData';

const getUser = async (username: string, session: any) => {
  const formattedUsn = decodeURIComponent(username);

  const user = await prisma.user.findUnique({
    where: {
      username: formattedUsn,
    },
    select: prismaExclude("User", ["password", "role", "emailVerified"]),
  });

  if (!user) return notFound();

  const isSelf = session?.user.id === user.id;
  const isAdmin = session?.user.role === 'admin';

  const userFollow = await prisma.userFollow.findFirst({
    where: {
      followerId: session?.user.id,
      followedUserId: user.id,
    },
  });

  const followersCount = await prisma.userFollow.count({
    where: {
      followedUserId: user.id,
    },
  });

  const followedCount = await prisma.userFollow.count({
    where: {
      followerId: user.id,
    },
  });

  return {
    user,
    isSelf,
    isAdmin,
    userFollow,
    followersCount,
    followedCount,
  };
};

const layout = async ({ children, params }: { children: React.ReactNode, params: { username: string } }) => {
  const session = await getAuthSession();
  const data = await getUser(params.username, session);

  const user = data.user;
  const isSelf = data.isSelf;
  const isFollow = data.userFollow;

  const count = {
    followed: data.followedCount,
    followers: data.followersCount,
  }

  const profileTabs = [
    {
      id: 'created',
      name: 'Created',
      url: '',
      selfOnly: false,
    },
    {
      id: 'saved',
      name: 'Saved',
      url: 'saved',
      selfOnly: false,
    }
  ]

  return (
    <div className='flex pb-9 px-5 pt-4 w-full relative flex-col gap-2'>
      <div className='flex flex-col relative w-full'>
        <div className={cn('w-full rounded', !user.banner && 'h-80 bg-light-grey bg-opacity-25')}>
          {user.banner && (
            <Image
              src={user.banner}
              alt=''
              width={0}
              height={0}
              sizes='100vw'
              style={{ objectFit: 'cover' }}
              className='w-full h-auto max-h-[580px] rounded'
            />
          )}
        </div>

        <div className='pt-4 pb-3 pr-4 pl-14 flex justify-between items-start bg-light sticky bottom-0'>
          <div className='flex gap-4'>
            <Image
              src={user.avatar ?? '/default_avatar.png'}
              alt=''
              width={0}
              height={0}
              sizes='100vw'
              style={{ objectFit: 'cover' }}
              className='w-28 h-2w-28 rounded-full border-2 border-light -mt-12'
            />

            <div className='flex flex-col gap-2.5'>
              <p className='flex items-center gap-1.5 font-bold text-xl text-black'>{user.name} <span className='font-medium text-xs text-dark text-opacity-45 mt-0.5'>@{user.username}</span></p>

              <div className='flex items-center gap-3'>
                <p className='font-bold text-[13px] text-black opacity-100 flex items-center gap-1'> {count.followed} <span className='font-medium opacity-50'>following</span></p>
                <p className='font-bold text-[13px] text-black opacity-100 flex items-center gap-1'> {count.followers} <span className='font-medium opacity-50'>followers</span></p>
              </div>
            </div>
          </div>

          <div className='flex items-center gap-3 flex-1 justify-end'>
            {!isSelf ? (
              <FollowButton
                userId={user.id}
                isFollow={isFollow?.followed ?? null}
                variant='defaultBig'
              />
            ) : (
              <EditProfileButton />
            )}

            <ShareButton withLabel label='User' />
            <OptionButton />
          </div>
        </div>

        <div className='pl-[182px] w-fit max-w-[58.3%] flex flex-col gap-3.5'>
          {user.region && (
            <div className='flex gap-1 items-center'>
              <MapPin className='w-4 h-4 text-black text-opacity-75' />
              <p className='text-black text-opacity-75 font-medium text-xs tracking-wide'>{user.region}</p>
            </div>
          )}

          <p className='max-w-full font-medium text-[13px] text-dark text-opacity-75'>{user.bio}</p>

          <Button variant={'raw'} className='self-end font-semibold text-xs -mt-2 text-dark text-opacity-45 hover:text-opacity-85 transition-all px-0'>View profile</Button>
        </div>
      </div>

      <Tabs tabs={profileTabs} isSelf username={params.username} />

      {children}
    </div>
  )
}

export default layout