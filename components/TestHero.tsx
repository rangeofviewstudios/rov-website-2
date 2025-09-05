'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Message = {
  text: string;
  // Tailwind positional utilities for middle-left or middle-right anchoring
  positionClass: string;
};

const TestHero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  const splitTextModuleRef = useRef<any>(null);
  const splitInstanceRef = useRef<any>(null);
  const tweenCleanupRef = useRef<Array<() => void>>([]);
  const destroySequenceRef = useRef<() => void>();

  // Bigger, longer sample copy. Alternate middle-left / middle-right placement.
  const messages: Message[] = useMemo(
    () => [
      {
        text:
          "We design motion-first product stories. As you scroll, each frame reveals intent—the craft behind the pixels, the rhythm of the interface, and the clarity of the narrative. This is where visual precision meets purposeful interaction.",
        positionClass:
          'top-1/2 left-10 -translate-y-1/2 text-left items-start',
      },
      {
        text:
          "Consistency at speed. The sequence is tuned for responsiveness—images remain crisp, typography breathes, and content adapts without breaking. We obsess over the micro-details so the macro-experience feels effortless.",
        positionClass:
          'top-1/2 right-10 -translate-y-1/2 text-right items-end',
      },
      {
        text:
          "Readable in motion. Lines reveal with intention, not just animation. Copy, layout, and timing collaborate so your message lands—even when the audience is in control of the scroll and the pace is continuously variable.",
        positionClass:
          'top-1/2 left-10 -translate-y-1/2 text-left items-start',
      },
      {
        text:
          "From first impression to final frame, the handoff between imagery and language stays seamless. No jitter. No reflow glitches. Just a smooth, cinematic glide that turns attention into understanding.",
        positionClass:
          'top-1/2 right-10 -translate-y-1/2 text-right items-end',
      },
    ],
    []
  );

  useEffect(() => {
    initImageSequence();
    return () => destroySequenceRef.current?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initImageSequence = async () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const textEl = textRef.current;
    if (!canvas || !container || !textEl) return;

    // Build your frame URLs (adjust range/path to your assets)
    const urls: string[] = [];
    const startNum = 86504;
    const endNum = 86761;
    for (let i = startNum; i <= endNum; i++) {
      const padded = i.toString().padStart(8, '0');
      urls.push(`/image_sequence_horizontal/spiralShotHorizontal${padded}.webp`);
    }

    // Canvas resolution (drawn using a "cover" algorithm to keep aspect)
    canvas.width = 1920;
    canvas.height = 1080;

    // Load SplitText (Club GreenSock); fallback gracefully if unavailable
    if (!splitTextModuleRef.current) {
      try {
        const mod = await import('gsap/SplitText');
        splitTextModuleRef.current =
          (mod as any).SplitText || (mod as any).default || mod;
        gsap.registerPlugin(splitTextModuleRef.current);
      } catch {
        /* proceed without SplitText */
      }
    }

    // Wait for fonts for accurate line wrapping
    try {
      // @ts-ignore
      await document.fonts?.ready;
    } catch {}

    // --- Text animation helpers ---
    const killTextTweens = () => {
      tweenCleanupRef.current.forEach((fn) => fn());
      tweenCleanupRef.current = [];
    };

    const clearSplit = () => {
      if (splitInstanceRef.current?.revert) splitInstanceRef.current.revert();
      splitInstanceRef.current = null;
    };

    const animateInText = (msg: Message) => {
      if (!textEl) return;

      // Show parent, place and set content
      gsap.set(textEl, { autoAlpha: 1 });
      textEl.className =
        'absolute z-20 flex max-w-[min(90vw,1100px)] leading-tight pointer-events-none ' +
        msg.positionClass +
        ' text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]';
      textEl.textContent = msg.text;

      const SplitTextCtor = splitTextModuleRef.current;

      if (!SplitTextCtor) {
        // Fallback without SplitText
        const t = gsap.fromTo(
          textEl,
          { yPercent: 8, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.6, ease: 'power2.out' }
        );
        tweenCleanupRef.current.push(() => t.kill());
        return;
      }

      clearSplit();
      splitInstanceRef.current = new SplitTextCtor(textEl, {
        type: 'lines,words',
        linesClass: 'line',
      });

      const lines = splitInstanceRef.current.lines as HTMLElement[];
      gsap.set(lines, { yPercent: 120, autoAlpha: 0 });

      const tween = gsap.to(lines, {
        yPercent: 0,
        autoAlpha: 1,
        stagger: 0.06,
        duration: 0.7,
        ease: 'power2.out',
      });
      tweenCleanupRef.current.push(() => tween.kill());
    };

    const animateOutText = () => {
      if (!textEl) return;

      const SplitTextCtor = splitTextModuleRef.current;
      if (!SplitTextCtor || !splitInstanceRef.current) {
        const t = gsap.to(textEl, {
          yPercent: -8,
          autoAlpha: 0,
          duration: 0.45,
          ease: 'power2.in',
        });
        tweenCleanupRef.current.push(() => t.kill());
        return;
      }

      const lines = splitInstanceRef.current.lines as HTMLElement[];
      const tween = gsap.to(lines, {
        yPercent: -120,
        autoAlpha: 0,
        stagger: 0.05,
        duration: 0.55,
        ease: 'power2.in',
        onComplete: clearSplit,
      });
      tweenCleanupRef.current.push(() => tween.kill());
    };

    // --- Hysteresis logic for “linger then change” ---
    // We switch to the next message late in each segment (~80%),
    // and when scrolling back up we switch early (~20%), avoiding rapid toggling.
    let activeIndex = 0;
    let lastFloat = 0;

    const getHysteresisIndex = (segmentFloat: number, segments: number) => {
      const goingDown = segmentFloat >= lastFloat;
      lastFloat = segmentFloat;

      const idx = Math.floor(segmentFloat);
      const pos = segmentFloat - idx; // position within the current segment [0..1)

      if (goingDown) {
        // linger: switch near the end of the current segment
        if (pos >= 0.8 && idx + 1 < segments) return idx + 1;
        return activeIndex;
      } else {
        // scrolling up: switch back earlier
        if (pos <= 0.2) return Math.max(0, idx);
        return activeIndex;
      }
    };

    // --- Build the image-sequence + ScrollTrigger ---
    const seq = imageSequence({
      urls,
      canvas,
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: '+=140%', // a bit longer so text really "stays" before changing
        scrub: true,
        pin: true,
        anticipatePin: 1,
        // markers: true, // uncomment to debug
      },
      onUpdate: (progress) => {
        const segments = messages.length;
        const segmentFloat = progress * segments;

        const nextIndex = getHysteresisIndex(segmentFloat, segments);
        if (nextIndex !== activeIndex) {
          animateOutText();
          // slight overlap for a smoother handoff
          gsap.delayedCall(0.1, () => animateInText(messages[nextIndex]));
          activeIndex = nextIndex;
        }
      },
    });

    // Initial text
    animateInText(messages[0]);

    // Handle resize: re-split the current text for accurate wrapping, refresh ST
    const onResize = () => {
      if (splitTextModuleRef.current && textEl && splitInstanceRef.current) {
        const SplitTextCtor = splitTextModuleRef.current;
        clearSplit();
        splitInstanceRef.current = new SplitTextCtor(textEl, {
          type: 'lines,words',
          linesClass: 'line',
        });
        gsap.set(splitInstanceRef.current.lines, { yPercent: 0, autoAlpha: 1 });
      }
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', onResize);

    const destroy = () => {
      window.removeEventListener('resize', onResize);
      seq.scrollTrigger?.kill();
      seq.kill();
      killTextTweens();
      clearSplit();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
    destroySequenceRef.current = destroy;
  };

  // Canvas image sequence with “cover” drawing (no tint, image as-is)
  function imageSequence(config: {
    urls: string[];
    canvas: HTMLCanvasElement;
    scrollTrigger: gsap.plugins.ScrollTriggerInstanceVars;
    onUpdate?: (progress01: number) => void;
  }) {
    const ctx = config.canvas.getContext('2d');
    const playhead = { frame: 0 };

    const images: HTMLImageElement[] = config.urls.map((url) => {
      const img = new Image();
      img.src = url;
      img.decoding = 'async';
      img.crossOrigin = 'anonymous';
      return img;
    });

    const drawCover = (img: HTMLImageElement) => {
      if (!ctx) return;
      const cw = config.canvas.width;
      const ch = config.canvas.height;
      const iw = img.naturalWidth || img.width;
      const ih = img.naturalHeight || img.height;

      const scale = Math.max(cw / iw, ch / ih);
      const sw = iw * scale;
      const sh = ih * scale;
      const dx = (cw - sw) / 2;
      const dy = (ch - sh) / 2;

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, dx, dy, sw, sh);
    };

    const updateImage = () => {
      if (!ctx) return;
      const frame = Math.round(playhead.frame);
      const img = images[frame];
      if (!img) return;

      drawCover(img);

      if (config.onUpdate) {
        const progress01 = frame / Math.max(1, images.length - 1);
        config.onUpdate(progress01);
      }
    };

    // paint first frame when ready
    if (images[0]) images[0].addEventListener('load', updateImage, { once: true });

    return gsap.to(playhead, {
      frame: images.length - 1,
      ease: 'none',
      onUpdate: updateImage,
      scrollTrigger: config.scrollTrigger,
    });
  }

  return (
    <div className="relative w-full bg-transparent">
      {/* Pinned image-sequence hero */}
      <div ref={containerRef} className="relative h-screen w-full">
        {/* Canvas: pure image sequence, fills frame */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

        {/* Overlay text (centered vertically, left/right aligned per segment) */}
        <h2
          ref={textRef}
          className="absolute z-20 text-[clamp(1.35rem,3.2vw,2.4rem)] font-semibold tracking-tight"
          style={{ opacity: 0 }}
        />
      </div>
    </div>
  );
};

export default TestHero;
