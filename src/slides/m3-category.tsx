import React from "react";
import { C, F } from "../deck/theme";
import { POP, SlideDef, useSteps } from "../deck/steps";
import { Code } from "../deck/Code";
import { A, Arrow, At, Chip, Lead, M, Mark, Slide } from "../deck/ui";
import { clamp01 } from "./common";
import { Ctx, Flow, SyntaxBox, Val } from "./kit";

type P = { x: number; y: number };

/** Endpoints of a segment between two circles of radius r, pulled in by `pad`. */
const trim = (a: P, b: P, r: number, pad = 8) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const k = (r + pad) / len;
  return { x1: a.x + dx * k, y1: a.y + dy * k, x2: b.x - dx * k, y2: b.y - dy * k };
};

const Obj: React.FC<{ p: P; label: string; step: number; delay?: number; r?: number; color?: string }> = ({
  p,
  label,
  step,
  delay = 0,
  r = 44,
  color = C.lav,
}) => {
  const { s } = useSteps();
  const a = s(step, delay, POP);
  return (
    <div
      style={{
        position: "absolute",
        left: p.x - r,
        top: p.y - r,
        width: r * 2,
        height: r * 2,
        borderRadius: r,
        border: `3px solid ${color}`,
        background: C.panel2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: F.mono,
        fontWeight: 700,
        fontSize: 36,
        color,
        boxSizing: "border-box",
        opacity: clamp01(a),
        transform: `scale(${0.6 + 0.4 * a})`,
      }}
    >
      {label}
    </div>
  );
};

type Side = "up" | "down" | "left" | "right";

const Loop: React.FC<{ p: P; r: number; step: number; delay?: number; side?: Side }> = ({ p, r, step, delay = 0, side = "up" }) => {
  const { lin } = useSteps();
  const k = lin(step, delay, 16);
  const v = side === "up" || side === "down";
  const sg = side === "up" || side === "left" ? -1 : 1;
  const base = r - 4;
  const s1 = v ? { x: p.x - 22, y: p.y + sg * base } : { x: p.x + sg * base, y: p.y - 22 };
  const s2 = v ? { x: p.x + 22, y: p.y + sg * base } : { x: p.x + sg * base, y: p.y + 22 };
  const c1 = v ? { x: s1.x - 40, y: s1.y + sg * 90 } : { x: s1.x + sg * 90, y: s1.y - 40 };
  const c2 = v ? { x: s2.x + 40, y: s2.y + sg * 90 } : { x: s2.x + sg * 90, y: s2.y + 40 };
  const d = `M ${s1.x} ${s1.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${s2.x} ${s2.y}`;
  const head = v
    ? `${s2.x},${s2.y} ${s2.x + 4},${s2.y + sg * 16} ${s2.x + 14},${s2.y + sg * 8}`
    : `${s2.x},${s2.y} ${s2.x + sg * 16},${s2.y + 4} ${s2.x + sg * 8},${s2.y + 14}`;
  const label = v ? { x: p.x, y: p.y + sg * (base + 92) + (sg > 0 ? 8 : 0) } : { x: p.x + sg * (base + 100), y: p.y + 8 };
  const L = 200;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <path d={d} stroke={C.faint} strokeWidth={3} fill="none" strokeDasharray={L} strokeDashoffset={L * (1 - k)} />
      <polygon points={head} fill={C.faint} opacity={clamp01(k * 4 - 3)} />
      <text x={label.x} y={label.y} fill={C.dim} fontFamily={F.mono} fontSize={22} fontWeight={700} textAnchor="middle" opacity={k}>
        id
      </text>
    </svg>
  );
};

/* 15 · Категорія і морфізми */
const PA: P = { x: 1080, y: 640 };
const PB: P = { x: 1400, y: 400 };
const PC: P = { x: 1720, y: 640 };

const S15: React.FC = () => {
  const ab = trim(PA, PB, 44);
  const bc = trim(PB, PC, 44);
  const ac = trim(PA, PC, 44);
  return (
    <Slide title="Категорія і морфізми">
      <Lead>
        <A>Категорія</A> – сукупність об’єктів і морфізмів, для яких визначено асоціативну композицію та тотожні морфізми.
      </Lead>
      <Code
        x={96}
        y={330}
        size={36}
        step={1}
        code={`
          f :: a -> b
          g :: b -> c
          @2+44 (g . f) :: a -> c
          @3 id      :: a -> a
        `}
      />
      <SyntaxBox x={96} y={560} w={820} step={2} title="Композиція" lines={["({g} . {f}) {x} = {g} ({f} {x})"]} />
      <Code
        x={96}
        y={700}
        size={30}
        step={4}
        code={`
          h . (g . f) = (h . g) . f
          id . f = f = f . id
        `}
      />
      <Obj p={PA} label="a" step={1} />
      <Obj p={PB} label="b" step={1} delay={8} />
      <Obj p={PC} label="c" step={1} delay={16} />
      <Arrow {...ab} step={1} delay={20} dur={14} color={C.mint} width={4} />
      <Arrow {...bc} step={1} delay={34} dur={14} color={C.mint} width={4} />
      <At x={1190} y={470} step={1} delay={28} size={32} weight={700} color={C.mint} font={F.mono}>
        f
      </At>
      <At x={1585} y={470} step={1} delay={42} size={32} weight={700} color={C.mint} font={F.mono}>
        g
      </At>
      <Arrow {...ac} step={2} delay={50} dur={18} color={C.pink} width={4} curve={-60} />
      <At x={1350} y={690} step={2} delay={60} size={32} weight={700} color={C.pink} font={F.mono}>
        g . f
      </At>
      <Loop p={PA} r={44} step={3} delay={10} side="left" />
      <Loop p={PB} r={44} step={3} delay={18} side="up" />
      <Loop p={PC} r={44} step={3} delay={26} side="right" />
      <At x={96} y={812} w={1720} step={4} delay={30} size={28} weight={400} color={C.dim}>
        Типи й функції дають корисну інтерпретацію об’єктів і морфізмів у Haskell.
      </At>
      <At
        x={96}
        y={868}
        w={1728}
        step={5}
        size={30}
        weight={600}
        style={{ padding: "16px 26px", borderRadius: 14, background: C.panel, borderLeft: `6px solid ${C.accentHi}`, boxSizing: "border-box" }}
      >
        <A>Функтор</A> <M>F</M> – відображення між категоріями, яке кожному об’єкту <M>a</M> зіставляє об’єкт <M>F a</M>, а кожному
        морфізму <M>{"f :: a -> b"}</M> – морфізм <M>{"F f :: F a -> F b"}</M>, зберігаючи тотожні морфізми та композицію.
      </At>
    </Slide>
  );
};

/* 16 · Функтор у теорії категорій */
const Corner: React.FC<{ p: P; step: number; delay?: number; color?: string; children: React.ReactNode }> = ({
  p,
  step,
  delay = 0,
  color = C.lav,
  children,
}) => {
  const { s } = useSteps();
  const a = s(step, delay, POP);
  return (
    <div
      style={{
        position: "absolute",
        left: p.x,
        top: p.y,
        transform: `translate(-50%, -50%) scale(${0.7 + 0.3 * a})`,
        opacity: clamp01(a),
      }}
    >
      <Chip size={30} color={color} border={color}>
        {children}
      </Chip>
    </div>
  );
};

const VDash: React.FC<{ x: number; y1: number; y2: number; step: number; delay?: number; label: string }> = ({ x, y1, y2, step, delay = 0, label }) => {
  const { lin } = useSteps();
  const k = lin(step, delay, 14);
  return (
    <>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <line x1={x} y1={y1} x2={x} y2={y1 + (y2 - y1) * k} stroke={C.accentHi} strokeWidth={3} strokeDasharray="8 8" />
        <polygon points={`${x - 9},${y2 - 14} ${x + 9},${y2 - 14} ${x},${y2}`} fill={C.accentHi} opacity={clamp01(k * 4 - 3)} />
      </svg>
      <div
        style={{
          position: "absolute",
          left: x + 16,
          top: (y1 + y2) / 2 - 20,
          fontFamily: F.mono,
          fontWeight: 700,
          fontSize: 28,
          color: C.accentHi,
          opacity: k,
        }}
      >
        {label}
      </div>
    </>
  );
};

const S16: React.FC = () => {
  const L = { x0: 220, x1: 760 };
  const R = { x0: 1150, x1: 1680 };
  const Y = { top: 440, bot: 720 };
  return (
    <Slide title="Функтор у теорії категорій">
      <Lead>
        <A>Ендофунктор</A> – функтор, який відображає категорію в саму себе, зберігаючи тотожні морфізми та композицію.
      </Lead>
      <At x={120} y={330} step={1} size={26} weight={600} color={C.dim}>
        загальна схема
      </At>
      <Corner p={{ x: L.x0, y: Y.top }} step={1}>
        a
      </Corner>
      <Corner p={{ x: L.x1, y: Y.top }} step={1} delay={8}>
        b
      </Corner>
      <Arrow x1={L.x0 + 50} y1={Y.top} x2={L.x1 - 50} y2={Y.top} step={1} delay={14} dur={14} color={C.mint} />
      <At x={(L.x0 + L.x1) / 2 - 10} y={Y.top - 60} step={1} delay={20} size={30} color={C.mint} font={F.mono}>
        f
      </At>
      <VDash x={L.x0} y1={Y.top + 36} y2={Y.bot - 36} step={2} label="F" />
      <VDash x={L.x1} y1={Y.top + 36} y2={Y.bot - 36} step={2} delay={8} label="F" />
      <Corner p={{ x: L.x0, y: Y.bot }} step={2} delay={16} color={C.accentHi}>
        F a
      </Corner>
      <Corner p={{ x: L.x1, y: Y.bot }} step={2} delay={22} color={C.accentHi}>
        F b
      </Corner>
      <Arrow x1={L.x0 + 70} y1={Y.bot} x2={L.x1 - 70} y2={Y.bot} step={3} dur={16} color={C.pink} />
      <At x={(L.x0 + L.x1) / 2 - 70} y={Y.bot + 26} step={3} delay={8} size={30} color={C.pink} font={F.mono}>
        fmap f
      </At>

      <At x={1060} y={330} step={4} size={26} weight={600} color={C.dim}>
        у Haskell: F = Maybe, f = double
      </At>
      <Corner p={{ x: R.x0, y: Y.top }} step={4} delay={6}>
        Int
      </Corner>
      <Corner p={{ x: R.x1, y: Y.top }} step={4} delay={10}>
        Int
      </Corner>
      <Arrow x1={R.x0 + 64} y1={Y.top} x2={R.x1 - 64} y2={Y.top} step={4} delay={14} dur={12} color={C.mint} />
      <At x={(R.x0 + R.x1) / 2 - 50} y={Y.top - 60} step={4} delay={18} size={30} color={C.mint} font={F.mono}>
        double
      </At>
      <VDash x={R.x0} y1={Y.top + 36} y2={Y.bot - 36} step={4} delay={24} label="Maybe" />
      <VDash x={R.x1} y1={Y.top + 36} y2={Y.bot - 36} step={4} delay={28} label="Maybe" />
      <Corner p={{ x: R.x0, y: Y.bot }} step={4} delay={34} color={C.accentHi}>
        Maybe Int
      </Corner>
      <Corner p={{ x: R.x1, y: Y.bot }} step={4} delay={38} color={C.accentHi}>
        Maybe Int
      </Corner>
      <Arrow x1={R.x0 + 130} y1={Y.bot} x2={R.x1 - 130} y2={Y.bot} step={4} delay={44} dur={12} color={C.pink} />
      <At x={(R.x0 + R.x1) / 2 - 110} y={Y.bot + 26} step={4} delay={50} size={30} color={C.pink} font={F.mono}>
        fmap double
      </At>
      <At x={96} y={880} w={1720} step={5} size={34} weight={600}>
        Конструктор типу відображає <A>об’єкти</A> (<M>a ↦ F a</M>), а <M>fmap</M> – <A>морфізми</A>:{" "}
        <span style={{ whiteSpace: "nowrap" }}>
          <M>{"a -> b"}</M> стає <M>{"F a -> F b"}</M>.
        </span>
      </At>
    </Slide>
  );
};

/* 17 · Два закони функтора */
const J: React.FC<{ v: React.ReactNode; color?: string }> = ({ v, color = C.mint }) => (
  <Ctx label="Just">
    <Val color={color}>{v}</Val>
  </Ctx>
);

const S17: React.FC = () => (
  <Slide title="Два закони функтора">
    <Lead>
      Коректна реалізація <M>fmap</M> зберігає <A>тотожне перетворення</A> та <A>композицію</A> функцій.
    </Lead>
    <At x={96} y={316} step={1} size={28} weight={700} color={C.accentHi}>
      Тотожність
    </At>
    <Code x={96} y={366} size={42} step={1} delay={8} code={`fmap id = id`} />
    <Flow
      x={900}
      y={340}
      step={1}
      delay={24}
      arrowW={170}
      items={[{ el: <J v={5} color={C.lav} /> }, { el: <J v={5} color={C.lav} />, via: "fmap id" }]}
    />
    <Mark ok x={1420} y={372} step={1} delay={60} size={46} />
    <At x={96} y={496} step={2} size={28} weight={700} color={C.accentHi}>
      Композиція
    </At>
    <Code x={96} y={546} size={42} step={2} delay={8} code={`fmap (g . f) = fmap g . fmap f`} />
    <Flow
      x={96}
      y={650}
      step={3}
      gap={28}
      arrowW={190}
      items={[
        { el: <J v={5} color={C.lav} /> },
        { el: <J v={6} color={C.amber} />, via: "fmap (+ 1)" },
        { el: <J v={12} />, via: "fmap (* 2)" },
      ]}
    />
    <Flow
      x={96}
      y={770}
      step={3}
      delay={70}
      gap={36}
      arrowW={560}
      items={[{ el: <J v={5} color={C.lav} /> }, { el: <J v={12} />, via: "fmap ((* 2) . (+ 1))" }]}
    />
    <Mark ok x={1000} y={738} step={3} delay={110} size={50} />
    <At x={1100} y={720} w={720} step={3} delay={116} size={28} weight={600} color={C.dim}>
      два проходи по структурі дають той самий результат, що й один
    </At>
    <At x={96} y={900} w={1720} step={4} size={34} weight={600}>
      Закони дозволяють змінювати форму функційної композиції <A>без зміни її поведінки</A>.
    </At>
  </Slide>
);

/* 18 · Моноїд */
const MONOIDS = [
  { set: "Int", op: "+", e: "0" },
  { set: "Int", op: "*", e: "1" },
  { set: "[a]", op: "++", e: "[]" },
  { set: "Bool", op: "&&", e: "True" },
];

const S18: React.FC = () => {
  const { s } = useSteps();
  const X = 1180;
  const W = [180, 180, 200];
  const cell = (txt: string, w: number, color: string, head?: boolean) => (
    <div
      style={{
        width: w,
        fontFamily: head ? F.body : F.mono,
        fontWeight: head ? 700 : 600,
        fontSize: head ? 24 : 32,
        color,
        textAlign: "center",
        whiteSpace: "pre",
      }}
    >
      {txt}
    </div>
  );
  return (
    <Slide title="Моноїд">
      <Lead>
        <A>Моноїд</A> – множина елементів з асоціативною бінарною операцією та нейтральним елементом.
      </Lead>
      <SyntaxBox
        x={96}
        y={320}
        step={1}
        size={28}
        title="Закони моноїду: операція <>, нейтральний елемент mempty"
        lines={["mempty <> {x} = {x} = {x} <> mempty", "({x} <> {y}) <> {z} = {x} <> ({y} <> {z})"]}
      />
      <Code
        x={96}
        y={520}
        size={36}
        step={2}
        stagger={10}
        code={`
          0 + x = x = x + 0
          [] ++ xs = xs = xs ++ []
          (xs ++ ys) ++ zs = xs ++ (ys ++ zs)
        `}
      />
      <div style={{ position: "absolute", left: X, top: 330, display: "flex", opacity: clamp01(s(3, 0)) }}>
        {cell("множина", W[0], C.dim, true)}
        {cell("операція", W[1], C.dim, true)}
        {cell("нейтральний", W[2], C.dim, true)}
      </div>
      {MONOIDS.map((m, i) => {
        const p = s(3, 8 + i * 8, POP);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: X,
              top: 380 + i * 76,
              display: "flex",
              alignItems: "center",
              height: 64,
              borderRadius: 12,
              background: i % 2 ? "transparent" : C.panel,
              opacity: clamp01(p),
              transform: `translateX(${(1 - p) * 30}px)`,
            }}
          >
            {cell(m.set, W[0], C.lav)}
            {cell(m.op, W[1], C.amber)}
            {cell(m.e, W[2], C.mint)}
          </div>
        );
      })}
      <At x={96} y={880} w={1720} step={4} size={34} weight={600}>
        Асоціативність і нейтральність будуть важливими для пояснення <A>законів монад</A>.
      </At>
    </Slide>
  );
};

export const s3Slides: SlideDef[] = [
  { id: "category", title: "Категорія і морфізми", steps: [45, 70, 90, 60, 80, 60], C: S15 },
  { id: "endofunctor", title: "Функтор у теорії категорій", steps: [45, 50, 50, 40, 80, 55], C: S16 },
  { id: "functor-laws", title: "Закони функтора", steps: [45, 80, 50, 150, 55], C: S17 },
  { id: "monoid", title: "Моноїд", steps: [45, 50, 70, 60, 55], C: S18 },
];

