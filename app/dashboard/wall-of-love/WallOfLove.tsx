
'use client'
import React from 'react'
import Testimonials from './Testimonials'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

const WallOfLove = ({ userId }: { userId: string }) => {

    const router = useRouter()

    return (
        <div className='items-center flex flex-col py-4'>
            <h1 className='text-4xl font-bold w-fit'>Our wall of Love</h1>
            <div>
                <button
                    className='text-xl flex gap-2 items-center bg-brand text-brand-light px-4 py-2 rounded-lg hover:cursor-pointer hover:scale-105 duration-200 transition-all my-4'
                    onClick={() => {
                        router.push('/dashboard/wall-of-love/add-testimony')
                    }}
                >
                    <Plus />
                    Add Testimony
                </button>
            </div>
            <Testimonials userId={userId} />
        </div>
    )
}

export default WallOfLove