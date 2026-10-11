import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { C, F } from "../deck/theme";
import { POP, SlideDef, useSteps } from "../deck/steps";
import { At } from "../deck/ui";
import { clamp01 } from "./common";
import { Ctx, Val } from "./kit";

/* Final slide: Maybe as a two-track railway. A value rides the Just track through three steps; a failing one drops to Nothing. */

const X0 = 1000;
const X1 = 1700;
const TOP = 480;
const BOT = 700;
const STATIONS = [
  { x: 1170, name: "positive" },
  { x: 1380, name: "inc" },
  { x: 1580, name: "double" },
];
const A_START = 80;
const A_END = 260;
const B_START = 170;
const B_DROP = 212;
const B_LAND = 240;
const B_END = 350;
const DONE_AT = B_END + 10;

const ease = Easing.inOut(Easing.cubic);
const span = (f: number, a: number, b: number, from: number, to: number, e = ease) =>
  interpolate(f, [a, b], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });

const Outro: React.FC = () => {
  const { s, frame: f } = useSteps();
  const credit = s(0, DONE_AT + 20);
  const sweep = interpolate(f, [DONE_AT + 30, DONE_AT + 80], [-30, 130], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rails = s(0, 40);

  const letters = (str: string, base: number) =>
    str.split("").map((ch, i) => {
      const p = s(0, base + i * 2, POP);
      return (
        <span key={i} style={{ display: "inline-block", whiteSpace: "pre", opacity: Math.min(1, p), transform: `translateY(${(1 - p) * 50}px)` }}>
          {ch}
        </span>
      );
    });

  const ax = span(f, A_START, A_END, X0 + 10, X1 - 10);
  const aVal = ax < STATIONS[1].x ? 3 : ax < STATIONS[2].x ? 4 : 8;
  const aDone = s(0, A_END, POP);

  const bx = f < B_DROP ? span(f, B_START, B_DROP, X0 + 10, STATIONS[0].x, Easing.out(Easing.cubic)) : f < B_LAND ? span(f, B_DROP, B_LAND, STATIONS[0].x, STATIONS[0].x + 90) : span(f, B_LAND, B_END, STATIONS[0].x + 90, X1 - 10);
  const by = f < B_DROP ? TOP : span(f, B_DROP, B_LAND, TOP, BOT);
  const bFailed = f >= B_DROP;
  const bDone = s(0, B_END, POP);

  const near = (x: number, sx: number) => clamp01(1 - Math.abs(x - sx) / 40);

  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 72% 52%, rgba(141,118,220,0.12) 0%, ${C.bg} 60%)` }} />

      <div style={{ position: "absolute", left: 90, top: 150, fontFamily: F.head, fontWeight: 800, fontSize: 104, lineHeight: 1.12, color: C.text }}>
        <div>{letters("Дякую", 6)}</div>
        <div>{letters("за увагу!", 18)}</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 430,
          height: 6,
          width: 440 * s(0, 36),
          borderRadius: 3,
          background: `linear-gradient(90deg, ${C.accent}, ${C.pink})`,
        }}
      />

      <At x={X0} y={200} w={860} step={0} delay={24} size={28} weight={400} color={C.dim} font={F.mono} style={{ fontVariantLigatures: "none" }}>
        {"pure x >>= positive >>= inc >>= double"}
      </At>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: rails }}>
        <line x1={X0} y1={TOP} x2={X0 + (X1 - X0) * rails} y2={TOP} stroke={C.mint} strokeWidth={4} strokeLinecap="round" />
        <line x1={X0} y1={BOT} x2={X0 + (X1 - X0) * rails} y2={BOT} stroke={C.faint} strokeWidth={4} strokeDasharray="10 10" />
        <path
          d={`M ${STATIONS[0].x} ${TOP} C ${STATIONS[0].x + 10} ${TOP + 120}, ${STATIONS[0].x + 80} ${BOT - 80}, ${STATIONS[0].x + 90} ${BOT}`}
          stroke={C.faint}
          strokeWidth={3}
          fill="none"
          strokeDasharray="6 8"
          opacity={s(0, 60)}
        />
        {STATIONS.map((st, i) => (
          <line key={i} x1={st.x} y1={TOP - 26} x2={st.x} y2={TOP + 26} stroke={C.line} strokeWidth={4} opacity={s(0, 50 + i * 6)} />
        ))}
      </svg>
      <At x={X0} y={TOP - 80} step={0} delay={44} size={24} weight={700} color={C.mint} font={F.mono}>
        Just
      </At>
      <At x={X0} y={BOT - 64} step={0} delay={50} size={24} weight={700} color={C.faint} font={F.mono}>
        Nothing
      </At>
      {STATIONS.map((st, i) => {
        const hot = near(ax, st.x);
        const fail = i === 0 ? clamp01(1 - Math.abs(f - B_DROP) / 14) : 0;
        const color = fail > 0.05 ? C.red : hot > 0.05 ? C.amber : C.dim;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: st.x,
              top: TOP - 74,
              transform: `translateX(-50%) scale(${1 + 0.08 * Math.max(hot, fail)})`,
              fontFamily: F.mono,
              fontWeight: 700,
              fontSize: 24,
              color,
              opacity: s(0, 50 + i * 6),
            }}
          >
            {st.name}
          </div>
        );
      })}

      {f >= A_START && aDone < 0.05 && (
        <div style={{ position: "absolute", left: ax, top: TOP, transform: "translate(-50%, -50%)", display: "flex", background: C.bg, borderRadius: 12 }}>
          <Val color={C.mint} size={26}>
            {aVal}
          </Val>
        </div>
      )}
      <div
        style={{
          position: "absolute",
          left: X1 + 20,
          top: TOP,
          transform: `translate(0, -50%) scale(${0.7 + 0.3 * aDone})`,
          transformOrigin: "left center",
          opacity: clamp01(aDone),
        }}
      >
        <Ctx label="Just">
          <Val size={26}>8</Val>
        </Ctx>
      </div>

      {f >= B_START && bDone < 0.05 && (
        <div style={{ position: "absolute", left: bx, top: by, transform: "translate(-50%, -50%)", display: "flex", background: C.bg, borderRadius: 16 }}>
          {bFailed ? (
            <Ctx label="Nothing" empty color={C.faint} size={22} />
          ) : (
            <Val color={C.amber} size={26}>
              -1
            </Val>
          )}
        </div>
      )}
      <div
        style={{
          position: "absolute",
          left: X1 + 20,
          top: BOT,
          transform: `translate(0, -50%) scale(${0.7 + 0.3 * bDone})`,
          transformOrigin: "left center",
          opacity: clamp01(bDone),
        }}
      >
        <Ctx label="Nothing" empty color={C.faint} />
      </div>
      <At x={X0} y={800} w={860} step={0} delay={DONE_AT - 10} size={26} weight={600} color={C.dim}>
        Один невдалий крок – і решта ланцюжка пропускається без жодної перевірки вручну.
      </At>

      <div style={{ position: "absolute", left: 96, top: 900, opacity: credit, transform: `translateY(${(1 - credit) * 16}px)` }}>
        <span
          style={{
            fontFamily: F.mono,
            fontWeight: 600,
            fontSize: 34,
            letterSpacing: 2,
            backgroundImage: `linear-gradient(100deg, ${C.dim} 0%, ${C.dim} ${sweep - 12}%, #ffffff ${sweep}%, ${C.dim} ${sweep + 12}%, ${C.dim} 100%)`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          made with Claude Opus 5.5
        </span>
      </div>
    </AbsoluteFill>
  );
};

export const outroSlide: SlideDef = { id: "thanks", title: "Дякую за увагу", steps: [DONE_AT + 120], C: Outro };
