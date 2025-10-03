'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import useStore from '@/store/useStore'

// Only allow these three values
type TagType = "video" | "picture" | "design"

const DesignCard = ({ type, id, title, url }: {
    type: TagType,
    id: string
    title: string
    url: string
}) => {

    const router = useRouter()

    const handleClick = (id: string) => {
        router.push(`/project/${id}`)
        setTag(type)
    }


    const { setTag } = useStore()

    return (
        <div
            className='w-full md:max-w-[400px] flex flex-col items-center gap-4 py-4 flex-1 hover:cursor-pointer hover:scale-105 duration-200 transition-all '
            onClick={() => handleClick(id)}
        >
            <div className="relative w-full h-96">
                <Image
                    src={url}
                    alt="PictureCard"
                    fill
                    className="object-cover rounded-lg"
                />
            </div>
            <h2
                className='text-2xl font-bold underline text-center'>
                {title}
            </h2>
            <h2
                className='text-2xl font-bold'>
                {type}
            </h2>

        </div >
    )
}

export default DesignCard
