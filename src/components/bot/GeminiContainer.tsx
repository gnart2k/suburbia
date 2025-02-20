"use client"
import React, { useState } from 'react'
import Draggable from 'react-draggable';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import GeminiForm from '../bot/GeminiForm';

type Props = {}

export default function GeminiContainer({ }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Draggable>
      <div className='relative'>
        <div className={cn("absolute bottom-4 left-20 ", !isOpen && 'hidden')}>
          <GeminiForm />
        </div>
        <div className='absolute w-[170px] cursor-pointer shadow-lg flex p-2 bg-white  hover:shadow-gray-300 justify-center items-center bottom-[-60px] left-[320px] rounded-full ' onClick={() => setIsOpen(prev => !prev)}>
          <Image src={''} alt='logo' className="w-12 h-12  rounded-full object-cover" />
          <div className='text-slate-600 font-semibold ml-2'>
            Trợ lý TCH
          </div>
        </div>
      </div>
    </Draggable>
  )
}


