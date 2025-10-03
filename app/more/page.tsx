'use client'
import React from 'react'
import Footer from '../ui/Footer'
import useFetch from '../components/hooks/UseFetch'
import { IProject } from '../type'
import Image from 'next/image'
import WeirdNav from '../components/WeirdNav'
import Navbar from '../components/Navbar'
import { useRouter } from 'next/navigation'
import useStore from '@/store/useStore'


type TagType = "video" | "picture" | "design"

const MorePage = () => {
    const { setTag } = useStore()

    const router = useRouter()


    const { data, loading, error } = useFetch<IProject[]>(`/api/projects`)

    console.log(data)

    if (loading) {
        return (
            <div className='flex justify-center items-center min-h-screen'>
                <h1>Loading...</h1>
            </div>
        )
    }

    if (error) {
        return (
            <div className='flex justify-center items-center min-h-screen'>
                <h1>Error: {error.message}</h1>
            </div>
        )
    }

    return (
        <>
            <Navbar />
            <WeirdNav />
            <section className="min-h-screen bg-brand-light p-6 mb-24">
                <h1 className='md:text-6xl text-3xl text-center font-bold leading-[200%] my-24'>
                    Works
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {(data ?? []).map((p) => (
                        <div
                            key={p.projectTitle}
                            className="relative rounded-xl overflow-hidden group cursor-pointer"
                            onClick={() => {
                                setTag(p.types[0] as TagType)
                                router.push(`/project/${p._id}`)
                            }}
                        >
                            <Image
                                src={p.thumbnail?.[0]?.url ?? '/placeholder.png'}
                                alt={p.projectTitle}
                                width={800}
                                height={600}
                                className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors" />
                            <h2 className="absolute bottom-4 left-4 text-2xl font-bold text-brand-light">
                                {p.projectTitle}
                            </h2>
                        </div>
                    ))}
                </div>
            </section>
            <Footer />
        </>

    )
}

export default MorePage
