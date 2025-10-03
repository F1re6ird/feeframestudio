'use client'
import React, { useState, useRef } from 'react';
import { Upload, Video, FileText, User } from 'lucide-react';
import { uploadImages } from '../../lib/uploadImages';
import Toast from '../../components/Toast';

export default function PostHome({ userId }: { userId: string }) {

    const [show, setShow] = useState(false)
    const [status, setStatus] = useState('')

    const [loading, setLoading] = useState(false);
    const [heroVideo, setHeroVideo] = useState<File[]>([]);
    const [aboutPic, setAboutPic] = useState<File[]>([]);
    const [whyChooseUs, setWhyChooseUs] = useState<File[]>([]);

    const heroVideoInputRef = useRef<HTMLInputElement>(null);
    const aboutPicInputRef = useRef<HTMLInputElement>(null);
    const whyChooseUsPicInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        heroText: '',
        whyChoose: '',
        shortAbout: '',
        showreelUrl: '',
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFiles: React.Dispatch<React.SetStateAction<File[]>>) => {
        if (e.target.files) {
            setFiles(prev => [
                ...prev,
                ...Array.from(e.target.files ?? [])
            ]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            // prevent it from sending if there is no user

            const heroUpload = await uploadImages(heroVideo, "videos");
            const aboutUploads = await uploadImages(aboutPic, "photos");
            const whyChooseUploads = await uploadImages(whyChooseUs, "designs");

            // TODO: send data + files to backend API

            // Prepare payload
            const payload = {
                ...formData,
                heroVideo: heroUpload,   // [{ url, publicId }, ...]
                aboutPic: aboutUploads,
                whyChooseUsPic: whyChooseUploads,
            };


            const response = await fetch(`/api/homepage?userId=${userId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setStatus("Portfolio uploaded successfully ✅");
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
                <h2 className="text-xl font-semibold text-gray-900">Add New Portfolio Project</h2>
            </div>

            <form className="p-6 space-y-6" onSubmit={handleSubmit}>
                {/* ---------------- Project Section ---------------- */}
                <h1 className="text-2xl font-semibold mb-4">Edit Home Contents</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label
                            className="block text-sm font-medium text-gray-700 mb-2">
                            <FileText
                                className="inline h-4 w-4 mr-1"
                            />
                            Hero Text
                        </label>
                        <input
                            type="text"
                            name="heroText"
                            value={formData.heroText}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"

                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <User className="inline h-4 w-4 mr-1" />
                            short Note for About
                        </label>
                        <textarea
                            name="shortAbout"
                            value={formData.shortAbout}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"

                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Why choose Us</label>
                        <textarea
                            name="whyChoose"
                            value={formData.whyChoose}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Video className="inline h-4 w-4 mr-1" />
                            ShowReel Video Youtube Link
                        </label>
                        <input
                            type="text"
                            name="showreelUrl"
                            value={formData.showreelUrl}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"

                        />
                    </div>

                </div>


                <div
                    className="border-2 border-dashed rounded-lg p-8 text-center"
                >
                    <Video className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium text-gray-900">Hero Video</p>
                    <input
                        type="file"
                        ref={heroVideoInputRef}
                        className="hidden"
                        multiple

                        onChange={(e) => handleFileChange(e, setHeroVideo)}
                    />
                    <p className="text-sm text-gray-600">
                        {heroVideo.length} file(s) selected
                    </p>
                    <button
                        type="button"
                        onClick={() => heroVideoInputRef.current?.click()}
                        className="mt-4 px-4 py-2 border rounded-md bg-indigo-50 hover:bg-indigo-100"
                    >
                        <Upload className="h-4 w-4 inline mr-2" />
                        Choose Files
                    </button>
                </div>

                {/* Preview for Project Files */}
                {heroVideo.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {heroVideo.map((file, i) => (
                            <div key={i} className="relative border rounded-md p-2">
                                {file.type.startsWith("video/") ? (
                                    <video
                                        src={URL.createObjectURL(file)}
                                        controls
                                        className="w-full h-32 object-cover rounded"
                                    />
                                ) : (
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={file.name}
                                        className="w-full h-32 object-cover rounded"
                                    />
                                )}
                                <p className="mt-1 text-xs truncate">{file.name}</p>

                                {/* Remove button */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        setHeroVideo((prev) => prev.filter((_, index) => index !== i))
                                    }
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}

                    </div>
                )}

                {/**About US Pic*/}
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Video className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium text-gray-900">About Pic</p>
                    <input
                        type="file"
                        ref={aboutPicInputRef}
                        className="hidden"
                        multiple

                        accept="video/*,image/*"
                        onChange={(e) => handleFileChange(e, setAboutPic)}
                    />
                    <p className="text-sm text-gray-600">
                        {aboutPic.length} file(s) selected
                    </p>
                    <button
                        type="button"
                        onClick={() => aboutPicInputRef.current?.click()}
                        className="mt-4 px-4 py-2 border rounded-md bg-indigo-50 hover:bg-indigo-100"
                    >
                        <Upload className="h-4 w-4 inline mr-2" />
                        Choose Files
                    </button>
                </div>
                {aboutPic.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {aboutPic.map((file, i) => (
                            <div key={i} className="relative border rounded-md p-2">
                                {file.type.startsWith("video/") ? (
                                    <video
                                        src={URL.createObjectURL(file)}
                                        controls
                                        className="w-full h-32 object-cover rounded"
                                    />
                                ) : (
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={file.name}
                                        className="w-full h-32 object-cover rounded"
                                    />
                                )}
                                <p className="mt-1 text-xs truncate">{file.name}</p>

                                {/* Remove button */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        setAboutPic((prev) => prev.filter((_, index) => index !== i))
                                    }
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/**Why Choose Us Pic*/}
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Video className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium text-gray-900">Why choose Us Pic</p>
                    <input
                        type="file"
                        ref={whyChooseUsPicInputRef}
                        className="hidden"
                        multiple

                        accept="video/*,image/*"
                        onChange={(e) => handleFileChange(e, setWhyChooseUs)}
                    />
                    <p className="text-sm text-gray-600">
                        {whyChooseUs.length} file(s) selected
                    </p>
                    <button
                        type="button"
                        onClick={() => whyChooseUsPicInputRef.current?.click()}
                        className="mt-4 px-4 py-2 border rounded-md bg-indigo-50 hover:bg-indigo-100"
                    >
                        <Upload className="h-4 w-4 inline mr-2" />
                        Choose Files
                    </button>
                </div>
                {whyChooseUs.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {whyChooseUs.map((file, i) => (
                            <div key={i} className="relative border rounded-md p-2">
                                {file.type.startsWith("video/") ? (
                                    <video
                                        src={URL.createObjectURL(file)}
                                        controls
                                        className="w-full h-32 object-cover rounded"
                                    />
                                ) : (
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={file.name}
                                        className="w-full h-32 object-cover rounded"
                                    />
                                )}
                                <p className="mt-1 text-xs truncate">{file.name}</p>

                                {/* Remove button */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        setWhyChooseUs((prev) => prev.filter((_, index) => index !== i))
                                    }
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )}



                {/* ---------------- Buttons ---------------- */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-4 py-2 text-sm font-medium rounded-md ${loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white"
                            }`}
                    >
                        {loading ? "Uploading..." : "Add to Hompage"}
                    </button>
                </div>
            </form>
        </div>
    );
}
