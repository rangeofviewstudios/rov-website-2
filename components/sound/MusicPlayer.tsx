"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Volume2,
    ListMusic,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Squiggle } from "@/components/sound/musicStory";
import { SESSION } from "@/components/sound/SessionPhoto";

const INK = "#EA9A61";
const DISPLAY_HEAVY = "NorwigeExtraBoldItalic_Hero, Norwige, sans-serif";
// Before is the raw take, so it wears a cool, unmixed slate. After is the
// mix, in ink orange. Every mode-aware accent in the player reads from here.
const MODE = {
    before: { accent: "#9FB3C8", on: "#0B1118" },
    after: { accent: INK, on: "#0B0603" },
} as const;

const songData = [
    {
        title: "GIVE ME YOUR LOVE",
        artist: "Lorenzo Barns",
        album: "Single",
        beforeSrc: "/audio/beforemp3/gimmeyourlovebefore.mp3",
        afterSrc: "/audio/aftermp3/gimmeyourloveafter.mp3",
        cover: "/audio/covers/gimmeyourlovecober.webp",
        spotifyUrl: "https://open.spotify.com/track/38SRgJ4K6R1KaeX9YHRZVn?si=3082b3830a2c4c67"
    },
    {
        title: "TALK MY SHIT",
        artist: "DDK",
        album: "Single",
        beforeSrc: "/audio/beforemp3/talkmyshitbefore.mp3",
        afterSrc: "/audio/aftermp3/talkmyshitafter.mp3",
        cover: "/audio/covers/talkmyshitcover.webp",
        spotifyUrl: "https://open.spotify.com/track/5Wdqmd6QqHFivymlHbMWg7?si=3d15de75aa1b4b78"
    },
    {
        title: "MARTYR",
        artist: "DDK",
        album: "Single",
        beforeSrc: "/audio/beforemp3/martyrbefore.mp3",
        afterSrc: "/audio/aftermp3/martyrafter.mp3",
        cover: "/audio/covers/martyrcover.webp",
        spotifyUrl: "https://open.spotify.com/track/2CDURlegHo60zais4SyNbN?si=257a4a94facc48d2"
    },
    {
        title: "YKWIW",
        artist: "Basu",
        album: "Single",
        beforeSrc: "/audio/beforemp3/ykwiwbefore.mp3",
        afterSrc: "/audio/aftermp3/ykwiwafter.mp3",
        cover: "/audio/covers/ykwiwcover.webp",
        spotifyUrl: "https://open.spotify.com/track/5lsskTv7eUZYIbLTEtq1cz?si=4b9532cacbf24733"
    },
    {
        title: "GUAP",
        artist: "Dafes",
        album: "Single",
        beforeSrc: "/audio/beforemp3/guapbefore.mp3",
        afterSrc: "/audio/aftermp3/guapafter.mp3",
        cover: "/audio/covers/guapcover.webp",
        spotifyUrl: "https://open.spotify.com/track/0xVvZTr5prKOC6Fv9aIfwU?si=59e9ab9eaba94806"
    },
    {
        title: "BACK IN TIME",
        artist: "Sam Suen",
        album: "Single",
        beforeSrc: "/audio/beforemp3/backintimebefore.mp3",
        afterSrc: "/audio/aftermp3/backintimeafter.mp3",
        cover: "/audio/covers/backintimecover.webp",
        spotifyUrl: "https://open.spotify.com/track/7MC8JAS25hJWvFXClSzFND?si=17a6d47209d14fd6"
    }
];

export default function MusicPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isAfter, setIsAfter] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    // State for new features
    const [volume, setVolume] = useState(1);
    const [prevVolume, setPrevVolume] = useState(1);
    const [showPlaylist, setShowPlaylist] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const carouselRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLButtonElement | null)[]>([]);
    const savedTimeRef = useRef<number>(0);
    const playlistRef = useRef<HTMLDivElement>(null);
    const playlistBtnRef = useRef<HTMLButtonElement>(null);

    // Refs to avoid stale closures in audio effect
    const isPlayingRef = useRef(isPlaying);
    isPlayingRef.current = isPlaying;
    const volumeRef = useRef(volume);
    volumeRef.current = volume;

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            audio.play().catch(() => { });
            setIsPlaying(true);
        }
    };

    const toggleMute = () => {
        if (!audioRef.current) return;
        if (volume > 0) {
            setPrevVolume(volume);
            setVolume(0);
            audioRef.current.volume = 0;
        } else {
            const restoreVol = prevVolume > 0 ? prevVolume : 0.5;
            setVolume(restoreVol);
            audioRef.current.volume = restoreVol;
        }
    };

    const selectSong = (index: number) => {
        savedTimeRef.current = 0;
        setCurrentIndex(index);
        setShowPlaylist(false);
        setIsPlaying(true);
    };

    const nextSong = () => {
        savedTimeRef.current = 0;
        setCurrentIndex((prev) => (prev + 1) % songData.length);
        setIsPlaying(true);
    };

    const prevSong = () => {
        savedTimeRef.current = 0;
        setCurrentIndex((prev) => (prev - 1 + songData.length) % songData.length);
        setIsPlaying(true);
    };

    const toggleBeforeAfter = (newValue: boolean) => {
        if (audioRef.current && audioRef.current.currentTime > 0) {
            savedTimeRef.current = audioRef.current.currentTime;
        }
        setIsAfter(newValue);
    };

    // Consolidated audio logic — uses refs to read fresh isPlaying/volume
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateProgress = () => {
            setCurrentTime(audio.currentTime);
            if (audio.duration) {
                setDuration(audio.duration);
                setProgress((audio.currentTime / audio.duration) * 100);
            }
        };

        const handleEnded = () => {
            savedTimeRef.current = 0;
            setCurrentIndex((prev) => (prev + 1) % songData.length);
            setIsPlaying(true);
        };

        const handleLoadedData = () => {
            // Apply current volume from ref (always fresh)
            audio.volume = volumeRef.current;
            setDuration(audio.duration);

            if (savedTimeRef.current > 0) {
                audio.currentTime = savedTimeRef.current;
                savedTimeRef.current = 0;
            }

            // Only play if isPlaying is true (read from ref for fresh value)
            if (isPlayingRef.current) {
                audio.play().catch(() => setIsPlaying(false));
            }
        };

        audio.addEventListener("timeupdate", updateProgress);
        audio.addEventListener("ended", handleEnded);
        audio.addEventListener("loadeddata", handleLoadedData);

        return () => {
            audio.removeEventListener("timeupdate", updateProgress);
            audio.removeEventListener("ended", handleEnded);
            audio.removeEventListener("loadeddata", handleLoadedData);
        };
    }, [currentIndex, isAfter]);

    // Close playlist on outside click
    useEffect(() => {
        if (!showPlaylist) return;
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;
            if (playlistRef.current && !playlistRef.current.contains(target) && playlistBtnRef.current && !playlistBtnRef.current.contains(target)) {
                setShowPlaylist(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showPlaylist]);

    // 3D Carousel Animation Logic
    useEffect(() => {
        if (!carouselRef.current) return;

        const cards = cardsRef.current;
        const total = cards.length;

        // Kill any in-flight tweens before starting new ones
        cards.forEach((card) => {
            if (card) gsap.killTweensOf(card);
        });

        cards.forEach((card, i) => {
            if (!card) return;

            let diff = i - currentIndex;

            // Infinite loop logic handles wrapping
            if (diff > total / 2) diff -= total;
            if (diff < -total / 2) diff += total;

            const absDiff = Math.abs(diff);
            const isCenter = diff === 0;

            // Cover Flow Style: Active 0, others turned ~60deg inward
            let rotationY = 0;
            if (!isCenter) {
                rotationY = diff > 0 ? -60 : 60;
            }

            gsap.to(card, {
                // Tight stack: neighbours tuck behind the centre, outer covers butt up against them.
                x: diff === 0 ? 0 : Math.sign(diff) * (110 + (absDiff - 1) * 72),
                z: isCenter ? 0 : -200,
                rotationY: rotationY,
                scale: isCenter ? 1.0 : 0.8,
                opacity: absDiff > 2 ? 0 : (isCenter ? 1 : 0.8),
                zIndex: 10 - absDiff,
                duration: 0.6,
                ease: "power2.out",
            });
        });
    }, [currentIndex]);

    const formatTime = (time: number) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, "0");
        return `${minutes}:${seconds}`;
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = parseFloat(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    const mode = isAfter ? MODE.after : MODE.before;

    return (
        <div className="w-full flex flex-col items-center bg-black">
            <div className="w-full max-w-[95%] md:max-w-7xl px-6 md:px-12 text-left pt-8 pb-5 md:pt-10 md:pb-6">
                <h2 className="type-h2 text-[#FFF4E3]">
                    The same song, before and after our mix.
                </h2>
                <div className="mt-3 max-w-[220px]">
                    <Squiggle />
                </div>
            </div>

            <div className="w-full max-w-[95%] md:max-w-7xl px-6 md:px-12 pb-10">
                <section className="relative w-full flex flex-col items-center justify-center pt-4 md:pt-5 overflow-hidden font-sans rounded-[2.5rem] border border-white/5">
                    {/* Background Image - Clean, no full screen glass */}
                    <div
                        className="absolute inset-0 bg-cover bg-center blur-md scale-110" // blur + scale-110 so the blurred edges never show
                        style={{
                            backgroundImage: `url('${SESSION.eyesClosed.src}')`,
                        }}
                    />
                    {/* Dark overlay, heavier at the bottom so the control bar reads */}
                    <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.8) 100%)" }} />

                    <div className="container max-w-6xl mx-auto px-4 flex flex-col items-center relative z-10">

                        {/* Before / After is the point of the whole player, so it
                            is the loudest control: ink orange when active, with a
                            one-line hint that flipping keeps your place. */}
                        <div
                            role="group"
                            aria-label="Hear the song before or after our mix"
                            className="relative flex rounded-full p-1 bg-black/55 border border-white/10 backdrop-blur-md"
                        >
                            {[false, true].map((after) => {
                                const active = isAfter === after;
                                return (
                                    <button
                                        key={String(after)}
                                        onClick={() => toggleBeforeAfter(after)}
                                        aria-pressed={active}
                                        className="type-btn relative px-6 md:px-9 py-2.5 rounded-full uppercase tracking-[0.1em] transition-colors duration-300"
                                        style={{
                                            color: active ? (after ? MODE.after.on : MODE.before.on) : (after ? MODE.after.accent : MODE.before.accent),
                                            opacity: active ? 1 : 0.75,
                                        }}
                                    >
                                        {active && (
                                            <motion.span
                                                layoutId="ba-pill"
                                                className="absolute inset-0 rounded-full"
                                                initial={false}
                                                animate={{ backgroundColor: after ? MODE.after.accent : MODE.before.accent }}
                                                transition={{ type: "spring", stiffness: 400, damping: 32 }}
                                            />
                                        )}
                                        <span className="relative">{after ? "After" : "Before"}</span>
                                    </button>
                                );
                            })}
                        </div>
                        <p className="type-caption mt-2 text-white/60">
                            Flip it mid-song. It keeps your place.
                        </p>

                        {/* 3D Carousel (Cover Flow) */}
                        <div className="relative w-full h-[180px] md:h-[210px] flex items-center justify-center mb-3" style={{ perspective: "1000px" }}>
                            <div ref={carouselRef} className="relative w-full h-full flex items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
                                {songData.map((song, i) => (
                                    <button
                                        type="button"
                                        key={i}
                                        ref={el => { cardsRef.current[i] = el; }}
                                        onClick={() => (i === currentIndex ? togglePlay() : selectSong(i))}
                                        aria-label={i === currentIndex ? `${isPlaying ? "Pause" : "Play"} ${song.title}` : `Play ${song.title} by ${song.artist}`}
                                        className="absolute w-[150px] md:w-[180px] aspect-square rounded-[1.6rem] overflow-hidden shadow-2xl border border-white/10 bg-black cursor-pointer"
                                    >
                                        <Image
                                            src={song.cover}
                                            alt={song.title}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 150px, 180px"
                                            priority={i === currentIndex}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* The title/artist pill that sat here was retired: the
                            dashboard below already names the track and links to Spotify. */}
                        {/* Playlist Popover (Conditional) */}
                        <AnimatePresence>
                            {showPlaylist && (
                                <motion.div
                                    ref={playlistRef}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    className="absolute bottom-32 md:bottom-28 bg-[#1A1A1A]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl z-[150]"
                                    style={{ width: "20rem", maxWidth: "min(20rem, calc(100vw - 32px))" }}
                                >
                                    <h4 className="type-eyebrow text-[#EA9A61] mb-3 ml-1">Up Next</h4>
                                    <div className="flex flex-col gap-2 max-h-[15rem] overflow-y-auto custom-scrollbar">
                                        {songData.map((song, i) => (
                                            <button
                                                key={i}
                                                onClick={() => selectSong(i)}
                                                className={`flex items-center gap-3 p-2 rounded-lg transition-colors text-left ${i === currentIndex ? "bg-white/10" : "hover:bg-white/5"}`}
                                            >
                                                <Image src={song.cover} width={32} height={32} className="rounded object-cover" alt={song.title} />
                                                <div className="flex flex-col min-w-0">
                                                    <span className={`type-h4 text-[0.9375rem] truncate ${i === currentIndex ? "text-[#EA9A61]" : "text-white"}`}>{song.title}</span>
                                                    <span className="type-caption text-white/65 truncate">{song.artist}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Exact Reference Dashboard Design REIMAGINED */}
                        <div className="w-full max-w-[55rem] bg-[#141414]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl relative z-[100] overflow-hidden group/dashboard transition-all hover:bg-[#1A1A1A]/90 hover:border-white/20">

                            {/* 1. Progress Bar - Top Edge */}
                            <div className="absolute top-0 left-0 right-0 h-1 w-full bg-white/10 z-20 group-hover/dashboard:h-1.5 transition-all cursor-pointer">
                                {/* Progress Fill */}
                                <div
                                    className="absolute h-full transition-all duration-100 ease-linear"
                                    style={{ width: `${(currentTime / (duration || 1)) * 100}%`, background: mode.accent }}
                                >
                                    {/* Glowing Head */}
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] opacity-0 group-hover/dashboard:opacity-100 transition-opacity" />
                                </div>
                                {/* Interactive Input — thin visual, tall (44px) hit area for touch */}
                                <input
                                    type="range"
                                    min="0"
                                    max={duration || 0}
                                    step="0.1"
                                    value={currentTime}
                                    onChange={handleSeek}
                                    aria-label="Seek"
                                    className="absolute left-0 right-0 top-0 w-full h-11 opacity-0 cursor-pointer"
                                />
                            </div>

                            <div className="flex flex-col md:flex-row items-center justify-between w-full p-4 md:px-8 md:py-3 mt-1 gap-y-4 md:gap-y-0">

                                {/* Left: Track Info & Art */}
                                <div className="flex items-center w-full md:w-1/3 justify-start order-1">
                                    <a
                                        href={songData[currentIndex].spotifyUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-4 group/info cursor-pointer w-full"
                                    >
                                        <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg relative flex-shrink-0 group-hover/info:shadow-[#EA9A61]/20 transition-all border border-white/5">
                                            <Image src={songData[currentIndex].cover} fill className="object-cover" alt={`${songData[currentIndex].title} by ${songData[currentIndex].artist}`} sizes="56px" priority />
                                        </div>
                                        <div className="flex flex-col min-w-0 justify-center">
                                            <h3 className="type-h4 flex items-center gap-2 text-white min-w-0 group-hover/info:text-[#EA9A61] transition-colors">
                                                <span className="truncate">{songData[currentIndex].title}</span>
                                                {isPlaying && <NowPlaying color={mode.accent} />}
                                            </h3>
                                            <p className="type-small text-white/70 truncate mt-0.5">
                                                {songData[currentIndex].artist}
                                                <span style={{ color: mode.accent }}> · {isAfter ? "after" : "before"}</span>
                                            </p>
                                        </div>
                                    </a>
                                </div>

                                {/* Center: Playback Controls */}
                                <div className="flex items-center justify-center w-full md:w-1/3 gap-8 order-3 md:order-2 pt-4 md:pt-0 border-t border-white/10 md:border-none">
                                    <button onClick={prevSong} className="text-white/70 hover:text-white hover:scale-110 transition-all active:scale-95 p-2.5 -m-2.5 flex items-center justify-center" aria-label="Previous song">
                                        <SkipBack size={24} fill="currentColor" />
                                    </button>

                                    <button
                                        onClick={togglePlay}
                                        className="w-12 h-12 rounded-full flex items-center justify-center hover:scale-105 transition-all duration-300 active:scale-95"
                                        style={{ background: mode.accent, color: mode.on }}
                                        aria-label={isPlaying ? "Pause" : "Play"}
                                    >
                                        {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                                    </button>

                                    <button onClick={nextSong} className="text-white/70 hover:text-white hover:scale-110 transition-all active:scale-95 p-2.5 -m-2.5 flex items-center justify-center" aria-label="Next song">
                                        <SkipForward size={24} fill="currentColor" />
                                    </button>
                                </div>

                                {/* Right: Time, Playlist, Volume */}
                                <div className="flex flex-row items-center justify-between md:justify-end gap-6 md:gap-8 w-full md:w-1/3 order-2 md:order-3">
                                    {/* Time Display */}
                                    <div className="type-small text-white/70 tabular-nums">
                                        {duration ? `${formatTime(currentTime)} / ${formatTime(duration)}` : "Press play"}
                                    </div>

                                    <div className="flex items-center gap-6 md:gap-8 text-white/70">
                                        {/* Playlist Toggle */}
                                        <button
                                            ref={playlistBtnRef}
                                            onClick={() => setShowPlaylist(!showPlaylist)}
                                            className={`hover:text-white transition-colors p-3 -m-3 flex items-center justify-center ${showPlaylist ? "text-[#EA9A61]" : ""}`}
                                            aria-label="Toggle playlist"
                                        >
                                            <ListMusic size={20} className="stroke-[2.5]" />
                                        </button>

                                        {/* Mute/Unmute Toggle */}
                                        <button
                                            onClick={toggleMute}
                                            className="hover:text-white transition-colors flex items-center justify-center p-3 -m-3"
                                            aria-label={volume === 0 ? "Unmute" : "Mute"}
                                        >
                                            {volume === 0 ? <Volume2 size={20} className="stroke-[2.5] opacity-50" /> : <Volume2 size={20} className="stroke-[2.5]" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Dot indicators retired for height; prev/next and the
                            playlist button already move between songs. */}
                        <div className="h-4 md:h-5" />

                    </div>

                    <audio
                        ref={audioRef}
                        src={isAfter ? songData[currentIndex].afterSrc : songData[currentIndex].beforeSrc}
                    />
                </section>
            </div>
        </div>
    );
}

/** Three small bars that bounce while a track is playing. */
function NowPlaying({ color }: { color: string }) {
    return (
        <span aria-hidden className="flex h-3 items-end gap-[2px] shrink-0">
            {[0, 0.2, 0.4].map((d) => (
                <motion.span
                    key={d}
                    className="w-[3px] rounded-full"
                    style={{ background: color }}
                    animate={{ height: ["30%", "100%", "45%", "80%", "30%"] }}
                    transition={{ duration: 1.1, repeat: Infinity, delay: d, ease: "easeInOut" }}
                />
            ))}
        </span>
    );
}
