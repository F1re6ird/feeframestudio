"use client"
import React, { useState } from "react";
import Image from "next/image";
import Masonry from "react-masonry-css";

type PhotoFiles = {
  url: string;
  publicId: string;
};

const Pictures = ({
  pictureShortDescription,
  photoFiles,
  title,
}: {
  pictureShortDescription: string;
  photoFiles: PhotoFiles[];
  title: string;
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const closeModal = () => setSelectedImage(null);

  return (
    <div className="bg-brand-secondary text-brand-light min-h-screen pr-4 py-20 md:px-14 relative">
      <div className="mx-auto">
        <h1 className="text-4xl font-bold mb-8 p-4">{`Photographs from ${title}`}</h1>

        <Masonry
          breakpointCols={{
            default: 3,
            768: 2,
            500: 1,
          }}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {/* First image */}
          <div
            onClick={() => setSelectedImage(photoFiles[0].url)}
            className="relative w-full max-w-sm aspect-[4/5] overflow-hidden rounded-lg mb-8 m-auto cursor-pointer"
          >
            <Image
              src={photoFiles[0].url}
              alt="VideoCard"
              fill
              className="object-cover hover:opacity-90 transition"
            />
          </div>

          <p className="min-h-40 mb-8 leading-[250%] text-2xl px-8">
            {pictureShortDescription}
          </p>

          {/* Rest of the photos */}
          {photoFiles.slice(1).map((file, index) => (
            <div
              key={index}
              onClick={() => setSelectedImage(file.url)}
              className="relative w-full max-w-sm aspect-[4/5] overflow-hidden rounded-lg mb-8 cursor-pointer"
            >
              <Image
                src={file.url}
                alt={file.publicId}
                fill
                className="object-cover hover:opacity-90 transition"
              />
            </div>
          ))}
        </Masonry>
      </div>

      {/* Modal */}
      {selectedImage && (
        <div
          onClick={closeModal}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center cursor-pointer"
        >
          {/* Stop click from closing when clicking inside the modal content */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full px-4"
          >
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 z-50 bg-white/30 hover:bg-white/60 text-white text-xl rounded-full w-8 h-8 flex items-center justify-center"
            >
              ×
            </button>

            <div className="relative w-full aspect-[4/5] max-h-[90vh] m-auto rounded-lg overflow-hidden">
              <Image
                src={selectedImage}
                alt="Selected photo"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pictures;
