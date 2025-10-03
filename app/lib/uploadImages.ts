// lib/uploadImage.ts
export async function uploadImages(files: File[], folder: string) {

  const uploads: { url: string; publicId: string }[] = [];

  for (const file of files) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!);
    formData.append("folder", folder);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    uploads.push({ url: data.secure_url, publicId: data.public_id });
  }

  return uploads;
}
