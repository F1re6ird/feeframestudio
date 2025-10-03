"use client";
import { useState, useEffect, useRef } from "react";
import WeirdNav from "./components/WeirdNav";
import Image from "next/image";
import useFetchHome from "./components/hooks/UseFetchHome";
import { IHome } from "./type";
import Contact from "./components/contacts/Contact";
import DesignHomePage from "./components/DesignHomePage";
import VideoHomePage from "./components/VideoHomePage";
import PictureHomePage from "./components/PictureHomePage";
import WallOfLove from "./components/WallOfLove/WallOfLove";
import Navbar from "./components/Navbar";
import VideoPlayer from "./components/VideoPlayer";
import { useRouter } from "next/navigation";
import Footer from "./ui/Footer";
import TextSkeleton from "./components/TextSkeleton";


function getYouTubeId(url: string | undefined): string {
  if (!url) return '';
  const regExp = /^.*(youtu\.be\/|v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : '';
}

export default function Page() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("home");

  const { homeData, homeLoading, homeError } = useFetchHome<IHome[]>('/api/homepage');

  // 👇 include ALL sections, not just the colored ones
  const sectionRefs = {
    home: useRef<HTMLDivElement | null>(null),
    videos: useRef<HTMLDivElement | null>(null),
    pictures: useRef<HTMLDivElement | null>(null),
    designs: useRef<HTMLDivElement | null>(null),
    contact: useRef<HTMLDivElement | null>(null),
    wallOfLove: useRef<HTMLDivElement | null>(null),
    showreel: useRef<HTMLDivElement | null>(null),
    why: useRef<HTMLDivElement | null>(null),
    about: useRef<HTMLDivElement | null>(null),
  };



  // 👇 Only these have special colors
  const colorMap: Record<string, string> = {
    videos: "bg-brand text-brand-light",
    pictures: "bg-brand-secondary text-brand-light",
    designs: "bg-brand-dark text-brand-light",
    wallOfLove: "bg-brand text-brand-light",
  };



  const fallbackBg = "bg-brand-light text-brand";

  // 👇 IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: [0.3, 0.5, 0.6, 0.7] } // detects earlier
    );


    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    // extra scroll listener to detect bottom of page
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

      if (scrollTop + clientHeight >= scrollHeight - 5) {
        // near bottom → reset to default/fallback
        setActiveSection("home");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [sectionRefs]);

  const scrollToSection = (section: keyof typeof sectionRefs) => {
    const ref = sectionRefs[section];
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };


  if (homeError) return <div>Something went wrong</div>;
  // 👇 Render
  return (
    <>
      <Navbar />
      <div
        className={`relative p-4 transition-colors duration-500 ${colorMap[activeSection] || fallbackBg
          }`}
      >
        <WeirdNav />

        {/* Hero / Intro Section */}
        <div
          id="home"
          ref={sectionRefs.home}
          className="grid sm:grid-cols-2 grid-cols-1 sm:gap-14 gap-16 mx-auto
          "
        >
          {/* <Image
            src="/artboard.jpg"
            alt="VideoCard"
            width={200}
            height={200}
            className="sm:h-[80vh] h-64 w-full object-cover rounded-lg"
          /> */}

          {homeLoading ? (<div className="relative w-full h-96 mb-8 animate-pulse bg-brand rounded-lg opacity-40"></div>) : (<VideoPlayer

            src={
              Array.isArray(homeData?.[0]?.heroVideo)
                ? homeData?.[0]?.heroVideo[0]?.url || ""
                : typeof homeData?.[0]?.heroVideo === "string"
                  ? homeData?.[0]?.heroVideo
                  : ""
            }

            poster="/korty.jpg"
          />)}

          <div className="flex flex-col justify-center ">

            {/** Hero Text */}
            <div className="flex flex-col gap-8 sm:items-start items-center">
              {homeLoading ? <TextSkeleton /> : (<h1 className="md:text-2xl lg:text-4xl text-xl font-bold w-3-fit text-center sm:text-left">
                {homeData?.[0]?.heroText}
              </h1>)}
              <button
                onClick={() => scrollToSection("contact")}
                className="border-brand border-2 px-10 py-4 w-fit md:text-2xl lg:text-4xl text-xl rounded-lg hover:bg-brand hover:text-brand-light font-bold transition-all duration-200 hover:scale-110">
                Contact
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-10 w-full py-40 h-fit">
          {/* <h1
            onClick={() => scrollToSection("videos")}
            className="md:text-2xl lg:text-4xl text-xl font-bold cursor-pointer hover:font-bold hover:underline transition-all duration-200 capitalize hover:scale-90"
          >
            VIDEO
          </h1> */}
          <Image
            onClick={() => scrollToSection("videos")}
            src={
              '/video.png'
            }
            alt="video section"
            width={50}
            height={50}
            className="transition-all duration-200 capitalize hover:scale-90"
          />
          {/* <h1
            onClick={() => scrollToSection("pictures")}
            className="md:text-2xl lg:text-4xl text-xl font-bold cursor-pointer hover:font-bold hover:underline transition-all duration-200 capitalize hover:scale-90"
          >
            PHOTOGRAPHY
          </h1> */}
          <Image
            onClick={() => scrollToSection("pictures")}
            src={"/picture.png"}
            alt="photo section"
            width={50}
            height={50}
            className="transition-all duration-200 capitalize hover:scale-90"
          />

          {/* <h1
            onClick={() => scrollToSection("designs")}
            className="md:text-2xl lg:text-4xl text-xl font-bold cursor-pointer hover:font-bold hover:underline transition-all duration-200 capitalize hover:scale-90"
          >
            DESIGNS
          </h1> */}
          <Image
            onClick={() => scrollToSection("designs")}
            src={"/design.png"}
            alt="design section"
            width={50}
            height={50}
            className="transition-all duration-200 capitalize hover:scale-90"
          />
        </div>

        <div
          id="about"
          ref={sectionRefs.about}
          className="grid sm:grid-cols-2 grid-cols-1 sm:gap-16 sm:px-16 md:px-24 mb-32 sm:text-left text-center"
        >

          {homeLoading ? (<div className="relative w-full h-96 mb-8 animate-pulse bg-brand rounded-lg opacity-40"></div>) :
            (<div className="relative w-full h-96 mb-8">
              <Image
                src={
                  Array.isArray(homeData?.[0]?.heroVideo)
                    ? homeData?.[0]?.aboutPic[0]?.url || ""
                    : typeof homeData?.[0]?.aboutPic === "string"
                      ? homeData?.[0]?.aboutPic
                      : ""
                }
                alt="short About"
                fill
                className="object-cover rounded-lg"
              />
            </div>)
          }


          <div className="flex flex-col gap-4 justify-center items-start">
            <h1 className="md:text-2xl lg:text-4xl mx-auto sm:m-0 text-xl font-bold">Welcome to our studio</h1>

            <div className="flex flex-col gap-4 sm:items-start items-center">

              {homeLoading ?
                (<TextSkeleton />) :
                (<p className="text-[14px] md:text-[16px] lg:text-[18px] leading-[200%]">
                  {homeData?.[0]?.shortAbout}
                </p>)
              }

              <button
                onClick={() => router.push('/about')}
                className="border-brand border-2 px-10 py-4 w-fit md:text-2xl lg:text-4xl text-xl rounded-lg sm:m-0 hover:bg-brand hover:text-brand-light font-bold transition-all duration-200 hover:scale-110">
                About Us
              </button>
            </div>
          </div>
        </div>

        {/* Videos */}
        <section className="min-h-screen flex flex-col gap-16">

          <VideoHomePage sectionRefs={sectionRefs} />

          {/* Pictures */}
          <PictureHomePage sectionRefs={sectionRefs} />

          {/* Designs */}
          <DesignHomePage sectionRefs={sectionRefs} />

        </section>

        <div
          id="showreel"
          ref={sectionRefs.showreel}
          className="md:min-h-screen min-h-[600px] flex items-center justify-center md:mt-16"
        >

          <div className="w-full">
            <iframe
              className="w-full sm:h-[500px] h-[350px] rounded-lg"
              src={`https://www.youtube.com/embed/${getYouTubeId(homeData?.[0]?.showreelUrl)}`}
              title={"Video 1"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

        </div>

        {/**Why choose us */}
        <div
          id="why"
          ref={sectionRefs.why}
          className="grid sm:grid-cols-2 grid-cols-1 gap-16 md:mt-32 sm:mt-16 px-4 md:px-24"
        >
          <div className="flex flex-col gap-4 md:justify-center items-left">
            <h1 className="md:text-2xl lg:text-4xl text-xl font-bold">Why choose us?</h1>
            {homeLoading ? (<TextSkeleton />) : (<p className="text-[14px] md:text-[16px] lg:text-[18px] leading-[200%]">
              {
                (homeData?.[0]?.whyChoose)
              }
            </p>)}
          </div>

          {homeLoading ? (<div className="relative h-96 animate-pulse bg-brand rounded-lg opacity-40"></div>) : (<div className="relative h-96 bg-red">
            <Image
              src={
                Array.isArray(homeData?.[0]?.heroVideo)
                  ? homeData?.[0]?.whyChooseUsPic[0]?.url || ""
                  : typeof homeData?.[0]?.whyChooseUsPic === "string"
                    ? homeData?.[0]?.whyChooseUsPic
                    : ""
              }
              alt="VideoCard"
              fill
              className=" w-full object-cover rounded-lg mb-8"
            />
          </div>)}


        </div>

        <div
          id="wallOfLove"
          ref={sectionRefs.wallOfLove}
          className="min-h-screen mt-32"
        >
          <WallOfLove />
        </div>

        {/* Contact */}
        <div
          id="contact"
          ref={sectionRefs.contact}
          className="min-h-screen"
        >
          <Contact />
        </div>
      </div>
      <Footer />
    </>
  );
}