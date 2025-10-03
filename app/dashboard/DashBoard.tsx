'use client'

import React from 'react'
import useFetch from '../components/hooks/UseFetch';
import { IProject } from '../type';
import { Plus, Video } from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import { useRouter } from 'next/navigation';
import LoadingBackend from '../components/LoadingBackend';
import ErrorPage from '../ui/ErrorPage';


const DashBoard = ({ userId }: { userId: string }) => {
    const router = useRouter()
    const { data, loading, error } = useFetch<IProject[]>('/api/projects');

    if (loading) return <LoadingBackend />
    if (error) return <ErrorPage />
    
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

                <div
                    className='shadow bg-white rounded-lg p-6 hover:cursor-pointer hover:scale-105 duration-200 transition-all hover:shadow-md'
                    onClick={() => router.push('/dashboard/home')}
                >
                    <p className='font-bold text-xl'>Update Homepage Data</p>
                </div>

                <div
                    className='shadow bg-white rounded-lg p-6 hover:cursor-pointer hover:scale-105 duration-200 transition-all hover:shadow-md'
                    onClick={() => router.push('/dashboard/footer')}
                >
                    <p className='font-bold text-xl'>Update Footer Data</p>
                </div>

                <div
                    className='shadow bg-white rounded-lg p-6 hover:cursor-pointer hover:scale-105 duration-200 transition-all hover:shadow-md'
                    onClick={() => router.push('/dashboard/about')}
                >
                    <p className='font-bold text-xl'>Update About Us</p>
                </div>
                <div
                    className='shadow bg-white rounded-lg p-6 hover:cursor-pointer hover:scale-105 duration-200 transition-all hover:shadow-md'
                    onClick={() => router.push('/dashboard/wall-of-love')}
                >
                    <p className='font-bold text-xl'>Wall Of Love</p>
                </div>

            </div>

            {/* Projects Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold ">Portfolio Projects</h2>
                            <p className="text-sm  mt-1">{"Manage your studio's showcase projects and client work"}</p>
                        </div>
                        <button
                            className="inline-flex items-center px-4 py-2 bg-brand text-brand-light text-sm font-medium rounded-md hover:scale-105 duration-200 transition-all"
                            onClick={() => router.push('/dashboard/upload')}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Project
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {data && data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {
                                data.map((project, index) => (
                                    <ProjectCard key={index} title={project.projectTitle} userId={userId}
                                        id={project._id} thumbnail={project.thumbnail?.[0]?.url || '/placeholder.png'} isPublished={project.isPublished} client={project.client} description={project.videoShortDescription} createdAt={project.createdAt} />
                                ))
                            }
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Video className="mx-auto h-12 w-12  mb-4" />
                            <h3 className="text-lg font-medium  mb-2">No portfolio projects yet</h3>
                            <p className="mb-6">{"Start building your studio's portfolio by adding your first project"}</p>
                            <button
                                className="inline-flex items-center px-4 py-2 bg-brand text-white text-sm font-medium rounded-md hover:scale-105 transition-all duration-200"
                                onClick={() => router.push('/dashboard/upload')}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add First Project
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>

    )
}

export default DashBoard
