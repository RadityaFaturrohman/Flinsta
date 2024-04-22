"use client";

import React from 'react'
import { dummyPins } from '@/dummy/dummyData'
import PinCard from '@/components/PinCard'

const PinList = () => {

  return (
    <div className='w-full h-full px-3 md:columns-4 lg:columns-5 space-y-5 gap-[14px]'>
      {dummyPins.map((item) => (
        <PinCard
          id={item.id}
          key={item.id}
          img={item.photos[0]}
          title={item.title}
          uri={item.link}
          user={item.user}
        />
      ))}
    </div>
  )
}

export default PinList