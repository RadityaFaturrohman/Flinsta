import { getAuthSession } from '@/utils/auth'
import prisma from '@/utils/prisma';
import React from 'react'

const PinAddToBoard = async () => {
  const session = await getAuthSession();

  const albums = await prisma.board.findMany({
    where: {
      userId: session?.user.id
    },
  })

  return (
    <div>PinAddToBoard</div>
  )
}

export default PinAddToBoard