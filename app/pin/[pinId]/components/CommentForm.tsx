"use client"
import { Button } from '@/components/ui/Button'
import { UseUser } from '@/hooks/useUser'
import { CommentValidator, commentValidator } from '@/utils/validators/comment'
import { User } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'

interface Props {
  pinId: string,
  user: User,
  replyToId?: string,
  onSuccess?: () => void,
}

const CommentForm = ({ pinId, user, replyToId, onSuccess }: Props) => {
  const [content, setContent] = useState<string>('');
  const router = useRouter();

  const { mutate: comment, isPending } = useMutation({
    mutationFn: async ({ pinId, content, replyToId }: CommentValidator) => {
      const payload: CommentValidator = {
        pinId,
        content,
        replyToId
      };

      const res = await fetch('/api/pin/comment', {
        method: 'PATCH',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!res.ok) {
        if (res.status === 401) {
          return toast.info('You need to login to comment on this pin', {
            action: {
              label: 'Sign In',
              onClick: () => router.push('/sign-in')
            }
          })
        } else {
          return toast.error('Something went wrong!', {
            description: 'Your comment was not registered, please try again later.'
          });
        }
      }

      return res;
    },
    onSuccess: () => {
      router.refresh();
      setContent('');
      if (onSuccess) {
        onSuccess();
      }
    }
  });

  const submit = () => {
    const data: CommentValidator = {
      pinId,
      content,
      replyToId: replyToId ?? null
    }

    comment(data);
  }

  return (
    <div className='flex items-center gap-2.5 w-full mt-3 pr-20'>
      <Image
        src={user?.avatar ?? '/default_avatar.png'}
        alt=''
        width={0}
        height={0}
        sizes='100vw'
        style={{ objectFit: 'cover' }}
        className='w-9 h-9 rounded-full'
      />

      <input
        type='text'
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder='Leave a comment'
        className='bg-light-grey bg-opacity-40 text-[13px] font-medium text-black flex-1 h-9 px-3 focus:outline-none focus:ring rounded placeholder:tracking-wide placeholder:font-normal'
      />

      <Button onClick={submit} disabled={content.length == 0} className='w-fit text-xs bg-primary text-white font-bold py-2 px-4'>Send</Button>
    </div>
  )
}

export default CommentForm