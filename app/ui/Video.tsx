import React from 'react'
function getYouTubeId(url: string): string {
    if (!url) return '';
    const regExp = /^.*(youtu\.be\/|v=)([^#&?]*).*/;
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : '';
}

const Video = ({
    title,
    videoUrl,
    longDescription,
    shortDescription,
}: {
    title: string
    videoUrl: string
    longDescription: string
    shortDescription: string
}) => {
    return (
        <>
            <section className='text-brand-light'>
                <div className='grid grid-cols-2 min-h-48'>

                    <div className='bg-[#d85425] p-8 border-t-[1px] border-[#414145]'>
                        <h1 className='sm:text-5xl text-3xl '>{title}</h1>
                    </div>
                    <div className='bg-[#414145] min-h-full p-8'>
                        <p>{shortDescription}</p>
                    </div>
                </div>

                <div className="w-full">
                    <iframe
                        className="w-full sm:h-screen h-[350px]"
                        src={`https://www.youtube.com/embed/${getYouTubeId(videoUrl)}`}
                        title={"Video 1"}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
                <div className='bg-[#d85425] min-h-[80vh]'>
                    <p className='max-w-3xl text-2xl p-8 leading-[200%]'>{longDescription}</p>
                </div>
            </section>
        </>
    )
}

export default Video
