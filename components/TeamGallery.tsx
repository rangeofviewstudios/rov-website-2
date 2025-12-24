'use client';

import { useState } from 'react';
import styles from './TeamGallery.module.css';

interface TeamMember {
    id: number | string;
    image: string;
    name: string;
    role: string;
    [key: string]: any; // Allow other properties to pass through if needed
}

interface TeamGalleryProps {
    members: TeamMember[];
    onMemberSelect?: (member: any) => void;
}

export default function TeamGallery({ members, onMemberSelect }: TeamGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    // Helper to calculate CSS variables for each item
    const getItemStyle = (index: number) => {
        const isActive = index === activeIndex;

        // Total inactive items to share the width
        const inactiveCount = members.length - 1;

        // Calculate how many inactive items are to the left of this one
        let inactivePosition = 0;
        for (let i = 0; i < index; i++) {
            if (i !== activeIndex) inactivePosition++;
        }

        // Dynamic Variables
        return {
            '--w': isActive ? '100%' : `${100 / (inactiveCount || 1)}%`, // Prevent divide by zero if only 1 member
            '--l': isActive ? '0%' : `${(inactivePosition * 100) / (inactiveCount || 1)}%`,
        } as React.CSSProperties;
    };

    const handleMemberClick = (member: TeamMember, index: number) => {
        if (index !== activeIndex) {
            setActiveIndex(index);
        } else {
            if (onMemberSelect) {
                onMemberSelect(member);
            }
        }
    };

    if (!members || members.length === 0) {
        return null;
    }

    return (
        // Tailwind wrapper for layout size
        <div className="relative w-full h-[600px] md:h-[80vmin] max-w-6xl mx-auto flex items-center justify-center bg-transparent mt-8">

            {/* Top Right Navigation Dropdown */}
            <div className="absolute top-6 right-6 z-50 flex flex-col items-end">
                <div className="relative group">
                    <button
                        className="px-6 py-2 w-auto rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-all shadow-lg text-sm font-bold tracking-widest uppercase whitespace-nowrap"
                        style={{ fontFamily: 'Norwige, sans-serif' }}
                    >
                        {members[activeIndex].name} <span className="ml-2 text-xs opacity-60">▼</span>
                    </button>

                    {/* Hover Dropdown Menu */}
                    <div className="absolute right-0 top-12 w-48 py-2 bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right translate-y-2 group-hover:translate-y-0 shadow-2xl overflow-hidden">
                        {members.map((m, idx) => (
                            <button
                                key={m.id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleMemberClick(m, idx);
                                }}
                                className={`w-full text-left px-5 py-3 text-sm transition-colors uppercase tracking-wider
                                    ${idx === activeIndex ? 'bg-white/20 text-white font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}
                                `}
                                style={{ fontFamily: 'Norwige, sans-serif' }}
                            >
                                {m.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* The Gallery Container */}
            <div className={styles.galleryWrapper}>
                {members.map((member, index) => (
                    <div
                        key={member.id}
                        className={styles.item}
                        style={getItemStyle(index)}
                        data-active={index === activeIndex}
                        onClick={() => handleMemberClick(member, index)}
                    >
                        <img
                            src={member.image}
                            alt={member.name}
                            loading="lazy"
                        />

                        {/* Text Overlay only visible when active */}
                        {index === activeIndex && (
                            <>
                                {/* Glass Gradient Overlay */}
                                <div
                                    className={`${styles.fadeIn} absolute bottom-0 left-0 w-full h-[50%] z-20 pointer-events-none`}
                                    style={{
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 40%, transparent 100%)',
                                        backdropFilter: 'blur(8px)',
                                        borderBottomLeftRadius: '8px',
                                        borderBottomRightRadius: '8px',
                                        maskImage: 'linear-gradient(to top, black 30%, transparent 100%)',
                                        WebkitMaskImage: 'linear-gradient(to top, black 30%, transparent 100%)',
                                    }}
                                />
                                <div className={`${styles.fadeIn} absolute bottom-8 left-8 text-white z-30 pointer-events-none`}>
                                    <h3
                                        className="text-4xl font-bold uppercase tracking-[0.15em] mb-2"
                                        style={{ fontFamily: 'sink, sans-serif', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
                                    >
                                        {member.name}
                                    </h3>
                                    <p
                                        className="text-sm tracking-[0.25em] text-gray-200 font-medium"
                                        style={{ fontFamily: 'Norwige, sans-serif' }}
                                    >
                                        {member.role}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
