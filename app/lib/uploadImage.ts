// lib/uploadImage.ts
export async function uploadImage(file: File, folder: string) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!
    );
    formData.append("folder", folder);

    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
        {
            method: "POST",
            body: formData,
        }
    );

    if (!res.ok) {
        throw new Error(`Upload failed: ${res.statusText}`);
    }

    const data = await res.json();

    return {
        url: data.secure_url as string,
        publicId: data.public_id as string,
    };
}
