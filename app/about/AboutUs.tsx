'use client'

import React from 'react'
import Image from 'next/image'
import Footer from '../ui/Footer'
import useFetch from '../components/hooks/UseFetch'
import ErrorPage from '../ui/ErrorPage'
import { IAboutUs } from '../type'


const AboutUs = () => {

    const { data, loading, error } = useFetch<IAboutUs[]>('/api/about')
    console.log(data)

    if (error) return <ErrorPage />

    return (
        <>
            <section
                className='pt-16 px-6 py-32'
            >

                <div
                    className="h-fit grid sm:grid-cols-2 grid-cols-1 gap-16 md:mt-24 sm:mt-16 px-4 md:px-24"
                >
                    <div className="flex flex-col gap-4 md:justify-end items-left">
                        <h1 className="text-8xl font-bold">About</h1>
                        {loading ?
                            (<>
                                <p className="h-4 w-ful rounded-md bg-[#d85425] opacity-40 relative overflow-hidden">
                                    <span className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/50 to-transparent"></span>
                                </p>
                                <p className="h-4 w-ful rounded-md bg-[#d85425] opacity-40 relative overflow-hidden">
                                    <span className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/50 to-transparent"></span>
                                </p>
                                <p className="h-4 w-ful rounded-md bg-[#d85425] opacity-40 relative overflow-hidden">
                                    <span className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/50 to-transparent"></span>
                                </p>
                                <p className="h-4 w-ful rounded-md bg-[#d85425] opacity-40 relative overflow-hidden">
                                    <span className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/50 to-transparent"></span>
                                </p>
                            </>) : <p className="text-[14px] md:text-[16px] lg:text-[18px] leading-[200%]">
                                {data && data[0]?.aboutUs}
                            </p>}
                    </div>

                    <div className="relative w-full min-h-96">
                        <Image
                            src="/kortyagian.jpg"
                            alt="About Card"
                            fill
                            className="object-cover rounded-lg"
                        />
                    </div>

                </div>

            </section>
            <Footer />
        </>

    )
}

export default AboutUs
