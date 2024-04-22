"use client"

import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";

const PinLink = ({ uri }: { uri: string }) => {
  const extractDomain = (url: string) => {
    let domain;
    if (url.indexOf("://") > -1) {
      domain = url.split('/')[2];
    } else {
      domain = url.split('/')[0];
    }
    domain = domain.split(':')[0];
    return domain;
  };

  const domain = extractDomain(uri);

  return (
    <Link href={uri} target="_blank" className="flex items-center gap-6 p-1.5 rounded-full bg-light max-w-36 overflow-hidden">
      <Icon icon='heroicons-solid:arrow-up' className="text-dark text-xl rotate-45" />
      <p className="text-dark font-semibold text-xs truncate w-full">{domain}</p>
    </Link>
  )
}

export default PinLink;