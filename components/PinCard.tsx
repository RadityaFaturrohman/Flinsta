"use client"

import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import Link from "next/link";
import PinLink from "./PinLink";
import { User } from "@prisma/client";
import { cn } from "@/utils/utils";

interface CardTypes {
  id: string;
  img: string;
  title?: string;
  uri?: string | null;
  user: User;
  maxHeight?: string;
  showInfo?: boolean;
}

const PinCard: React.FC<CardTypes> = ({ showInfo = true, ...props }) => {
  return (
    <div className="flex flex-col gap-2 break-inside-avoid relative font-robotoFlex">
      <div className="flex flex-col gap-2 group break-inside-avoid relative">
        <div className="relative">
          <Link href={`/pin/${props.id}`} className="flex rounded-xl relative h-auto overflow-hidden cursor-zoom-in shadow">
            <Image
              src={props.img}
              alt={props.img}
              width={0}
              height={0}
              sizes="100vw"
              className={cn("group-hover:brightness-[.65] transition-all object-cover w-full h-auto rounded-xl flex", `max-h-[${props.maxHeight ?? '650px'}]`)}
            />

            <div className="absolute w-full h-full opacity-0 group-hover:opacity-100 transition-all flex flex-col p-2 py-3 pt-2 z-10">
              <div className="w-full flex flex-row items-center justify-between">
                <button className="flex items-center gap-1 p-2.5">
                  <p className="font-medium text-sm">Fruits</p>
                  <Icon icon='ion:chevron-down' className="" />
                </button>

                <button className="flex items-center px-2.5 py-2 gap-1 rounded-full bg-primary text-light text-[13px] tracking-wide font-medium mr-[2px]">
                  Save
                </button>
              </div>

              <div className="w-full flex flex-row items-center justify-between mt-auto">
                <div className="ml-auto flex flex-row items-center gap-1.5">
                  <button className="p-2 rounded-full bg-light">
                    <Icon icon='tabler:share' className="text-dark" />
                  </button>

                  <button onClick={() => console.log('clicked')} className="p-1 rounded-full bg-light">
                    <Icon icon='iwwa:option-horizontal' className='text-dark text-2xl' />
                  </button>
                </div>
              </div>
            </div>
          </Link>

          {props.uri && (
            <div className="absolute bottom-3 left-2 opacity-0 group-hover:opacity-100 transition-all z-20">
              <PinLink uri={props.uri} />
            </div>
          )}
        </div>


        {props.title && showInfo && (
          <Link href={`/pin/${props.id}`} className="cursor-zoom-in ml-0.5">
            <p className="text-dark font-semibold text-sm">{props.title}</p>
          </Link>
        )}
      </div>

      {showInfo && (
        <Link href={`/${props.user.username}`} className="flex flex-row items-center gap-1.5 group ml-0.5">
          <div className="relative w-7 h-7 rounded-full overflow-hidden">
            <Image
              src={props.user.avatar ?? '/default_avatar.png'}
              alt="/default_avatar.png"
              fill
              className="object-cover"
            />
          </div>
          <p className="text-[13px] text-dark font-semibold group-hover:underline">{props.user.name}</p>
        </Link>
      )}
    </div>
  )
}

export default PinCard;