"use client"

import BackBtn from '@/components/BackBtn'
import { FileState, MultiImageDropzone } from '@/components/MultiImageDropzone'
import { Button } from '@/components/ui/Button'
import { TextInput } from '@/components/ui/TextInput'
import { Icon } from '@iconify/react/dist/iconify.js'
import { Board, Photo, Pin, PinOnBoards } from '@prisma/client'
import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, MotionProps, motion } from 'framer-motion'
import { cn } from '@/utils/utils'
import { Switch } from '@/components/ui/Toggle'
import { dummyAlbums } from '@/dummy/dummyData'
import Image from 'next/image'
import BoardSelector from '@/components/BoardSelector'
import { SingleImageDropzone } from '@/components/SingleImageDropzone'
import { useEdgeStore } from '@/utils/edgestore'
import { Loader2, UploadCloudIcon } from 'lucide-react'
import { Textarea } from '@/components/ui/TextArea'
import { useMutation } from '@tanstack/react-query'
import { PinValidator, pinValidator } from '@/utils/validators/pin'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

type formValueType = {
  title: string,
  description: string,
  photos: string[],
  link?: string,
  board?: Board
  & {
    Pins: PinOnBoards & {
      photos: any;
      pin: Pin & {
        photos: Photo[]
      }
    }[];
  } | null,
  tags: string[],
  showTags?: boolean,
  allowComments?: boolean,
  private: boolean
}

const CreatePin = () => {
  const { edgestore } = useEdgeStore();
  const router = useRouter();

  const [formValues, setFormValues] = useState<formValueType>({
    title: '',
    description: '',
    photos: [],
    link: '',
    board: null,
    tags: [],
    showTags: true,
    allowComments: true,
    private: false
  });

  const [progresses, setProgresses] = useState({
    photos: 0
  })

  const handleChange = (value: any, name: string) => {
    setFormValues({ ...formValues, [name]: value })
  }

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
        handleChange([...formValues.photos, res.url], name);
      }
    }
  }

  const [tag, setTag] = useState<string>('')

  const removeTags = (index: number) => {
    const newTags = [...formValues.tags]
    newTags.splice(index, 1)
    setFormValues({ ...formValues, tags: newTags })
  }

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const menuRef = useRef<any>(null);
  const [menuHeight, setMenuHeight] = useState(0);

  useEffect(() => {
    setMenuHeight(menuRef.current?.clientHeight);
  }, [menuHeight]);

  const menu = {
    closed: {
      height: 0,
      transition: {
        type: 'linear',
        duration: .2
      }
    },
    open: {
      height: menuHeight,
      transition: {
        type: 'linear',
        duration: .2,
      }
    }
  }

  const disabled = formValues.photos.length === 0;

  const { mutate: createPin } = useMutation({
    mutationFn: async ({ title, description, link, commentable, tags, albumId, photos, showTags }: PinValidator) => {
      const payload: PinValidator = {
        title,
        description,
        link,
        commentable,
        tags,
        albumId,
        photos,
        showTags
      };

      const res = await fetch('/api/pin', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (res.ok) {
        router.push('/');
        const pin: Pin = await res.json();
        return toast.success('Your artwork has been published!', {
          action: {
            label: 'Check',
            onClick: () => router.push(`/${pin.id}`)
          }
        })
      }
    },
    onError: () => {
      return toast.error('Something went wrong.', {
        description: "Cannot create a new board right now, please try again later.",
      })
    },
  })

  const submit = () => {
    const data: PinValidator = {
      photos: formValues.photos,
      title: formValues.title,
      description: formValues.description,
      link: formValues.link ?? null,
      tags: formValues.tags,
      albumId: formValues.board?.id,
      commentable: formValues.allowComments || true,
      showTags: formValues.showTags
    }

    createPin(data)
    console.log('runned');
  }

  return (
    <div className='w-full px-3 pb-6 flex flex-col gap-2 relative'>
      <div className='fixed top-32 left-64'>
        <BackBtn />
      </div>
      <div className='flex flex-col w-full gap-4 pl-24 pr-10 mt-6 items-center'>
        <p className='text-black text-2xl font-semibold -ml-24'>Create Pin</p>

        <div className='w-full flex gap-10 mt-10'>
          <SingleImageDropzone
            width={450}
            height={450}
            className='border border-dashed rounded-md border-black border-opacity-20 overflow-hidden'
            onChange={(file) => {
              if (file) {
                onChangeFile(file, 'photos')
              }
            }}
          >
            {progresses.photos > 0 && progresses.photos < 100 ? (
              <div className='flex items-center justify-center'>
                <Loader2 className="mr-2 h-10 w-10 animate-spin text-blue-600" />
              </div>
            ) : (
              <>
                {formValues.photos.length ? (
                  <Image
                    src={formValues.photos[0]}
                    alt=""
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ objectFit: 'contain' }}
                    className="w-full h-full"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-xs text-gray-400">
                    <UploadCloudIcon className="mb-2 h-10 w-10 text-black" />
                    <div className="text-black font-medium text-sm">JPEG / GIF / PNG</div>
                    <div className="text-black font-normal mt-2 w-8/12 text-center">You can upload to 20 MB on each file and a maximum of 6 files</div>
                    <div className="mt-3">
                      <Button className='text-blue-500'>Select a file</Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </SingleImageDropzone>

          <div className='flex flex-col gap-7 w-full'>
            <TextInput
              id='title'
              label='Title'
              value={formValues.title}
              onChange={(e) => handleChange(e.target.value, 'title')}
              placeholder='Insert Title'
            />

            <Textarea
              id='description'
              label='Description'
              value={formValues.description}
              onChange={(e) => handleChange(e.target.value, 'description')}
              placeholder='Insert some description'
            />

            <TextInput
              id='link'
              label='Link'
              value={formValues.link}
              onChange={(e) => handleChange(e.target.value, 'link')}
              placeholder='Insert some link'
              className=''
            />

            <BoardSelector
              value={formValues.board!}
              onSelect={(board) => handleChange(board, 'board')}
            />

            <div className='flex flex-col gap-2.5'>
              <TextInput
                id='tags'
                label={`Tags (${formValues.tags.length})`}
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder='Add some tags'
                disabled={formValues.tags.length === 20}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleChange([...formValues.tags, tag], 'tags');
                    setTag('')
                  }
                }}
              />

              <div className='flex gap-2 items-center max-w-full flex-wrap'>
                {formValues.tags.map((item, index) => (
                  <div key={index} className='py-2 px-4 pr-2 flex gap-1.5 rounded-full bg-dark text-white font-semibold text-[13px] items-center'>
                    <p className='tracking-wide'>{item}</p>
                    <Button variant={'raw'} size={'iconSmall'} onClick={() => removeTags(index)}>
                      <Icon icon='mingcute:close-fill' className='text-white' />
                    </Button>
                  </div>
                ))}
              </div>

              <motion.button onClick={() => setIsExpanded(prev => !prev)} className='flex items-center gap-1.5 text-sm text-black font-semibold w-fit tracking-wide mt-3'>
                Other Option
                <Icon icon='ion:chevron-down' className={cn('text-dark text-lg ml-auto transition-all duration-300', isExpanded && 'rotate-180')} />
              </motion.button>

              <motion.div animate={isExpanded ? 'open' : 'closed'} variants={menu} className='relative w-full overflow-hidden mt-1 -ml-2'>
                <motion.div ref={menuRef} className='absolute gap-4 flex-col flex p-2'>
                  <Switch
                    checked={formValues.showTags}
                    onChange={(e) => handleChange(e.target.checked, 'showTags')}
                    label='Show Tags'
                  />

                  <Switch
                    checked={formValues.allowComments}
                    onChange={(e) => handleChange(e.target.checked, 'allowComments')}
                    label='Allow Comments'
                    description='Let anyone to leave a comment on this pin.'
                  />

                  <Switch
                    checked={formValues.private}
                    onChange={(e) => handleChange(e.target.checked, 'private')}
                    label='Make it private'
                    description="So you're the only one who could see this pin."
                  />
                </motion.div>
              </motion.div>
            </div>

            <Button onClick={submit} disabled={disabled} scaleWhileTap={.95} className='self-end flex items-center px-3.5 py-2.5 gap-1 rounded-full bg-primary font-semibold text-white text-[13px] tracking-wider mt-2'>Create</Button>

          </div>
        </div>
      </div>

    </div>
  )
}

export default CreatePin