import React, { useState } from 'react'
import { SingleImageDropzone } from '../SingleImageDropzone'
import { cn } from '@/utils/utils';
import { CircleArrowUp, Loader2, Pencil } from 'lucide-react';
import Image from 'next/image';
import { TextInput } from '../ui/TextInput';
import { getSession } from 'next-auth/react';
import { UseUser } from '@/hooks/useUser';
import { useEdgeStore } from '@/utils/edgestore';
import { on } from 'events';

const EditProfile = () => {
  const { user } = UseUser();
  const { edgestore } = useEdgeStore();

  console.log(user);

  const [formValues, setFormValues] = useState({
    banner: '',
    avatar: '/default_avatar.png',
    name: user?.name,
    username: user?.username,
    bio: user?.bio ?? '',
    gender: user?.gender,
    region: user?.region ?? '',
    birthDay: null,
  });

  const [progresses, setProgresses] = useState({
    banner: 0,
    avatar: 0,
  });

  const handleChange = (value: any, name: string) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const onChangeFile = async (file: File, name: string) => {
    setProgresses({ ...progresses, [name]: 1 });

    if (file) {
      const res = await edgestore.myPublicImages.upload({
        file,
        options: {
          temporary: true,
        },
        input: { type: "profile" },
        onProgressChange: (progress) => {
          if (progress !== 0) {
            setProgresses({ ...progresses, [name]: progress });
          }
        },
      });

      if (res) {
        handleChange(res.url, name);
      }
    }
  }

  const genderList = ["male", "female", "private"]

  return (
    <div className='flex flex-col h-[90vh] overflow-y-auto rounded-xl pb-9'>
      <div className='w-full py-4 bg-white sticky top-0 z-10'>
        <p className='text-lg font-semibold text-black text-center'>Edit Profile</p>
      </div>

      <SingleImageDropzone
        width={600}
        height={225}
        className={cn('bg-light-grey bg-opacity-30')}
        onChange={(file) => {
          if (file) {
            onChangeFile(file, 'banner')
          }
        }}
      >
        {progresses.banner > 0 && progresses.banner < 100 ? (
          <div className='flex items-center justify-center'>
            <Loader2 className="mr-2 h-10 w-10 animate-spin text-blue-600" />
          </div>
        ) : (
          <>
            {formValues.banner ? (
              <Image
                src={formValues.banner ?? ''}
                alt=""
                width={0}
                height={0}
                sizes="100vw"
                style={{ objectFit: 'cover' }}
                className="w-full h-full"
              />
            ) : (
              <div className='relative w-full h-full'>
                <div className={cn('w-full h-full flex flex-col items-center justify-center gap-5 text-[#505050]')}>
                  <Pencil className='size-11 text-dark text-opacity-50' />

                  <p className='text-sm font-bold text-dark text-opacity-50'>Set a cover image</p>

                </div>
              </div>
            )}
          </>
        )}
      </SingleImageDropzone>

      <SingleImageDropzone
        width={125}
        height={125}
        className={cn('rounded-full bg-white ml-6 border-2 -mt-12')}
        onChange={(file) => {
          if (file) {
            onChangeFile(file, 'avatar')
          }
        }}
      >
        {progresses.avatar > 0 && progresses.avatar < 100 ? (
          <div className='flex items-center justify-center'>
            <Loader2 className="mr-2 h-10 w-10 animate-spin text-blue-600" />
          </div>
        ) : (
          <>
            {formValues.avatar ? (
              <Image
                src={formValues.avatar ?? ''}
                alt=""
                width={0}
                height={0}
                sizes="100vw"
                style={{ objectFit: 'cover' }}
                className="w-full h-full rounded-full"
              />
            ) : (
              <div className='relative w-full h-full'>
                <div className={cn('w-full h-full flex flex-col items-center justify-center gap-5 text-[#505050]')}>
                  <Pencil className='size-11 text-dark text-opacity-50' />

                  <p className='text-sm font-bold text-dark text-opacity-50'>Set a cover image</p>

                </div>
              </div>
            )}
          </>
        )}
      </SingleImageDropzone>

      <div className='px-6 mt-5 gap-5 flex flex-col'>
        <TextInput
          id='name'
          label='Name'
          value={formValues.name}
          variant={'filled'}
          onChange={(e) => handleChange(e.target.value, 'name')}
        />

        <TextInput
          id='username'
          label='Username'
          value={formValues.username}
          variant={'filled'}
          onChange={(e) => handleChange(e.target.value, 'username')}
        />

        <TextInput
          id='bio'
          label='Bio'
          value={formValues.bio}
          variant={'filled'}
          onChange={(e) => handleChange(e.target.value, 'bio')}
        />

        <TextInput
          id='region'
          label='Region'
          value={formValues.region}
          variant={'filled'}
          onChange={(e) => handleChange(e.target.value, 'region')}
        />


        <div className='flex flex-col gap-2'>
          <p className='text-dark text-opacity-65 text-xs font-medium tracking-wide cursor-pointer'>Gender</p>

          <div className='flex items-center gap-4'>
            {genderList.map((item, index) => (
              <div key={index} className='flex gap-2 items-center'>
                <input type="radio" id={item} value={item} checked={formValues.gender === item} onChange={e => handleChange(e.target.value, 'gender')} className='size-3' />
                <label htmlFor={item} className='text-sm font-semibold text-dark text-opacity-75 capitalize mt-0.5'>{item === 'private' ? 'Rather not say' : item}</label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditProfile