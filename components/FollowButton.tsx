"use client";

import React, { useEffect, useState } from 'react'
import { Button } from './ui/Button'
import { usePrevious } from '@mantine/hooks';
import { useRouter } from 'next/navigation';
import { useMutation } from "@tanstack/react-query";
import { UserFollowValidator } from '@/utils/validators/follow';
import { toast } from 'sonner';
import { cn } from '@/utils/utils';
import { ClassNameValue } from 'tailwind-merge';

interface FollowButtonProps {
  userId: string,
  isFollow: boolean | null,
  variant?: 'default' | 'defaultBig' | 'stretch',
}

const FollowButton = ({ userId, isFollow, variant = 'default' }: FollowButtonProps) => {
  const [areFollow, setAreFollow] = useState(isFollow);
  const prevFollow = usePrevious(areFollow);
  const router = useRouter();

  useEffect(() => {
    setAreFollow(isFollow);
  }, [isFollow]);

  const { mutate: follow } = useMutation({
    mutationFn: async (followed: boolean) => {
      const payload: UserFollowValidator = {
        userId,
        followed,
      };

      const res = await fetch('/api/user/follow', {
        method: 'PATCH',
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        setAreFollow(prevFollow!);
        if (res.status === 400) {
          return /// need to login toast
        } else {
          toast.error('Something went wrong', {
            description: 'Your follow was not registered, please try again.',
          });
        }
      }
      router.refresh();
    },
    onMutate: (followed: boolean) => {
      setAreFollow(followed);
    }
  })

  const variants = {
    default: 'w-fit text-xs',
    defaultBig: 'py-2 px-5 w-fit text-[13px]',
    stretch: 'w-full text-[13px]'
  }

  return (
    <Button
      onClick={() => follow(!areFollow)}
      className={cn('w-full bg-primary text-white font-bold text-[13px]', areFollow && 'bg-dark bg-opacity-10 text-dark', variants[variant])}
    >
      {areFollow ? 'Following' : 'Follow'}
    </Button>
  )
}

export default FollowButton