import React from "react";
import { C, F } from "../deck/theme";
import { SlideDef, useSteps } from "../deck/steps";
import { Code } from "../deck/Code";
import { A, At, Chip, Lead, M, Slide } from "../deck/ui";
import { clamp01 } from "./common";
import { Ctx, Flow, SyntaxBox, Val } from "./kit";

const J: React.FC<{ v: React.ReactNode; color?: string }> = ({ v, color = C.mint }) => (
  <Ctx label="Just">
    <Val color={color}>{v}</Val>
  </Ctx>
);
const N: React.FC = () => <Ctx label="Nothing" empty color={C.faint} />;

/* 23 · Монада та оператор зв’язування */
const S23: React.FC = () => (
  <Slide title="Монада та оператор зв’язування">
    <Lead>
      <A>Монада</A> (Monad) – абстракція для послідовної композиції <A>залежних</A> обчислень у контексті.
    </Lead>
    <Code
      x={96}
      y={320}
      size={32}
      step={1}
      code={`
        class Applicative m => Monad m where
            (>>=) :: m a -> (a -> m b) -> m b
      `}
    />
    <SyntaxBox
      x={96}
      y={460}
      w={840}
      step={2}
      title="Зв’язування (bind)"
      lines={["{computation} >>= {nextStep}", "-- {computation} :: m a", "-- {nextStep}    :: a -> m b"]}
    />
    <Flow
      x={1000}
      y={320}
      step={2}
      delay={40}
      gap={26}
      arrowW={110}
      items={[
        {
          el: (
            <Ctx label="m">
              <Val color={C.lav}>a</Val>
            </Ctx>
          ),
        },
        {
          el: (
            <Chip size={28} color={C.amber} border={C.amber}>
              {"a -> m b"}
            </Chip>
          ),
          via: ">>=",
        },
        {
          el: (
            <Ctx label="m">
              <Val>b</Val>
            </Ctx>
          ),
        },
      ]}
    />
    <Code
      x={1000}
      y={480}
      size={28}
      step={3}
      code={`
        half :: Int -> Maybe Int
        half n = if even n then Just (n \`div\` 2)
                           else Nothing
      `}
    />
    <Code
      x={1000}
      y={640}
      size={30}
      step={4}
      stagger={16}
      code={`
        Just 10 >>= half   -- Just 5
        Just 5  >>= half   -- Nothing
        Nothing >>= half   -- Nothing
      `}
    />
    <At x={96} y={880} w={1720} step={5} size={32} weight={600}>
      Оператор bind отримує контекстний результат і <A>функцію наступного кроку</A> та повертає один контекстний результат. Наступний
      контекст залежить від значення <M>a</M>.
    </At>
  </Slide>
);

/* 24 · Композиція Maybe через bind */
const S24: React.FC = () => (
  <Slide title="Композиція Maybe через bind">
    <Lead>
      Для <M>Maybe</M> оператор <M>{">>="}</M> передає наступній функції значення <M>Just</M> або зберігає <M>Nothing</M> без виклику
      функції.
    </Lead>
    <Code
      x={96}
      y={330}
      size={32}
      step={1}
      code={`
        orderProduct :: String -> Maybe Product
        orderProduct code =
            findProduct code >>= checkStock
      `}
    />
    <Code
      x={96}
      y={520}
      size={32}
      step={2}
      code={`
        instance Monad Maybe where
            [[3@10~60|Just x  >>= f = f x]]
            [[4@10~60|Nothing >>= _ = Nothing]]
      `}
    />
    <Flow
      x={1000}
      y={330}
      step={3}
      delay={10}
      gap={30}
      arrowW={170}
      items={[
        { el: <Val color={C.amber}>"BOOK"</Val> },
        { el: <J v="p" color={C.lav} />, via: "findProduct" },
        { el: <J v="p" color={C.lav} />, via: "checkStock" },
      ]}
    />
    <Flow
      x={1000}
      y={480}
      step={4}
      delay={10}
      gap={30}
      arrowW={170}
      items={[{ el: <Val color={C.amber}>"XYZ"</Val> }, { el: <N />, via: "findProduct" }, { el: <N />, via: "checkStock", skip: true }]}
    />
    <At x={1000} y={600} w={820} step={4} delay={60} size={26} weight={600} color={C.dim}>
      <M c={C.dim}>checkStock</M> не викликається: <M c={C.dim}>Nothing</M> проходить далі без змін
    </At>
    <At x={96} y={880} w={1720} step={5} size={34} weight={600}>
      Результат має тип <M>Maybe Product</M>, а не <M>Maybe (Maybe Product)</M>.
    </At>
  </Slide>
);

/* 25 · pure, return та >> */
const S25: React.FC = () => (
  <Slide title="pure, return та >>">
    <Lead>
      <M>pure</M> вводить значення в контекст. <M>return</M> у Haskell має ту саму роль, а <A>не завершує</A> виконання функції.
    </Lead>
    <Code
      x={96}
      y={330}
      size={32}
      step={1}
      stagger={10}
      code={`
        pure   :: Applicative m => a -> m a
        return :: Monad m => a -> m a
        (>>)   :: Monad m => m a -> m b -> m b
      `}
    />
    <SyntaxBox
      x={96}
      y={520}
      w={840}
      step={2}
      title="Послідовність без передачі значення"
      lines={["{action1} >> {action2}", "  ≡  {action1} >>= \\_ -> {action2}"]}
    />
    <Code
      x={1000}
      y={330}
      size={30}
      step={1}
      delay={40}
      stagger={14}
      code={`
        pure 5 :: Maybe Int    -- Just 5
        return 5 :: [Int]      -- [5]
        @2+40 Just 1  >> Just 2      -- Just 2
        @2+54 Nothing >> Just 2      -- Nothing
        @3 [[3@20~80|return 1 >> Just 2]]     -- Just 2
      `}
    />
    <At x={1000} y={590} w={820} step={3} delay={30} size={26} weight={600} color={C.dim}>
      <M c={C.dim}>return 1</M> не перериває обчислення: результатом є другий крок
    </At>
    <At x={96} y={880} w={1720} step={4} size={34} weight={600}>
      Оператор <M>{">>"}</M> компонує два обчислення, якщо <A>значення першого не потрібне</A> другому.
    </At>
  </Slide>
);

/* 26 · do-нотація та оператор >>= */
const S26: React.FC = () => (
  <Slide title="do-нотація та оператор >>=">
    <Lead>
      <M>do</M>-нотація надає послідовну форму запису тієї самої монадичної композиції.
    </Lead>
    <SyntaxBox
      x={96}
      y={290}
      w={800}
      step={1}
      size={26}
      title="do-блок"
      lines={["do", "  {x1} <- {action1}", "  {x2} <- {action2}", "  {finalAction}"]}
    />
    <At x={922} y={360} step={1} delay={24} size={52} color={C.amber}>
      ≡
    </At>
    <SyntaxBox
      x={1000}
      y={290}
      w={820}
      step={1}
      delay={30}
      size={26}
      title="Те саме через >>="
      lines={["{action1} >>= \\{x1} ->", "  {action2} >>= \\{x2} ->", "    {finalAction}"]}
    />
    <At x={96} y={540} step={2} size={28} weight={700} color={C.accentHi}>
      Через do
    </At>
    <Code
      x={96}
      y={586}
      size={30}
      step={2}
      delay={6}
      code={`
        do
          x <- [[3~44|safeDivide 20 4]]
          y <- [[3@44~44|safeDivide x 2]]
          [[3@88~44|pure (y + 1)]]
      `}
    />
    <At x={1000} y={540} step={2} delay={20} size={28} weight={700} color={C.accentHi}>
      Через {">>="}
    </At>
    <Code
      x={1000}
      y={586}
      size={30}
      step={2}
      delay={26}
      code={`
        [[3~44|safeDivide 20 4]] >>= \\x ->
          [[3@44~44|safeDivide x 2]] >>= \\y ->
          [[3@88~44|pure (y + 1)]]
      `}
    />
    <Flow
      x={96}
      y={780}
      step={3}
      delay={10}
      gap={44}
      arrowW={170}
      items={[{ el: <J v="5.0" /> }, { el: <J v="2.5" />, via: "x = 5.0" }, { el: <J v="3.5" />, via: "y = 2.5" }]}
    />
    <At x={96} y={940} w={1720} step={4} size={32} weight={600}>
      Обидва записи дають <M>Just 3.5</M>; <M>{"<-"}</M> не є мутацією змінної, а дає ім’я результату кроку.
    </At>
  </Slide>
);

/* 27 · Три закони монад */
const LAWS = [
  { name: "Ліва тотожність", law: "pure a >>= f  =  f a", ex: "-- pure 10 >>= half  =  half 10", mon: "mempty <> x = x" },
  { name: "Права тотожність", law: "m >>= pure  =  m", ex: "-- Just 4 >>= pure  =  Just 4", mon: "x <> mempty = x" },
  {
    name: "Асоціативність",
    law: "(m >>= f) >>= g  =  m >>= (\\x -> f x >>= g)",
    ex: "-- групування змінюється, порядок f, g – ні",
    mon: "(x <> y) <> z = x <> (y <> z)",
  },
];

const S27: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Три закони монад">
      <Lead>
        Коректна реалізація <M>Monad</M> має задовольняти ліву та праву тотожності й асоціативність.
      </Lead>
      <At x={1260} y={290} step={1} delay={30} size={24} weight={600} color={C.dim}>
        аналог у моноїді
      </At>
      {LAWS.map((l, i) => {
        const y = 330 + i * 170;
        const st = i + 1;
        return (
          <React.Fragment key={i}>
            <At x={96} y={y} step={st} size={28} weight={700} color={C.accentHi}>
              {l.name}
            </At>
            <Code x={96} y={y + 44} size={34} step={st} delay={8} code={l.law} />
            <Code x={96} y={y + 100} size={26} step={st} delay={24} code={l.ex} />
            <div
              style={{
                position: "absolute",
                left: 1260,
                top: y + 40,
                opacity: clamp01(s(st, 36)),
                transform: `translateX(${(1 - s(st, 36)) * 24}px)`,
              }}
            >
              <Chip size={26} color={C.lav} border={C.line}>
                {l.mon}
              </Chip>
            </div>
          </React.Fragment>
        );
      })}
      <At x={96} y={880} w={1720} step={4} size={34} weight={600}>
        Асоціативність змінює лише <A>групування</A> кроків, але не дозволяє їх <A>переставляти</A>.
      </At>
    </Slide>
  );
};

/* 28 · Монада та теорія категорій */
const S28: React.FC = () => (
  <Slide title="Монада та теорія категорій">
    <Lead>
      Категорне означення монади використовує ендофунктор <M>T</M> і два природні перетворення: одиницю <M c={C.amber}>η</M> та
      множення <M c={C.amber}>μ</M>.
    </Lead>
    <At x={96} y={322} step={1} size={42} weight={700}>
      <A c={C.amber}>η</A> : Id → T
    </At>
    <Code x={96} y={390} size={28} step={1} delay={10} code={`pure :: a -> m a     -- уведення в контекст`} />
    <Flow
      x={1000}
      y={316}
      step={1}
      delay={24}
      arrowW={120}
      items={[{ el: <Val color={C.lav}>5</Val> }, { el: <J v={5} />, via: "η" }]}
    />
    <Flow
      x={1460}
      y={316}
      step={1}
      delay={40}
      arrowW={120}
      items={[
        { el: <Val color={C.lav}>5</Val> },
        {
          el: (
            <Ctx label="[ ]" color={C.lav}>
              <Val>5</Val>
            </Ctx>
          ),
          via: "η",
        },
      ]}
    />
    <At x={96} y={492} step={2} size={42} weight={700}>
      <A c={C.amber}>μ</A> : T ∘ T → T
    </At>
    <Code x={96} y={560} size={28} step={2} delay={10} code={`join :: m (m a) -> m a   -- згортання шарів`} />
    <Flow
      x={1000}
      y={480}
      step={2}
      delay={24}
      arrowW={110}
      items={[
        {
          el: (
            <Ctx label="Just" color={C.pink}>
              <J v={5} />
            </Ctx>
          ),
        },
        { el: <J v={5} />, via: "μ" },
      ]}
    />
    <Flow
      x={1000}
      y={600}
      step={2}
      delay={44}
      arrowW={110}
      items={[
        { el: <Val color={C.lav}>[[1,2],[3]]</Val> },
        { el: <Val>[1,2,3]</Val>, via: "μ" },
      ]}
    />
    <SyntaxBox x={96} y={680} w={840} step={3} title="bind через fmap і join" lines={["{m} >>= {f}  =  join (fmap {f} {m})"]} />
    <At x={1000} y={720} w={820} step={3} delay={30} size={28} weight={600} color={C.dim}>
      <M c={C.dim}>fmap</M> додає внутрішній шар, <M c={C.dim}>join</M> його знімає
    </At>
    <At x={96} y={870} w={1720} step={4} size={32} weight={600}>
      «Монада – це моноїд у категорії ендофункторів»: <M c={C.amber}>η</M> відіграє роль нейтрального елемента, <M c={C.amber}>μ</M> –
      асоціативної операції. Звідси й закони монад.
    </At>
  </Slide>
);

export const s5Slides: SlideDef[] = [
  { id: "bind", title: "Монада та bind", steps: [45, 50, 110, 60, 80, 55], C: S23 },
  { id: "maybe-bind", title: "Maybe через bind", steps: [55, 50, 60, 100, 100, 55], C: S24 },
  { id: "pure-return", title: "pure, return та >>", steps: [55, 90, 100, 90, 55], C: S25 },
  { id: "do", title: "do-нотація", steps: [45, 90, 70, 160, 55], C: S26 },
  { id: "monad-laws", title: "Закони монад", steps: [45, 70, 70, 70, 55], C: S27 },
  { id: "eta-mu", title: "η і μ", steps: [55, 80, 100, 70, 60], C: S28 },
];
