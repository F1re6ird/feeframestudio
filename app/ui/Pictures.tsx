import React from 'react'
import Image from 'next/image'
import Masonry from 'react-masonry-css'

type PhotoFiles = {
    url: string
    publicId: string
}

const Pictures = ({
    pictureShortDescription,
    photoFiles,
    title
}: {
    pictureShortDescription: string
    pictureMoreDescription: string
    photoFiles: PhotoFiles[]
    title: string
}) => {
    return (
        <div className='bg-brand-secondary text-brand-light min-h-screen pr-4 py-20 md:px-14'>
            <h1 className='text-4xl font-bold mb-8 p-4'>
                {`Photographs from ${title}`}
            </h1>
            <Masonry
                breakpointCols={{
                    default: 2, // desktop and up
                    768: 1,     // below 768px (mobile) → single column
                }}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
            >
                <div className="relative w-full h-96 rounded-lg overflow-hidden mb-8">
                    <Image
                        src={photoFiles[0].url}
                        alt="VideoCard"
                        fill
                        className="object-cover "
                    />
                </div>

                <p className='min-h-40 mb-8 leading-[250%] text-2xl px-8'>
                    {pictureShortDescription}
                </p>

                {photoFiles.slice(1).map((file, index) => (
                    <div key={index} className="relative w-full h-96 rounded-lg overflow-hidden mb-8">
                        <Image
                            src={file.url}
                            alt={file.publicId}
                            fill
                            className="object-cover"
                        />
                    </div>
                ))}

            </Masonry>


        </div>
    )
}

export default Pictures
