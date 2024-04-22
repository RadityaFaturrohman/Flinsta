"use client"

import React, { useEffect, useState } from 'react'
import { Button } from './ui/Button'
import { usePrevious } from '@mantine/hooks';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { PostLikeRequest } from '@/utils/validators/like';
import { toast } from 'sonner';
import { Heart } from 'lucide-react';
import { cn } from '@/utils/utils';

interface ButtonProps {
  postId: string,
  isLike: boolean,
}

const LikeButton = ({ postId, isLike }: ButtonProps) => {
  const [areLike, setAreLike] = useState(isLike);
  const prevLike = usePrevious(areLike);
  const router = useRouter();

  useEffect(() => {
    setAreLike(isLike);
  }, [isLike]);

  const { mutate: like } = useMutation({
    mutationFn: async (liked: boolean) => {
      const payload: PostLikeRequest = {
        postId,
        liked
      };

      const res = await fetch('/api/pin/like', {
        method: 'PATCH',
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        setAreLike(prevLike!);
        if (res.status === 400) {
          return /// show need to login toast
        } else {
          return toast.error('Something went wrong', {
            description: 'Your like was not registered, please try again.'
          })
        }
      }

      router.refresh();
    },
    onMutate: (liked: boolean) => {
      setAreLike(liked);
    }
  });

  return (
    <Button variant={'icon'} size={'iconBig'} onClick={() => like(!areLike)} className='bg-[#f7f7f7] group bg-opacity-100'>
      <Heart strokeWidth={2} className={cn('w-[22px] h-[22px] text-dark text-opacity-65 group-hover:text-opacity-100 transition-all', areLike && 'fill-primary text-primary')} />
    </Button>
  )
}

export default LikeButton