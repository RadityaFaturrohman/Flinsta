import BackBtn from '@/components/BackBtn';
import FilterButton from '@/components/FilterButton';
import OptionButton from '@/components/OptionButton';
import PinCard from '@/components/PinCard';
import { dummyAlbums } from '@/dummy/dummyData';
import { prisma } from '@/utils/prisma';
import Image from 'next/image';
import React from 'react'

interface Props {
  params: {
    username: string;
    boardName: string;
  }
}

const ShowBoard = async ({ params }: Props) => {
  // const creator = await prisma.user.findUnique({
  //   where: {
  //     username: params.username
  //   },
  // })

  // const data = await prisma.board.findUnique({
  //   where: {
  //     userId: creator?.id,
  //     name: params.boardName
  //   }
  // })

  const album = dummyAlbums[1]
  const creator = album.User

  return (
    <div className='w-full flex flex-col mt-7'>
      <div className='fixed top-32 left-64'>
        <BackBtn />
      </div>

      <div className='w-full items-center flex flex-col gap-2 relative'>
        <div className='flex items-center gap-1.5 relative'>
          <p className='text-4xl font-bold text-dark'>{album.name}</p>

          <div className='absolute self-center z-10 -right-11'>
            <OptionButton
              variant='darken'
            />
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <Image
            src={creator.avatar ?? 'default_avatar.png'}
            alt=''
            width={0}
            height={0}
            sizes='100vw'
            className='size-6 rounded-full'
          />

          <p className='font-semibold text-dark text-[13px]'><span className='font-normal opacity-75'>created by</span> {creator.username}</p>
        </div>

        <p className='text-dark text-[13px] mt-4 font-medium text-opacity-75 w-1/4 text-center ml-2.5'>{album.description}</p>

        {album.privacy === 'private' && (
          <div className='absolute top-2 right-2 flex items-center gap-2'>

          </div>
        )}
      </div>

      <div className='mt-24 w-full pl-24 pr-14 gap-4 flex flex-col'>
        <div className='flex justify-between items-center px-1.5'>
          <p className='font-bold text-lg text-dark'>{album.Pins.length} Pins</p>

          <FilterButton position='right' />
        </div>

        <div className='columns-5 gap-3 space-y-3 w-full'>
          {album.Pins.map((item, index) => (
            <PinCard
              id={item.id}
              key={index}
              img={item.photos[0]}
              user={item.user}
              title={item.title}
              uri={item.link}
              showInfo={true}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ShowBoard