'use client';
import { useState, useRef, useEffect } from 'react';

interface LoadingProps {
  onLoadingComplete?: () => void;
}

export default function Loading({ onLoadingComplete }: LoadingProps) {
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Check both sessionStorage and global flag
    const hasLoadedBefore =
      typeof window !== 'undefined' &&
      (sessionStorage.getItem('hasLoadedOnce') === 'true' ||
        (window as any).hasLoadedOnce === true);

    if (hasLoadedBefore) {
      setIsLoading(false);
      if (onLoadingComplete) onLoadingComplete();
      return;
    }

    // If first load, play video
    const video = videoRef.current;
    if (video) {
      video.play().catch(console.error);
    }
  }, [onLoadingComplete]);

  const finishLoading = () => {
    // Mark as loaded globally and in sessionStorage
    if (typeof window !== 'undefined') {
      (window as any).hasLoadedOnce = true;
      sessionStorage.setItem('hasLoadedOnce', 'true');
    }

    setIsLoading(false);
    if (onLoadingComplete) onLoadingComplete();
  };

  const handleVideoEnd = finishLoading;
  const handleVideoError = finishLoading;

  if (!isLoading) return null;

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-black relative z-[9999] fixed inset-0">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
        onError={handleVideoError}
      >
        <source src="/loading.mp4" type="video/mp4" />
        {/* Fallback for browsers that don't support video */}
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white text-4xl font-bold animate-pulse">
            RANGE OF VIEW
          </h1>
        </div>
      </video>
    </div>
  );
}
