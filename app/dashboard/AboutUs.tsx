'use client'
import React from 'react'
import { useRouter } from 'next/router'

const AboutUs = () => {
    const router = useRouter()
    return (
        <div
            className='shadow bg-white rounded-lg p-6 hover:cursor-pointer hover:scale-105 duration-200 transition-all hover:shadow-md'
            onClick={() => router.push('/dashboard/about')}
        >
            <p className='font-bold text-xl'>Update About Us</p>
        </div>
    )
}

export default AboutUs
