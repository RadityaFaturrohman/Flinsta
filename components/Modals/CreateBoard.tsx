"use client"

import React, { useState } from 'react'
import { Button } from '../ui/Button'
import { useMutation } from '@tanstack/react-query'
import { BoardValidator } from '@/utils/validators/board'
import { Board } from '@prisma/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { UseModal } from '@/hooks/useModal'
import { UseUser } from '@/hooks/useUser'

interface Props {
  board?: Board
}

const CreateBoard = ({ board }: Props) => {
  const [formValues, setFormValues] = useState({
    name: board?.name ?? '',
    description: board?.description ?? '',
    isPrivate: board?.privacy == 'private' ?? false,
  })

  const handleChange = (value: string | boolean, name: string) => {
    setFormValues({ ...formValues, [name]: value })
  };

  const router = useRouter();
  const { openModal } = UseModal();
  const { user } = UseUser();

  const { mutate: createBoard } = useMutation({
    mutationFn: async ({ name, description, isPrivate }: BoardValidator) => {
      const payload: BoardValidator = {
        name,
        description,
        isPrivate,
      };
      let res;
      if (!board) {
        res = await fetch('/api/board', {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        payload["id"] = board.id;
        res = await fetch('/api/board', {
          method: 'PATCH',
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
      if (!res.ok) {
        const resJson = await res.json();
        return toast(resJson.code, {
          description: resJson.message
        });
      } else {
        const board: Board = await res.json();
        router.push(`/${user?.username}/${board.id}`);
        openModal(<></>);
      }
    },
    onError: () => { 
      return toast.error('Something went wrong.', {
        description: "Cannot create a new board right now, please try again later.",
      })
    }
  });

  const create = async () => {
    const payload: BoardValidator = {
      name: formValues.name,
      description: formValues.description,
      isPrivate: formValues.isPrivate,
    };

    createBoard(payload);
  }

  return (
    <div className='p-4'>
      <div className='p-5 px-[25px] flex flex-col items-center'>
        <p className='text-2xl font-semibold tracking-wide text-black mb-8 mt-4'>Create board</p>

        <div className='w-96 gap-7 flex flex-col'>
          <div className='flex flex-col gap-1'>
            <label htmlFor="name" className='text-dark text-opacity-65 text-xs font-medium tracking-wide cursor-pointer'>Name</label>
            <input
              id='name'
              type="text"
              value={formValues.name}
              onChange={(e) => handleChange(e.target.value, 'name')}
              placeholder='Give your new board a name'
              className='focus:outline-none focus:ring p-2 border-2 border-dark border-opacity-15 rounded-xl -ml-0.5 pl-3 text-[15px] font-medium text-dark hover:border-opacity-35 transition-all placeholder:text-sm'
            />
          </div>

          <div className='flex flex-col gap-0.5'>
            <label htmlFor="desc" className='text-dark text-opacity-65 text-xs font-medium tracking-wide cursor-pointer'>Description</label>
            <textarea
              id='desc'
              value={formValues.description}
              onChange={(e) => handleChange(e.target.value, 'description')}
              placeholder='Describe your board'
              className='focus:outline-none focus:ring p-2 border-2 border-dark border-opacity-15 rounded-xl -ml-0.5 pl-3 text-[15px] font-medium text-dark hover:border-opacity-35 transition-all placeholder:text-sm'
            />
          </div>

          <div className='flex gap-2 items-center'>
            <input type="checkbox" id="private" checked={formValues.isPrivate} onChange={(e) => handleChange(e.target.checked, 'isPrivate')} className="w-5 h-5 appearance-none border-2 border-dark border-opacity-65 rounded bg-transparent" />
            <label htmlFor="private" className='text-dark text-opacity-75 text-sm tracking-wide cursor-pointer font-semibold flex flex-col'>
              <p>Make it private</p>
              <p className='text-xs font-medium'>{`So, you're the only one who could see this board.`}</p>
            </label>
          </div>

          <Button onClick={create} disabled={formValues.name.length == 0} scaleWhileTap={.95} className='self-end flex items-center px-3.5 py-2.5 gap-1 rounded-full bg-primary font-semibold text-white text-[13px] tracking-wider'>Create</Button>
        </div>
      </div>
    </div>
  )
}

export default CreateBoard