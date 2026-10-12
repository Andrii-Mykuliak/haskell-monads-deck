import React from "react";
import { C, F } from "../deck/theme";
import { POP, SlideDef, useSteps } from "../deck/steps";
import { Code } from "../deck/Code";
import { A, At, Lead, M, Slide } from "../deck/ui";
import { clamp01 } from "./common";
import { Ctx, Flow, SyntaxBox, Val } from "./kit";

const Fn: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = C.amber }) => (
  <Val color={color} size={26}>
    {children}
  </Val>
);

/* 19 · Коли одного fmap недостатньо */
const S19: React.FC = () => {
  const { s } = useSteps();
  const q = s(2, 50);
  const ap = s(3, 50, POP);
  const res = s(3, 70, POP);
  const op = (txt: string, p: number, color: string) => (
    <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 34, color, opacity: clamp01(p), whiteSpace: "pre" }}>{txt}</span>
  );
  return (
    <Slide title="Коли одного fmap недостатньо">
      <Lead>Результат часто залежить від кількох незалежних значень, кожне з яких уже представлене у контексті.</Lead>
      <Code
        x={96}
        y={320}
        size={36}
        step={1}
        code={`
          add :: Int -> Int -> Int
          add x y = x + y
        `}
      />
      <Code x={96} y={460} size={34} step={2} code={`fmap add (Just 10)   -- Just (add 10) :: Maybe (Int -> Int)`} />
      <div style={{ position: "absolute", left: 96, top: 540, display: "flex", alignItems: "center", gap: 22 }}>
        <span style={{ display: "inline-flex", opacity: clamp01(s(2, 24, POP)) }}>
          <Ctx label="Just">
            <Fn>add 10</Fn>
          </Ctx>
        </span>
        <span style={{ position: "relative", width: 110, height: 50, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ position: "absolute" }}>{op("?", q * (1 - s(3, 40)), C.red)}</span>
          <span style={{ position: "absolute", transform: `scale(${0.6 + 0.4 * ap})` }}>{op("<*>", ap, C.accentHi)}</span>
        </span>
        <span style={{ display: "inline-flex", opacity: clamp01(s(2, 36, POP)) }}>
          <Ctx label="Just">
            <Val>20</Val>
          </Ctx>
        </span>
        {op("=", res, C.op)}
        <span style={{ display: "inline-flex", opacity: clamp01(res), transform: `scale(${0.7 + 0.3 * res})` }}>
          <Ctx label="Just">
            <Val>30</Val>
          </Ctx>
        </span>
      </div>
      <At x={1000} y={548} w={820} step={2} delay={56} size={28} weight={600} color={C.red}>
        <span style={{ opacity: 1 - s(3, 40) }}>
          функція вже в контексті – <M c={C.red}>fmap</M> тут не допоможе
        </span>
      </At>
      <SyntaxBox x={96} y={680} w={820} step={3} title="Аплікативний стиль" lines={["{g} <$> {ctxA} <*> {ctxB}"]} />
      <Code x={980} y={714} size={32} step={3} delay={30} code={`add <$> Just 10 <*> Just 20  -- Just 30`} />
      <At x={96} y={880} w={1720} step={4} size={34} weight={600}>
        Обидва аргументи можна описати <A>заздалегідь</A>, не визначаючи наступний крок за попереднім значенням.
      </At>
    </Slide>
  );
};

/* 20 · Аплікативний функтор */
const S20: React.FC = () => (
  <Slide title="Аплікативний функтор">
    <Lead>
      <A>Applicative</A> – клас типів, який вводить звичайні значення в контекст і застосовує функції в контексті до значень у
      контексті.
    </Lead>
    <Code
      x={96}
      y={330}
      size={30}
      step={1}
      code={`
        class Functor ptype => Applicative ptype where
            pure  :: a -> ptype a
            (<*>) :: ptype (a -> b) -> ptype a -> ptype b
      `}
    />
    <Code
      x={96}
      y={540}
      size={34}
      step={2}
      code={`
        instance Applicative Maybe where
            pure = Just
            Just g  <*> m = fmap g m
            Nothing <*> _ = Nothing
      `}
    />
    <At x={1060} y={330} step={3} size={28} weight={700} color={C.accentHi}>
      Приклади
    </At>
    <Code
      x={1060}
      y={390}
      size={30}
      step={3}
      delay={10}
      stagger={14}
      code={`
        pure 5 :: Maybe Int       -- Just 5
        Just (+ 3) <*> Just 4     -- Just 7
        @4 add <$> Just 10 <*> Nothing  -- Nothing
      `}
    />
    <Flow
      x={1060}
      y={580}
      step={4}
      delay={40}
      gap={30}
      arrowW={130}
      items={[
        {
          el: (
            <Ctx label="Just">
              <Fn>add 10</Fn>
            </Ctx>
          ),
        },
        { el: <Ctx label="Nothing" empty color={C.faint} />, via: "<*>" },
      ]}
    />
    <At x={96} y={880} w={1720} step={5} size={34} weight={600}>
      <M>Applicative</M> має <M>Functor</M> як суперклас. Якщо хоч один аргумент – <M>Nothing</M>, результат теж <M>Nothing</M>.
    </At>
  </Slide>
);

/* 21 · Чому виникає вкладений Maybe */
const S21: React.FC = () => {
  const { s } = useSteps();
  const warn = s(3, 0);
  return (
    <Slide title="Чому виникає вкладений Maybe">
      <Lead>
        Якщо функція сама повертає <M>Maybe</M>, операція <M>fmap</M> зберігає зовнішній контекст і додає внутрішній.
      </Lead>
      <Code
        x={96}
        y={320}
        size={34}
        step={1}
        code={`
          data Product = Product String Int
          findProduct :: String -> Maybe Product
          checkStock  :: Product -> Maybe Product
        `}
      />
      <Code
        x={96}
        y={500}
        size={34}
        step={2}
        code={`
          nested = fmap checkStock (findProduct "BOOK")
          @2+30 -- nested :: [[3|Maybe (Maybe Product)]]
        `}
      />
      <Flow
        x={96}
        y={650}
        step={2}
        delay={50}
        gap={30}
        arrowW={200}
        items={[
          { el: <Val color={C.amber}>"BOOK"</Val> },
          {
            el: (
              <Ctx label="Just">
                <Val color={C.lav}>p</Val>
              </Ctx>
            ),
            via: "findProduct",
          },
          {
            el: (
              <span
                style={{
                  display: "inline-flex",
                  borderRadius: 20,
                  boxShadow: warn > 0.02 ? `0 0 0 ${6 * warn}px rgba(239,107,107,${0.35 * warn})` : undefined,
                }}
              >
                <Ctx label="Just" color={C.pink}>
                  <Ctx label="Just">
                    <Val color={C.lav}>p</Val>
                  </Ctx>
                </Ctx>
              </span>
            ),
            via: "fmap checkStock",
          },
        ]}
      />
      <At x={830} y={760} step={3} delay={10} size={26} weight={600} color={C.red}>
        два шари контексту
      </At>
      <At x={96} y={880} w={1720} step={3} delay={24} size={34} weight={600}>
        Потрібна композиція, яка <A>не накопичує</A> вкладені контексти.
      </At>
    </Slide>
  );
};

/* 22 · Три рівні композиції */
const LEVELS = [
  { name: "Functor", color: C.mint, sig: "fmap  :: (a -> b) -> ptype a -> ptype b", desc: "перетворення одного значення всередині контексту" },
  { name: "Applicative", color: C.accentHi, sig: "(<*>) :: ptype (a -> b) -> ptype a -> ptype b", desc: "поєднання незалежних контекстних обчислень" },
  { name: "Monad", color: C.pink, sig: "(>>=) :: m a -> (a -> m b) -> m b", desc: "поєднання залежних кроків виду a → m b" },
];

const BOXES = [
  { x: 96, y: 300, w: 780, h: 540, ex: "Map k" },
  { x: 150, y: 400, w: 672, h: 380, ex: "ZipList" },
  { x: 204, y: 500, w: 564, h: 220, ex: "Maybe, [], Either e, IO" },
];

const S22: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Три рівні композиції">
      <Lead>Абстракції відрізняються насамперед вимогами до зв’язку між обчисленнями.</Lead>
      {BOXES.map((b, i) => {
        const p = s(i + 1, 0, POP);
        const lv = LEVELS[i];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: b.x,
              top: b.y,
              width: b.w,
              height: b.h,
              borderRadius: 22,
              border: `3px solid ${lv.color}`,
              background: `${lv.color}0d`,
              boxSizing: "border-box",
              opacity: clamp01(p),
              transform: `scale(${0.92 + 0.08 * p})`,
            }}
          >
            <div style={{ position: "absolute", left: 24, top: 16, fontFamily: F.mono, fontWeight: 700, fontSize: 30, color: lv.color }}>{lv.name}</div>
            <div
              style={{
                position: "absolute",
                right: 24,
                top: 22,
                fontFamily: F.mono,
                fontWeight: 600,
                fontSize: 22,
                color: C.dim,
                opacity: clamp01(s(4, 10 + i * 8)),
              }}
            >
              {b.ex}
            </div>
          </div>
        );
      })}
      {LEVELS.map((lv, i) => {
        const p = s(i + 1, 10);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 960,
              top: 320 + i * 170,
              width: 860,
              opacity: clamp01(p),
              transform: `translateX(${(1 - p) * 30}px)`,
            }}
          >
            <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 30, color: lv.color, whiteSpace: "pre", fontVariantLigatures: "none" }}>{lv.sig}</div>
            <div style={{ marginTop: 10, fontFamily: F.body, fontWeight: 600, fontSize: 30, color: C.text }}>{lv.desc}</div>
          </div>
        );
      })}
      <At x={96} y={880} w={1720} step={4} delay={30} size={32} weight={600}>
        У Haskell: <M c={C.pink}>Monad</M> → <M c={C.accentHi}>Applicative</M> → <M>Functor</M> (відношення суперкласів): кожна монада є
        аплікативним функтором.
      </At>
    </Slide>
  );
};

export const s4Slides: SlideDef[] = [
  { id: "need-ap", title: "Коли одного fmap недостатньо", steps: [45, 50, 90, 100, 55], C: S19 },
  { id: "applicative", title: "Аплікативний функтор", steps: [55, 60, 60, 70, 100, 55], C: S20 },
  { id: "nested", title: "Вкладений Maybe", steps: [45, 50, 130, 70], C: S21 },
  { id: "levels", title: "Три рівні композиції", steps: [40, 45, 45, 45, 90], C: S22 },
];
