'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import Toast from '../../components/Toast'
import { FileText } from 'lucide-react'
import useFetch from '@/app/components/hooks/UseFetch'
import { useRouter } from 'next/navigation'

const UpdateFooterLinks = ({ userId }: { userId: string }) => {

    const router = useRouter()

    type FooterType = { mail: string, instagram: string, youtube: string, whatsapp: string, _id: string }[]
    const { data } = useFetch<FooterType>('/api/footer');

    console.log(data && data[0]?._id)

    useEffect(() => {
        if (data && Array.isArray(data)) {
            setFormData({ mail: data[0]?.mail, instagram: data[0]?.instagram, youtube: data[0]?.youtube, whatsapp: data[0]?.whatsapp });
        }
    }, [data])

    const [show, setShow] = useState(false)
    const [status, setStatus] = useState("")
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        mail: "",
        instagram: "",
        youtube: "",
        whatsapp: "",
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

            const response = await fetch(`/api/footer/${data && data[0]?._id}?userId=${userId}`, {
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
                <h2 className="text-xl font-semibold ">Edit Footer Links</h2>
            </div>
            <form onSubmit={handleSubmit}>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 p-8'>

                    {/* instagram field */}
                    <div>
                        <label
                            className="block text-sm font-medium  mb-2">
                            <FileText
                                className="inline h-4 w-4 mr-1"
                            />
                            Instagram Link
                        </label>
                        <input
                            type="text"
                            name="instagram"
                            value={formData.instagram}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* whatsapp field */}
                    <div>
                        <label
                            className="block text-sm font-medium mb-2">
                            <FileText
                                className="inline h-4 w-4 mr-1"
                            />
                            Whatsapp Link
                        </label>
                        <input
                            type="text"
                            name="whatsapp"
                            value={formData.whatsapp}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* yoututbe field */}
                    <div>
                        <label
                            className="block text-sm font-medium mb-2">
                            <FileText
                                className="inline h-4 w-4 mr-1"
                            />
                            Youtube Link
                        </label>
                        <input
                            type="text"
                            name="youtube"
                            value={formData.youtube}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* mail field */}
                    <div>
                        <label
                            className="block text-sm font-medium mb-2">
                            <FileText
                                className="inline h-4 w-4 mr-1"
                            />
                            your mail
                        </label>
                        <input
                            type="text"
                            name="mail"
                            value={formData.mail}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                {/* ---------------- Buttons ---------------- */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 p-8 items-center">
                    <button
                        type="button"
                        className="px-4 py-2 text-sm font-medium bg-white border rounded-md hover:scale-105"
                        onClick={() => router.push('/dashboard')}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-4 py-2 text-sm font-medium rounded-md ${loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-brand hover:scale-105 text-brand-light"
                            }`}
                    >
                        {loading ? "Updating..." : "Update Footer Links"}
                    </button>
                </div>
            </form>


        </div>
    )
}

export default UpdateFooterLinks
