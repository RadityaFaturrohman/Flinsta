"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import SidebarItems from "./SidebarItems";
import UserProfile from "./UserProfile";
import Link from "next/link";
import PostButton from "./PostButton";

interface Props {
  children: React.ReactNode
}

const Sidebar = () => {
  const pathname = usePathname();

  const routes = useMemo(() => [
    {
      name: 'Home',
      href: '/',
      active: pathname === '/',
      icon: 'fluent:home-32-regular',
      activeIcon: 'fluent:home-32-filled'
    },
    {
      name: 'Discover',
      href: '/discover',
      active: pathname === '/discover',
      icon: 'mdi:compass-outline',
      activeIcon: 'mdi:compass'
    },
    {
      name: 'Saved',
      href: '/_saved',
      active: pathname === '/saved',
      icon: 'mingcute:bookmark-line',
      activeIcon: 'mingcute:bookmark-fill'
    },
    {
      name: 'Settings',
      href: '/settings',
      active: pathname === '/settings',
      icon: 'mage:settings',
      activeIcon: 'mage:settings-fill'
    }
  ], [pathname])

  return (
    <aside className="w-[220px] flex h-screen fixed left-0 top-5 border-r-[.1px] border-light-grey border-opacity-45 bg-white flex-col pb-4">
      <div className='w-[220px] items-start flex pl-4 bg-white'>
        <Link href='/' className="flex items-center justify-center px-2">
          <p className="text-2xl text-primary font-bold">app logo</p>
        </Link>
      </div>

      <div className='w-full items-center px-2.5 mt-7 mb-auto gap-1'>
        {routes.map((item, index) => (
          <SidebarItems
            key={index}
            icon={item.icon}
            activeIcon={item.activeIcon}
            label={item.name}
            href={item.href}
            active={item.active}
          />
        ))}
        <PostButton />
      </div>

      <UserProfile />
      {/* <p className="mt-auto text-xs text-dark opacity-75 p-4">© 2024 Google LLC</p> */}
    </aside>
  )
}

export default Sidebar;