"use client";

import { cn } from '@/utils/utils';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

type SidebarItems = {
  key: number;
  icon: string;
  activeIcon: string;
  label: string;
  href: string;
  active: boolean;
}

const SidebarItems: React.FC<SidebarItems> = ({ ...props }) => {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
    >
      <Link key={props.key} href={props.href} className={cn('flex flex-row items-center w-full px-[15px] py-3 gap-2 rounded-md bg-light-grey bg-opacity-0 hover:bg-opacity-40 transition-all group', props.active && 'bg-opacity-40')}>
        <Icon icon={props.active ? props.activeIcon : props.icon} className={twMerge('text-dark text-lg group-hover:scale-105', props.active && 'text-primary font-semibold')} />
        <p className={twMerge('text-dark text-sm font-medium', props.active && 'text-primary font-semibold')}>{props.label}</p>
      </Link>
    </motion.div>
  )
}

export default SidebarItems;