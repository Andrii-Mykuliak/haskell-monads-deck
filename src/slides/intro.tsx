import React from "react";
import { C, F } from "../deck/theme";
import { mix, POP, SlideDef, useSteps } from "../deck/steps";
import { At, HaskellLogo, Slide } from "../deck/ui";
import { AuthorBlock } from "../deck/Author";
import { clamp01 } from "./common";
import { Ctx, FlowArrow, Val } from "./kit";

const TitleSlide: React.FC = () => {
  const { s } = useSteps();
  const lines = ["Класи типів,", "функтори", "та монади"];
  const letters = (str: string, base: number) =>
    str.split("").map((ch, i) => {
      const p = s(0, base + i * 1.3);
      return (
        <span key={i} style={{ display: "inline-block", opacity: p, transform: `translateY(${(1 - p) * 60}px)`, whiteSpace: "pre" }}>
          {ch}
        </span>
      );
    });
  return (
    <Slide>
      <div style={{ position: "absolute", right: 60, top: 70 }}>
        <HaskellLogo size={680} p1={s(0, 4, POP)} p2={s(0, 12, POP)} p3={s(0, 22, POP)} />
      </div>
      <At x={116} y={190} step={0} delay={8} size={60} weight={800} color={C.pink}>
        Лекція 7
      </At>
      <div style={{ position: "absolute", left: 110, top: 300, fontFamily: F.head, fontWeight: 800, fontSize: 100, lineHeight: 1.12, color: C.text }}>
        {lines.map((l, i) => (
          <div key={i}>{letters(l, 14 + i * 12)}</div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 116,
          top: 670,
          height: 6,
          width: mix(0, 520, s(0, 56)),
          background: `linear-gradient(90deg, ${C.accent}, ${C.pink})`,
          borderRadius: 3,
        }}
      />
      <At x={116} y={710} step={0} delay={62} size={34} weight={400} color={C.dim} font={F.mono} style={{ fontVariantLigatures: "none" }}>
        {"(>>=) :: m a -> (a -> m b) -> m b"}
      </At>
      <AuthorBlock />
    </Slide>
  );
};

/* Epigraph: a monoid has a neutral element and an associative product; a monad has η and μ with the same laws. */
const QuoteSlide: React.FC = () => {
  const { s } = useSteps();
  const words = (str: string, base: number, color?: string) =>
    str.split(" ").map((w, i) => {
      const p = s(0, base + i * 4, POP);
      return (
        <span key={i} style={{ display: "inline-block", whiteSpace: "pre", opacity: Math.min(1, p), transform: `translateY(${(1 - p) * 40}px)`, color }}>
          {w + " "}
        </span>
      );
    });
  const panel = (x: number, title: string, color: string, p: number, children: React.ReactNode) => (
    <div
      style={{
        position: "absolute",
        left: x,
        top: 330,
        width: 820,
        height: 380,
        borderRadius: 20,
        background: C.panel,
        border: `3px solid ${color}`,
        boxSizing: "border-box",
        opacity: clamp01(p),
        transform: `translateY(${(1 - p) * 24}px)`,
      }}
    >
      <div style={{ position: "absolute", left: 30, top: 22, fontFamily: F.body, fontWeight: 800, fontSize: 28, color }}>{title}</div>
      {children}
    </div>
  );
  const row = (top: number, at: number, children: React.ReactNode) => {
    const p = s(0, at, POP);
    return (
      <div style={{ position: "absolute", left: 30, top, display: "flex", alignItems: "center", gap: 14, opacity: clamp01(p), transform: `translateX(${(1 - p) * -24}px)` }}>
        {children}
      </div>
    );
  };
  const op = (t: string) => <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 28, color: C.op, whiteSpace: "pre" }}>{t}</span>;
  const arrow = (label: string, at: number) => <FlowArrow p={clamp01((s(0, at) - 0.05) * 1.2)} label={label} w={110} />;
  const assoc1 = s(0, 90);
  const join = s(0, 150);
  return (
    <Slide>
      <div style={{ position: "absolute", left: 110, top: 100, width: 1720, fontFamily: F.head, fontWeight: 800, fontSize: 56, lineHeight: 1.22, color: C.text }}>
        <div>
          {words("All told, a monad in X is just", 6)}
          {words("a monoid", 34, C.accentHi)}
        </div>
        <div>{words("in the category of endofunctors of X …", 44)}</div>
      </div>
      {panel(
        112,
        "моноїд: нейтральний [] і асоціативне ++",
        C.lav,
        s(0, 30, POP),
        <>
          {row(
            96,
            46,
            <>
              {op("(")}
              <Val color={C.lav}>[1]</Val>
              {op("++")}
              <Val color={C.lav}>[2]</Val>
              {op(")")}
              {op("++")}
              <Val color={C.lav}>[3]</Val>
            </>,
          )}
          {row(
            176,
            62,
            <>
              <Val color={C.lav}>[1]</Val>
              {op("++")}
              {op("(")}
              <Val color={C.lav}>[2]</Val>
              {op("++")}
              <Val color={C.lav}>[3]</Val>
              {op(")")}
            </>,
          )}
          <div style={{ position: "absolute", left: 560, top: 136, opacity: clamp01(assoc1), transform: `scale(${0.7 + 0.3 * assoc1})` }}>
            {op("= ")}
            <Val>[1,2,3]</Val>
          </div>
          {row(
            268,
            110,
            <>
              <Val color={C.lav}>[]</Val>
              {op("++ xs  =  xs  =  xs ++")}
              <Val color={C.lav}>[]</Val>
            </>,
          )}
        </>,
      )}
      {panel(
        988,
        "монада: η (pure) і μ (join)",
        C.mint,
        s(0, 36, POP),
        <>
          {row(
            96,
            70,
            <>
              <Val color={C.lav}>5</Val>
              {arrow("η", 74)}
              <span style={{ opacity: clamp01(s(0, 84)), transform: `scale(${0.8 + 0.2 * s(0, 84, POP)})`, display: "inline-flex" }}>
                <Ctx label="Just">
                  <Val>5</Val>
                </Ctx>
              </span>
            </>,
          )}
          {row(
            196,
            120,
            <>
              <Ctx label="Just" color={C.pink}>
                <Ctx label="Just">
                  <Val>5</Val>
                </Ctx>
              </Ctx>
              {arrow("μ", 132)}
              <span style={{ opacity: clamp01(join), transform: `scale(${0.8 + 0.2 * s(0, 150, POP)})`, display: "inline-flex" }}>
                <Ctx label="Just" glow={join * (1 - s(0, 175))}>
                  <Val>5</Val>
                </Ctx>
              </span>
            </>,
          )}
          <div style={{ position: "absolute", left: 30, top: 300, fontFamily: F.body, fontSize: 26, color: C.dim, opacity: clamp01(s(0, 170)) }}>
            η – як нейтральний елемент, μ – як асоціативна операція
          </div>
        </>,
      )}
      <div
        style={{
          position: "absolute",
          left: 116,
          top: 750,
          height: 6,
          width: mix(0, 420, s(1, 0)),
          background: `linear-gradient(90deg, ${C.accent}, ${C.pink})`,
          borderRadius: 3,
        }}
      />
      <At x={110} y={780} w={1700} step={1} delay={6} size={42} weight={600} color={C.text}>
        Зрештою, монада в X – це просто моноїд у категорії ендофункторів X.
      </At>
      <At x={110} y={900} step={1} delay={24} size={34} weight={400} color={C.dim} font={F.mono}>
        Saunders Mac Lane
      </At>
      <At x={110} y={950} w={1600} step={1} delay={36} size={30} weight={400} color={C.dim}>
        «Categories for the Working Mathematician», 1971
      </At>
    </Slide>
  );
};

const AGENDA = [
  "Класи типів і поліморфізм з обмеженнями",
  "Функтори: значення у контексті",
  "Теорія категорій і закони функторів",
  "Від Functor до Applicative та Monad",
  "Монадичні операції, do-нотація та закони",
  "Приклади монад та їхні контексти",
  "Практичні рекомендації та типові помилки",
];
const Agenda: React.FC<{ active?: number }> = ({ active }) => {
  const { s } = useSteps();
  const full = active === undefined;
  const Y0 = 190;
  const GAP = 108;
  const hl = full ? 0 : s(0, 6);
  return (
    <Slide title="План">
      {AGENDA.map((item, i) => {
        const p = full ? s(0, 8 + i * 5, POP) : 1;
        const on = full ? 1 : i === active ? s(0, 10) : 0;
        const dim = full ? 1 : i === active ? 1 : 0.35;
        const isActive = !full && i === active;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 84,
              top: Y0 + i * GAP,
              display: "flex",
              alignItems: "center",
              gap: 34,
              padding: "10px 34px 10px 20px",
              opacity: p * dim,
              transform: `translateX(${(1 - p) * -40}px)`,
            }}
          >
            {isActive && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 14,
                  background: "rgba(141,118,220,0.13)",
                  border: `2px solid rgba(141,118,220,${0.5 * hl})`,
                  clipPath: `inset(0 ${(1 - hl) * 100}% 0 0 round 14px)`,
                }}
              />
            )}
            <div
              style={{
                position: "relative",
                width: 76,
                height: 64,
                borderRadius: 8,
                background: i % 2 ? "#5e5086" : C.pink,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: F.body,
                fontWeight: 800,
                fontSize: 40,
                color: C.text,
                flexShrink: 0,
                boxShadow: on ? `0 0 ${30 * on}px rgba(178,95,168,${0.6 * on})` : undefined,
                transform: `scale(${1 + 0.12 * on})`,
              }}
            >
              {i + 1}
            </div>
            <div style={{ position: "relative", fontFamily: F.body, fontSize: 48, fontWeight: on ? 700 : 400, color: C.text, whiteSpace: "nowrap" }}>
              {item}
            </div>
          </div>
        );
      })}
    </Slide>
  );
};

export const introSlides: SlideDef[] = [
  { id: "title", title: "Титул", steps: [110], C: TitleSlide },
  { id: "quote", title: "Епіграф", steps: [210, 120], C: QuoteSlide },
  { id: "agenda", title: "План", steps: [60], C: () => <Agenda /> },
];

export const agendaSlide = (active: number): SlideDef => ({
  id: `agenda-${active + 1}`,
  title: `План ${active + 1}`,
  steps: [40],
  C: () => <Agenda active={active} />,
});
