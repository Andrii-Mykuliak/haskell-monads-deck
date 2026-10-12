import React from "react";
import { C, F } from "../deck/theme";
import { mix, POP, SlideDef, useSteps } from "../deck/steps";
import { Code } from "../deck/Code";
import { A, Arrow, At, Chip, Lead, M, Mark, Slide } from "../deck/ui";
import { clamp01 } from "./common";
import { Ctx, Flow, Pop, SyntaxBox, Val } from "./kit";

/* 9 · Значення у контексті */
const S9: React.FC = () => {
  const { s, t } = useSteps();
  const MX = 1300;
  const MY = 440;
  const MW = 250;
  const MH = 120;
  const inP = s(2, 24);
  const outP = s(2, 52, POP);
  const hit = s(3, 20);
  const bounce = Math.max(0, t(3, 40));
  const shake = Math.sin(bounce * 1.5) * 10 * Math.max(0, 1 - bounce / 20);
  const back = s(3, 40);
  return (
    <Slide title="Значення у контексті">
      <Lead>
        Звичайна функція очікує <M>Int</M>. Але <M>Maybe Int</M> представляє або ціле число, або його відсутність.
      </Lead>
      <SyntaxBox x={96} y={320} step={1} title="Тип із параметром" lines={["data {TypeName} {a} = {Constr1} | {Constr2} {a}"]} />
      <Code x={96} y={450} size={36} step={1} delay={30} code={`data Maybe a = Nothing | Just a`} />
      <Code
        x={96}
        y={550}
        size={36}
        step={2}
        code={`
          double :: Int -> Int
          double x = 2 * x
          number :: Maybe Int
          number = Just 5
        `}
      />
      <Code x={96} y={790} size={36} step={3} code={`[[!3|double number]]    -- помилка типів`} />

      <div
        style={{
          position: "absolute",
          left: MX,
          top: MY,
          width: MW,
          height: MH,
          borderRadius: 18,
          border: `3px solid ${hit > 0.05 && back < 0.95 ? C.red : C.accent}`,
          background: C.panel,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          opacity: clamp01(s(2, 0)),
          boxSizing: "border-box",
        }}
      >
        <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 36, color: C.text }}>double</span>
        <span style={{ fontFamily: F.mono, fontWeight: 600, fontSize: 22, color: C.dim, fontVariantLigatures: "none" }}>{"Int -> Int"}</span>
      </div>
      <div
        style={{
          position: "absolute",
          left: mix(1040, MX - 40, inP),
          top: MY + 36,
          opacity: clamp01(s(2, 8)) * (1 - clamp01((inP - 0.85) * 7)),
        }}
      >
        <Val>5</Val>
      </div>
      <Arrow x1={MX + MW + 10} y1={MY + MH / 2} x2={MX + MW + 110} y2={MY + MH / 2} step={2} delay={44} dur={10} color={C.dim} width={3} />
      <div style={{ position: "absolute", left: MX + MW + 130, top: MY + 36, opacity: clamp01(outP), transform: `scale(${0.7 + 0.3 * outP})` }}>
        <Val>10</Val>
      </div>

      <div
        style={{
          position: "absolute",
          left: mix(1000, 1080, hit) - mix(0, 80, back) + shake,
          top: MY + 200,
          opacity: clamp01(s(3, 0)),
        }}
      >
        <Ctx label="Just" color={hit > 0.05 && back < 0.95 ? C.red : C.accentHi}>
          <Val>5</Val>
        </Ctx>
      </div>
      <Arrow x1={1180} y1={MY + 196} x2={MX + 30} y2={MY + MH + 10} step={3} delay={16} dur={12} color={C.red} width={3} />
      <Mark ok={false} x={1240} y={MY + 150} step={3} delay={40} size={48} />
      <At x={1000} y={MY + 300} w={820} step={3} delay={50} size={26} weight={600} color={C.red}>
        очікується <M c={C.red}>Int</M>, отримано <M c={C.red}>Maybe Int</M>
      </At>
      <At x={96} y={880} w={1720} step={4} size={34} weight={600}>
        Вираз <M>double number</M> некоректний: <M>Int</M> і <M>Maybe Int</M> – різні типи.
      </At>
    </Slide>
  );
};

/* 10 · Повторення службової логіки */
const S10: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Повторення службової логіки">
      <Lead>
        Для кожного перетворення можна вручну розглядати випадки <M>Just</M> і <M>Nothing</M>, однак такий підхід повторює однакову
        структуру.
      </Lead>
      <Code
        x={96}
        y={340}
        size={32}
        step={1}
        code={`
          doubleMaybe :: Maybe Int -> Maybe Int
          doubleMaybe [[3|Nothing]]  = [[3|Nothing]]
          doubleMaybe ([[3@10|Just]] x) = [[3@10|Just]] ([[.3@30|double]] x)
        `}
      />
      <Code
        x={96}
        y={520}
        size={32}
        step={2}
        code={`
          showMaybe :: Maybe Int -> Maybe String
          showMaybe [[3|Nothing]]  = [[3|Nothing]]
          showMaybe ([[3@10|Just]] x) = [[3@10|Just]] ([[.3@30|show]] x)
        `}
      />
      <At x={1000} y={330} step={4} size={30} weight={700} color={C.accentHi}>
        Відмінність виносимо в параметр <M c={C.amber}>g</M>
      </At>
      <Code
        x={1000}
        y={400}
        size={30}
        step={4}
        delay={16}
        code={`
          liftMaybe :: (a -> b) -> Maybe a -> Maybe b
          liftMaybe g Nothing  = Nothing
          liftMaybe g (Just x) = Just (g x)
        `}
      />
      <Code
        x={1000}
        y={570}
        size={30}
        step={4}
        delay={50}
        style={{ color: C.dim }}
        code={`
          -- doubleMaybe = liftMaybe double
          -- showMaybe   = liftMaybe show
        `}
      />
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 740,
          display: "flex",
          alignItems: "center",
          gap: 22,
          opacity: clamp01(s(5, 0)),
          transform: `translateY(${(1 - s(5, 0)) * 20}px)`,
        }}
      >
        <Chip size={34} color={C.amber} border={C.amber}>
          {"a -> b"}
        </Chip>
        <span style={{ fontFamily: F.body, fontWeight: 700, fontSize: 34, color: C.dim }}>+</span>
        <Chip size={34} color={C.accentHi} border={C.accentHi}>
          PType a
        </Chip>
        <span style={{ fontFamily: F.body, fontWeight: 700, fontSize: 40, color: C.dim }}>⟹</span>
        <Chip size={34} color={C.mint} border={C.mint}>
          PType b
        </Chip>
      </div>
      <At x={96} y={870} w={1720} step={5} delay={14} size={34} weight={600}>
        Потрібен загальний спосіб застосувати <M>{"a -> b"}</M> до значення типу <M>PType a</M>, отримавши <M>PType b</M>.
      </At>
      <At x={96} y={930} w={1720} step={5} delay={30} size={26} weight={400} color={C.dim}>
        <M c={C.dim}>PType</M> – умовне позначення параметризованого типу-контексту, наприклад <M c={C.dim}>Maybe</M>: тоді{" "}
        <M c={C.dim}>PType Int</M> – це <M c={C.dim}>Maybe Int</M>.
      </At>
    </Slide>
  );
};

/* 11 · Функтор і fmap */
const S11: React.FC = () => (
  <Slide title="Функтор і fmap">
    <Lead>
      <A>Функтор</A> (Functor) – клас типів, що дозволяє переносити звичайне перетворення на значення у певному контексті.
    </Lead>
    <Code
      x={96}
      y={330}
      size={36}
      step={1}
      code={`
        class Functor ptype where
            fmap :: (a -> b) -> ptype a -> ptype b
      `}
    />
    <SyntaxBox
      x={96}
      y={480}
      w={840}
      step={2}
      title="Екземпляр Functor"
      lines={["instance Functor {TypeCtor} where", "    fmap {g} {pattern} = {expression}"]}
    />
    <Code
      x={96}
      y={680}
      size={34}
      step={2}
      delay={40}
      code={`
        instance Functor Maybe where
            fmap _ Nothing  = Nothing
            fmap g (Just x) = Just (g x)
      `}
    />
    <At x={1060} y={340} step={1} delay={20} size={26} weight={600} color={C.dim}>
      звичайна функція
    </At>
    <Flow
      x={1080}
      y={390}
      step={1}
      delay={30}
      arrowW={300}
      items={[{ el: <Val color={C.lav}>a</Val> }, { el: <Val>b</Val>, via: "g" }]}
    />
    <At x={1060} y={520} step={1} delay={50} size={26} weight={600} color={C.dim}>
      та сама функція в контексті <M c={C.accentHi}>PType</M>
    </At>
    <Flow
      x={1040}
      y={570}
      step={1}
      delay={60}
      arrowW={240}
      items={[
        {
          el: (
            <Ctx label="PType">
              <Val color={C.lav}>a</Val>
            </Ctx>
          ),
        },
        {
          el: (
            <Ctx label="PType">
              <Val>b</Val>
            </Ctx>
          ),
          via: "fmap g",
        },
      ]}
    />
    <At x={96} y={880} w={1720} step={3} size={34} weight={600}>
      <M>PType</M> задає <A>форму контексту</A>, реалізація <M>fmap</M> залежить від конкретного типу. У коді Haskell змінна типу
      пишеться з малої літери: <M>ptype</M>.
    </At>
  </Slide>
);

/* 12 · Одна операція – різні контексти */
const List: React.FC<{ xs: number[]; color?: string }> = ({ xs, color = C.mint }) => (
  <Ctx label="[ ]" color={C.lav}>
    {xs.map((v, i) => (
      <Val key={i} color={color}>
        {v}
      </Val>
    ))}
  </Ctx>
);

const ROWS12: { code: string; from: React.ReactNode; to: React.ReactNode; w: number }[] = [
  {
    code: "fmap double (Just 5)   -- Just 10",
    from: (
      <Ctx label="Just">
        <Val color={C.lav}>5</Val>
      </Ctx>
    ),
    to: (
      <Ctx label="Just">
        <Val>10</Val>
      </Ctx>
    ),
    w: 240,
  },
  { code: "fmap double Nothing    -- Nothing", from: <Ctx label="Nothing" empty color={C.faint} />, to: <Ctx label="Nothing" empty color={C.faint} />, w: 248 },
  { code: "fmap double [1, 2, 3]  -- [2, 4, 6]", from: <List xs={[1, 2, 3]} color={C.lav} />, to: <List xs={[2, 4, 6]} />, w: 150 },
];

const S12: React.FC = () => (
  <Slide title="Одна операція – різні контексти">
    <Lead>
      <M>fmap</M> не змінює саму функцію <M>double</M>, а узгоджує її застосування зі <A>структурою значення</A>.
    </Lead>
    {ROWS12.map((r, i) => (
      <React.Fragment key={i}>
        <Code x={96} y={344 + i * 116} size={34} step={i + 1} code={r.code} />
        <Flow x={1000} y={316 + i * 116} step={i + 1} delay={14} gap={26} arrowW={r.w} items={[{ el: r.from }, { el: r.to, via: "fmap double" }]} />
      </React.Fragment>
    ))}
    <SyntaxBox x={96} y={690} w={840} step={4} title="Інфіксна форма fmap" lines={["{g} <$> {ctx}  ≡  fmap {g} {ctx}"]} />
    <Code x={1000} y={720} size={34} step={4} delay={36} code={`double <$> Just 5      -- Just 10`} />
    <At x={96} y={880} w={1720} step={5} size={34} weight={600}>
      Оператор <M>{"<$>"}</M> – інфіксна форма <M>fmap</M>: запис нагадує звичайну аплікацію <M>double $ 5</M>.
    </At>
  </Slide>
);

/* 13 · Functor потребує конструктора типу */
const S13: React.FC = () => (
  <Slide title="Functor і конструктор типу">
    <Lead>
      <A>Конструктор типу</A> (наприклад, <M>Maybe</M>) приймає тип і утворює інший тип. У класі <M>Functor</M> змінна <M>ptype</M> –
      саме такий конструктор: її застосовують до <M>a</M> і <M>b</M>.
    </Lead>
    <Code
      x={96}
      y={330}
      size={38}
      step={1}
      code={`
        class Functor [[1@20|ptype]] where
            fmap :: (a -> b) -> [[1@20|ptype]] a -> [[1@20|ptype]] b
      `}
    />
    <At x={96} y={500} step={2} pop dir="scale">
      <Chip size={30} color={C.mint} border={C.mint}>
        ptype = Maybe
      </Chip>
    </At>
    <Code x={480} y={504} size={32} step={2} delay={14} code={`fmap :: (a -> b) -> [[2@34|Maybe]] a -> [[2@34|Maybe]] b`} />
    <Mark ok x={1340} y={500} step={2} delay={50} size={50} />
    <At x={96} y={620} step={3} pop dir="scale">
      <Chip size={30} color={C.red} border={C.red}>
        ptype = Maybe Int
      </Chip>
    </At>
    <Code x={480} y={624} size={32} step={3} delay={14} code={`fmap :: (a -> b) -> [[!3@34|Maybe Int a]] -> [[!3@34|Maybe Int b]]`} />
    <Mark ok={false} x={1500} y={620} step={3} delay={50} size={50} />
    <At x={480} y={680} w={1340} step={3} delay={60} size={26} weight={600} color={C.dim}>
      <M c={C.dim}>Maybe Int</M> – уже готовий тип, ще один аргумент <M c={C.dim}>a</M> йому передати не можна
    </At>
    <At x={96} y={780} step={4} pop dir="scale">
      <Chip size={30} color={C.mint} border={C.mint}>
        instance Functor Maybe
      </Chip>
    </At>
    <Mark ok x={570} y={782} step={4} delay={10} size={50} />
    <At x={720} y={780} step={4} delay={20} pop dir="scale">
      <Chip size={30} color={C.red} border={C.red}>
        instance Functor (Maybe Int)
      </Chip>
    </At>
    <Mark ok={false} x={1320} y={782} step={4} delay={30} size={50} />
    <At x={96} y={900} w={1720} step={4} delay={40} size={34} weight={600}>
      <M>Functor</M> визначають для <A>родини</A> <M>Maybe a</M>, а не для окремого типу <M>Maybe Int</M>.
    </At>
  </Slide>
);

/* 14 · Власний функтор для дерева */
type TNode = { x: number; y: number; leaf?: [number, number] };
const TREE: TNode[] = [
  { x: 1500, y: 470 },
  { x: 1330, y: 590 },
  { x: 1240, y: 720, leaf: [1, 10] },
  { x: 1420, y: 720, leaf: [2, 20] },
  { x: 1670, y: 590, leaf: [3, 30] },
];
const EDGES: [number, number][] = [
  [0, 1],
  [0, 4],
  [1, 2],
  [1, 3],
];

const S14: React.FC = () => {
  const { s } = useSteps();
  const show = s(3, 20);
  return (
    <Slide title="Власний функтор для дерева">
      <Lead>
        Операція <M>fmap</M> перетворює значення листків, зберігаючи <A>структуру</A> рекурсивного дерева.
      </Lead>
      <SyntaxBox
        x={96}
        y={320}
        step={1}
        size={28}
        title="Рекурсивний тип із параметром"
        lines={["data {TypeName} {a} = {Constr1} {a} | {Constr2} ({TypeName} {a}) ({TypeName} {a})"]}
      />
      <Code x={96} y={455} size={32} step={1} delay={30} code={`data Tree a = Leaf a | Node (Tree a) (Tree a)`} />
      <Code
        x={96}
        y={530}
        size={32}
        step={2}
        code={`
          instance Functor Tree where
              fmap f (Leaf x)   = Leaf (f x)
              fmap f (Node l r) =
                  Node (fmap f l) (fmap f r)
        `}
      />
      <Code
        x={96}
        y={746}
        size={26}
        step={3}
        code={`
          t = Node (Node (Leaf 1) (Leaf 2)) (Leaf 3)
          @4 fmap (* 10) t
          @4+70 -- Node (Node (Leaf 10) (Leaf 20)) (Leaf 30)
        `}
      />
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: show }}>
        {EDGES.map(([a, b], i) => {
          const from = TREE[a];
          const to = TREE[b];
          return (
            <line
              key={i}
              x1={from.x}
              y1={from.y + 26}
              x2={to.x}
              y2={to.y - (to.leaf ? 34 : 26)}
              stroke={C.dim}
              strokeOpacity={0.55}
              strokeWidth={3}
              strokeLinecap="round"
            />
          );
        })}
      </svg>
      {TREE.map((n, i) => {
        const p = s(3, 24 + i * 6, POP);
        if (!n.leaf) {
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: n.x - 46,
                top: n.y - 24,
                width: 92,
                height: 48,
                borderRadius: 24,
                border: `3px solid ${C.accent}`,
                background: C.panel2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: F.mono,
                fontWeight: 700,
                fontSize: 22,
                color: C.accentHi,
                opacity: clamp01(p),
                transform: `scale(${0.6 + 0.4 * p})`,
                boxSizing: "border-box",
              }}
            >
              Node
            </div>
          );
        }
        const m = s(4, 20 + i * 8);
        const color = m > 0.5 ? C.mint : C.lav;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: n.x - 50,
              top: n.y - 32,
              width: 100,
              height: 64,
              borderRadius: 12,
              border: `3px solid ${color}`,
              background: `linear-gradient(${color}22, ${color}22), ${C.bg}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: F.mono,
              fontWeight: 700,
              fontSize: 30,
              color,
              opacity: clamp01(p),
              transform: `scale(${(0.6 + 0.4 * p) * (1 + 0.15 * Math.sin(Math.PI * m))})`,
              boxSizing: "border-box",
            }}
          >
            {m > 0.5 ? n.leaf[1] : n.leaf[0]}
          </div>
        );
      })}
      <At x={1600} y={760} step={4} size={30} weight={700} color={C.amber} font={F.mono}>
        fmap (* 10)
      </At>
      <At x={96} y={900} w={1720} step={5} size={34} weight={600}>
        Кількість вузлів і зв’язки між ними <A>не змінюються</A> – змінюються лише значення в листках.
      </At>
    </Slide>
  );
};

export const s2Slides: SlideDef[] = [
  { id: "context", title: "Значення у контексті", steps: [45, 70, 90, 100, 55], C: S9 },
  { id: "boilerplate", title: "Повторення службової логіки", steps: [55, 50, 50, 80, 90, 70], C: S10 },
  { id: "functor", title: "Функтор і fmap", steps: [45, 110, 100, 55], C: S11 },
  { id: "fmap-contexts", title: "fmap у різних контекстах", steps: [45, 60, 60, 60, 80, 55], C: S12 },
  { id: "functor-kind", title: "Functor і конструктор типу", steps: [55, 50, 80, 110, 90], C: S13 },
  { id: "tree", title: "Функтор для дерева", steps: [45, 70, 60, 70, 110, 55], C: S14 },
];
