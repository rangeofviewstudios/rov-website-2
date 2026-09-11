'use client';

import React from 'react';
import Image from 'next/image';

interface HighlightItem {
    title: string;
    caption: string;
    src?: string;
    videoSrc?: string;
}

interface HighlightsProps {
    title?: string;
    description?: string;
    items: HighlightItem[];
    titleColor?: string;
    titleFont?: string;
    titleItalic?: boolean;
    textColor?: string;
    bodyFont?: string;
    labelColor?: string;
    secondaryColor?: string;
    borderColor?: string;
    cardBgColor?: string;
}

/**
 * Closing showcase reel: the fun/creative details worth calling out on
 * their own, after the audit vs rebuild comparison has made the case.
 */
export const Highlights: React.FC<HighlightsProps> = ({
    title,
    description,
    items,
    titleColor = '#C90000',
    titleFont = 'Norwige, sans-serif',
    titleItalic = false,
    textColor = '#d1d5db',
    bodyFont = "'Roboto', sans-serif",
    labelColor = 'white',
    secondaryColor = '#9ca3af',
    borderColor = 'rgba(255,255,255,0.12)',
    cardBgColor = 'rgba(255,255,255,0.03)',
}) => {
    return (
        <div>
            {title && (
                <h3
                    className="text-5xl md:text-6xl font-bold mb-4 uppercase tracking-tight"
                    style={{ color: titleColor, fontFamily: titleFont, letterSpacing: '0.1em', fontStyle: titleItalic ? 'italic' : undefined }}
                >
                    {title}
                </h3>
            )}
            {description && (
                <p className="text-lg mb-12 leading-relaxed max-w-3xl" style={{ fontFamily: bodyFont, color: textColor }}>
                    {description}
                </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {items.map((item, index) => (
                    <div key={index}>
                        <div
                            className="relative w-full overflow-hidden rounded-xl mb-4"
                            style={{
                                // These are wide page captures, so a portrait card would crop the shot in half.
                                aspectRatio: '16 / 10',
                                border: `1px solid ${borderColor}`,
                                backgroundColor: cardBgColor,
                            }}
                        >
                            {item.videoSrc ? (
                                <video
                                    src={item.videoSrc}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            ) : item.src ? (
                                <Image
                                    src={item.src}
                                    alt={item.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                    style={{ objectFit: 'cover' }}
                                />
                            ) : (
                                <div
                                    className="absolute inset-0 flex items-center justify-center text-center px-6"
                                    style={{ border: `1px dashed ${borderColor}` }}
                                >
                                    <span className="text-xs" style={{ color: secondaryColor, fontFamily: bodyFont }}>
                                        Drop clip / frame here
                                    </span>
                                </div>
                            )}
                        </div>
                        <h4
                            className="text-lg font-semibold mb-1.5"
                            style={{ fontFamily: titleFont, letterSpacing: '0.05em', color: labelColor }}
                        >
                            {item.title}
                        </h4>
                        <p className="text-sm leading-relaxed" style={{ fontFamily: bodyFont, color: textColor }}>
                            {item.caption}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};
