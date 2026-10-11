import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { C, F } from "../deck/theme";
import { POP, SlideDef, useSteps } from "../deck/steps";
import { At } from "../deck/ui";
import { clamp01, useClock } from "./common";

/* Final slide: Maybe as a two-track railway. Values drive into three stations, get processed and drive on;
   a value that fails `positive` leaves the station downwards onto the Nothing track. Runs continuously. */

const X0 = 980;
const X1 = 1730;
const TOP = 480;
const BOT = 730;
const BOX_W = 150;
const BOX_H = 120;
const STATIONS = [
  { x: 1130, name: "positive", op: "x > 0 ?" },
  { x: 1360, name: "inc", op: "x + 1" },
  { x: 1590, name: "double", op: "x * 2" },
];
const VALUES = [3, -2, 5, 1, -7, 4, 0, 6, -1, 2, 8, -3];
const START = 2.4;
const PERIOD = 1.6;
const SPEED = 230;
const DWELL = 0.7;
const DROP = 0.6;
const LAND_X = STATIONS[0].x + 110;
const BURST = 0.9;
const DONE_AT = 130;

/** When the token reaches station i (arrive) and leaves it (leave), relative to its spawn. */
const ARRIVE = STATIONS.map((st, i) => (st.x - X0) / SPEED + i * DWELL);
const LEAVE = ARRIVE.map((a) => a + DWELL);
const END_OK = LEAVE[2] + (X1 - STATIONS[2].x) / SPEED;
const DROP_AT = LEAVE[0];
const END_FAIL = DROP_AT + DROP + (X1 - LAND_X) / SPEED;

type Tok = { x: number; y: number; label: string; color: string; nothing: boolean; scale: number };

const easeInOut = (p: number) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);
const pulse = (p: number) => 1 + 0.28 * Math.sin(Math.PI * clamp01((p - 0.4) / 0.25));

const xOnTop = (age: number) => {
  for (let i = 0; i < STATIONS.length; i++) {
    const from = i === 0 ? X0 : STATIONS[i - 1].x;
    const t0 = i === 0 ? 0 : LEAVE[i - 1];
    if (age < ARRIVE[i]) {
      return from + (age - t0) * SPEED;
    }
    if (age < LEAVE[i]) {
      return STATIONS[i].x;
    }
  }
  return STATIONS[2].x + (age - LEAVE[2]) * SPEED;
};

const tokenAt = (k: number, t: number): Tok | null => {
  const age = t - (START + k * PERIOD);
  if (age < 0) {
    return null;
  }
  const v = VALUES[k % VALUES.length];
  if (v > 0) {
    if (age > END_OK) {
      return null;
    }
    const mid1 = ARRIVE[1] + DWELL * 0.5;
    const mid2 = ARRIVE[2] + DWELL * 0.5;
    const label = age < mid1 ? v : age < mid2 ? v + 1 : (v + 1) * 2;
    const p1 = (age - ARRIVE[1]) / DWELL;
    const p2 = (age - ARRIVE[2]) / DWELL;
    return { x: xOnTop(age), y: TOP, label: String(label), color: C.mint, nothing: false, scale: pulse(p1) * pulse(p2) };
  }
  if (age < DROP_AT) {
    const verdict = age > ARRIVE[0] + DWELL * 0.7;
    return { x: xOnTop(age), y: TOP, label: String(v), color: verdict ? C.red : C.amber, nothing: false, scale: 1 };
  }
  if (age < DROP_AT + DROP) {
    const p = easeInOut((age - DROP_AT) / DROP);
    const x = STATIONS[0].x + (LAND_X - STATIONS[0].x) * p;
    return { x, y: TOP + (BOT - TOP) * p, label: "Nothing", color: C.faint, nothing: true, scale: 1 };
  }
  if (age > END_FAIL) {
    return null;
  }
  return { x: LAND_X + (age - DROP_AT - DROP) * SPEED, y: BOT, label: "Nothing", color: C.faint, nothing: true, scale: 1 };
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
        gap: 8,
        padding: "6px 12px",
        borderRadius: 14,
        border: `3px ${empty ? "dashed" : "solid"} ${empty ? color : C.accentHi}`,
        background: C.bg,
        boxShadow: empty ? undefined : `0 0 ${24 * (1 - p) + 10}px rgba(134,224,168,${0.25 + 0.35 * (1 - p)})`,
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 22, color: empty ? color : C.accentHi }}>{label}</span>
      {!empty && (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: 36,
            height: 36,
            padding: "0 6px",
            borderRadius: 9,
            border: `2px solid ${color}`,
            background: `${color}22`,
            fontFamily: F.mono,
            fontWeight: 700,
            fontSize: 22,
            color,
          }}
        >
          {value}
        </span>
      )}
    </div>
  );
};

type StationState = { active: number; progress: number; verdict: number; ok: boolean };

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
  const kFirst = Math.max(0, kLast - Math.ceil((Math.max(END_OK, END_FAIL) + BURST) / PERIOD) - 1);
  const ks: number[] = [];
  for (let k = kFirst; k <= kLast; k++) {
    ks.push(k);
  }
  const toks = ks.map((k) => ({ k, tok: tokenAt(k, t) }));

  const stations: StationState[] = STATIONS.map((_, i) => {
    let st: StationState = { active: 0, progress: -1, verdict: 0, ok: true };
    for (const k of ks) {
      const v = VALUES[k % VALUES.length];
      if (i > 0 && v <= 0) {
        continue;
      }
      const age = t - (START + k * PERIOD);
      const rel = age - ARRIVE[i];
      const active = clamp01(Math.min((rel + 0.15) / 0.15, (DWELL + 0.25 - rel) / 0.25));
      if (active > st.active) {
        st = { active, progress: clamp01(rel / DWELL), verdict: 0, ok: v > 0 };
      }
      if (i === 0 && rel > DWELL * 0.7 && rel < DWELL + 0.6) {
        st.verdict = Math.max(st.verdict, clamp01(1 - (rel - DWELL * 0.7 - 0.5) / 0.3));
        st.ok = v > 0;
      }
    }
    return st;
  });

  const dropFlash = ks.reduce((m, k) => {
    if (VALUES[k % VALUES.length] > 0) {
      return m;
    }
    const dt = t - (START + k * PERIOD) - DROP_AT;
    return dt >= 0 && dt < 0.8 ? Math.max(m, 1 - dt / 0.8) : m;
  }, 0);

  const arrivals = ks
    .map((k) => {
      const v = VALUES[k % VALUES.length];
      return { k, v, dt: t - (START + k * PERIOD + (v > 0 ? END_OK : END_FAIL)) };
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
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 72% 48%, rgba(134,224,168,0.10) 0%, rgba(141,118,220,0.10) 30%, ${C.bg} 62%)` }} />
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
        {codePart("positive", stations[0].active)}
        {codePart(" >>= ", 0)}
        {codePart("inc", stations[1].active)}
        {codePart(" >>= ", 0)}
        {codePart("double", stations[2].active)}
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
            d={`M ${STATIONS[0].x} ${TOP + BOX_H / 2} C ${STATIONS[0].x} ${TOP + 150}, ${LAND_X - 10} ${BOT - 70}, ${LAND_X} ${BOT}`}
            stroke={C.red}
            strokeWidth={3 + 3 * dropFlash}
            strokeOpacity={0.35 + 0.65 * dropFlash}
            fill="none"
            strokeDasharray="6 8"
            filter={dropFlash > 0.05 ? "url(#glow)" : undefined}
          />
          {toks.map(({ k, tok }) =>
            tok && tok.y === TOP ? (
              <rect key={`t${k}`} x={tok.x - 110} y={TOP - 3} width={100} height={6} rx={3} fill={tok.color === C.mint ? "url(#trailJ)" : "url(#trailN)"} />
            ) : tok && tok.y === BOT ? (
              <rect key={`t${k}`} x={tok.x - 140} y={BOT - 2} width={100} height={4} rx={2} fill="url(#trailN)" />
            ) : null,
          )}
        </g>
      </svg>

      <At x={X0} y={TOP - 96} step={0} delay={44} size={24} weight={700} color={C.mint} font={F.mono}>
        Just
      </At>
      <At x={X0} y={BOT - 64} step={0} delay={50} size={24} weight={700} color={C.red} font={F.mono} style={{ opacity: 0.7 }}>
        Nothing
      </At>

      {STATIONS.map((st, i) => {
        const a = s(0, 50 + i * 8, POP);
        const S = stations[i];
        const hot = S.active;
        const fail = i === 0 && S.verdict > 0 && !S.ok;
        const edge = fail ? C.red : hot > 0.05 ? C.amber : C.line;
        return (
          <React.Fragment key={st.name}>
            <div
              style={{
                position: "absolute",
                left: st.x,
                top: TOP - BOX_H / 2 - 40,
                transform: "translateX(-50%)",
                fontFamily: F.mono,
                fontWeight: 700,
                fontSize: 26,
                color: hot > 0.05 ? C.amber : C.text,
                textShadow: hot > 0.05 ? `0 0 ${12 * hot}px rgba(242,193,125,0.9)` : undefined,
                opacity: clamp01(a),
                whiteSpace: "nowrap",
              }}
            >
              {st.name}
            </div>
            <div
              style={{
                position: "absolute",
                left: st.x - BOX_W / 2,
                top: TOP - BOX_H / 2,
                width: BOX_W,
                height: BOX_H,
                borderRadius: 20,
                border: `3px solid ${edge}`,
                background: `linear-gradient(180deg, rgba(242,193,125,${0.1 * hot}) 0%, rgba(33,39,56,0.96) 70%)`,
                boxShadow: hot > 0.05 ? `0 0 ${30 * hot}px ${fail ? "rgba(239,107,107,0.6)" : "rgba(242,193,125,0.45)"}` : "0 8px 24px rgba(0,0,0,0.35)",
                boxSizing: "border-box",
                opacity: clamp01(a),
                transform: `scale(${(0.8 + 0.2 * a) * (1 + 0.04 * hot)})`,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 6,
                  textAlign: "center",
                  fontFamily: F.mono,
                  fontWeight: 600,
                  fontSize: 18,
                  color: hot > 0.05 ? C.amber : C.dim,
                  fontVariantLigatures: "none",
                }}
              >
                {st.op}
              </div>
              <div
                style={{
                  position: "absolute",
                  left: 12,
                  bottom: 10,
                  height: 6,
                  width: (BOX_W - 30) * (S.progress >= 0 ? S.progress : 0),
                  borderRadius: 3,
                  background: fail ? C.red : C.amber,
                  opacity: hot,
                }}
              />
            </div>
            {i === 0 && S.verdict > 0 && (
              <div
                style={{
                  position: "absolute",
                  left: st.x + BOX_W / 2 - 18,
                  top: TOP - BOX_H / 2 - 18,
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  background: S.ok ? C.mint : C.red,
                  color: C.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: F.body,
                  fontWeight: 900,
                  fontSize: 24,
                  opacity: S.verdict,
                  transform: `scale(${0.6 + 0.4 * S.verdict})`,
                  boxShadow: `0 0 16px ${S.ok ? "rgba(134,224,168,0.7)" : "rgba(239,107,107,0.7)"}`,
                }}
              >
                {S.ok ? "✓" : "✗"}
              </div>
            )}
          </React.Fragment>
        );
      })}

      {toks.map(({ k, tok }) => {
        if (!tok) {
          return null;
        }
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              left: tok.x,
              top: tok.y,
              transform: `translate(-50%, -50%) scale(${(tok.nothing ? 0.85 : 1) * tok.scale})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 54,
              height: 54,
              padding: "0 12px",
              borderRadius: 12,
              border: `3px ${tok.nothing ? "dashed" : "solid"} ${tok.color}`,
              background: tok.nothing ? C.bg : `linear-gradient(${tok.color}2a, ${tok.color}2a), ${C.bg}`,
              boxShadow: tok.nothing ? undefined : `0 0 ${18 * tok.scale}px ${tok.color}88`,
              fontFamily: F.mono,
              fontWeight: 700,
              fontSize: tok.nothing ? 22 : 30,
              color: tok.color,
              boxSizing: "border-box",
              whiteSpace: "nowrap",
            }}
          >
            {tok.label}
          </div>
        );
      })}

      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
        {ks.map((k) => {
          const v = VALUES[k % VALUES.length];
          const age = t - (START + k * PERIOD);
          return STATIONS.map((st, i) => {
            if (i > 0 && v <= 0) {
              return null;
            }
            const p = (age - ARRIVE[i] - DWELL * 0.45) / 0.6;
            if (p < 0 || p > 1) {
              return null;
            }
            const color = i === 0 ? (v > 0 ? C.mint : C.red) : C.amber;
            return <Burst key={`s${k}-${i}`} x={st.x} y={TOP} p={p} color={color} seed={k * 3 + i} n={10} reach={44} />;
          });
        })}
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
      </svg>

      {lastJust && <Result x={X1 + 16} y={TOP} dt={lastJust.dt} color={C.mint} label="Just" value={String((lastJust.v + 1) * 2)} />}
      {lastNothing && <Result x={X1 + 16} y={BOT} dt={lastNothing.dt} color={C.faint} label="Nothing" />}

      <At x={X0} y={820} w={860} step={0} delay={DONE_AT - 10} size={26} weight={600} color={C.dim}>
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

export const outroSlide: SlideDef = { id: "thanks", title: "Дякую за увагу", steps: [DONE_AT + 280], C: Outro };
