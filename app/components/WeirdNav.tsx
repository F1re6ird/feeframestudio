'use client'
import React from 'react'
import { useState, useEffect } from 'react'
import Nav from './Nav'
import { RxHamburgerMenu } from "react-icons/rx"

const WeirdNav = () => {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsScrolled(scrollTop > 80); // You can adjust the threshold
        };

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => {
        setIsOpen(prev => !prev)
    }

    return (
        <>
            <div
                className={`
          fixed top-5 right-4 text-brand-light bg-[#d85425] p-[1px] rounded-lg z-10 hover:scale-90 transition-all ease-in duration-100  ${isScrolled ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-0'}
        `}>
                <RxHamburgerMenu onClick={toggleMenu} className='w-[35px] h-[35px]' />
            </div>
            <Nav
                isClicked={isOpen}
                onClosed={() => setIsOpen(false)}
            />
        </>
    )
}

export default WeirdNav
