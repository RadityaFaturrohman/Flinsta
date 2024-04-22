"use client"

import FilterButton from '@/components/FilterButton'
import CreateBoard from '@/components/Modals/CreateBoard'
import PinCard from '@/components/PinCard'
import { Button } from '@/components/ui/Button'
import { dummyAlbums, dummyPins } from '@/dummy/dummyData'
import { UseModal } from '@/hooks/useModal'
import { Plus, SquarePlus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface Props {
  params: {
    username: string
  }
}

const page = ({ params }: Props) => {
  const { openModal } = UseModal();



  return (
    <div className='w-full mt-4 flex flex-col gap-10'>
      <div className='flex flex-col gap-7'>
        <div className='flex items-center gap-1.5'>
          <FilterButton />

          <Button onClick={() => openModal(<CreateBoard />)} className='group bg-slate-100 flex items-center gap-1.5 border border-dark border-opacity-45 rounded-lg py-1.5 px-2.5 hover:border-opacity-75 hover:bg-opacity-0 duration-300 transition-all'>
            <p className='font-bold text-xs text-dark text-opacity-45 group-hover:text-opacity-75 transition-all'>Create</p>
            <Plus strokeWidth={2.5} className='size-3.5 text-dark text-opacity-45 group-hover:text-opacity-75 transition-all' />
          </Button>
        </div>

        <div className='flex gap-2 flex-wrap'>
          {dummyAlbums.map((item, index) => (
            <div key={index} className='flex flex-col gap-2 flex-1 max-w-60 min-w-48'>
              <Link href={`/${item.User.username}/${item.name}`} className='hover:brightness-75 duration-200 w-full h-40 rounded-lg overflow-hidden flex divide-x-2 divide-light'>
                <div className='w-2/3 h-full'>
                  <Image
                    src={item.Pins[0].photos[0]}
                    alt=''
                    width={0}
                    height={0}
                    sizes='100vw'
                    style={{ objectFit: 'cover' }}
                    className='w-full h-full'
                  />
                </div>
                <div className='w-1/2 h-full flex flex-col divide-y-2 divide-light'>
                  <div className='w-full h-1/2'>
                    {item.Pins[0].photos[0] && (
                      <Image
                        src={item.Pins[1].photos[0]}
                        alt=''
                        width={0}
                        height={0}
                        sizes='100vw'
                        style={{ objectFit: 'cover' }}
                        className='w-full h-full'
                      />
                    )}
                  </div>
                  <div className='w-full h-1/2 bg-dark bg-opacity-15'>
                    {item.Pins[2].photos[0] && (
                      <Image
                        src={item.Pins[2].photos[0]}
                        alt=''
                        width={0}
                        height={0}
                        sizes='100vw'
                        style={{ objectFit: 'cover' }}
                        className='w-full h-full'
                      />
                    )}
                  </div>
                </div>
              </Link>

              <p className='font-semibold text-[15px] text-dark px-0.5 flex flex-col'>
                {item.name}
                <span className='text-[10px] font-semibold text-dark opacity-50 mt-0.5'>{item.Pins.length} Pins</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className='flex flex-col gap-5'>
        <p className='text-xl font-bold text-dark'>Uncategorized Pins</p>

        <div className='columns-5 gap-4 space-y-4'>
          {dummyPins.map((item, index) => (
            <PinCard
              key={index}
              id={item.id}
              img={item.photos[0]}
              user={item.user}
              showInfo
              title={item.title}
              uri={item.link}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default page