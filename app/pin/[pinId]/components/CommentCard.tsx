"use client"

import { cn, formatCommentDate } from '@/utils/utils';
import { Comment, User } from '@prisma/client'
import Image from 'next/image';
import React, { useState } from 'react'
import CommentForm from './CommentForm';

interface CardProps {
  pinId: string;
  creatorId: string;
  user: User;
  comment: Comment & {
    User: User;
    replies: (
      Comment & {
        User: User;
      }
    )[];
  };
}

const CommentCard = ({ comment, user, creatorId, pinId }: CardProps) => {
  const [replyForm, setReplyForm] = useState<boolean>(false);

  const isCreator = comment.User.id === creatorId;
  const isSelf = comment.User.id === user.id;

  const tagStyle = 'font-semibold p-[1.2px] rounded text-light bg-red-500 text-[9px] tracking-wide px-1'

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex gap-3 items-start w-full'>
        <Image
          src={comment.User.avatar ?? '/default_avatar.png'}
          alt=''
          width={0}
          height={0}
          sizes='100vw'
          style={{ objectFit: 'cover' }}
          className='size-9 rounded-full'
        />

        <div className='w-full flex flex-col gap-0.5'>
          <div className='flex gap-2 items-center'>
            <p className='font-bold text-[15px] text-dark'>{comment.User.name}</p>

            {isSelf ? (
              <p className={cn(tagStyle, 'bg-blue-400')}>You</p>
            ) : isCreator && (
              <p className={cn(tagStyle, 'bg-red-500')}>Author</p>
            )}
          </div>
          <p className='w-full font-medium text-[13px] text-dark'>{comment.content}</p>

          <div className='flex items-center gap-1.5 mt-1'>
            <p className='text-dark text-opacity-50 text-[11px] font-semibold'>{formatCommentDate(comment.createdAt)}</p>

            <button onClick={() => setReplyForm(prev => !prev)} className='text-[#3D7699] font-medium text-[11px]'>Reply</button>
          </div>
        </div>
      </div>

      {comment.replies.map((item, index) => (
        <div key={index} className='flex gap-3 items-start w-full ml-11'>
          <Image
            src={item.User.avatar ?? '/default_avatar.png'}
            alt=''
            width={0}
            height={0}
            sizes='100vw'
            style={{ objectFit: 'cover' }}
            className='size-9 rounded-full'
          />

          <div className='w-full flex flex-col gap-0.5'>
            <div className='w-full flex items-center gap-2'>
              <p className='font-bold text-[15px] text-dark'>{item.User.name}</p>

              {isSelf ? (
                <p className={cn(tagStyle, 'bg-blue-400')}>You</p>
              ) : isCreator && (
                <p className={cn(tagStyle, 'bg-red-500')}>Author</p>
              )}
            </div>
            <p className='w-full font-medium text-[13px] text-dark'>{item.content}</p>

            <div className='flex items-center gap-1.5 mt-1'>
              <p className='text-dark text-opacity-50 text-[11px] font-semibold'>{formatCommentDate(comment.createdAt)}</p>

              <button onClick={() => setReplyForm(prev => !prev)} className='text-[#3D7699] font-medium text-[11px]'>Reply</button>
            </div>
          </div>
        </div>
      ))}

      {replyForm && (
        <div className='w-full ml-11 -mt-2.5'>
          <CommentForm
            pinId={pinId}
            user={user}
            replyToId={comment.id}
            onSuccess={() => setReplyForm(false)}
          />
        </div>
      )}
    </div>
  )
}

export default CommentCard