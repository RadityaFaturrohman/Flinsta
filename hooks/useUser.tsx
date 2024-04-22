"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { User } from "@prisma/client";
import { getAuthSession } from "@/utils/auth";

interface UserContextType {
  user: User | null,
  isLoading: boolean,
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export interface Props {
  [propsName: string]: any;
}

export const UserContextProvider = ({ ...props }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const session = await getSession(); 
        setUser(session?.user as User);
      } catch (error) {
        console.error('Error while fetching user data:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);


  return (
    <UserContext.Provider value={{ user, isLoading }} {...props} />
  )
}

export const UseUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a MyUserContextProvider');
  }

  return context;
}