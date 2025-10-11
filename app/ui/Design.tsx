import React from 'react'
import Image from 'next/image'

type DesignFile = {
    url: string;
    publicId: string;
};

interface DesignProps {
    designDescription: string;
    designFiles: DesignFile[];  // 👈 array of objects
    designTitle: string;
}

const Design: React.FC<DesignProps> = ({
    designDescription,
    designFiles,
    designTitle,
}) => {
    return (
        <div className='bg-brand-dark h-fit px-10 text-brand-light flex flex-col gap-10 pt-20'>


            <h1 className='text-4xl font-bold leading-[200%]'>
                {designTitle}
            </h1>
            <p className='max-w-2xl leading-[200%]'>
                {designDescription}
            </p>

            <div className='grid md:grid-cols-3 sm:grid-cols-2 pb-20 gap-4'>
                {designFiles.map((file, index) => (
                    <div key={index} className='relative h-64 w-full'>
                        <Image
                            src={file.url}
                            alt={file.publicId}
                            fill
                            sizes="100vw"
                            className='object-cover rounded-lg'
                        />
                    </div>
                ))}
            </div>

        </div>
    )
}

export default Design
