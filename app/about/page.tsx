import React from 'react'
import WeirdNav from '../components/WeirdNav'
import Image from 'next/image'
import TeamGrid from '../ui/TeamGrid'
import Footer from '../ui/Footer'

const AboutUs = () => {
    return (
        <>
            <WeirdNav />
            <section
                className='pt-16 px-10'
            >
                <div
                    className="h-fit grid sm:grid-cols-2 grid-cols-1 gap-16 md:mt-24 sm:mt-16 px-4 md:px-24"
                >
                    <div className="flex flex-col gap-4 md:justify-end items-left">
                        <h1 className="text-8xl font-bold">About</h1>
                        <p className="text-[14px] md:text-[16px] lg:text-[18px] leading-[200%]">
                            FEELFRAMESTUDIO is a film production company made up of a variety of industry professionals with different backgrounds. This is how we create effective, innovative and quality videos for the web.
                        </p>
                    </div>

                    <Image
                        src="/kortyagian.jpg"
                        alt="VideoCard"
                        width={200}
                        height={200}
                        className="sm:max-h-96 max-h-48 w-full object-cover rounded-lg"
                    />
                </div>

                <TeamGrid />

            </section>
            <Footer />
        </>

    )
}

export default AboutUs
