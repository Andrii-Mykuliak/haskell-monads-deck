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

const Loop: React.FC<{ p: P; r: number; step: number; delay?: number; side?: Side; label?: string }> = ({
  p,
  r,
  step,
  delay = 0,
  side = "up",
  label: text = "id",
}) => {
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
        {text}
      </text>
    </svg>
  );
};

/** A type drawn as a pill centred on `p`. */
const TypeNode: React.FC<{ p: P; label: string; step: number; delay?: number; color?: string }> = ({ p, label, step, delay = 0, color = C.lav }) => {
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
        {label}
      </Chip>
    </div>
  );
};

const ArrowLabel: React.FC<{ x: number; y: number; step: number; delay?: number; color?: string; children: React.ReactNode }> = ({
  x,
  y,
  step,
  delay = 0,
  color = C.mint,
  children,
}) => (
  <At x={x} y={y} step={step} delay={delay} size={28} weight={700} color={color} font={F.mono} style={{ fontVariantLigatures: "none" }}>
    {children}
  </At>
);

/* 15a · Об’єкти і морфізми */
const T_INT: P = { x: 1110, y: 470 };
const T_BOOL: P = { x: 1690, y: 470 };
const T_STR: P = { x: 1400, y: 730 };

const SMorphism: React.FC = () => (
  <Slide title="Об’єкти і морфізми">
    <Lead>
      <A>Морфізм</A> – стрілка <M>{"f : a -> b"}</M> від об’єкта <M>a</M> (джерела) до об’єкта <M>b</M> (цілі). Об’єкти – це «точки», морфізми –
      «шляхи» між ними.
    </Lead>
    <Obj p={{ x: 220, y: 450 }} label="a" step={1} />
    <Obj p={{ x: 700, y: 450 }} label="b" step={1} delay={10} />
    <Arrow x1={272} y1={450} x2={648} y2={450} step={1} delay={18} dur={16} color={C.mint} width={4} />
    <ArrowLabel x={450} y={386} step={1} delay={24}>
      f
    </ArrowLabel>
    <At x={160} y={510} step={1} delay={30} size={24} weight={600} color={C.dim}>
      джерело
    </At>
    <At x={660} y={510} step={1} delay={34} size={24} weight={600} color={C.dim}>
      ціль
    </At>

    <At x={1000} y={330} step={2} size={26} weight={600} color={C.dim}>
      у Haskell: об’єкти – типи, морфізми – функції
    </At>
    <TypeNode p={T_INT} label="Int" step={2} delay={6} />
    <TypeNode p={T_BOOL} label="Bool" step={2} delay={10} />
    <TypeNode p={T_STR} label="String" step={2} delay={14} />
    <Arrow x1={T_INT.x + 56} y1={T_INT.y} x2={T_BOOL.x - 66} y2={T_BOOL.y} step={2} delay={24} dur={14} color={C.mint} width={4} />
    <ArrowLabel x={1360} y={410} step={2} delay={30}>
      even
    </ArrowLabel>
    <Arrow x1={T_INT.x - 10} y1={T_INT.y + 34} x2={T_STR.x - 72} y2={T_STR.y - 26} step={2} delay={44} dur={14} color={C.mint} width={4} curve={40} />
    <ArrowLabel x={1130} y={620} step={2} delay={50}>
      show
    </ArrowLabel>
    <Arrow x1={T_STR.x - 24} y1={T_STR.y - 34} x2={T_INT.x + 44} y2={T_INT.y + 34} step={2} delay={64} dur={14} color={C.mint} width={4} curve={40} />
    <ArrowLabel x={1300} y={540} step={2} delay={70}>
      length
    </ArrowLabel>
    <Loop p={T_BOOL} r={58} step={2} delay={84} side="right" label="not" />

    <At x={96} y={620} w={820} step={3} size={30} weight={600}>
      об’єкт ↔ тип: <M>Int</M>, <M>Bool</M>, <M>String</M>
    </At>
    <At x={96} y={680} w={820} step={3} delay={14} size={30} weight={600}>
      морфізм ↔ функція: <M>{"even :: Int -> Bool"}</M>
    </At>
    <At x={96} y={880} w={1720} step={4} size={32} weight={600}>
      Морфізм не мусить змінювати тип: <M>{"not :: Bool -> Bool"}</M> – теж морфізм. Важливо лише, звідки і куди веде стрілка.
    </At>
  </Slide>
);

/* 15b · Категорія */
const PA: P = { x: 1080, y: 640 };
const PB: P = { x: 1400, y: 400 };
const PC: P = { x: 1720, y: 640 };

const ITEMS: React.ReactNode[] = [
  <>
    <b>Об’єкти</b>: <M>a</M>, <M>b</M>, <M>c</M>
  </>,
  <>
    <b>Морфізми</b> між ними: <M>{"f : a -> b"}</M>, <M>{"g : b -> c"}</M>
  </>,
  <>
    <b>Композиція</b>: <M>{"g . f : a -> c"}</M> – спочатку <M>f</M>, потім <M>g</M>
  </>,
  <>
    <b>Тотожний морфізм</b> <M>{"id : a -> a"}</M> для кожного об’єкта
  </>,
];

const SCategory: React.FC = () => {
  const ab = trim(PA, PB, 44);
  const bc = trim(PB, PC, 44);
  const ac = trim(PA, PC, 44);
  return (
    <Slide title="Категорія">
      <Lead>
        <A>Категорія</A> – об’єкти, морфізми між ними та правило, за яким морфізми компонуються. Вона складається з чотирьох частин:
      </Lead>
      {ITEMS.map((it, i) => (
        <At key={i} x={96} y={330 + i * 70} w={880} step={i + 1} size={30} weight={400} dir="left">
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              marginRight: 16,
              borderRadius: 20,
              background: i % 2 ? "#5e5086" : C.pink,
              fontWeight: 800,
              fontSize: 24,
              verticalAlign: "middle",
            }}
          >
            {i + 1}
          </span>
          {it}
        </At>
      ))}
      <SyntaxBox x={96} y={630} w={820} step={3} delay={40} title="Композиція в Haskell" lines={["({g} . {f}) {x} = {g} ({f} {x})"]} />
      <At x={96} y={770} step={5} size={28} weight={700} color={C.accentHi}>
        Закони
      </At>
      <Code
        x={96}
        y={810}
        size={28}
        step={5}
        delay={8}
        code={`
          h . (g . f) = (h . g) . f   -- асоціативність
          id . f = f = f . id         -- нейтральність id
        `}
      />
      <Obj p={PA} label="a" step={1} />
      <Obj p={PB} label="b" step={1} delay={8} />
      <Obj p={PC} label="c" step={1} delay={16} />
      <Arrow {...ab} step={2} delay={6} dur={14} color={C.mint} width={4} />
      <Arrow {...bc} step={2} delay={20} dur={14} color={C.mint} width={4} />
      <ArrowLabel x={1190} y={470} step={2} delay={14}>
        f
      </ArrowLabel>
      <ArrowLabel x={1585} y={470} step={2} delay={28}>
        g
      </ArrowLabel>
      <Arrow {...ac} step={3} delay={6} dur={18} color={C.pink} width={4} curve={-60} />
      <ArrowLabel x={1350} y={690} step={3} delay={16} color={C.pink}>
        g . f
      </ArrowLabel>
      <Loop p={PA} r={44} step={4} delay={6} side="left" />
      <Loop p={PB} r={44} step={4} delay={14} side="up" />
      <Loop p={PC} r={44} step={4} delay={22} side="right" />
      <At x={1000} y={790} w={820} step={5} delay={30} size={26} weight={600} color={C.dim}>
        Типи Haskell з функціями, композицією <M c={C.dim}>(.)</M> та <M c={C.dim}>id</M> утворюють категорію.
      </At>
    </Slide>
  );
};

/* 15c · Функтор */
const MapArrow: React.FC<{ x1: number; x2: number; y: number; step: number; delay?: number; color: string; label: string }> = ({
  x1,
  x2,
  y,
  step,
  delay = 0,
  color,
  label,
}) => {
  const { lin } = useSteps();
  const k = lin(step, delay, 18);
  return (
    <>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <line x1={x1} y1={y} x2={x1 + (x2 - 14 - x1) * k} y2={y} stroke={color} strokeWidth={3} strokeDasharray="10 8" />
        <polygon points={`${x2},${y} ${x2 - 16},${y - 9} ${x2 - 16},${y + 9}`} fill={color} opacity={clamp01(k * 4 - 3)} />
      </svg>
      <div
        style={{
          position: "absolute",
          left: (x1 + x2) / 2 - 40,
          top: y - 44,
          width: 80,
          textAlign: "center",
          fontFamily: F.mono,
          fontWeight: 700,
          fontSize: 28,
          color,
          opacity: k,
        }}
      >
        {label}
      </div>
    </>
  );
};

const Panel: React.FC<{ x: number; title: string; step: number; delay?: number }> = ({ x, title, step, delay = 0 }) => {
  const { s } = useSteps();
  const p = s(step, delay);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: 330,
        width: 600,
        height: 380,
        borderRadius: 22,
        border: `2px solid ${C.line}`,
        background: "rgba(33,39,56,0.6)",
        opacity: clamp01(p),
        boxSizing: "border-box",
      }}
    >
      <div style={{ position: "absolute", left: 22, top: 16, fontFamily: F.body, fontWeight: 700, fontSize: 24, color: C.dim }}>{title}</div>
    </div>
  );
};

const SFunctor: React.FC = () => {
  const LX = 400;
  const RX = 1520;
  const Y1 = 430;
  const Y2 = 630;
  return (
    <Slide title="Функтор">
      <Lead>
        <A>Функтор</A> <M>F</M> – відображення між категоріями: кожен об’єкт <M>a</M> переходить в об’єкт <M>F a</M>, кожен морфізм{" "}
        <M>{"f : a -> b"}</M> – у морфізм <M>{"F f : F a -> F b"}</M>.
      </Lead>
      <Panel x={100} title="категорія C" step={1} />
      <TypeNode p={{ x: LX, y: Y1 }} label="Int" step={1} delay={8} />
      <TypeNode p={{ x: LX, y: Y2 }} label="Bool" step={1} delay={14} />
      <Arrow x1={LX} y1={Y1 + 34} x2={LX} y2={Y2 - 34} step={1} delay={22} dur={14} color={C.mint} width={4} />
      <ArrowLabel x={LX + 20} y={Y1 + 70} step={1} delay={28}>
        even
      </ArrowLabel>

      <Panel x={1220} title="категорія D" step={2} />
      <MapArrow x1={LX + 60} x2={RX - 100} y={Y1} step={2} delay={6} color={C.lav} label="F" />
      <MapArrow x1={LX + 70} x2={RX - 110} y={Y2} step={2} delay={14} color={C.lav} label="F" />
      <TypeNode p={{ x: RX, y: Y1 }} label="Maybe Int" step={2} delay={26} color={C.accentHi} />
      <TypeNode p={{ x: RX, y: Y2 }} label="Maybe Bool" step={2} delay={32} color={C.accentHi} />

      <MapArrow x1={LX + 120} x2={RX - 20} y={(Y1 + Y2) / 2} step={3} color={C.amber} label="F" />
      <Arrow x1={RX} y1={Y1 + 34} x2={RX} y2={Y2 - 34} step={3} delay={20} dur={14} color={C.pink} width={4} />
      <ArrowLabel x={RX + 20} y={Y1 + 70} step={3} delay={26} color={C.pink}>
        fmap even
      </ArrowLabel>

      <At x={96} y={750} w={1720} step={4} size={30} weight={600}>
        Функтор не руйнує структуру: тотожний морфізм переходить у тотожний, композиція – у композицію.
      </At>
      <Code x={96} y={804} size={30} step={4} delay={14} code={`F id = id          F (g . f) = F g . F f`} />
      <At x={96} y={880} w={1720} step={5} size={32} weight={600}>
        У Haskell <M>F</M> на об’єктах – конструктор типу <M>Maybe</M>, на морфізмах – <M>fmap</M>. Тож функтор дає звичайній функції{" "}
        <M>even</M> працювати в новому контексті.
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

/** A value with its type underneath: the arrows change the value, the type may stay the same. */
const ValCorner: React.FC<{ p: P; step: number; delay?: number; value: string; type: string; color?: string }> = ({
  p,
  step,
  delay = 0,
  value,
  type,
  color = C.lav,
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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "6px 18px 8px",
        borderRadius: 12,
        border: `3px solid ${color}`,
        background: C.panel,
        fontVariantLigatures: "none",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 30, color: C.mint }}>{value}</span>
      <span style={{ fontFamily: F.mono, fontWeight: 600, fontSize: 20, color: C.dim }}>{`:: ${type}`}</span>
    </div>
  );
};

const S16: React.FC = () => {
  const L = { x0: 220, x1: 760 };
  const R = { x0: 1150, x1: 1680 };
  const Y = { top: 440, bot: 720 };
  return (
    <Slide title="Функтор у теорії категорій">
      <Lead>
        <A>Ендофунктор</A> – функтор із категорії в ту саму категорію. <M>Maybe</M> переводить типи Haskell знову в типи Haskell,
        тому кожен <M>Functor</M> у Haskell – ендофунктор.
      </Lead>
      <At x={120} y={330} step={1} size={26} weight={600} color={C.dim}>
        загальна схема: a, b – типи (можуть збігатися)
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
        приклад: <M c={C.dim}>{"double :: Int -> Int"}</M>, тут a = b = Int
      </At>
      <ValCorner p={{ x: R.x0, y: Y.top }} step={4} delay={6} value="5" type="Int" />
      <ValCorner p={{ x: R.x1, y: Y.top }} step={4} delay={10} value="10" type="Int" />
      <Arrow x1={R.x0 + 64} y1={Y.top} x2={R.x1 - 64} y2={Y.top} step={4} delay={14} dur={12} color={C.mint} />
      <At x={(R.x0 + R.x1) / 2 - 50} y={Y.top - 60} step={4} delay={18} size={30} color={C.mint} font={F.mono}>
        double
      </At>
      <VDash x={R.x0} y1={Y.top + 48} y2={Y.bot - 48} step={4} delay={24} label="Just" />
      <VDash x={R.x1} y1={Y.top + 48} y2={Y.bot - 48} step={4} delay={28} label="Just" />
      <ValCorner p={{ x: R.x0, y: Y.bot }} step={4} delay={34} value="Just 5" type="Maybe Int" color={C.accentHi} />
      <ValCorner p={{ x: R.x1, y: Y.bot }} step={4} delay={38} value="Just 10" type="Maybe Int" color={C.accentHi} />
      <Arrow x1={R.x0 + 110} y1={Y.bot} x2={R.x1 - 110} y2={Y.bot} step={4} delay={44} dur={12} color={C.pink} />
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
      <Code
        x={96}
        y={380}
        size={40}
        step={1}
        stagger={10}
        code={`
          0 + x = x = x + 0
          [] ++ xs = xs = xs ++ []
          (xs ++ ys) ++ zs = xs ++ (ys ++ zs)
        `}
      />
      <div style={{ position: "absolute", left: X, top: 330, display: "flex", opacity: clamp01(s(2, 0)) }}>
        {cell("множина", W[0], C.dim, true)}
        {cell("операція", W[1], C.dim, true)}
        {cell("нейтральний", W[2], C.dim, true)}
      </div>
      {MONOIDS.map((m, i) => {
        const p = s(2, 8 + i * 8, POP);
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
      <At x={96} y={720} w={1720} step={3} size={34} weight={600}>
        Асоціативність і нейтральність будуть важливими для пояснення <A>законів монад</A>.
      </At>
    </Slide>
  );
};

export const s3Slides: SlideDef[] = [
  { id: "morphism", title: "Об’єкти і морфізми", steps: [55, 70, 130, 60, 60], C: SMorphism },
  { id: "category", title: "Категорія", steps: [45, 60, 60, 80, 60, 90], C: SCategory },
  { id: "functor-cat", title: "Функтор", steps: [70, 60, 70, 60, 60, 70], C: SFunctor },
  { id: "endofunctor", title: "Функтор у теорії категорій", steps: [45, 50, 50, 40, 80, 55], C: S16 },
  { id: "functor-laws", title: "Закони функтора", steps: [45, 80, 50, 150, 55], C: S17 },
  { id: "monoid", title: "Моноїд", steps: [45, 70, 60, 55], C: S18 },
];

