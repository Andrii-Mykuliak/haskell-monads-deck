import React from "react";
import { C, F } from "../deck/theme";
import { mix, POP, SlideDef, useSteps } from "../deck/steps";
import { At, HaskellLogo, Slide } from "../deck/ui";
import { AuthorBlock } from "../deck/Author";
import { clamp01 } from "./common";

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

/* Epigraph: one context layer folds into the other, Just (Just 5) becomes Just 5 (μ, join). */
const COLLAPSE = 110;

const QuoteSlide: React.FC = () => {
  const { s } = useSteps();
  const words = (str: string, base: number, color?: string) =>
    str.split(" ").map((w, i) => {
      const p = s(0, base + i * 5, POP);
      return (
        <span key={i} style={{ display: "inline-block", whiteSpace: "pre", opacity: Math.min(1, p), transform: `translateY(${(1 - p) * 40}px)`, color }}>
          {w + " "}
        </span>
      );
    });
  const box = s(0, 60, POP);
  const k = s(0, COLLAPSE);
  const label = (text: string, color: string, extra?: React.CSSProperties) => (
    <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 44, color, whiteSpace: "nowrap", overflow: "hidden", ...extra }}>{text}</span>
  );
  return (
    <Slide>
      <div style={{ position: "absolute", left: 110, top: 190, fontFamily: F.head, fontWeight: 800, fontSize: 70, lineHeight: 1.2, color: C.text }}>
        <div>{words("All told, a monad in X", 6)}</div>
        <div>
          {words("is just", 36)}
          {words("a monoid", 46, C.accentHi)}
          {words("in the", 56)}
        </div>
        <div>{words("category of endofunctors of X …", 66)}</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 1580,
          top: 380,
          transform: `translate(-50%, -50%) scale(${0.7 + 0.3 * box})`,
          opacity: clamp01(box),
          display: "inline-flex",
          alignItems: "center",
          gap: mix(16, 0, k),
          padding: mix(16, 0, k),
          borderRadius: 24,
          border: `4px solid rgba(178,95,168,${1 - k})`,
          background: `rgba(178,95,168,${0.1 * (1 - k)})`,
        }}
      >
        {label("Just", C.pink, { maxWidth: mix(110, 0, k), opacity: 1 - k })}
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 16,
            padding: "12px 18px",
            borderRadius: 20,
            border: `4px solid ${C.accentHi}`,
            background: "rgba(169,148,255,0.08)",
          }}
        >
          {label("Just", C.accentHi)}
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 64,
              height: 64,
              borderRadius: 12,
              border: `3px solid ${C.mint}`,
              background: `${C.mint}1f`,
              fontFamily: F.mono,
              fontWeight: 700,
              fontSize: 40,
              color: C.mint,
            }}
          >
            5
          </span>
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 1280,
          top: 480,
          width: 600,
          textAlign: "center",
          fontFamily: F.mono,
          fontWeight: 600,
          fontSize: 28,
          color: C.dim,
          fontVariantLigatures: "none",
          whiteSpace: "nowrap",
          opacity: clamp01(s(0, COLLAPSE + 20)),
        }}
      >
        join (Just (Just 5)) = Just 5
      </div>
      <div
        style={{
          position: "absolute",
          left: 116,
          top: 540,
          height: 6,
          width: mix(0, 420, s(1, 0)),
          background: `linear-gradient(90deg, ${C.accent}, ${C.pink})`,
          borderRadius: 3,
        }}
      />
      <At x={110} y={580} w={1150} step={1} delay={6} size={44} weight={600} color={C.text}>
        Зрештою, монада в X – це просто моноїд у категорії ендофункторів X.
      </At>
      <At x={110} y={750} step={1} delay={24} size={34} weight={400} color={C.dim} font={F.mono}>
        Saunders Mac Lane
      </At>
      <At x={110} y={802} w={1150} step={1} delay={36} size={30} weight={400} color={C.dim}>
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
  { id: "quote", title: "Епіграф", steps: [170, 120], C: QuoteSlide },
  { id: "agenda", title: "План", steps: [60], C: () => <Agenda /> },
];

export const agendaSlide = (active: number): SlideDef => ({
  id: `agenda-${active + 1}`,
  title: `План ${active + 1}`,
  steps: [40],
  C: () => <Agenda active={active} />,
});
