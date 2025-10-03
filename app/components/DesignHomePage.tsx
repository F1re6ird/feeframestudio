'use client'
import React from 'react'

import { IProject } from '../type'
import useFetch from './hooks/UseFetch'
import DesignCard from './DesignCard'
import { useRouter } from 'next/navigation'
import SkeletonCard from './Skeleton'


const DesignHomePage = ({ sectionRefs }: { sectionRefs: { [key: string]: React.RefObject<HTMLDivElement | null> } }) => {

    const router = useRouter()

    const { data, loading, error } = useFetch<IProject[]>('/api/projects?type=design&limit=4')
    const handleClick = () => {
        router.push('/more/design')
    }

    if (loading) {
        return (
            <div
                id="designs"
                ref={sectionRefs.designs}
                className="min-h-screen flex flex-col items-center"
            >
                <h1 className='text-[14px] md:text-[16px] lg:text-[18px] leading-[200%]'>
                    Featured Designs
                </h1>
                <div className="md:flex gap-4 w-full p-4 py-8">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
                <h3
                    className="font-bold border-2 border-brand-light w-fit px-6 py-4 md:text-2xl lg:text-4xl text-xl rounded-lg hover:cursor-pointer hover:scale-105 duration-200 transition-all"
                    onClick={handleClick}
                >See more Designs</h3>
            </div >
        )
    }

    if (error) return <div>Error: {error.message}</div>;

    return (
        <div id="designs" ref={sectionRefs.designs} className="min-h-screen flex flex-col items-center" >
            <h1 className='text-[14px] md:text-[16px] lg:text-[18px] leading-[200%]'>
                Featured Designs
            </h1>
            <div className="md:flex gap-4 w-full p-4 py-8">
                {
                    data?.map((project: IProject) => <DesignCard
                        key={project._id}
                        type="design" id={project._id}
                        title={project.projectTitle}
                        url={project.thumbnail?.[0]?.url ?? '/placeholder.png'}
                    />)
                }
            </div>
            <h3
                className="font-bold border-2 border-brand-light w-fit px-6 py-4 md:text-2xl lg:text-4xl text-xl rounded-lg hover:cursor-pointer hover:scale-105 duration-200 transition-all"
                onClick={handleClick}
            >See more Designs</h3>
        </div >
    )
}

export default DesignHomePage
