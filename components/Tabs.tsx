"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LegacyRef, useEffect, useRef, useState } from "react";

type Tab = {
  id: string;
  name: string;
  url: string;
  selfOnly: boolean;
};

type TabsProps = {
  tabs: Tab[];
  username: string;
  isSelf: boolean;
};

export const Tabs: React.FC<TabsProps> = ({ tabs, isSelf, username }) => {
  const pathname = usePathname();
  const tabsRef = useRef<(HTMLElement | null)[]>([]);
  const [activeTabIndex, setActiveTabIndex] = useState<number | null>(null);
  const [tabUnderlineWidth, setTabUnderlineWidth] = useState(0);
  const [tabUnderlineLeft, setTabUnderlineLeft] = useState(0);

  const setTabPosition = () => {
    const currentTab = tabsRef.current[activeTabIndex ?? 0] as HTMLElement;

    setTabUnderlineLeft(currentTab?.offsetLeft ?? 0);
    setTabUnderlineWidth(currentTab?.clientWidth ?? 0);
  };

  useEffect(() => {
    const parts = pathname.split("/");
    const url = parts[parts.length - 1];
    const activeIndex = tabs.findIndex((tab) => tab.url === url);
    if (activeTabIndex === null) {
      setActiveTabIndex(activeIndex !== -1 ? activeIndex : 0);
      return;
    } else if (activeIndex !== activeTabIndex) {
      setActiveTabIndex(activeIndex !== -1 ? activeIndex : 0);
    }
    const activeTab = tabsRef.current[activeIndex !== -1 ? activeIndex : 0];
    if (
      activeTab &&
      tabs[activeIndex !== -1 ? activeIndex : 0].name === activeTab.innerText
    ) {
      setTabPosition();
    } else {
      setTimeout(() => {
        setTabPosition();
      }, 1000);
    }
  }, [activeTabIndex, pathname]);

  return (
    <div
      className="relative flex h-10 backdrop-blur-sm gap-3 px-2.5"
      style={{
        overflowX: "auto",
        scrollbarWidth: "none",
      }}
    >
      <span
        className="absolute bottom-0 top-0 -z-10 flex overflow-hidden transition-all duration-300"
        style={{ left: tabUnderlineLeft, width: tabUnderlineWidth }}
      >
        <span className="w-full border-b-[3px] border-primary" />
      </span>
      {tabs
        .filter((tab) => !tab.selfOnly || isSelf) // Filter tabs based on selfOnly and isSelf
        .map((tab, index) => {
          const isActive = activeTabIndex === index;

          return (
            <Link
              key={index}
              ref={(el) => (tabsRef.current[index] = el)}
              className={`${isActive ? `` : `hover:text-opacity-75 text-opacity-45`
                } my-auto cursor-pointer select-none text-dark text-center bg-dark bg-opacity-0 font-bold transition-all duration-300`}
              href={`/${username}/${tab.url}`}
            >
              {tab.name}
            </Link>
          );
        })}
    </div>
  );
};