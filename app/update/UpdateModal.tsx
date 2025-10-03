'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Upload, Video, FileText, User } from 'lucide-react';
import { uploadImages } from '../lib/uploadImages';
import Toast from '../components/Toast';
import { divFilter } from '../lib/utility';
import { IProject } from '../type';

const types = ['video', 'photo', 'design'];


import useFetch from '../components/hooks/UseFetch';


export default function UpdateModal({ userId, id }: { userId: string, id: string }) {

    const { data, loading, error } = useFetch<IProject>(`/api/projects/${id}?userId=${userId}`);

    const [show, setShow] = useState(false)
    const [status, setStatus] = useState('')
    const [selected, setSelected] = useState<string[]>([])

    const [formLoading, setLoading] = useState(false);
    const [thumbnail, setThumbnail] = useState<File[]>([]);
    const [photoFiles, setPhotoFiles] = useState<File[]>([]);
    const [designFiles, setDesignFiles] = useState<File[]>([]);

    const thumbnailRef = useRef<HTMLInputElement>(null);
    const photoInputRef = useRef<HTMLInputElement>(null);
    const designInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (fruit: string) => {
        setSelected((prev) =>
            prev.includes(fruit)
                ? prev.filter((item) => item !== fruit)
                : [...prev, fruit]
        );
    };

    const [formData, setFormData] = useState({
        projectTitle: '',
        videoShortDescription: '',
        videoLongDescription: '',
        client: '',
        videoUrl: '',
        pictureShortDescription: '',
        pictureMoreDescription: '',
        designTitle: '',
        designDescription: '',
        isPublished: false,
        isFeatured: false
    });

    useEffect(() => {
        if (data) {
            setFormData({
                projectTitle: data.projectTitle,
                videoShortDescription: data.videoShortDescription,
                videoLongDescription: data.videoLongDescription,
                client: data.client,
                videoUrl: data.videoUrl,
                pictureShortDescription: data.pictureShortDescription,
                pictureMoreDescription: data.pictureLongDescription,
                designTitle: data.designTitle,
                designDescription: data.designDescription,
                isPublished: data.isPublished,
                isFeatured: data.isFeatured
            });

            setSelected(data.types);
        }
    }, [data]);


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

            const videoUploads = await uploadImages(thumbnail, "thumbnail");
            const photoUploads = await uploadImages(photoFiles, "photos");
            const designUploads = await uploadImages(designFiles, "designs");
            // console.log("Form Data:", formData);
            // console.log("Project Files:", videoUploads);
            // console.log("Photo Files:", photoUploads);
            // console.log("Design Files:", designUploads);

            // TODO: send data + files to backend API

            // Prepare payload
            const payload = {
                ...formData,
                types: selected,
                videoUploads: videoUploads,   // [{ url, publicId }, ...]
                photoUploads: photoUploads,
                designUploads: designUploads,
            };


            const response = await fetch(`/api/projects/${id}?userId=${userId}`, {
                method: "PATCH",
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
        } catch {
            setStatus("Something went wrong ❌");
        } finally {
            setLoading(false);
        }

    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="bg-white w-full min-h-[90vh] overflow-y-auto">
            <Toast
                show={show}
                message={status}
                onClose={() => setShow(false)}
            />
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Add New Project</h2>
            </div>

            <div className="p-4 flex flex-col gap-4 w-full">
                <h2>Pick your template:</h2>
                <div className="flex gap-4">
                    {types.map((type) => (
                        <label
                            key={type}
                            className="w-fit text-xl md:text-2xl lg:text-4xl items-center">
                            <input
                                type="checkbox"
                                checked={selected.includes(type)}
                                onChange={() => handleChange(type)}
                                className="w-4 h-4 mr-2"
                            />
                            {type}
                        </label>
                    ))}
                </div>
            </div>

            <form className="p-6 space-y-6" onSubmit={handleSubmit}>
                {/* ---------------- Project Section ---------------- */}
                <h1 className="text-2xl font-semibold mb-4">Project Section</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/**project title */}
                    <div>
                        <label
                            className="block text-sm font-medium text-gray-700 mb-2">
                            <FileText
                                className="inline h-4 w-4 mr-1"
                            />
                            Project Title
                        </label>
                        <input
                            type="text"
                            name="projectTitle"
                            value={formData.projectTitle}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"

                        />
                    </div>

                    {/**client */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <User className="inline h-4 w-4 mr-1" />
                            Client Name
                        </label>
                        <input
                            type="text"
                            name="client"
                            value={formData.client}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"

                        />
                    </div>
                </div>

                <div className='relative'>
                    {/**short description */}
                    {
                        divFilter(selected, "video") &&
                        <div className="absolute top-0 left-0 w-full h-full z-10 bg-brand-light flex justify-center items-center">
                            <h1 className='text-2xl underline'>Check the video template to add video details</h1>
                        </div>

                    }
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
                        <textarea
                            name="videoShortDescription"
                            value={formData.videoShortDescription}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"

                        />
                    </div>

                    {/**long description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Long Description</label>
                        <textarea
                            name="videoLongDescription"
                            value={formData.videoLongDescription}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"

                        />
                    </div>



                    {/* ---------------- Youtube Link ---------------- */}
                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Video className="inline h-4 w-4 mr-1" />
                            Video youtube Url
                        </label>
                        <input
                            type="text"
                            name="videoUrl"
                            value={formData.videoUrl}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"

                        />
                    </div>

                    <div
                        className="border-2 border-dashed rounded-lg p-8 text-center mt-8"
                    >
                        <Video className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-lg font-medium text-gray-900">Upload Thumbnail Pic</p>
                        <input
                            type="file"
                            ref={thumbnailRef}
                            className="hidden"
                            multiple

                            onChange={(e) => handleFileChange(e, setThumbnail)}
                        />
                        <p className="text-sm text-gray-600">
                            {thumbnail.length} file(s) selected
                        </p>
                        <button
                            type="button"
                            onClick={() => thumbnailRef.current?.click()}
                            className="mt-4 px-4 py-2 border rounded-md bg-indigo-50 hover:bg-indigo-100"
                        >
                            <Upload className="h-4 w-4 inline mr-2" />
                            Choose File
                        </button>
                    </div>

                    {/* Preview for Project Files */}
                    {thumbnail.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                            {thumbnail.map((file, i) => (
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
                                            setThumbnail((prev) => prev.filter((_, index) => index !== i))
                                        }
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}

                        </div>
                    )}

                </div>

                {/* ---------------- Photo Section ---------------- */}
                <h1 className="text-2xl font-semibold mb-4">Photography Section</h1>

                <div className='relative'>
                    {
                        divFilter(selected, "photo") &&
                        <div className="absolute top-0 left-0 w-full h-full z-10 bg-brand-light flex justify-center items-center">
                            <h1 className='text-2xl underline'>Check the photo template to add photos details</h1>
                        </div>
                    }

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Short Photo Description</label>
                            <textarea
                                name="pictureShortDescription"
                                value={formData.pictureShortDescription}
                                onChange={handleInputChange}
                                rows={4}

                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">More Photo Description</label>
                            <textarea
                                name="pictureMoreDescription"
                                value={formData.pictureMoreDescription}
                                onChange={handleInputChange}
                                rows={4}

                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                        <Video className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-lg font-medium text-gray-900">Upload Photo Files</p>
                        <input
                            type="file"
                            ref={photoInputRef}
                            className="hidden"
                            multiple

                            accept="video/*,image/*"
                            onChange={(e) => handleFileChange(e, setPhotoFiles)}
                        />
                        <p className="text-sm text-gray-600">
                            {photoFiles.length} file(s) selected
                        </p>
                        <button
                            type="button"
                            onClick={() => photoInputRef.current?.click()}
                            className="mt-4 px-4 py-2 border rounded-md bg-indigo-50 hover:bg-indigo-100"
                        >
                            <Upload className="h-4 w-4 inline mr-2" />
                            Choose Files
                        </button>
                    </div>
                    {photoFiles.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                            {photoFiles.map((file, i) => (
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
                                            setPhotoFiles((prev) => prev.filter((_, index) => index !== i))
                                        }
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>



                {/* ---------------- Design Section ---------------- */}
                <h1 className="text-2xl font-semibold mb-4">Design Section</h1>

                <div className='relative'>
                    {
                        divFilter(selected, "design") &&
                        <div className="absolute top-0 left-0 w-full h-full z-10 bg-brand-light flex justify-center items-center">
                            <h1 className='text-2xl underline'>Check the design template to add design details</h1>
                        </div>
                    }

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Design Short Title</label>
                            <textarea
                                name="designTitle"
                                value={formData.designTitle}
                                onChange={handleInputChange}
                                rows={2}

                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                                name="designDescription"
                                value={formData.designDescription}
                                onChange={handleInputChange}
                                rows={4}

                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                        <Video className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-lg font-medium text-gray-900">Upload Design Files</p>
                        <input
                            type="file"
                            ref={designInputRef}
                            className="hidden"
                            multiple

                            accept="image/*,video/*"
                            onChange={(e) => handleFileChange(e, setDesignFiles)}
                        />
                        <p className="text-sm text-gray-600">
                            {designFiles.length} file(s) selected
                        </p>
                        <button
                            type="button"
                            onClick={() => designInputRef.current?.click()}
                            className="mt-4 px-4 py-2 border rounded-md bg-indigo-50 hover:bg-indigo-100"
                        >
                            <Upload className="h-4 w-4 inline mr-2" />
                            Choose Files
                        </button>
                    </div>

                    {designFiles.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                            {designFiles.map((file, i) => (
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
                                            setDesignFiles((prev) => prev.filter((_, index) => index !== i))
                                        }
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}

                        </div>
                    )}
                </div>



                {/* ---------------- Publish Options ---------------- */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Publishing Options</h3>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="isFeatured"
                            checked={formData.isFeatured}
                            onChange={handleInputChange}

                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                        <label className="ml-2 text-sm text-gray-700">Feature on homepage</label>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="isPublished"
                            checked={formData.isPublished}
                            onChange={handleInputChange}

                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                        <label className="ml-2 text-sm text-gray-700">Publish?</label>
                    </div>
                </div>

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
                        disabled={formLoading || selected.length === 0}
                        className={`px-4 py-2 text-sm font-medium rounded-md ${formLoading || selected.length === 0
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white"
                            }`}
                    >
                        {formLoading ? "Uploading..." : "Add to Portfolio"}
                    </button>
                </div>
            </form>
        </div>
    );
}