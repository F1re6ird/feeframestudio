'use client'
import React, { useState } from 'react';
import { FileText, User } from 'lucide-react';
import Toast from '@/app/components/Toast';
import { useRouter } from 'next/navigation';


export default function AddTestimony({ userId }: { userId: string }) {

    const router = useRouter();

    const [show, setShow] = useState(false)
    const [status, setStatus] = useState('')

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        role: '',
        content: '',
    });

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

            const response = await fetch(`/api/testimony?userId=${userId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setStatus("Testimonial uploaded successfully ✅");
                router.push('/dashboard/wall-of-love')
            } else {

                // rollback: delete all uploaded files
                setStatus("Something went wrong ❌");
                // rollback: delete all uploaded files
            }
        } catch (error) {
            console.log(error);
            setStatus("Something went wrong ❌");
        } finally {
            setLoading(false);
        }

    };

    return (
        <div className="w-full min-h-screen overflow-y-auto">
            <Toast
                show={show}
                message={status}
                onClose={() => setShow(false)}
            />
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold ">Add New Testimonial</h2>
            </div>

            <form className="p-6 space-y-6" onSubmit={handleSubmit}>
                {/* ---------------- Project Section ---------------- */}
                <h1 className="text-2xl font-semibold mb-4">Edit Home Contents</h1>

                <div>
                    <label
                        className="block text-sm font-medium mb-2">
                        <User
                            className="inline h-4 w-4 mr-1"
                        />
                        Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-brand rounded-md focus:ring-2 focus:ring-brand-secondary"

                    />
                </div>
                <div>
                    <label
                        className="block text-sm font-medium  mb-2">
                        <User
                            className="inline h-4 w-4 mr-1"
                        />
                        Role
                    </label>
                    <input
                        type="text"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-brand rounded-md focus:ring-2 focus:ring-brand-secondary"

                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        <FileText className="inline h-4 w-4 mr-1" />
                        Content
                    </label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-brand rounded-md focus:ring-2 focus:ring-indigo-500"

                    />
                </div>


                {/* ---------------- Buttons ---------------- */}
                <div className="flex justify-end space-x-3 py-6 border-t border-gray-200">
                    <button
                        onClick={() => router.push('/dashboard/wall-of-love')}
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
    );
}
