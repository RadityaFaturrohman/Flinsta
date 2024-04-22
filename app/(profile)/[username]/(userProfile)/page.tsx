import PinCard from '@/components/PinCard'
import { dummyPins } from '@/dummy/dummyData'
import { getAuthSession } from '@/utils/auth'
import { prisma } from '@/utils/prisma'
import { getSession } from 'next-auth/react'
import React from 'react'

interface Props {
  params: {
    username: string
  }
}

const page = async ({ params }: Props) => {
  const session = await getAuthSession();

  const data = await prisma.user.findUnique({
    where: {
      username: params.username,
    },
    include: {
      Pins: {
        include: {
          Photos: true,
        },
        where: {
          privacy: 'public',
        }
      },
    }
  });

  const isSelf = data?.id === session?.user.id;
  
  return (
    <>
      {data?.Pins.length !== 0 ? (
        <div className='w-full columns-5 space-y-4 gap-4 mt-4'>
          {data?.Pins.map((item, index) => (
            <PinCard
              key={index}
              id={item.id}
              img={item.Photos[0].photo}
              user={data}
              title={item.title ?? ''}
              uri={item.link ?? null}
              showInfo={false}
            />
          ))}
        </div>
      ) : (
        <div className='w-full h-72 items-center justify-center flex flex-col gap-5 mt-10 pr-10'>
          <svg viewBox="0 0 24 24" width={85} height={85} className="sc-11csm01-0 fieitW mt-6">
            <path fill='#101010' fillOpacity={.35} fill-rule="evenodd" clip-rule="evenodd" d="M2 5C2 3.89542 2.89545 3 4 3H11C12.1046 3 13 3.89542 13 5V8C11.7335 8 10.6502 8.78494 10.2101 9.89493L9 10.5L6 9L4 9.99341V13H10V15H4C2.89545 15 2 14.1046 2 13V5ZM9.5 5C8.67157 5 8 5.67157 8 6.5C8 7.32843 8.67157 8 9.5 8C10.3284 8 11 7.32843 11 6.5C11 5.67157 10.3284 5 9.5 5Z"></path>
            <path fill='#101010' fillOpacity={.35} fill-rule="evenodd" clip-rule="evenodd" d="M13 21C11.8954 21 11 20.1054 11 18.9999V11.0001C11 9.89548 11.8955 9 13 9H20C21.1046 9 22 9.89459 22 11.0001V18.9999C22 20.1045 21.1045 21 20 21H13ZM13 15.9934L15 15L18 16.5L20 15.5V19H13V15.9934ZM18.5 11C17.6716 11 17 11.6716 17 12.5C17 13.3284 17.6716 14 18.5 14C19.3284 14 20 13.3284 20 12.5C20 11.6716 19.3284 11 18.5 11Z"></path>
          </svg>

          <p className='text-base text-dark text-opacity-45 font-extrabold'>{`${isSelf ? 'It looks like you' : data?.username} hasn't post anything yet`}</p>
        </div>
      )}
    </>
  )
}

export default page