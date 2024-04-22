import BackBtn from '@/components/BackBtn';
import FollowButton from '@/components/FollowButton';
import LikeButton from '@/components/LikeButton';
import OptionButton from '@/components/OptionButton';
import PinCard from '@/components/PinCard';
import ProfileCard from '@/components/ProfileCard';
import ShareButton from '@/components/ShareButton';
import { Button } from '@/components/ui/Button';
import { dummyPins, dummyUsers } from '@/dummy/dummyData';
import { UseUser } from '@/hooks/useUser';
import { getAuthSession } from '@/utils/auth';
import { prisma } from '@/utils/prisma';
import { prismaExclude } from '@/utils/prisma_function';
import { cn } from '@/utils/utils';
import { User } from '@prisma/client';
import { Bookmark, ChevronLeft, ChevronRight, Heart, MessageSquare, Pin } from 'lucide-react';
import { getSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react'
import CommentSection from './components/CommentSection';
import CommentForm from './components/CommentForm';

interface Props {
  params: {
    pinId: string;
  }
}

const getPin = async (id: string) => {
  let pin;

  pin = await prisma.pin.findUnique({
    where: {
      id: id,
    },
    include: {
      Photos: true,
      Tags: true,
    }
  });

  if (!pin) return notFound();

  const creator = await prisma.user.findFirst({
    where: {
      id: pin.id
    },
    include: {
      Follower: true,
      FollowedUser: true,
      Pins: true,
    }
  });

  const comments = await prisma.comment.count({
    where: {
      pinId: pin.id,
    }
  });

  const likes = await prisma.like.count({
    where: {
      pinId: pin.id,
    }
  })

  return {
    pin,
    creator,
    comments,
    likes
  }
}

const PinDetails = async ({ params }: Props) => {
  const session = await getAuthSession();

  let pin;

  pin = await prisma.pin.findUnique({
    where: {
      id: params.pinId,
    },
    include: {
      Photos: true,
      Tags: true,
    }
  });

  if (!pin) return notFound();

  const user = await prisma.user.findFirst({
    where: {
      id: pin.userId!
    },
    include: {
      Follower: true,
      FollowedUser: true,
      Pins: {
        include: {
          Photos: true,
        }
      },
    }
  });

  const comments = await prisma.comment.count({
    where: {
      pinId: pin.id,
    }
  });

  const isLiked = await prisma.like.findFirst({
    where: {
      userId: session?.user.id,
      pinId: pin.id
    }
  })

  const likes = await prisma.like.count({
    where: {
      pinId: pin.id,
    }
  })

  const boards = await prisma.pinOnBoards.count({
    where: {
      pinId: pin.id
    }
  })

  const isSelf = pin.userId === session?.user.id;

  const creator = user;

  const getRecentPin = () => {
    const pinIndex: number | undefined = user?.Pins.findIndex(pins => pins.id === pin.id);

    if (pinIndex !== -1) {
      const pin = user?.Pins[pinIndex!];
      const previousPin = pinIndex! > 0 ? creator?.Pins[pinIndex! - 1] : null;
      const nextPin = pinIndex! < creator?.Pins.length! - 1 ? creator?.Pins[pinIndex! + 1] : null;

      return { pin, previousPin, nextPin };
    } else {
      return null;
    }
  };

  const recentPin = getRecentPin();

  const relatedPin = dummyPins;

  return (
    <div className='w-full relative pl-20'>
      <div className='fixed top-32 left-64'>
        <BackBtn />
      </div>

      <div className='w-full flex flex-col px-5 pr-10 gap-7 pb-9'>
        <div className='w-full flex justify-between mt-7 relative gap-5'>
          <div className='flex flex-col rounded-[10px] flex-1 max-w-[840px] bg-white shadow pb-6'>
            <div className='relative'>
              <Image
                src={pin.Photos[0].photo}
                alt=''
                width={0}
                height={0}
                sizes='100vw'
                style={{ objectFit: 'contain' }}
                className='w-full h-auto max-h-[742px] rounded-tl-[10px] rounded-tr-[10px]'
              />
              <div className='w-full flex justify-end items-center gap-1.5 bg-white sticky bottom-0 py-2.5 px-5'>
                <LikeButton
                  postId={pin.id}
                  isLike={isLiked?.isLiked ?? false}
                />

                <ShareButton />
                <OptionButton />
              </div>

              <div className='flex flex-col w-3/4 pl-9 gap-2 mt-1'>
                <p className='font-bold text-2xl text-dark text-opacity-85'>{pin.title}</p>
                <div className='flex items-center flex-wrap gap-1.5'>
                  {pin.Tags.map((item, index) => (
                    <Link
                      key={index}
                      href=''
                      className='font-normal text-xs text-link hover:underline transition-all tracking-wide'
                    >
                      #{item.tag}
                    </Link>
                  ))}
                </div>

                <div className='flex items-center gap-3 mt-1.5'>
                  <div className='flex items-center gap-1'>
                    <Heart className='fill-dark opacity-45 w-5 h-w-5' />
                    <p className='text-xs text-dark font-medium text-opacity-75'>{likes}</p>
                  </div>

                  <div className='flex items-center gap-1'>
                    <MessageSquare className='fill-dark opacity-45 w-4 h-w-4 text-dark' />
                    <p className='text-xs text-dark font-medium text-opacity-75'>{comments}</p>
                  </div>

                  <div className='flex items-center gap-1'>
                    <Bookmark className='fill-dark text-dark opacity-45 w-4 h-w-4' />
                    <p className='text-xs text-dark font-medium text-opacity-75'>{boards}</p>
                  </div>
                </div>

                <p className='text-[11px] text-dark text-opacity-45 font-medium ml-0.5'>November 13, 2024 8:51 PM</p>
              </div>

              <div className='w-3/4 pl-9 mt-6 flex justify-between items-end'>
                <ProfileCard
                  user={creator!}
                  href={`/${creator?.name}`}
                  isFollow={false}
                  withFollow={!isSelf}
                />

                {isSelf && (
                  <Link href={`/${user?.username!}`} className='text-black text-opacity-50 font-medium text-xs hover:text-opacity-85 transition-all'>
                    <p>View all works</p>
                  </Link>
                )}
              </div>

              <div className='overflow-x-scroll flex items-center gap-1.5 px-9 py-4 mt-1'>
                {creator?.Pins.map((item, index) => (
                  <div key={index} className={cn('group relative w-[100px] h-[100px] rounded-md overflow-hidden', item.id === pin.id && 'opacity-50')}>
                    {item.id !== pin.id && (
                      <Link href={`/pin/${item.id}`} className='absolute w-full h-full bg-dark bg-opacity-25 z-10 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center'>
                      </Link>
                    )}
                    <Image
                      src={item.Photos[0].photo}
                      alt=''
                      width={0}
                      height={0}
                      sizes='100vw'
                      style={{ objectFit: "cover" }}
                      className='w-full h-full'
                    />
                  </div>
                ))}
              </div>

              <div className='pl-9 w-3/4 mt-8'>
                <p className='font-bold text-lg text-black'>Comments</p>

                {pin.allowComments ? (
                  <div className='flex flex-col gap-5'>
                    <CommentForm
                      pinId={pin.id}
                      user={session?.user as User}
                    />

                    <CommentSection
                      pinId={pin.id}
                      creatorId={creator?.id!}
                      user={session?.user as User}
                    />
                  </div>
                ) : (
                  <div className='flex items-center justify-center py-4 min-h-5'>
                    <p className='text-[13px] font-semibold text-black text-opacity-40'>The creator turned comments off</p>
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* creator info */}
          <div className='flex flex-col rounded-[10px] p-3 bg-white shadow w-[300px] h-fit gap-8'>
            <div className='flex flex-col gap-3.5'>
              <ProfileCard
                href={`/${creator?.username}`}
                user={creator!}
                sizes='medium'
              />

              <FollowButton
                userId={user?.id!}
                isFollow={false}
                variant='stretch'
              />
            </div>

            <div className='flex flex-col gap-2.5'>
              <div className='flex w-full items-end justify-between'>
                <p className='font-semibold text-black text-[13px]'>Other works</p>
                <Link href={`/${user?.username!}`} className='text-black text-opacity-50 font-medium text-xs hover:text-opacity-85 transition-all'>
                  <p>View all works</p>
                </Link>
              </div>

              <div className='flex items-center gap-1.5'>
                {recentPin && (
                  <>
                    <div className='group relative flex-1 h-[90px] rounded-[10px] overflow-hidden'>
                      {recentPin.previousPin && (
                        <>
                          <Link href={`/pin/${recentPin.previousPin.id}`} className='absolute w-full h-full bg-dark bg-opacity-25 z-10 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center'>
                            <ChevronLeft strokeWidth={3} className='text-white w-8 h-8 self-center' />
                          </Link>
                          <Image
                            src={recentPin.previousPin.Photos[0].photo}
                            alt=''
                            width={0}
                            height={0}
                            sizes='100vw'
                            style={{ objectFit: "cover" }}
                            className='w-full h-full'
                          />
                        </>
                      )}
                    </div>
                    <div className='group relative flex-1 h-[90px] rounded-[10px] overflow-hidden opacity-50'>
                      {recentPin.pin && (
                        <Image
                          src={recentPin.pin.Photos[0].photo}
                          alt=''
                          width={0}
                          height={0}
                          sizes='100vw'
                          style={{ objectFit: "cover" }}
                          className='w-full h-full'
                        />
                      )}
                    </div>
                    <div className='group relative flex-1 h-[90px] rounded-[10px] overflow-hidden'>
                      {recentPin.nextPin && (
                        <>
                          <Link href={`/pin/${recentPin.nextPin.id}`} className='absolute w-full h-full bg-dark bg-opacity-25 z-10 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center'>
                            <ChevronRight strokeWidth={3} className='text-white w-8 h-8 self-center' />
                          </Link>
                          <Image
                            src={recentPin.nextPin.Photos[0].photo}
                            alt=''
                            width={0}
                            height={0}
                            sizes='100vw'
                            style={{ objectFit: "cover" }}
                            className='w-full h-full'
                          />
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* relatedPins */}
        <div className='flex flex-col gap-5'>
          <p className='font-bold text-xl text-dark'>Related Pins</p>

          <div className='w-full columns-5 space-y-5 gap-[14px]'>
            {relatedPin.map((item, index) => (
              <PinCard
                key={index}
                id={item.id}
                img={item.photos[0]}
                user={item.user}
                title={item.title}
                uri={item.link}
                maxHeight={'450px'}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PinDetails