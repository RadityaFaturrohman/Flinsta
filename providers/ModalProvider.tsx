"use client"

import { ModalContextProvider } from '@/hooks/useModal';
import React from 'react'

interface ModalProviderType {
  children: React.ReactNode;
}

const ModalProvider: React.FC<ModalProviderType> = ({ children }) => {
  return (
    <ModalContextProvider>
      {children}
    </ModalContextProvider>
  )
}

export default ModalProvider