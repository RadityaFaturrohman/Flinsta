import { Player } from '@lottiefiles/react-lottie-player'
import React from 'react'

interface Props {
  isLoading: boolean,
  children: React.ReactNode
}

const LoadingDiv = ({ isLoading, children }: Props) => {
  return (
    <div className='w-full h-screen bg-light'>
      {isLoading ? (
        <Player
          src={'/loading.json'}
          autoplay
          loop
          speed={.7}
          className='self-center flex'
        />
      ) : (
        <>
          {children}
        </>
      )}
    </div>
  )
}

export default LoadingDiv