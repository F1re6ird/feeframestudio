'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import Toast from '../../components/Toast'
import { User } from 'lucide-react'
import useFetch from '@/app/components/hooks/UseFetch'
import { useRouter } from 'next/navigation'

const UpdateAboutUs = ({ userId }: { userId: string }) => {
    const router = useRouter()

    type AboutUsData = { aboutUs: string, _id: string }[];
    const { data } = useFetch<AboutUsData>('/api/about');

    console.log(data && data[0]?._id)

    useEffect(() => {
        if (data && Array.isArray(data)) {
            setFormData({ aboutUs: data[0]?.aboutUs });
        }
    }, [data]);


    const [show, setShow] = useState(false)
    const [status, setStatus] = useState("")
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        aboutUs: "",
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            setFormData({
                ...formData,
                [name]: (e.target as HTMLInputElement).checked
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);

            const response = await fetch(`/api/about/${data && data[0]?._id}?userId=${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setStatus("Portfolio uploaded successfully ✅");
            } else {
                setStatus("Something went wrong ❌");
            }

            console.log("Form Data:", formData);
        } catch (error) {
            console.log(error);
            setStatus("Something went wrong ❌");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='w-full min-h-screen overflow-y-auto'>
            <Toast
                show={show}
                message={status}
                onClose={() => setShow(false)}
            />

            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold ">Edit About note</h2>
            </div>
            <form onSubmit={handleSubmit}>
                <div className='grid grid-cols-1 gap-6 p-8'>

                    {/* instagram field */}
                    <div>
                        <label className="block text-sm font-medium  mb-2">
                            <User className="inline h-4 w-4 mr-1" />
                            short Note for About
                        </label>
                        <textarea
                            name="aboutUs"
                            value={formData.aboutUs}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 [field-sizing:content] min-h-[450px] text-xl leading-[200%]"

                        />
                    </div>
                </div>

                {/* ---------------- Buttons ---------------- */}
                <div className="flex justify-end space-x-3 p-8 border-t border-gray-200">
                    <button
                        onClick={() => router.push('/dashboard')}
                        type="button"
                        className="px-4 py-2 text-sm font-medium bg-white border rounded-md hover:scale-105 transition-all duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-4 py-2 text-sm font-medium rounded-md duration-200 transition-all ${loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-brand hover:scale-105 text-white"
                            }`}
                    >
                        {loading ? "Uploading..." : "Add to Testimonials"}
                    </button>
                </div>
            </form>

        </div>
    )
}

export default UpdateAboutUs
