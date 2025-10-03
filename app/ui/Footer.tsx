'use client'
import React from 'react'
import useFetch from '../components/hooks/UseFetch'

const Footer = () => {

    type FooterType = { mail: string, instagram: string, youtube: string, whatsapp: string, _id: string }[]
    const { data } = useFetch<FooterType>('/api/footer');

    return (
        <footer className="bg-brand text-brand-light px-6 py-10 ">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* About Us */}
                <div>
                    <h3 className="font-bold mb-3">ABOUT US</h3>
                    <p className="text-sm leading-relaxed">
                        We are a production company put together by a number of
                        filmmakers with different backgrounds. This is how we create
                        effective, innovative and solid videos for the web.
                    </p>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="font-bold mb-3">CONTACT</h3>
                    <a href={`mailto:${data && data[0]?.mail}`} className="block underline hover:text-gray-700" target="_blank">
                        {data && data[0]?.mail}
                    </a>
                    <a href={`tel:${data && data[0]?.whatsapp}`} className="block underline hover:text-gray-700" target="_blank">
                        {data && data[0]?.whatsapp}
                    </a>
                </div>

                {/* Follow Us */}
                <div>
                    <h3 className="font-bold mb-3">FOLLOW US</h3>
                    <div className="flex flex-col space-y-2">
                        <a href={`${data && data[0]?.youtube}`} className="underline hover:text-gray-700" target="_blank">YOUTUBE</a>
                        <a href={`${data && data[0]?.instagram}`} className="underline hover:text-gray-700" target="_blank">INSTAGRAM</a>
                    </div>
                </div>
            </div>

            {/* Big Logo at Bottom */}
            <div className="text-[8vw] md:text-[5vw] font-extrabold text-brand-light mt-10 leading-none">
                FEELFRAMESTUDIO
            </div>
        </footer>
    )
}

export default Footer
