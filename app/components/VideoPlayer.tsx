// components/VideoPlayer.tsx
"use client";

interface VideoPlayerProps {
    src: string;
    poster: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, poster }) => {

    return (
        <div  className={`sm:h-[80vh] h-80 w-full object-cover rounded-lg`}>
            <video
                autoPlay
                loop
                muted
                playsInline
                poster={poster}
                className='h-full w-full object-cover rounded-lg'
            >
                <source src={src} />
            </video>
        </div>
    );
};

export default VideoPlayer;


