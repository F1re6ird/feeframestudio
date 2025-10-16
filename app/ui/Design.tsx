"use client";
import React, { useState } from "react";
import Image from "next/image";

type DesignFile = {
  url: string;
  publicId: string;
};

interface DesignProps {
  designDescription: string;
  designFiles: DesignFile[];
  designTitle: string;
}

const Design: React.FC<DesignProps> = ({
  designDescription,
  designFiles,
  designTitle,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const closeModal = () => setSelectedImage(null);

  return (
    <div className="bg-brand-dark h-fit px-10 text-brand-light flex flex-col gap-10 pt-20 relative">
      <h1 className="text-4xl font-bold leading-[200%]">{designTitle}</h1>

      <p className="max-w-2xl leading-[200%]">{designDescription}</p>

      <div className="grid md:grid-cols-3 sm:grid-cols-2 pb-20 gap-4">
        {designFiles.map((file, index) => (
          <div
            key={index}
            onClick={() => setSelectedImage(file.url)}
            className="relative h-64 w-full cursor-pointer"
          >
            <Image
              src={file.url}
              alt={file.publicId}
              fill
              sizes="100vw"
              className="object-cover rounded-lg hover:opacity-90 transition"
            />
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedImage && (
        <div
          onClick={closeModal}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center cursor-pointer"
        >
          {/* prevent closing when clicking inside modal content */}
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
                alt="Selected design"
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

export default Design;
