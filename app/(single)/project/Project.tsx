'use client'
import React, { useEffect, useState } from 'react'
import useStore from '@/store/useStore'
import Video from '@/app/ui/Video'
import Design from '@/app/ui/Design'
import Pictures from '@/app/ui/Pictures'
import Footer from '@/app/ui/Footer'
import WeirdNav from '@/app/components/WeirdNav'
import useFetch from '@/app/components/hooks/UseFetch'
import { IProject } from '@/app/type'
import { useRouter } from 'next/navigation'
import LoadingScreen from '@/app/components/LoadingScreen'
import ErrorPage from '@/app/ui/ErrorPage'


const divFilter = (inputList: string[], inputText: string) => {

    if (inputList.length === 0) {
        return false
    }
    else if (inputList.includes(inputText)) {
        return true
    }
    else {
        return false
    }
}

const ProjectDetails = ({ id }: { id: string }) => {
    const router = useRouter()

    const { data, loading, error } = useFetch<IProject>(`/api/projects/${id}`);

    const { tag } = useStore()
    const [types, setTypes] = useState<string[]>([])

    useEffect(() => {
        setTypes(data?.types ?? [])
    }, [data?.types])

    if (loading) return <LoadingScreen />;
    if (error) return <ErrorPage />;
    if (!data) return <ErrorPage />;


    if (tag === "design") {
        return (
            <div className='bg-brand-dark'>
                <WeirdNav />

                {
                    divFilter(types, "design") &&
                    <Design
                        designDescription={data.designDescription ?? ''}
                        designFiles={data.designFiles}
                        designTitle={data.designTitle ?? ''}
                    />
                }

                {
                    divFilter(types, "video") &&
                    <Video title={data.projectTitle} videoUrl={data.videoUrl} longDescription={data.videoLongDescription} shortDescription={data.videoShortDescription} />
                }

                {
                    divFilter(types, "photo") &&
                    <Pictures pictureShortDescription={data.pictureShortDescription} photoFiles={data.photoFiles} title={data.projectTitle} />
                }
                <div className='bg-brand p-8 flex items-center justify-center gap-2'>
                    <p
                        onClick={() => router.push("/more/design")}
                        className='text-brand-light underline cursor-pointer hover:scale-105 duration-200 transition-all'>
                        View more projects click here
                    </p>

                </div>

                <Footer />
            </div>

        )
    }
    if (tag === "picture") {
        return (
            <div className='bg-brand-dark'>
                <WeirdNav />
                {
                    divFilter(types, "photo") &&
                    <Pictures pictureShortDescription={data.pictureShortDescription} photoFiles={data.photoFiles} title={data.projectTitle} />
                }

                {
                    divFilter(types, "video") &&
                    <Video title={data.projectTitle} videoUrl={data.videoUrl} longDescription={data.videoLongDescription} shortDescription={data.videoShortDescription} />
                }

                {
                    divFilter(types, "design") &&
                    <Design
                        designDescription={data.designDescription ?? ''}
                        designFiles={data.designFiles}
                        designTitle={data.designTitle ?? ''}
                    />
                }
                <div className='bg-brand p-8 flex items-center justify-center gap-2'>
                    <p
                        onClick={() => router.push("/more/picture")}
                        className='text-brand-light underline cursor-pointer hover:scale-105 duration-200 transition-all'>
                        View more projects click here
                    </p>

                </div>
                <Footer />
            </div>

        )
    }
    if (tag === "video") {
        return (
            <div className='bg-brand-dark'>
                <WeirdNav />
                {
                    divFilter(types, "video") &&
                    <Video title={data.projectTitle} videoUrl={data.videoUrl} longDescription={data.videoLongDescription} shortDescription={data.videoShortDescription} />
                }
                {
                    divFilter(types, "photo") &&
                    <Pictures pictureShortDescription={data.pictureShortDescription} photoFiles={data.photoFiles} title={data.projectTitle} />
                }

                {
                    divFilter(types, "design") &&
                    <Design
                        designDescription={data.designDescription ?? ''}
                        designFiles={data.designFiles}
                        designTitle={data.designTitle ?? ''}
                    />
                }
                <div className='bg-brand p-8 flex items-center justify-center gap-2'>
                    <p
                        onClick={() => router.push("/more/video")}
                        className='text-brand-light underline cursor-pointer hover:scale-105 duration-200 transition-all'>
                        View more projects click here
                    </p>

                </div>
                <Footer />
            </div>



        )
    }

}

export default ProjectDetails
