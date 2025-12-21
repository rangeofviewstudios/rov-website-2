"use client";

import React, { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MousePointer2, ChevronRight, X, Sparkles } from "lucide-react";

type Category = "All" | "Creative" | "Tech" | "Systems";

interface TeamMember {
    id: number;
    image: string;
    category: Category;
    name: string;
    role: string;
    skills: string[];
    location: string;
    specialties?: string;
    tools?: string[];
    keyContributions?: string[];
    secretQuote?: string;
    shadowColor?: string;
    imageRotation?: number;
}

const teamMembers: TeamMember[] = [
    {
        id: 1,
        image: "/teammembers/basutm.png",
        category: "Creative",
        name: "Basu",
        role: "FOUNDER & CREATIVE DIRECTOR",
        skills: ["Creative Direction", "Brand Strategy", "Web Development", "Design Systems", "Client Relations"],
        location: "Atlanta",
        specialties: "Leads creative direction across all client projects and internal initiatives while overseeing company operations. Contributes hands-on to design, development, and client communications, ensuring R.O.V.'s vision stays consistent from pitch to delivery.",
        tools: ["Figma", "Adobe Creative Suite (Illustrator, Photoshop, XD)", "Next.js, React, TypeScript, HTML/CSS", "Notion"],
        keyContributions: [
            "Directed creative vision and strategy for all major client engagements.",
            "Built and coded flagship web experiences from concept to deployment.",
            "Established R.O.V.'s operational framework and client communication standards."
        ],
        secretQuote: "Coffee first, code second, creativity always. ☕✨",
        shadowColor: "101, 67, 33"
    },
    {
        id: 2,
        image: "/teammembers/jahnavitm.png",
        category: "Creative",
        name: "Jahnavi",
        role: "HEAD OF DESIGN",
        skills: ["UI/UX Design", "Brand Identity", "Design Systems", "Illustration", "Visual Design", "Prototyping"],
        location: "India",
        secretQuote: "Design is thinking made visual. 🎨💭",
        specialties: "Masters every design discipline—from UI/UX and visual systems to custom illustration and brand identity. Creates cohesive, polished design solutions across all touchpoints, ensuring R.O.V.'s work is as functional as it is beautiful.",
        tools: ["Figma", "Adobe Illustrator, Photoshop, Procreate", "FigJam/Miro"],
        keyContributions: [
            "Led visual design and UI/UX for flagship client projects and R.O.V.'s own branding.",
            "Created custom illustrations and brand identity elements that define studio aesthetic.",
            "Built reusable design systems and component libraries for consistent execution."
        ],
        shadowColor: "150, 100, 120"
    },
    {
        id: 3,
        image: "/teammembers/vaishnavitm.png?v=3",
        category: "Creative",
        name: "Vaishnavi",
        role: "CREATIVE DIRECTOR & VIDEO STRATEGIST",
        skills: ["Video Creative Direction", "Visual Storytelling", "Campaign Strategy", "Motion Design"],
        location: "Atlanta",
        secretQuote: "I shape how brands move, talk, and feel across every frame.",
        specialties: "I help brands tell stories that stick—through motion, narrative structure, and campaign-level thinking. Whether it's directing video concepts or modeling creative strategies, I make sure every decision connects back to what the brand needs to say and how people should feel it.",
        tools: ["Adobe Premiere Pro, After Effects", "Figma", "Social Planning Tools"],
        keyContributions: [
            "Directed video strategies for 8+ campaigns, shaped foundational creative concepts.",
            "Helped define how R.O.V. thinks about motion and narrative across all client work."
        ],
        shadowColor: "180, 120, 90"
    },
    {
        id: 4,
        image: "/teammembers/tanvitm.png",
        category: "Creative",
        name: "Tanvi",
        role: "DESIGN & SOCIAL MEDIA STRATEGIST",
        skills: ["Social Media Design", "UI/UX", "Content Strategy", "Creative Ideation", "Campaign Visuals"],
        location: "India",
        secretQuote: "Every pixel has a purpose. ✏️",
        specialties: "Drives social media design and visual content strategy while playing a key role in ideating and brainstorming direction for new projects. Brings fresh UI/UX perspectives and ensures digital touchpoints feel modern and engaging.",
        tools: ["Figma, Adobe XD, Canva, Photoshop", "Meta Suite", "Content Planning Tools"],
        keyContributions: [
            "Created social media graphics, carousels, and campaign assets for R.O.V. and clients.",
            "Contributed to UI/UX ideation and design direction for new project launches.",
            "Helped brainstorm creative concepts that shaped fresh project directions."
        ],
        shadowColor: "140, 110, 140"
    },
    {
        id: 5,
        image: "/teammembers/chamantm.png",
        category: "Creative",
        name: "Chaman",
        role: "VIDEO EDITOR & MOTION DESIGNER",
        skills: ["Video Editing", "Motion Graphics", "After Effects Design", "Creative Concepting", "Rapid Turnaround Production"],
        location: "India",
        secretQuote: "Fast edits, fresh ideas, flawless execution. 🎬✨",
        specialties: "Expert video editor who brings fresh creative ideas and fast execution to R.O.V.'s edits and media production. Specializes in After Effects wizardry and communicates seamlessly to turn concepts into polished, dynamic visuals on tight timelines.",
        tools: ["Adobe After Effects", "Premiere Pro", "Adobe Creative Cloud Suite"],
        keyContributions: [
            "Delivers fast, high-quality edits with innovative motion design and visual effects that elevate client campaigns.",
            "Brings fresh creative ideas that push R.O.V.'s video work forward while maintaining clear communication.",
            "Ensures reliable execution across all projects with rapid turnaround production."
        ],
        shadowColor: "200, 100, 50"
    },
    {
        id: 6,
        image: "/teammembers/davidtm.png",
        category: "Creative",
        name: "David",
        role: "3D CREATIVE DIRECTOR",
        skills: ["3D Product Visualization", "Custom Texturing", "Modeling", "Lighting & Rendering", "Creative Direction"],
        location: "USA",
        secretQuote: "Bringing pixels to life, one render at a time. 🎨✨",
        specialties: "Creates sophisticated, photorealistic 3D product visualizations using advanced Blender techniques. Specializes in custom texturing, modeling, and lighting that bring digital assets to life with cinematic quality.",
        tools: ["Blender", "Substance Tools", "Photoshop", "After Effects", "HDRI Libraries"],
        keyContributions: [
            "Produced high-end 3D product renders for client campaigns and brand assets.",
            "Developed custom texturing and modeling workflows for unique visual styles.",
            "Collaborated on creative direction to integrate 3D into broader brand experiences."
        ],
        shadowColor: "100, 150, 200"
    },
    {
        id: 7,
        image: "/teammembers/dakshatm.png",
        category: "Tech",
        name: "Daksha",
        role: "HEAD OF DEVELOPMENT",
        skills: ["Full-Stack Development", "Technical Architecture", "Complex Problem Solving", "Performance Optimization", "Code Standards"],
        location: "India",
        secretQuote: "Code is poetry in motion. 💻🎵",
        specialties: "R.O.V.'s go-to technical lead for complex coding challenges and scalable solutions. Solves the toughest tech problems, architects robust systems, and ensures every build is performant, maintainable, and production-ready.",
        tools: ["Next.js, React, TypeScript, JavaScript", "Node.js, API Integration", "Git/GitHub, Vercel"],
        keyContributions: [
            "Led development and technical architecture on high-complexity client builds.",
            "Solved critical technical challenges that unlocked new possibilities for projects.",
            "Built scalable, clean codebases while establishing development best practices for the team."
        ],
        shadowColor: "90, 120, 150"
    },
    {
        id: 8,
        image: "/teammembers/jasnoortm.png",
        category: "Tech",
        name: "Jasnoor",
        role: "DEVELOPER & FRONTEND SPECIALIST",
        skills: ["Frontend Development", "Creative Problem Solving", "UI Implementation", "Interactive Features", "Component Development"],
        location: "Atlanta",
        secretQuote: "Debugging is like being a detective in a crime movie where you're also the murderer. 🕵️",
        specialties: "Assists with coding across projects while solving complex technical problems and creating innovative frontend solutions. Brings creative thinking to development, finding elegant ways to implement ambitious design ideas.",
        tools: ["React, Next.js, JavaScript/TypeScript", "HTML/CSS, Tailwind", "Git/GitHub"],
        keyContributions: [
            "Developed key features and interactive elements across client sites and internal tools.",
            "Solved complex frontend challenges with creative, performant solutions.",
            "Contributed technical ideas that elevated user experience and visual execution."
        ],
        shadowColor: "120, 140, 100"
    },
    {
        id: 9,
        image: "/teammembers/basutm.png",
        category: "Tech",
        name: "Basu",
        role: "FOUNDER & CREATIVE DIRECTOR",
        skills: ["Creative Direction", "Brand Strategy", "Web Development", "Design Systems", "Client Relations"],
        location: "Atlanta",
        specialties: "Leads creative direction across all client projects and internal initiatives while overseeing company operations.",
        tools: ["Figma", "Next.js", "Notion"],
        keyContributions: ["Directed creative vision", "Built flagship web experiences"],
        secretQuote: "Coffee first, code second, creativity always. ☕✨"
    },
    {
        id: 10,
        image: "/teammembers/suchettm.png",
        category: "Tech",
        name: "Suchet",
        role: "CO-FOUNDER & SYSTEMS ARCHITECT",
        skills: ["Operations Strategy", "AI Systems Development", "Financial Management", "Sales & Client Relations", "Process Automation"],
        location: "Atlanta",
        secretQuote: "Real Job: Getting whatever the fuck needs to be done, done",
        specialties: "Joined as co-founder to build the operational backbone of R.O.V.",
        tools: ["n8n, Make/Zapier", "ChatGPT & AI Tools"],
        keyContributions: ["Built end-to-end AI systems"]
    },
    {
        id: 12,
        image: "/teammembers/suchettm.png",
        category: "Systems",
        name: "Suchet",
        role: "CO-FOUNDER & SYSTEMS ARCHITECT",
        skills: ["Operations Strategy", "AI Systems Development", "Financial Management", "Sales & Client Relations", "Process Automation"],
        location: "Atlanta",
        secretQuote: "Real Job: Getting whatever the fuck needs to be done, done",
        specialties: "Joined as co-founder to build the operational backbone of R.O.V.",
        tools: ["n8n, Make/Zapier", "ChatGPT & AI Tools"],
        keyContributions: ["Built end-to-end AI systems"]
    },
    {
        id: 11,
        image: "/teammembers/dakshatm.png",
        category: "Systems",
        name: "Daksha",
        role: "HEAD OF DEVELOPMENT",
        skills: ["Full-Stack Development", "Technical Architecture", "Complex Problem Solving", "Performance Optimization", "Code Standards"],
        location: "India",
        secretQuote: "Code is poetry in motion. 💻🎵",
        specialties: "R.O.V.'s go-to technical lead for complex coding challenges.",
        tools: ["Next.js, React", "Git/GitHub"],
        keyContributions: ["Led development on high-complexity builds"]
    },
    {
        id: 13,
        image: "/teammembers/kavyatm.png",
        category: "Creative",
        name: "Kavya",
        role: "UI/UX DESIGNER & DESIGN SYSTEMS SPECIALIST",
        skills: ["UI/UX Design", "Design Systems", "Web Design", "Design Infrastructure", "Brand Guidelines", "Design Standards"],
        location: "Atlanta",
        specialties: "SCAD-trained designer who brings enterprise-level design rigor from work with major brands like Porsche, Lowe's, and UBS.",
        tools: ["Figma", "Canva"],
        keyContributions: ["Establishes design foundations"],
        shadowColor: "100, 100, 100"
    },
    {
        id: 14,
        image: "/teammembers/jinwontm.png",
        category: "Creative",
        name: "Jiwon",
        role: "UI/UX DESIGNER & ILLUSTRATOR",
        skills: ["UI/UX Design", "Design Strategy", "Illustration", "Interface Design", "User Experience", "Visual Design Systems"],
        location: "Savannah",
        secretQuote: "Design that makes every touchpoint feel intentional. ✨",
        specialties: "SCAD-trained design talent based in Savannah with exceptional vision for overall design strategy.",
        tools: ["Figma", "Adobe Creative Suite"],
        keyContributions: ["Brings big-picture design vision"],
        shadowColor: "130, 100, 160"
    },
];

const categories: Category[] = ["Creative", "Tech", "Systems"];

const TeamSection: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<Category>("All");
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
    const [showQuote, setShowQuote] = useState(false);
    const [expandedMemberId, setExpandedMemberId] = useState<number | null>(null);

    const ImageCard = useCallback(({ src, alt, stationary = false, onClick, name, role, rotation = 0 }: { src: string; alt: string, stationary?: boolean, onClick?: () => void, name?: string, role?: string, rotation?: number }) => {
        const [isHovered, setIsHovered] = useState(false);

        return (
            <motion.div
                layoutId={stationary ? `card-${src}` : undefined}
                className="image-card md:w-[450px] md:h-[253px] w-[240px] h-[135px] rounded-[20px] overflow-hidden shrink-0 relative cursor-pointer"
                initial={stationary ? { opacity: 0, scale: 0.9 } : undefined}
                animate={stationary ? { opacity: 1, scale: 1 } : undefined}
                exit={stationary ? { opacity: 0, scale: 0.9 } : undefined}
                transition={{ duration: 0.5 }}
                onClick={onClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <img
                    src={src}
                    alt={alt}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center center',
                        display: 'block',
                        transform: rotation !== 0 ? `rotate(${rotation}deg)` : undefined
                    }}
                />
                {name && isHovered && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)',
                            backdropFilter: 'blur(4px)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            zIndex: 10
                        }}
                    >
                        <h3 style={{
                            fontFamily: 'sink, sans-serif',
                            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                            fontWeight: '900',
                            color: 'white',
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            margin: 0
                        }}>
                            {name}
                        </h3>
                        {role && (
                            <p style={{
                                fontFamily: 'Norwige, sans-serif',
                                fontSize: 'clamp(0.8rem, 1.5vw, 1rem)',
                                fontWeight: '400',
                                color: 'rgba(255, 255, 255, 0.9)',
                                letterSpacing: '0.05em',
                                textTransform: 'uppercase',
                                margin: 0
                            }}>
                                {role}
                            </p>
                        )}
                    </motion.div>
                )}
            </motion.div>
        );
    }, []);

    const filteredMembers = teamMembers.filter(m => m.category === activeCategory);

    // Optimized Category Section with "Open Above" logic
    const CategorySection = ({ category, members }: { category: Category, members: TeamMember[] }) => {
        const expandedMember = members.find(m => m.id === expandedMemberId);
        const gridMembers = members.filter(m => m.id !== expandedMemberId);

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full max-w-7xl mx-auto px-4"
            >
                <AnimatePresence mode="wait">
                    {expandedMember && (
                        <motion.div
                            key="expanded-view"
                            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginBottom: 48 }}
                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                            className="w-full"
                        >
                            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 p-8 border border-white/20"
                                 style={{ boxShadow: `0 25px 50px -12px rgba(${expandedMember.shadowColor || '101, 67, 33'}, 0.5)` }}>
                                
                                <button 
                                    onClick={() => setExpandedMemberId(null)}
                                    className="absolute top-6 right-6 z-20 text-white/60 hover:text-white transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>

                                <div className="absolute inset-0 z-0">
                                    <img src={expandedMember.image} className="w-full h-full object-cover opacity-20 blur-sm" />
                                    <div className="absolute inset-0 bg-black/60" />
                                </div>

                                <div className="relative z-10">
                                    <div className="flex flex-col lg:flex-row gap-12">
                                        <div className="w-full lg:w-1/3">
                                            <img src={expandedMember.image} className="w-full aspect-[4/5] object-cover rounded-2xl shadow-2xl" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-sink text-[clamp(2.5rem,5vw,4rem)] font-black text-[#F7F2E4] uppercase leading-none mb-4">
                                                {expandedMember.name}
                                            </h3>
                                            <p className="font-norwige text-sm tracking-[0.2em] uppercase text-[#DAA520] mb-8">
                                                {expandedMember.role} • {expandedMember.location}
                                            </p>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                {expandedMember.specialties && (
                                                    <div>
                                                        <h4 className="font-sink text-lg font-black uppercase text-[#F7F2E4] mb-4">Specialties</h4>
                                                        <p className="font-norwige text-sm text-[#F7F2E4]/80 leading-relaxed">{expandedMember.specialties}</p>
                                                    </div>
                                                )}
                                                <div>
                                                    <h4 className="font-sink text-lg font-black uppercase text-[#F7F2E4] mb-4">Skills</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {expandedMember.skills.map((s, i) => (
                                                            <span key={i} className="px-3 py-1 bg-white/10 border border-white/10 rounded-full text-[10px] text-white uppercase tracking-widest">{s}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-8 flex gap-4">
                                                <button 
                                                    onClick={() => setSelectedMember(expandedMember)}
                                                    className="px-8 py-3 bg-[#DAA520] text-black font-norwige font-bold uppercase text-xs rounded-full hover:scale-105 transition-transform"
                                                >
                                                    Full Profile
                                                </button>
                                                <button 
                                                    onClick={() => setExpandedMemberId(null)}
                                                    className="px-8 py-3 border border-white/20 text-white font-norwige font-bold uppercase text-xs rounded-full hover:bg-white/10 transition-colors"
                                                >
                                                    Minimize
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Remaining Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {gridMembers.map((member) => (
                        <motion.div
                            layout
                            key={member.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="relative h-[300px] rounded-2xl overflow-hidden cursor-pointer group border border-white/10"
                            onClick={() => setExpandedMemberId(member.id)}
                        >
                            <img src={member.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                            <div className="absolute bottom-6 left-6 right-6">
                                <h4 className="font-sink text-2xl font-black text-white uppercase">{member.name}</h4>
                                <p className="font-norwige text-[10px] tracking-[0.2em] text-[#DAA520] uppercase">{member.role}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        );
    };

    return (
        <>
            <section
                style={{
                    borderRadius: "20px",
                    background: `radial-gradient(ellipse 800px 600px at 50% 120%, rgba(218, 165, 32, 0.4) 0%, rgba(184, 134, 11, 0.3) 30%, transparent 70%), rgba(255, 255, 255, 0.05)`,
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    minHeight: "100vh",
                    padding: "40px 0",
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <div className="z-50 mb-12 flex gap-4 bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/20 relative">
                    <button
                        onClick={() => { setActiveCategory("All"); setExpandedMemberId(null); }}
                        className={`px-3 py-1 md:px-6 md:py-2 rounded-full text-xs md:text-lg font-bold transition-all duration-300 font-futura ${activeCategory === "All" ? "bg-white text-black shadow-lg" : "text-white hover:bg-white/10"}`}
                        style={{ fontFamily: 'Norwige, sans-serif' }}
                    > ALL </button>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => { setActiveCategory(cat); setExpandedMemberId(null); }}
                            className={`px-3 py-1 md:px-6 md:py-2 rounded-full text-xs md:text-lg font-bold transition-all duration-300 font-futura ${activeCategory === cat ? "bg-white text-black shadow-lg" : "text-white hover:bg-white/10"}`}
                            style={{ fontFamily: 'Norwige, sans-serif' }}
                        > {cat.toUpperCase()} </button>
                    ))}
                </div>

                <div style={{ width: "100%", flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {activeCategory === "All" ? (
                        <motion.div key="marquee" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
                            <div className="marquee-row">
                                <div className="marquee-track scroll-left">
                                    {[...Array(4)].map((_, i) => (
                                        <React.Fragment key={`r1-${i}`}>
                                            <div className="text-block"><h2>MEET</h2></div>
                                            <ImageCard src={teamMembers[0].image} alt="Basu" name={teamMembers[0].name} role={teamMembers[0].role} onClick={() => setSelectedMember(teamMembers[0])} />
                                            <ImageCard src={teamMembers[9].image} alt="Suchet" name={teamMembers[9].name} role={teamMembers[9].role} onClick={() => setSelectedMember(teamMembers[9])} />
                                            <button className="category-button" onClick={() => setActiveCategory("Creative")}>CREATIVE</button>
                                            <ImageCard src={teamMembers[6].image} alt="Daksha" name={teamMembers[6].name} role={teamMembers[6].role} onClick={() => setSelectedMember(teamMembers[6])} />
                                            <ImageCard src={teamMembers[1].image} alt="Jahnavi" name={teamMembers[1].name} role={teamMembers[1].role} onClick={() => setSelectedMember(teamMembers[1])} />
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>

                            <div className="marquee-row">
                                <div className="marquee-track scroll-right">
                                    {[...Array(4)].map((_, i) => (
                                        <React.Fragment key={`r2-${i}`}>
                                            <button className="category-button" onClick={() => setActiveCategory("Tech")}>TECH</button>
                                            <ImageCard src={teamMembers[12].image} alt="Kavya" name={teamMembers[12].name} role={teamMembers[12].role} onClick={() => setSelectedMember(teamMembers[12])} />
                                            <ImageCard src={teamMembers[13].image} alt="Jiwon" name={teamMembers[13].name} role={teamMembers[13].role} onClick={() => setSelectedMember(teamMembers[13])} />
                                            <div className="text-block"><h2>THE</h2></div>
                                            <ImageCard src={teamMembers[2].image} alt="Vaishnavi" name={teamMembers[2].name} role={teamMembers[2].role} onClick={() => setSelectedMember(teamMembers[2])} />
                                            <ImageCard src={teamMembers[3].image} alt="Tanvi" name={teamMembers[3].name} role={teamMembers[3].role} onClick={() => setSelectedMember(teamMembers[3])} />
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>

                            <div className="marquee-row">
                                <div className="marquee-track scroll-left">
                                    {[...Array(4)].map((_, i) => (
                                        <React.Fragment key={`r3-${i}`}>
                                            <ImageCard src={teamMembers[5].image} alt="David" name={teamMembers[5].name} role={teamMembers[5].role} onClick={() => setSelectedMember(teamMembers[5])} />
                                            <ImageCard src={teamMembers[4].image} alt="Chaman" name={teamMembers[4].name} role={teamMembers[4].role} onClick={() => setSelectedMember(teamMembers[4])} rotation={teamMembers[4].imageRotation} />
                                            <div className="text-block"><h2>TEAM</h2></div>
                                            <ImageCard src={teamMembers[7].image} alt="Jasnoor" name={teamMembers[7].name} role={teamMembers[7].role} onClick={() => setSelectedMember(teamMembers[7])} />
                                            <ImageCard src={teamMembers[10].image} alt="Suchet" name={teamMembers[10].name} role={teamMembers[10].role} onClick={() => setSelectedMember(teamMembers[10])} />
                                            <button className="category-button" onClick={() => setActiveCategory("Systems")}>SYSTEMS</button>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <CategorySection category={activeCategory} members={filteredMembers} />
                    )}
                </div>
            </section>

            {/* Portfolio Detail View */}
            <AnimatePresence>
                {selectedMember && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#F5F5F5] p-0 md:p-[40px] lg:p-[60px]"
                    >
                        <div className="w-full h-full overflow-y-auto overflow-x-hidden relative flex flex-col md:block">
                            <button
                                onClick={() => setSelectedMember(null)}
                                className="fixed md:absolute top-4 right-4 md:top-10 md:right-10 w-10 h-10 md:w-[50px] md:h-[50px] bg-black text-white rounded-full flex items-center justify-center z-[105] shadow-lg hover:scale-110 transition-transform"
                            >
                                <X className="w-4 h-4 md:w-6 md:h-6" />
                            </button>

                            <div className="relative w-full max-w-7xl mx-auto min-h-screen md:min-h-[900px] flex flex-col md:block p-6 pt-20 md:p-0">
                                {/* Desktop/Mobile Content Stacks (Simplified for briefness, keeping your original detailed structure) */}
                                <div className="flex flex-col md:flex-row items-start justify-between w-full h-full pt-[60px] md:pl-32 pr-[5%] gap-8">
                                    <div className="flex flex-col flex-1 gap-8 z-[3]">
                                        <motion.h2 initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="font-sink text-[clamp(2.5rem,4vw,4rem)] font-black text-black tracking-[0.05em] leading-[1]">
                                            {selectedMember.role}
                                        </motion.h2>
                                        <div className="font-norwige text-sm font-bold tracking-[0.2em] uppercase text-black">
                                            BASED IN {selectedMember.location.toUpperCase()}
                                        </div>
                                        <div className="w-full h-[1px] bg-black/20" />
                                        <div className="flex flex-col gap-1">
                                            {selectedMember.skills.map((skill, index) => (
                                                <div key={index} className="font-norwige text-xl text-black font-bold tracking-[0.02em]">/{skill.toUpperCase()}</div>
                                            ))}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
                                            {selectedMember.specialties && (
                                                <div>
                                                    <h3 className="font-sink text-lg font-black text-black mb-3 tracking-[0.1em]">SPECIALTIES</h3>
                                                    <p className="font-norwige text-sm text-[#333] leading-relaxed">{selectedMember.specialties}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0 z-[4]">
                                        <div className="relative w-[300px] md:w-[350px] aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-black/10">
                                            <img src={selectedMember.image} className="w-full h-full object-cover" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
                .marquee-row { display: flex; overflow: hidden; width: 100%; margin-bottom: 60px; mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent); -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent); }
                .marquee-track { display: flex; align-items: center; gap: 20px; width: max-content; padding-right: 20px; }
                .scroll-left { animation: scrollLeft 60s linear infinite; }
                .scroll-right { animation: scrollRight 60s linear infinite; }
                .text-block { padding: 0 40px; }
                h2 { font-family: 'sink', sans-serif; font-size: clamp(2rem, 5vw, 4.5rem); font-weight: 900; color: #F7F2E4; letter-spacing: 0.05em; white-space: nowrap; }
                .category-button { writing-mode: vertical-rl; text-orientation: mixed; background: white; color: #3E2723; padding: 40px 20px; border-radius: 20px; border: none; font-size: clamp(1rem, 2.5vw, 1.8rem); font-weight: 900; font-family: 'sink', sans-serif; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); white-space: nowrap; height: 253px; display: flex; align-items: center; justify-content: center; letter-spacing: 0.1em; }
                @keyframes scrollLeft { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
                @keyframes scrollRight { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
                @media (max-width: 768px) { .image-card { width: 240px !important; height: 135px !important; } .category-button { height: 135px; padding: 20px 10px; } }
            `}</style>
        </>
    );
};

export default TeamSection;