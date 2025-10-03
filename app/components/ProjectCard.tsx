'use client'

import React from 'react';
import { useState } from 'react';
import { Calendar, Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Toast from './Toast';

export default function ProjectCard({
    id,
    title,
    thumbnail,
    isPublished,
    client,
    description,
    createdAt,
    userId
}: {
    id: string,
    title: string,
    thumbnail: string,
    isPublished: boolean,
    client: string,
    description: string,
    createdAt: Date
    userId: string
}) {

    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false)
    const [status, setStatus] = useState('')

    const router = useRouter();

    const publishDate = new Date(createdAt).toLocaleDateString();

    const handleEdit = async (id: string) => {
        router.push("/update/" + id)
    }

    const handleDelete = async (id: string) => {
        try {
            setLoading(true);

            const response = await fetch(`/api/projects/${id}?userId=${userId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
                setStatus("Portfolio uploaded successfully ✅");

            } else {
                // rollback: delete all uploaded files
                setStatus("Something went wrong ❌");
            }

        } catch (error) {
            console.log(error);
            setStatus("Something went wrong ❌");
        } finally {
            setLoading(false);
        }

        setStatus("Portfolio deleted successfully ✅");
    }

    return (
        <div className='relative'>
            <Toast
                show={show}
                message={status}
                onClose={() => setShow(false)}
            />
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200">
                <div className="relative">
                    <Image
                        width={200}
                        height={200}
                        src={thumbnail}
                        alt={title}
                        className="w-full h-48 object-cover"
                    />

                    <div className="absolute top-2 left-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${isPublished
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                            }`}>
                            {isPublished ? 'Published' : 'Draft'}
                        </span>
                    </div>

                </div>

                <div className="p-4">
                    <div className="flex flex-col justify-between items-start mb-3">
                        <div className="flex-1 flex-wrap">
                            <h3 className="font-semibold text-gray-900 truncate break-words whitespace-normal">{title}</h3>
                            <p className="text-sm text-indigo-600 font-medium">{client}</p>
                        </div>
                        <div className="flex items-center">
                            <button className="p-1 text-gray-400 hover:text-indigo-600 transition-colors" onClick={() => { handleEdit(id) }}>
                                <Edit className="h-4 w-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                onClick={() => { handleDelete(id) }}>
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{description}</p>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {publishDate}
                        </div>

                    </div>
                </div>
            </div>
        </div>


    );
}