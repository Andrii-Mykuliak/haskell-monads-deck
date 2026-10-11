import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { C, F } from "../deck/theme";
import { POP, SlideDef, useSteps } from "../deck/steps";
import { At } from "../deck/ui";
import { clamp01, useClock } from "./common";

/* Final slide: Maybe as a two-track railway. Values stream along the Just track through three gates;
   a value that fails `positive` is switched to the Nothing track and skips the rest. Runs continuously. */

const X0 = 1000;
const X1 = 1700;
const TOP = 470;
const BOT = 700;
const GATES = [
  { x: 1170, name: "positive" },
  { x: 1380, name: "inc" },
  { x: 1580, name: "double" },
];
const VALUES = [3, -2, 5, 1, -7, 4, 0, 6, -1, 2, 8, -3];
const START = 2.4;
const PERIOD = 1.25;
const SPEED = 190;
const DROP = 0.55;
const SWITCH_X = GATES[0].x;
const LAND_X = SWITCH_X + 90;
const TOP_TIME = (X1 - X0) / SPEED;
const FAIL_AT = (SWITCH_X - X0) / SPEED;
const FAIL_END = FAIL_AT + DROP + (X1 - LAND_X) / SPEED;
const BURST = 0.9;
const DONE_AT = 130;

type Tok = { x: number; y: number; label: string; fail: boolean; nothing: boolean };

const easeInOut = (p: number) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);

const valueAt = (v: number, x: number) => (x < GATES[1].x ? v : x < GATES[2].x ? v + 1 : (v + 1) * 2);

const tokenAt = (k: number, t: number): Tok | null => {
  const age = t - (START + k * PERIOD);
  if (age < 0) {
    return null;
  }
  const v = VALUES[k % VALUES.length];
  if (v > 0) {
    if (age > TOP_TIME) {
      return null;
    }
    const x = X0 + age * SPEED;
    return { x, y: TOP, label: String(valueAt(v, x)), fail: false, nothing: false };
  }
  if (age < FAIL_AT) {
    return { x: X0 + age * SPEED, y: TOP, label: String(v), fail: true, nothing: false };
  }
  if (age < FAIL_AT + DROP) {
    const p = easeInOut((age - FAIL_AT) / DROP);
    return { x: SWITCH_X + (LAND_X - SWITCH_X) * p, y: TOP + (BOT - TOP) * p, label: p < 0.5 ? String(v) : "Nothing", fail: true, nothing: p >= 0.5 };
  }
  if (age > FAIL_END) {
    return null;
  }
  return { x: LAND_X + (age - FAIL_AT - DROP) * SPEED, y: BOT, label: "Nothing", fail: true, nothing: true };
};

const rnd = (n: number) => {
  const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};
const DUST = Array.from({ length: 36 }, (_, i) => ({
  x: 940 + rnd(i * 5 + 1) * 940,
  y: rnd(i * 7 + 2) * 1080,
  r: 1 + rnd(i * 11 + 3) * 1.8,
  v: 6 + rnd(i * 13 + 4) * 14,
  ph: rnd(i * 17 + 5) * 6.28,
  c: i % 3 === 0 ? C.mint : C.lav,
}));

const Burst: React.FC<{ x: number; y: number; p: number; color: string; seed: number; n?: number; reach?: number }> = ({
  x,
  y,
  p,
  color,
  seed,
  n = 14,
  reach = 80,
}) => {
  const e = 1 - Math.pow(1 - p, 3);
  return (
    <>
      <circle cx={x} cy={y} r={10 + 50 * e} fill="none" stroke={color} strokeWidth={3 * (1 - p)} opacity={1 - p} />
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2 + rnd(seed * 31 + i) * 0.5;
        const d = 16 + reach * e * (0.6 + 0.4 * rnd(seed * 17 + i));
        return <circle key={i} cx={x + Math.cos(a) * d} cy={y + Math.sin(a) * d} r={3.2 * (1 - p) + 0.6} fill={color} opacity={1 - p} />;
      })}
    </>
  );
};

/** The latest value that reached the end of a track; pops in when it arrives. */
const Result: React.FC<{ x: number; y: number; dt: number; color: string; label: string; value?: string }> = ({ x, y, dt, color, label, value }) => {
  const p = clamp01(dt / 0.35);
  const pop = 1 + 0.25 * Math.sin(Math.PI * p);
  const empty = value === undefined;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(0, -50%) scale(${pop})`,
        transformOrigin: "left center",
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 14px",
        borderRadius: 16,
        border: `3px ${empty ? "dashed" : "solid"} ${empty ? color : C.accentHi}`,
        background: C.bg,
        boxShadow: empty ? undefined : `0 0 ${24 * (1 - p) + 10}px rgba(134,224,168,${0.25 + 0.35 * (1 - p)})`,
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 24, color: empty ? color : C.accentHi }}>{label}</span>
      {!empty && (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: 40,
            height: 40,
            padding: "0 8px",
            borderRadius: 10,
            border: `2px solid ${color}`,
            background: `${color}22`,
            fontFamily: F.mono,
            fontWeight: 700,
            fontSize: 24,
            color,
          }}
        >
          {value}
        </span>
      )}
    </div>
  );
};

const Outro: React.FC = () => {
  const { s, frame: f, fps } = useSteps();
  const clock = useClock();
  const t = Math.max(f / fps, clock);
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

  const kLast = Math.floor((t - START) / PERIOD);
  const kFirst = Math.max(0, kLast - Math.ceil((FAIL_END + BURST) / PERIOD) - 1);
  const ks: number[] = [];
  for (let k = kFirst; k <= kLast; k++) {
    ks.push(k);
  }
  const toks = ks.map((k) => ({ k, tok: tokenAt(k, t) }));

  const gateHot = GATES.map((g, gi) => {
    let hot = 0;
    let ring = -1;
    for (const k of ks) {
      const age = t - (START + k * PERIOD);
      const v = VALUES[k % VALUES.length];
      if (gi > 0 && v <= 0) {
        continue;
      }
      const dt = age - (g.x - X0) / SPEED;
      hot = Math.max(hot, clamp01(1 - Math.abs(dt) / 0.3));
      if (v > 0 && dt >= 0 && dt < 0.6) {
        ring = dt / 0.6;
      }
    }
    return { hot, ring };
  });

  const failFlash = ks.reduce((m, k) => {
    if (VALUES[k % VALUES.length] > 0) {
      return m;
    }
    const dt = t - (START + k * PERIOD) - FAIL_AT;
    return dt >= 0 && dt < 0.7 ? Math.max(m, 1 - dt / 0.7) : m;
  }, 0);

  const arrivals = ks
    .map((k) => {
      const v = VALUES[k % VALUES.length];
      return { k, v, dt: t - (START + k * PERIOD + (v > 0 ? TOP_TIME : FAIL_END)) };
    })
    .filter((a) => a.dt >= 0);
  const lastJust = [...arrivals].reverse().find((a) => a.v > 0);
  const lastNothing = [...arrivals].reverse().find((a) => a.v <= 0);

  const codePart = (txt: string, hot: number) => (
    <span style={{ color: hot > 0.05 ? C.amber : C.dim, textShadow: hot > 0.05 ? `0 0 ${14 * hot}px rgba(242,193,125,${0.8 * hot})` : undefined }}>
      {txt}
    </span>
  );

  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 72% 46%, rgba(134,224,168,0.10) 0%, rgba(141,118,220,0.10) 30%, ${C.bg} 62%)` }} />
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        {DUST.map((d, i) => (
          <circle
            key={i}
            cx={d.x}
            cy={(d.y - t * d.v + 1080 * 20) % 1080}
            r={d.r}
            fill={d.c}
            opacity={(0.12 + 0.18 * (0.5 + 0.5 * Math.sin(t * 1.4 + d.ph))) * rails}
          />
        ))}
      </svg>

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

      <div
        style={{
          position: "absolute",
          left: X0,
          top: 200,
          fontFamily: F.mono,
          fontWeight: 600,
          fontSize: 30,
          whiteSpace: "pre",
          fontVariantLigatures: "none",
          opacity: clamp01(s(0, 24)),
        }}
      >
        {codePart("pure x >>= ", 0)}
        {codePart("positive", gateHot[0].hot)}
        {codePart(" >>= ", 0)}
        {codePart("inc", gateHot[1].hot)}
        {codePart(" >>= ", 0)}
        {codePart("double", gateHot[2].hot)}
      </div>

      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <filter id="glow" filterUnits="userSpaceOnUse" x={0} y={0} width={1920} height={1080}>
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="trailJ" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor={C.mint} stopOpacity="0" />
            <stop offset="1" stopColor={C.mint} stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="trailN" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor={C.red} stopOpacity="0" />
            <stop offset="1" stopColor={C.red} stopOpacity="0.55" />
          </linearGradient>
        </defs>
        <g opacity={rails}>
          <line x1={X0} y1={TOP} x2={X0 + (X1 - X0) * rails} y2={TOP} stroke={C.mint} strokeWidth={6} strokeLinecap="round" filter="url(#glow)" />
          <line
            x1={X0}
            y1={TOP}
            x2={X0 + (X1 - X0) * rails}
            y2={TOP}
            stroke="#eafff2"
            strokeWidth={2}
            strokeDasharray="4 26"
            strokeDashoffset={-t * 140}
            opacity={0.8}
          />
          <line
            x1={X0}
            y1={BOT}
            x2={X0 + (X1 - X0) * rails}
            y2={BOT}
            stroke={C.red}
            strokeOpacity={0.45}
            strokeWidth={3}
            strokeDasharray="12 10"
            strokeDashoffset={-t * 60}
          />
          <path
            d={`M ${SWITCH_X} ${TOP} C ${SWITCH_X + 10} ${TOP + 120}, ${LAND_X - 10} ${BOT - 80}, ${LAND_X} ${BOT}`}
            stroke={C.red}
            strokeWidth={3 + 3 * failFlash}
            strokeOpacity={0.35 + 0.65 * failFlash}
            fill="none"
            strokeDasharray="6 8"
            filter={failFlash > 0.05 ? "url(#glow)" : undefined}
          />
          {GATES.map((g, i) => {
            const h = gateHot[i].hot;
            const red = i === 0 ? failFlash : 0;
            const color = red > 0.1 ? C.red : h > 0.05 ? C.amber : "#59627d";
            return (
              <rect
                key={i}
                x={g.x - 4}
                y={TOP - 34}
                width={8}
                height={68}
                rx={4}
                fill={color}
                filter={h > 0.05 || red > 0.1 ? "url(#glow)" : undefined}
                opacity={s(0, 50 + i * 6)}
              />
            );
          })}
          {GATES.map((g, i) =>
            gateHot[i].ring >= 0 ? <Burst key={`r${i}`} x={g.x} y={TOP} p={gateHot[i].ring} color={C.amber} seed={i + 1} n={8} reach={34} /> : null,
          )}
          {failFlash > 0 && <Burst x={SWITCH_X} y={TOP} p={1 - failFlash} color={C.red} seed={99} n={12} reach={60} />}
          {toks.map(({ k, tok }) =>
            tok && tok.y === TOP ? (
              <rect key={`t${k}`} x={tok.x - 110} y={TOP - 3} width={100} height={6} rx={3} fill={tok.fail ? "url(#trailN)" : "url(#trailJ)"} />
            ) : tok && tok.y === BOT ? (
              <rect key={`t${k}`} x={tok.x - 130} y={BOT - 2} width={100} height={4} rx={2} fill="url(#trailN)" />
            ) : null,
          )}
          {arrivals
            .filter((a) => a.dt < BURST)
            .map((a) => (
              <Burst
                key={`b${a.k}`}
                x={X1}
                y={a.v > 0 ? TOP : BOT}
                p={a.dt / BURST}
                color={a.v > 0 ? C.mint : "#7b6f8f"}
                seed={a.k + 7}
                n={a.v > 0 ? 18 : 8}
                reach={a.v > 0 ? 90 : 40}
              />
            ))}
        </g>
      </svg>

      <At x={X0} y={TOP - 84} step={0} delay={44} size={24} weight={700} color={C.mint} font={F.mono}>
        Just
      </At>
      <At x={X0} y={BOT - 64} step={0} delay={50} size={24} weight={700} color={C.red} font={F.mono} style={{ opacity: 0.7 }}>
        Nothing
      </At>
      {GATES.map((g, i) => {
        const h = gateHot[i].hot;
        const red = i === 0 ? failFlash : 0;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: g.x,
              top: TOP - 82,
              transform: `translateX(-50%) scale(${1 + 0.12 * Math.max(h, red)})`,
              fontFamily: F.mono,
              fontWeight: 700,
              fontSize: 24,
              color: red > 0.1 ? C.red : h > 0.05 ? C.amber : C.dim,
              textShadow: h > 0.05 ? `0 0 ${12 * h}px rgba(242,193,125,0.9)` : undefined,
              opacity: s(0, 50 + i * 6),
            }}
          >
            {g.name}
          </div>
        );
      })}

      {toks.map(({ k, tok }) => {
        if (!tok) {
          return null;
        }
        const color = tok.nothing ? C.faint : tok.fail ? C.amber : C.mint;
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              left: tok.x,
              top: tok.y,
              transform: `translate(-50%, -50%) scale(${tok.nothing ? 0.85 : 1})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 54,
              height: 54,
              padding: "0 12px",
              borderRadius: 12,
              border: `3px ${tok.nothing ? "dashed" : "solid"} ${color}`,
              background: tok.nothing ? C.bg : `linear-gradient(${color}2a, ${color}2a), ${C.bg}`,
              boxShadow: tok.nothing ? undefined : `0 0 18px ${color}88`,
              fontFamily: F.mono,
              fontWeight: 700,
              fontSize: tok.nothing ? 22 : 30,
              color,
              boxSizing: "border-box",
              whiteSpace: "nowrap",
            }}
          >
            {tok.label}
          </div>
        );
      })}

      {lastJust && <Result x={X1 + 30} y={TOP} dt={lastJust.dt} color={C.mint} label="Just" value={String((lastJust.v + 1) * 2)} />}
      {lastNothing && <Result x={X1 + 30} y={BOT} dt={lastNothing.dt} color={C.faint} label="Nothing" />}

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
