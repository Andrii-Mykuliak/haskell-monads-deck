import React from "react";
import { C, F } from "../deck/theme";
import { POP, SlideDef, useSteps } from "../deck/steps";
import { Code } from "../deck/Code";
import { A, At, Lead, M, Mark, Slide } from "../deck/ui";
import { clamp01 } from "./common";

/* 38 · Вибір найпростішої абстракції */
const LADDER = [
  { name: "Звичайна функція", color: C.text, code: "double 5", desc: "пряме перетворення значення" },
  { name: "Functor", color: C.mint, code: "double <$> Just 5", desc: "перетворення значення всередині контексту" },
  { name: "Applicative", color: C.accentHi, code: "add <$> Just 10 <*> Just 20", desc: "незалежні контекстні аргументи" },
  { name: "Monad", color: C.pink, code: "findProduct c >>= checkStock", desc: "залежні контекстні кроки" },
];

const S38: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Вибір найпростішої абстракції">
      <Lead>Кожен рівень композиції розв’язує окрему задачу.</Lead>
      {LADDER.map((r, i) => {
        const p = s(1, i * 14, POP);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 96 + i * 34,
              top: 300 + i * 104,
              width: 1720 - i * 34,
              height: 84,
              display: "flex",
              alignItems: "center",
              borderRadius: 14,
              background: C.panel,
              borderLeft: `6px solid ${r.color}`,
              boxSizing: "border-box",
              paddingLeft: 26,
              opacity: clamp01(p),
              transform: `translateX(${(1 - p) * -30}px)`,
            }}
          >
            <div style={{ width: 330 - i * 34, fontFamily: F.body, fontWeight: 800, fontSize: 30, color: r.color }}>{r.name}</div>
            <div style={{ width: 640, fontFamily: F.mono, fontWeight: 600, fontSize: 28, color: C.mint, whiteSpace: "pre", fontVariantLigatures: "none" }}>
              {r.code}
            </div>
            <div style={{ fontFamily: F.body, fontWeight: 600, fontSize: 28, color: C.text }}>{r.desc}</div>
          </div>
        );
      })}
      <At x={96} y={740} w={1720} step={2} size={32} weight={600}>
        У сигнатурі варто зазначати <A>найслабше обмеження</A> класу, достатнє для реалізації.
      </At>
      <Code
        x={96}
        y={810}
        size={28}
        step={2}
        delay={20}
        stagger={14}
        code={`
          incAll :: Functor f => f Int -> f Int   -- достатньо
          incAll :: Monad m   => m Int -> m Int   -- надмірна вимога
        `}
      />
      <Mark ok x={1200} y={806} step={2} delay={34} size={40} />
      <Mark ok={false} x={1200} y={846} step={2} delay={48} size={40} />
    </Slide>
  );
};

/* 39 · Типові помилки у використанні монад */
const MISTAKES: { title: React.ReactNode; bad: string; good: React.ReactNode }[] = [
  {
    title: (
      <>
        Не кожний контекст можна «розгорнути» функцією <M>{"m a -> a"}</M>
      </>
    ),
    bad: "unIO :: IO a -> a   -- такої функції немає",
    good: (
      <>
        залишайся в контексті: <M>fmap</M>, <M>{">>="}</M>, <M>do</M>
      </>
    ),
  },
  {
    title: (
      <>
        <M>fromJust</M> небезпечний для <M>Nothing</M>
      </>
    ),
    bad: "fromJust Nothing    -- аварійне завершення",
    good: (
      <>
        <M>fromMaybe 0 m</M> або зіставлення зі зразком
      </>
    ),
  },
  {
    title: (
      <>
        <M>do</M>-нотація не означає мутацію змінних
      </>
    ),
    bad: "x <- Just 1\nx <- Just (x + 1)   -- нове ім’я",
    good: (
      <>
        <M>{"<-"}</M> іменує результат кроку, старе <M>x</M> не змінюється
      </>
    ),
  },
  {
    title: <>Компілятор перевіряє типи, але не доводить законів монад</>,
    bad: "pure a >>= f  =  f a   -- ніхто не перевіряє",
    good: <>закони гарантує автор екземпляра: тести, міркування</>,
  },
];

const S39: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Типові помилки у використанні монад">
      {MISTAKES.map((m, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = 96 + col * 880;
        const y = 190 + row * 400;
        const p = s(i + 1, 0, POP);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 840,
              height: 370,
              borderRadius: 20,
              background: C.panel,
              border: `2px solid ${C.line}`,
              boxSizing: "border-box",
              padding: "26px 30px",
              opacity: clamp01(p),
              transform: `translateY(${(1 - p) * 24}px)`,
            }}
          >
            <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 30, lineHeight: 1.3, color: C.text, height: 84 }}>{m.title}</div>
            <div
              style={{
                marginTop: 18,
                padding: "14px 18px",
                borderRadius: 12,
                background: "rgba(239,107,107,0.08)",
                borderLeft: `4px solid ${C.red}`,
                fontFamily: F.mono,
                fontWeight: 600,
                fontSize: 24,
                lineHeight: 1.5,
                color: C.text,
                whiteSpace: "pre",
                fontVariantLigatures: "none",
                height: 100,
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              {m.bad.split("\n").map((l, k) => {
                const cut = l.indexOf("--");
                return (
                  <div key={k}>
                    {cut < 0 ? l : l.slice(0, cut)}
                    {cut >= 0 && <span style={{ color: C.comment, fontStyle: "italic" }}>{l.slice(cut)}</span>}
                  </div>
                );
              })}
            </div>
            <div
              style={{
                marginTop: 18,
                display: "flex",
                alignItems: "center",
                gap: 14,
                fontFamily: F.body,
                fontWeight: 600,
                fontSize: 26,
                color: C.text,
                opacity: clamp01(s(i + 1, 20)),
              }}
            >
              <span style={{ color: C.mint, fontWeight: 800, fontSize: 30 }}>✓</span>
              <span>{m.good}</span>
            </div>
          </div>
        );
      })}
    </Slide>
  );
};

/* 40 · Контрольні питання */
const QUESTIONS = [
  "Чим різняться параметричний і обмежений поліморфізм?",
  "Як визначають class, instance та deriving?",
  "Що описує fmap і які два закони Functor?",
  "Чим відрізняються Functor, Applicative і Monad?",
  "Як інтерпретувати сигнатуру оператора >>= ?",
  "Чому fmap може утворювати вкладений Maybe?",
  "Які три закони визначають коректну монаду?",
  "Чим різняться Maybe, Either, список, Logged, IO і State?",
];

const S40: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Контрольні питання">
      {QUESTIONS.map((q, i) => {
        const p = s(0, 10 + i * 6, POP);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 104,
              top: 180 + i * 102,
              display: "flex",
              alignItems: "center",
              gap: 32,
              opacity: clamp01(p),
              transform: `translateX(${(1 - p) * -30}px)`,
            }}
          >
            <div
              style={{
                width: 64,
                height: 56,
                borderRadius: 8,
                background: i % 2 ? "#5e5086" : C.pink,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: F.body,
                fontWeight: 800,
                fontSize: 32,
                color: C.text,
                flexShrink: 0,
              }}
            >
              {i + 1}
            </div>
            <div style={{ fontFamily: F.body, fontSize: 38, fontWeight: 600, color: C.text }}>{q}</div>
          </div>
        );
      })}
    </Slide>
  );
};

export const s7Slides: SlideDef[] = [
  { id: "choose", title: "Вибір абстракції", steps: [40, 90, 90], C: S38 },
  { id: "mistakes", title: "Типові помилки", steps: [20, 50, 50, 50, 50], C: S39 },
];
export const questionsSlide: SlideDef = { id: "questions", title: "Контрольні питання", steps: [80], C: S40 };

