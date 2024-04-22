import { dummyPins } from '@/dummy/dummyData';
import { getAuthSession } from '@/utils/auth';
import prisma from '@/utils/prisma';
import { formatCommentDate } from '@/utils/utils';
import Image from 'next/image';
import { comment } from 'postcss';
import React from 'react'
import CommentCard from './CommentCard';
import { User } from '@prisma/client';

interface Props {
  pinId: string;
  creatorId: string;
  user: User;
}

const CommentSection = async ({ pinId, creatorId, user }: Props) => {
  const comments = await prisma.comment.findMany({
    where: {
      pinId: pinId,
      replyToId: null
    },
    include: {
      User: true,
      replies: {
        include: {
          User: true,
        }
      }
    }
  })

  return (
    <div className='w-full flex flex-col gap-3.5'>
      {comments.length > 0 ? (
        <>
          {comments.map((item, index) => (
            <CommentCard
              key={index}
              comment={item}
              pinId={pinId}
              creatorId={creatorId}
              user={user}
            />
          ))}
        </>
      ) : (
        <div className='w-full h-3 items-center flex justify-center'>
          <p className='text-13 font-medium text-dark text-opacity-75'>There is no comment yet</p>
        </div>
      )}
    </div>
  )
}

export default CommentSection