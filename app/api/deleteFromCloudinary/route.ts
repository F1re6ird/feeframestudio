// // /pages/api/deleteFromCloudinary.ts
// import type { NextApiRequest, NextApiResponse } from "next";
// import { v2 as cloudinary } from "cloudinary";

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// type Data =
//   | { success: true }
//   | { error: string };

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<Data>
// ) {
//   if (req.method === "POST") {
//     const { publicIds } = req.body as { publicIds: string[] };

//     if (!publicIds || !Array.isArray(publicIds)) {
//       return res.status(400).json({ error: "publicIds must be an array" });
//     }

//     try {
//       await Promise.all(publicIds.map((id) => cloudinary.uploader.destroy(id)));
//       res.status(200).json({ success: true });
//     } catch (error) {
//       res.status(500).json({ error: (error as Error).message });
//     }
//   } else {
//     res.setHeader("Allow", ["POST"]);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }

// https://res.cloudinary.com/da7jtwv3v/image/upload/v1757901173/designs/bbunw9tkxx5w8dgoeb4e.jpg