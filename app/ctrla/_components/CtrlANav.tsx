"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A — NAVIGATION
// The issue's own menu. Replaces the site-wide ROV NavigationDock on
// every /ctrla route, so the community side never wears the B2B nav.
//
// Two parts:
//   · A persistent glass bar. CTRL-A mark on the left; Start here, Sign
//     up, and the Menu trigger on the right.
//   · A full-screen overlay that opens on hover (fine pointers) and pins
//     on click: an aggressive blur + scrim over the whole page, then a
//     centered list, no cards, no icons. Nobody with no path yet sees
//     "Start here" first, big, ahead of everything else; once they have
//     one, Toolkits and ATL take that top spot instead and the path
//     itself shows in the strip above. The Magazine sits underneath as
//     a quieter secondary tier (Lock In is off the menu for now).
//
// The way back to the studio lives in the footer row as the real ROV
// logo, matching how the reference parks its legal row.
// ═══════════════════════════════════════════════════════

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Instagram, Linkedin, Mail } from "lucide-react";
import GoogleLoginButton from "@/components/providers/GoogleLoginButton";
import CtrlASignup from "./CtrlASignup";
import { ed } from "./editorial";
import { toolkitSections } from "../data";
import YourPath from "./YourPath";
import { useCtrlAPath } from "@/lib/ctrla/progress";

/** Routes that own the whole screen and get no site chrome. */
const CHROMELESS = ["/ctrla/pitchdeck"];

// Toolkits and ATL are the two real destinations and carry the big type
// in the menu's center; this sits underneath as the quieter tier. Lock In
// is off the menu for now, not gone for good.
const SECONDARY_PRIMARY = [{ title: "The Magazine", to: "/ctrla/vol/1" }];

const SECONDARY = [
  { title: "Brand Kit Generator", to: "/ctrla/brand-kit" },
  { title: "The Daily Taste Test", to: "/ctrla/daily" },
  { title: "Cookbook", to: "/ctrla/cookbook" },
];

/** Atlanta clock, the way the reference shows its studio's local time. */
function useAtlantaTime() {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const tick = () =>
      setNow(
        new Intl.DateTimeFormat("en-US", {
          hour: "numeric",
          minute: "2-digit",
          timeZone: "America/New_York",
        }).format(new Date())
      );
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export default function CtrlANav() {
  const pathname = usePathname() || "";
  const [open, setOpen] = useState(false);
  const [kitsOpen, setKitsOpen] = useState(false);
  const time = useAtlantaTime();
  const path = useCtrlAPath();
  const hasPath = path.ready && !!path.craft;

  // Hover opens on pointer devices; a click pins it so the panel survives
  // the cursor leaving. Touch only ever uses the click path.
  const pinned = useRef(false);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const clearTimers = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    openTimer.current = null;
    closeTimer.current = null;
  };

  const close = useCallback(() => {
    clearTimers();
    pinned.current = false;
    setOpen(false);
  }, []);

  const hoverOpen = () => {
    if (typeof window !== "undefined" && !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    clearTimers();
    openTimer.current = setTimeout(() => setOpen(true), 90);
  };

  const hoverClose = () => {
    if (pinned.current) return;
    clearTimers();
    closeTimer.current = setTimeout(() => setOpen(false), 220);
  };

  // Never trail the page it opened from.
  useEffect(() => {
    close();
  }, [pathname, close]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  useEffect(() => clearTimers, []);

  if (CHROMELESS.some((r) => pathname === r || pathname.startsWith(`${r}/`))) return null;

  const isActive = (to: string) => pathname === to || pathname.startsWith(`${to}/`);

  return (
    <>
      {/* ── The bar ─────────────────────────────────────── */}
      <div
        className="ctrla-nav-bar"
        onMouseEnter={hoverOpen}
        onMouseLeave={hoverClose}
      >
        <Link href="/ctrla" aria-label="CTRL-A home" className="ctrla-nav-mark">
          <Image
            src="/ctrla/ctrla-flat-logo-white.svg"
            alt="CTRL-A"
            width={48}
            height={35}
            priority
            unoptimized
            style={{ height: "clamp(18px,2.2vw,24px)", width: "auto" }}
          />
        </Link>

        <div className="ctrla-nav-right">
          {hasPath ? (
            <span className="ctrla-nav-start">
              <YourPath variant="line" />
            </span>
          ) : (
            <Link href="/ctrla/start" className="ctrla-nav-link ctrla-nav-start">
              Start here
            </Link>
          )}

          <button
            type="button"
            className="ctrla-nav-signup"
            onClick={() => {
              clearTimers();
              pinned.current = true;
              setOpen(true);
              // Let the panel mount, then put the cursor in the field.
              setTimeout(() => panelRef.current?.querySelector<HTMLInputElement>("input[type=email]")?.focus(), 420);
            }}
          >
            Sign up
          </button>

          <button
            type="button"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="ctrla-nav-trigger"
            onClick={() => {
              clearTimers();
              if (open && pinned.current) {
                close();
              } else {
                pinned.current = true;
                setOpen(true);
              }
            }}
          >
            <span>{open ? "Close" : "Menu"}</span>
            <span className={`ctrla-nav-burger${open ? " is-open" : ""}`} aria-hidden>
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      {/* ── The overlay ─────────────────────────────────── */}
      <div
        className={`ctrla-nav-shell${open ? " is-open" : ""}`}
        aria-hidden={!open}
        onMouseEnter={() => clearTimers()}
        onMouseLeave={hoverClose}
      >
        <button type="button" aria-label="Close menu" tabIndex={-1} onClick={close} className="ctrla-nav-scrim" />

        <div ref={panelRef} className="ctrla-nav-overlay" role="dialog" aria-modal="false" aria-label="CTRL-A menu">
          <div className="ctrla-nav-overlay-top">
            <Link href="/ctrla" onClick={close} aria-label="CTRL-A home" className="ctrla-nav-mark">
              <Image
                src="/ctrla/ctrla-flat-logo-white.svg"
                alt="CTRL-A"
                width={40}
                height={29}
                unoptimized
                style={{ height: "clamp(16px,2vw,20px)", width: "auto" }}
              />
            </Link>
            <button type="button" onClick={close} className="ctrla-nav-close">
              Close
            </button>
          </div>

          <div className="ctrla-nav-overlay-center">
            {hasPath && <YourPath variant="strip" onNavigate={close} />}

            <div className="ctrla-nav-primary">
              {/* Nobody's taken the quiz yet: that's the first door, ahead
                  of Toolkits and ATL, not a footnote below them. Someone
                  who has a path already sees it in the strip above instead. */}
              {!hasPath && (
                <Link href="/ctrla/start" onClick={close} className="ctrla-nav-primary-item is-active">
                  Start here
                </Link>
              )}

              {/* Toolkits, expanding in place to the four crafts */}
              <button
                type="button"
                className={`ctrla-nav-primary-item${kitsOpen ? " is-active" : ""}`}
                aria-expanded={kitsOpen}
                onClick={() => setKitsOpen((v) => !v)}
              >
                Toolkits
                {isActive("/ctrla/toolkit") && <span className="ctrla-nav-here">you&rsquo;re here</span>}
              </button>

              {kitsOpen && (
                <div className="ctrla-nav-kits">
                  {toolkitSections.map((s) => (
                    <Link key={s.id} href={`/ctrla/toolkit/${s.id}`} className="ctrla-nav-kit" onClick={close}>
                      {s.title}
                    </Link>
                  ))}
                </div>
              )}

              <Link href="/ctrla/atl" onClick={close} className={`ctrla-nav-primary-item${isActive("/ctrla/atl") ? " is-active" : ""}`}>
                ATL
                {isActive("/ctrla/atl") && <span className="ctrla-nav-here">you&rsquo;re here</span>}
              </Link>
            </div>

            <span aria-hidden className="ctrla-nav-rule" />

            <div className="ctrla-nav-secondary-row">
              {SECONDARY_PRIMARY.map((item, i) => (
                <span key={item.to}>
                  {i > 0 && <span aria-hidden className="ctrla-nav-dot">·</span>}
                  <Link href={item.to} onClick={close} className={isActive(item.to) ? "is-active" : ""}>
                    {item.title}
                  </Link>
                </span>
              ))}
            </div>

            <div className="ctrla-nav-links-row">
              {SECONDARY.map((item) => (
                <Link key={item.to} href={item.to} onClick={close} className="ctrla-nav-sub">
                  {item.title}
                </Link>
              ))}
            </div>

            <Link href="/ctrla/submit" onClick={close} className="ctrla-nav-submit">
              Submit your work →
            </Link>
          </div>

          <div className="ctrla-nav-overlay-foot">
            <div className="ctrla-nav-foot-left">
              <Link href="/" onClick={close} className="ctrla-nav-rov" aria-label="Range Of View Studios">
                <Image src="/brand/rov-logo.webp" alt="" width={140} height={36} unoptimized style={{ height: 28, width: "auto" }} />
              </Link>
              <span className="ctrla-nav-eyebrow">Atlanta {time ? `· ${time}` : ""}</span>
              <div className="ctrla-nav-socials">
                <a href="https://www.instagram.com/rangeofview/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Instagram size={16} strokeWidth={1.6} />
                </a>
                <a href="https://www.linkedin.com/company/range-of-view/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <Linkedin size={16} strokeWidth={1.6} />
                </a>
                <a href="mailto:contact@rovstudios.com" aria-label="Email">
                  <Mail size={16} strokeWidth={1.6} />
                </a>
              </div>
              <div className="ctrla-nav-login">
                <GoogleLoginButton />
              </div>
            </div>

            <CtrlASignup
              source="ctrla:nav"
              theme="dark"
              variant="inline"
              accent={ed.gold}
              cta="Join"
              note="One email a month."
            />
          </div>
        </div>
      </div>
    </>
  );
}
