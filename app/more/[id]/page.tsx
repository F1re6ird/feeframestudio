import React from 'react'
import MorePage from '../MorePage'

type TagType = "video" | "picture" | "design"
export default async function page(props: { params: Promise<{ id: TagType }> }) {
    const { id } = await props.params;
    return (
        <MorePage type={id} />
    )
}
