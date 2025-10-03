import React from 'react';

interface StatsCardProps {
    title: string;
    value: string;
}

export default function StatsCard({ title, value }: StatsCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
                </div>
            </div>
        </div>
    );
}