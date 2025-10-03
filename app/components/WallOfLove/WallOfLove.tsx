"use client";

import { useState } from 'react';
import useFetch from '../hooks/UseFetch';
import TestimonialSkeleton from './TestimonialSkeleton';

type Testimonial = {
  _id: number;
  name: string;
  role: string;
  content: string;
};


const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-orange-500/10 border-2 border-brand-light"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
        <svg width={24} height={24} viewBox="0 0 24 24" className="text-orange-600">
          <path fill="currentColor" d="M14 17h3l2-4V7h-6v6h3M6 17h3l2-4V7H5v6h3l-2 4Z" />
        </svg>
      </div>

      <div className="space-y-4">
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
        className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-600/5 to-orange-400/5 opacity-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : ''
          }`}
      />
    </div>
  );
};

export default function WallOfLove() {

  const { data, loading, error } = useFetch<Testimonial[]>('/api/testimony');

  if (loading) return <>
    <div className="pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 border border-white/30 mb-6">
          <svg width={16} height={16} viewBox="0 0 24 24" className="text-yellow-400 fill-yellow-400">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span className="text-sm font-medium">Wall of Love</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
          What Our Users Say
        </h1>

        <p className="text-xl max-w-3xl mx-auto leading-relaxed">
          {`Join satisfied customers who have transformed their workflow with our platform. 
              Here's what they have to say about their experience.`}
        </p>
      </div>
    </div>
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <TestimonialSkeleton key={i} />
      ))}
    </div>

  </>

  if (error) return <div>Something went wrong</div>;

  return (
    <div className="min-h-screen">
      {/* Background Pattern */}

      <div className="relative">
        {/* Header */}
        <div className="pt-16 pb-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 border border-white/30 mb-6">
              <svg width={16} height={16} viewBox="0 0 24 24" className="text-yellow-400 fill-yellow-400">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-sm font-medium">Wall of Love</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              What Our Users Say
            </h1>

            <p className="text-xl max-w-3xl mx-auto leading-relaxed">
              {`Join satisfied customers who have transformed their workflow with our platform. 
              Here's what they have to say about their experience.`}
            </p>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="px-4 sm:px-6 lg:px-8 pb-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
              {(data ?? []).map((testimonial) => (
                <TestimonialCard key={testimonial._id} testimonial={testimonial} />
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="px-4 sm:px-6 lg:px-8 pb-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="p-8 rounded-3xl">
              <h2 className="text-2xl sm:text-3xl font-bold">
                Ready to Join Them?
              </h2>
              <p className=" mb-8 max-w-2xl mx-auto">
                Experience the difference for yourself. Join thousands of users who have already
                transformed their workflow with our platform.
              </p>

              <div className="flex items-center sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4  font-semibold rounded-xl transition-all duration-200 hover:scale-105 animate-bounce">
                  {`Let's Talk`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}