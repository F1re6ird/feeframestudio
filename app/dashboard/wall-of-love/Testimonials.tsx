'use client'

import React from 'react'
import useFetch from '@/app/components/hooks/UseFetch';
import TestimonialCard from './TestimonialCard';
import { Testimonial } from '@/app/type';

const Testimonials = ({ userId }: { userId: string }) => {

    const { data, loading, error } = useFetch<Testimonial[]>('/api/testimony');

    console.log(data)
   


    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 p-4">
            {data?.map((testimonial) => (
                <TestimonialCard key={testimonial._id} userId={userId} testimonial={testimonial} goto={testimonial._id} />
            ))}
        </div>
    )
}

export default Testimonials
