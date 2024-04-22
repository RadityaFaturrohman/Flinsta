import BackBtn from '@/components/BackBtn'
import Auth from '@/components/Modals/Auth'
import React from 'react'

const SignIn = () => {
  return (
    <div className='absolute inset-0'>
      <div className='flex items-center justify-center w-full h-screen'>
        <div className='fixed top-32 left-64'>
          <BackBtn />
        </div>

        <Auth />
      </div>
    </div>
  )
}

export default SignIn