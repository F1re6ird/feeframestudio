import Image from "next/image";

const members = [
    {
        name: "Anders Øvergaard",
        role: "Creative producer & director",
        bio: "After 20 years in the industry, Anders has a wide variety of expertise…",
        img: "/korty.jpg",
    },
    {
        name: "June Marie Benjaminsen",
        role: "Post producer & Editor",
        bio: "As our main editor, June Marie has a keen eye for visual storytelling…",
        img: "/korty.jpg",
    },
    {
        name: "Morten Rustad",
        role: "General Manager & VFX",
        bio: "Morten is one of the world's leading timelapse photographers…",
        img: "/korty.jpg",
    },
    // Add as many objects as you like – rows are unlimited
];

export default function TeamGrid() {
    return (
        <div className="py-12 ">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-10">Our Team</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {members.map((m) => (
                        <div key={m.name} className=" rounded-xl p-6">
                            <div className="relative w-full h-64 mb-4">
                                <Image
                                    src={m.img}
                                    alt={m.name}
                                    fill
                                    className="object-cover rounded-lg"
                                />
                            </div>
                            <h3 className="text-xl font-semibold">{m.name}</h3>
                            <p className="text-sm  mb-2">{m.role}</p>
                            <p className="text-sm leading-relaxed">{m.bio}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
