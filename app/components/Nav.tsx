'use client'

import { useEffect, useRef, useState } from 'react'
import { GiCancel } from "react-icons/gi"
import { gsap } from 'gsap'
import Link from 'next/link'

export default function Nav({
    isClicked,
    onClosed,
}: {
    isClicked: boolean
    onClosed: () => void
}) {
    const navRef = useRef<HTMLDivElement>(null)
    const [shouldRender, setShouldRender] = useState(isClicked)

    // Handle mount/unmount transition
    useEffect(() => {
        if (isClicked) {
            setShouldRender(true)
        } else if (navRef.current) {
            gsap.to(navRef.current, {
                y: '100%',
                opacity: 0,
                duration: 0.5,
                ease: 'power2.out',
                onComplete: () => setShouldRender(false),
            })
        }
    }, [isClicked])

    // Animate in when mounted
    useEffect(() => {
        if (shouldRender && navRef.current) {
            gsap.fromTo(
                navRef.current,
                { y: '100%', opacity: 0 },
                { y: '0%', opacity: 1, duration: 0.6, ease: 'power3.out' }
            )
        }
    }, [shouldRender])

    // Disable scroll when nav is open
    useEffect(() => {
        if (isClicked) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isClicked])

    if (!shouldRender) return null

    return (
        <div
            ref={navRef}
            className='fixed inset-0 flex flex-col gap-10 items-center justify-center bg-[#d85425] text-brand-light z-50 '
        >
            <div className="absolute top-2 right-2 text-white text-3xl z-20 mt-4 mr-2">
                <GiCancel fill='#f5f5f5' onClick={onClosed} />
            </div>

            <Link href={'/'}>
                <div className='hover:scale-90 transition-all ease-in duration-100 hover:underline inline-block'>
                    <h1 className='text-5xl sm:text-7xl'>HOME</h1>
                </div>
            </Link>

            <Link href={'/more'}>
                <div className='hover:scale-90 transition-all ease-in duration-100 hover:underline inline-block'>
                    <h1 className='text-5xl sm:text-7xl'>WORK</h1>
                </div>
            </Link>

            <Link href="/#contact" scroll={false}>
                <div className='hover:scale-90 transition-all ease-in duration-100 hover:underline inline-block'>
                    <h1 className='text-5xl sm:text-7xl'>CONTACT</h1>
                </div>
            </Link>
        </div>
    )
}
