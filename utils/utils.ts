import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import moment from "moment";
import { useState } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function bytesToMB(bytes: number): number {
  const MB = 1048576;
  return bytes / MB;
}

export function getRandomNumber(min: number, max: number): string {
  return Math.floor(Math.random() * (max - min + 1) + min).toString();
}

export function formateDate(date: string): string {
  return moment(date).fromNow();
}

export function searchParamsToObject(
  searchParams: URLSearchParams,
): Record<string, string> {
  return Array.from(searchParams).reduce(
    (prev, [key, value]) => {
      prev[key] = value;
      return prev;
    },
    {} as Record<string, string>,
  );
}

const addOrdinalSuffix = (day: number) => {
  const j = day % 10,
        k = day % 100;
  if (j === 1 && k !== 11) {
    return day + "st";
  }
  if (j === 2 && k !== 12) {
    return day + "nd";
  }
  if (j === 3 && k !== 13) {
    return day + "rd";
  }
  return day + "th";
}

export const formatCommentDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
  };
  const formatted: string = date.toLocaleDateString('en-US', options);
  const formattedWithSuffix: string = addOrdinalSuffix(Number(formatted.split(' ')[1]));

  return `${formatted.split(' ')[0]} ${formattedWithSuffix}`;
}