"use client";
import { useState, useEffect, useRef, useMemo } from "react";
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
import ErrorPage from "./ui/ErrorPage";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);


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
  const homeRef = useRef<HTMLDivElement | null>(null);
  const videosRef = useRef<HTMLDivElement | null>(null);
  const picturesRef = useRef<HTMLDivElement | null>(null);
  const designsRef = useRef<HTMLDivElement | null>(null);
  const contactRef = useRef<HTMLDivElement | null>(null);
  const wallOfLoveRef = useRef<HTMLDivElement | null>(null);
  const showreelRef = useRef<HTMLDivElement | null>(null);
  const whyRef = useRef<HTMLDivElement | null>(null);
  const aboutRef = useRef<HTMLDivElement | null>(null);



  const sectionRefs = useMemo(() => ({
    home: homeRef,
    videos: videosRef,
    pictures: picturesRef,
    designs: designsRef,
    contact: contactRef,
    wallOfLove: wallOfLoveRef,
    showreel: showreelRef,
    why: whyRef,
    about: aboutRef,
  }), []);

  useEffect(() => {
    if (homeLoading) return; // do nothing until data is loaded

    // Clean up any pre-existing triggers for safety
    ScrollTrigger.getAll().forEach((t) => t.kill());

    const createdTriggers: ScrollTrigger[] = [];

    // animate each section ref if it has a DOM node
    Object.values(sectionRefs).forEach((ref) => {
      const el = ref.current;
      if (!el) return;

      const tween = gsap.fromTo(
        el,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            end: "bottom 60%",
            toggleActions: "play none none none", // ✅ only plays once
            // markers: true, // <-- enable for visual debugging
          },
        }
      );

      if (tween.scrollTrigger) createdTriggers.push(tween.scrollTrigger);
    });

    return () => {
      createdTriggers.forEach((t) => t.kill && t.kill());
    };
  }, [homeLoading, sectionRefs]);

  // 👇 Only these have special colors
  const colorMap: Record<string, string> = {
    videos: "bg-brand text-brand-light",
    pictures: "bg-brand-secondary text-brand-light",
    designs: "bg-brand-dark text-brand-light",
    wallOfLove: "bg-brand text-brand-light",
  };

  const fallbackBg = "bg-brand-light text-brand";

  console.log(colorMap[activeSection]);

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


  if (homeError) return <ErrorPage />;
  // 👇 Render
  return (
    <>
      <Navbar />
      <div
        className={`relative p-4 transition-colors duration-500 flex flex-col gap-12 sm:gap-16 ${colorMap[activeSection] || fallbackBg
          }`}
      >
        <WeirdNav />

        {/* Hero / Intro Section */}
        <div
          id="home"
          ref={sectionRefs.home}
          className="grid sm:grid-cols-2 grid-cols-1 sm:gap-14 gap-9"
        >

          {homeLoading ? (<div className="relative w-full h-96 animate-pulse bg-brand rounded-lg opacity-70"></div>) : (<VideoPlayer

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
            <div className="flex flex-col gap-8 sm:items-start items-center ">
              {homeLoading ? <TextSkeleton /> : (<p className={`md:text-2xl lg:text-5xl text-xl font-bold w-3-fit text-center sm:text-left leading-snug md:leading-normal lg:leading-relaxed ${colorMap[activeSection] && colorMap[activeSection].includes("bg-") ? "text-brand-light" : "text-brand-dark"
                }`}>
                {homeData?.[0]?.heroText}
              </p>)}
              <button
                onClick={() => scrollToSection("contact")}
                className="border-brand bg-brand text-brand-light border-2 px-10 py-4 w-fit md:text-2xl lg:text-4xl text-xl rounded-lg font-semi-bold transition-all duration-200 hover:scale-110">
                Contact
              </button>
            </div>
          </div>
        </div>

        <div className={`flex items-center justify-center gap-1 md:gap-4 w-full h-fit py-8 ${colorMap[activeSection] && colorMap[activeSection].includes("bg-") ? "text-brand-light" : "text-brand"
          }`}>
          <h1
            onClick={() => scrollToSection("videos")}
            className="transition-all duration-200 capitalize hover:scale-90 cursor-pointer text-xl font-bold sm:text-4xl"
          >
            VIDEOS
          </h1>
          |
          <h1
            onClick={() => scrollToSection("pictures")}
            className="transition-all duration-200 capitalize hover:scale-90 cursor-pointer text-xl font-bold sm:text-4xl"
          >
            PHOTOGRAPHY
          </h1>
          |
          <h1
            onClick={() => scrollToSection("designs")}
            className="transition-all duration-200 capitalize hover:scale-90 cursor-pointer text-xl font-bold sm:text-4xl"
          >
            DESIGNS
          </h1>
        </div>


        <div
          id="about"
          ref={sectionRefs.about}
          className="grid sm:grid-cols-2 grid-cols-1 gap-8 sm:gap-16 sm:px-16 md:px-24 sm:text-left text-center py-8"
        >

          {homeLoading ? (<div className="relative w-full h-fit mb-8 animate-pulse bg-brand rounded-lg opacity-40"></div>) :
            (<div className="relative w-full min-h-96">
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
            {/* <h1 className="md:text-2xl lg:text-4xl mx-auto sm:m-0 text-xl font-bold">Welcome to our studio</h1> */}

            <div className="flex flex-col w-full gap-4 items-center sm:items-start">

              {homeLoading ?
                (<TextSkeleton />) :
                (<p className={`text-[14px] md:text-[16px] lg:text-[20px] leading-[200%] font-bold ${colorMap[activeSection] && colorMap[activeSection].includes("bg-") ? "text-brand-light" : "text-brand-dark"
                  }`}>
                  {homeData?.[0]?.shortAbout}
                </p>)
              }

              <button
                onClick={() => router.push('/about')}
                className={`border-brand border-2 px-10 py-4 w-fit md:text-2xl lg:text-4xl text-xl rounded-lg sm:m-0 hover:text-brand-light font-bold transition-all duration-200 hover:scale-110 bg-brand text-brand-light ${colorMap[activeSection] && colorMap[activeSection].includes("bg-") ? "border-brand-light" : ""
                  }`}>
                About Us
              </button>
            </div>
          </div>
        </div>

        {/* Videos */}
        <section className="min-h-screen flex flex-col gap-8">
          <VideoHomePage sectionRefs={sectionRefs} />
          <PictureHomePage sectionRefs={sectionRefs} />
          <DesignHomePage sectionRefs={sectionRefs} />
        </section>

        <div
          id="showreel"
          ref={sectionRefs.showreel}
          className="md:min-h-screen flex items-center justify-center"
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
          className="grid sm:grid-cols-2 grid-cols-1 gap-8 sm:gap-12 px-4 md:px-24"
        >
          <div className={`flex flex-col gap-4 md:justify-center items-left ${colorMap[activeSection] && colorMap[activeSection].includes("bg-") ? "text-brand-light" : "text-brand-dark"
            }`}>
            <h1 className="md:text-3xl lg:text-4xl text-xl font-bold">Why choose us?</h1>
            {homeLoading ? (<TextSkeleton />) : (<p className={`text-[14px] md:text-[16px] lg:text-[20px] leading-[200%]`}>
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

        <WallOfLove sectionRefs={sectionRefs} />


        {/* Contact */}
        <div
          id="contact"
          ref={sectionRefs.contact}
          className="min-h-screen"
        >
          <div className='flex flex-col items-center gap-16 h-fit min-h-96 justify-center pt-28'>
            <h1 className='text-6xl md:text-8xl font-bold'>
              {"CONTACT"}
            </h1>
            <p className={`text-2xl text-center text-brand-dark ${colorMap[activeSection] && colorMap[activeSection].includes("bg-") ? "text-brand-light" : "text-brand-dark"
              }`}>
              You can reach us by filling out the form below, or send us an email to feelframestudio@gmail.com
            </p>
          </div>
          <Contact />
        </div>
      </div>
      <Footer />
    </>
  );
}