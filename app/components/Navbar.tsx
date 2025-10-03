import React from 'react'
import Image from 'next/image'
import Link from 'next/link'


const Navbar = () => {
    return (
        <nav className="w-full p-4">
            <Link href={'/'}>
                <Image
                    src={'/feelframelogo.png'}
                    alt='logo'
                    width={55}
                    height={70}
                    className='w-[55px] h-[55px]'
                />
            </Link>
        </nav>
    )
}

export default Navbar
