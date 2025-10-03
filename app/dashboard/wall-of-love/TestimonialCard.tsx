'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LucideTrash } from "lucide-react";
import { Testimonial } from "@/app/type";


const TestimonialCard = ({ testimonial, goto, userId }: { testimonial: Testimonial, goto: string, userId: string }) => {

    const [loading, setLoading] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const router = useRouter();

    const handleTestimonialClick = () => {
        const url = `/dashboard/wall-of-love/${goto}`;
        router.push(url);
    };

    // const handleDeleteClick = (e: React.MouseEvent<SVGSVGElement>) => {
    //     e.stopPropagation(); // Prevent the event from bubbling up
    //     alert('Child clicked only');
    // };

    const handleDelete = async (e: React.MouseEvent<SVGSVGElement>, id: string) => {
        e.stopPropagation();
        try {
            setLoading(true);

            const response = await fetch(`/api/testimony/${id}?userId=${userId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
                setDeleted(true);
            } else {
                // rollback: delete all uploaded files
            }

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }

    }


    return (
        <div
            className={`relative p-6 rounded-2xl transition-all duration-300 border-2 hover:border-2 hover:border-brand border-brand-light  min-w-[300px] ${deleted ? "cursor-not-allowed pointer-events-none" : "cursor-pointer"}`}
            onClick={handleTestimonialClick}
        >

            {!loading ? (<LucideTrash className={`absolute top-6 right-6 transition-all duration-200 hover:scale-110  z-10 ${deleted ? "cursor-not-allowed" : "cursor-pointer"}`}
                onClick={(e) => { handleDelete(e, goto) }} />) : (
                <div className="absolute top-6 right-6 h-7 w-7 animate-spin rounded-full border-4 border-gray-300 border-t-brand pointer-events-none cursor-not-allowed"></div>

            )}


            <div className="space-y-4"
            >
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="font-semibold  text-lg">{testimonial.name}</h3>
                        {testimonial.role && (
                            <p className=" text-sm">
                                {testimonial.role}
                            </p>
                        )}
                    </div>
                </div>

                <blockquote className=" leading-relaxed">
                    {`"${testimonial.content}"`}
                </blockquote>
            </div>

            <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-600/5 to-orange-400/5 opacity-0 transition-opacity duration-300`}
            />
        </div>
    );
};

export default TestimonialCard;