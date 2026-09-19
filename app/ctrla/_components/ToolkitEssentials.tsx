"use client";

// TOOLKIT ESSENTIALS - the beginner-mode tool list.
//
// Simplified mode swaps the full Stations/Signals experience for this:
// 3-4 tools, no more. Picks the section's Beginner-level tools first,
// then fills up to the floor from the next tier so a section with too
// few explicit Beginner picks (currently: video) still reads as a real
// shortlist rather than a half-empty one. Order otherwise follows the
// hand-authored order in data.ts, which is already easiest-first.

import type { Tool, ToolkitSection } from "../data";
import { edLight as ed, Bleed, Kicker, Label, Rule } from "./editorial";

const FLOOR = 3;
const CEILING = 4;

function pickEssentials(tools: Tool[]): Tool[] {
  const beginner = tools.filter((t) => t.level === "Beginner");
  if (beginner.length >= FLOOR) return beginner.slice(0, CEILING);

  const rest = tools.filter((t) => t.level !== "Beginner");
  return [...beginner, ...rest].slice(0, CEILING);
}

export default function ToolkitEssentials({
  section,
  accent,
}: {
  section: ToolkitSection;
  accent: string;
}) {
  const picks = pickEssentials(section.tools);
  if (picks.length === 0) return null;

  return (
    <section style={{ background: "transparent", padding: "clamp(24px,4vw,48px) 0" }}>
      <Bleed>
        <Kicker color={accent}>The essentials</Kicker>
        <p
          style={{
            fontFamily: ed.body,
            fontSize: "clamp(14px,1.6vw,17px)",
            lineHeight: 1.5,
            color: ed.inkSoft,
            margin: "12px 0 0",
            maxWidth: 560,
          }}
        >
          Start here. This is not the whole kit, it&apos;s the part worth learning first.
        </p>

        <div style={{ marginTop: "clamp(24px,3vw,36px)" }}>
          <Rule color={ed.hair} />
          {picks.map((tool) => (
            <a
              key={tool.name}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "block", textDecoration: "none" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  gap: 24,
                  flexWrap: "wrap",
                  padding: "clamp(18px,2.6vw,28px) 0",
                }}
              >
                <div style={{ maxWidth: 640 }}>
                  <span
                    style={{
                      fontFamily: ed.grotesque,
                      fontWeight: 800,
                      fontSize: "clamp(22px,3vw,32px)",
                      letterSpacing: "-0.02em",
                      color: ed.ink,
                    }}
                  >
                    {tool.name}
                  </span>
                  <p
                    style={{
                      fontFamily: ed.body,
                      fontSize: "clamp(14px,1.6vw,16px)",
                      lineHeight: 1.5,
                      color: ed.inkSoft,
                      margin: "8px 0 0",
                    }}
                  >
                    {tool.oneLiner ?? tool.description}
                  </p>
                </div>
                <Label color={ed.inkFaint} style={{ whiteSpace: "nowrap" }}>
                  {tool.category} &#8599;
                </Label>
              </div>
              <Rule color={ed.hair} />
            </a>
          ))}
        </div>
      </Bleed>
    </section>
  );
}
