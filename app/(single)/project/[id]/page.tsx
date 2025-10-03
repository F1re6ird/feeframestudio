import React from 'react';
import ProjectDetails from '../Project';

export default async function page(props: { params: Promise<{ id: string }> }) {
    const { id } = await props.params; // ✅ await before accessing

    return <ProjectDetails id={id} />;
}
