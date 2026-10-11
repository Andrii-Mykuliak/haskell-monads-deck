import React from "react";
import { C, F } from "../deck/theme";
import { mix, POP, SlideDef, useSteps } from "../deck/steps";
import { Code } from "../deck/Code";
import { A, Arrow, At, Lead, M, Slide } from "../deck/ui";
import { clamp01 } from "./common";
import { Ctx, Flow, Pop, SyntaxBox, Val } from "./kit";

const J: React.FC<{ v: React.ReactNode; color?: string; label?: string }> = ({ v, color = C.mint, label = "Just" }) => (
  <Ctx label={label}>
    <Val color={color} size={26}>
      {v}
    </Val>
  </Ctx>
);
const N: React.FC = () => <Ctx label="Nothing" empty color={C.faint} />;

/* 29 · Maybe: відсутній результат */
const S29: React.FC = () => (
  <Slide title="Maybe: відсутній результат">
    <Lead>
      Монадична композиція <M>Maybe</M> об’єднує залежні перевірки та автоматично поширює <M>Nothing</M>.
    </Lead>
    <SyntaxBox
      x={96}
      y={320}
      w={820}
      step={1}
      size={26}
      title="Охоронні вирази (guards)"
      lines={["{name} {x}", "  | {condition} = {result1}", "  | otherwise   = {result2}"]}
    />
    <Code
      x={96}
      y={526}
      size={28}
      step={2}
      code={`
        positiveRoot x
          | x < 0     = Nothing
          | otherwise = Just (sqrt x)
        safeReciprocal 0 = Nothing
        safeReciprocal y = Just (1 / y)
        calculate x = positiveRoot x >>= safeReciprocal
      `}
    />
    <Flow
      x={980}
      y={330}
      step={3}
      gap={30}
      arrowW={190}
      items={[{ el: <Val color={C.amber}>4</Val> }, { el: <J v="2.0" />, via: "positiveRoot" }, { el: <J v="0.5" />, via: "safeReciprocal" }]}
    />
    <Flow
      x={980}
      y={490}
      step={4}
      gap={30}
      arrowW={190}
      items={[{ el: <Val color={C.amber}>-4</Val> }, { el: <N />, via: "positiveRoot" }, { el: <N />, via: "safeReciprocal", skip: true }]}
    />
    <Flow
      x={980}
      y={650}
      step={4}
      delay={70}
      gap={30}
      arrowW={190}
      items={[{ el: <Val color={C.amber}>0</Val> }, { el: <J v="0.0" />, via: "positiveRoot" }, { el: <N />, via: "safeReciprocal" }]}
    />
    <At x={96} y={880} w={1720} step={5} size={34} weight={600}>
      Однаковий код композиції працює <A>без вкладених case</A> для кожної перевірки.
    </At>
  </Slide>
);

/* 30 · Either: явна причина помилки */
const S30: React.FC = () => (
  <Slide title="Either: явна причина помилки">
    <Lead>
      <M>Left</M> зберігає помилку; <M>Right</M> передає успішний результат наступному монадичному кроку.
    </Lead>
    <SyntaxBox
      x={96}
      y={320}
      step={1}
      size={28}
      title="Тип Either: дві альтернативи з даними"
      lines={["data Either {e} {a} = Left {e} | Right {a}"]}
    />
    <Code
      x={96}
      y={456}
      size={28}
      step={2}
      code={`
        parsePositive :: Int -> Either String Int
        parsePositive n
          | n > 0     = Right n
          | otherwise = Left "Очікується додатне число"
        doublePositive n = do
          x <- parsePositive n
          pure (2 * x)
      `}
    />
    <Flow
      x={1030}
      y={440}
      step={3}
      gap={30}
      arrowW={175}
      items={[
        { el: <Val color={C.amber}>5</Val> },
        { el: <J v={5} label="Right" />, via: "parsePositive" },
        { el: <J v={10} label="Right" />, via: "pure (2 * x)" },
      ]}
    />
    <Flow
      x={1030}
      y={600}
      step={4}
      gap={30}
      arrowW={175}
      items={[
        { el: <Val color={C.amber}>-3</Val> },
        {
          el: (
            <Ctx label="Left" color={C.red}>
              <Val color={C.red} size={26}>
                e
              </Val>
            </Ctx>
          ),
          via: "parsePositive",
        },
        {
          el: (
            <Ctx label="Left" color={C.red}>
              <Val color={C.red} size={26}>
                e
              </Val>
            </Ctx>
          ),
          via: "pure (2 * x)",
          skip: true,
        },
      ]}
    />
    <At x={1030} y={720} w={800} step={4} delay={70} size={26} weight={600} color={C.dim} font={F.mono}>
      e = "Очікується додатне число"
    </At>
    <At x={96} y={880} w={1720} step={5} size={34} weight={600}>
      На відміну від <M>Maybe</M>, тип <M>Either e a</M> зберігає <A>інформацію про невдачу</A>.
    </At>
  </Slide>
);

/* 31 · Список як монада альтернатив */
type TN = { x: number; y: number; label: string; step: number; delay: number; color: string; parent?: number };
const TX = 1000;
const TNODES: TN[] = [
  { x: TX + 400, y: 350, label: "•", step: 1, delay: 30, color: C.faint },
  { x: TX + 200, y: 470, label: "n = 1", step: 2, delay: 0, color: C.lav, parent: 0 },
  { x: TX + 600, y: 470, label: "n = 2", step: 2, delay: 10, color: C.lav, parent: 0 },
  { x: TX + 100, y: 600, label: "'a'", step: 3, delay: 0, color: C.amber, parent: 1 },
  { x: TX + 300, y: 600, label: "'b'", step: 3, delay: 8, color: C.amber, parent: 1 },
  { x: TX + 500, y: 600, label: "'a'", step: 3, delay: 16, color: C.amber, parent: 2 },
  { x: TX + 700, y: 600, label: "'b'", step: 3, delay: 24, color: C.amber, parent: 2 },
];
const LEAVES = ["(1,'a')", "(1,'b')", "(2,'a')", "(2,'b')"];

const S31: React.FC = () => {
  const { s, lin } = useSteps();
  return (
    <Slide title="Список як монада альтернатив">
      <Lead>
        Список представляє нуль, один або багато можливих результатів. Bind об’єднує результати <A>кожного вибору</A>.
      </Lead>
      <Code
        x={96}
        y={330}
        size={32}
        step={1}
        code={`
          pairs :: [(Int, Char)]
          pairs = do
          @2   n <- [1, 2]
          @3   c <- ['a', 'b']
          @4   pure (n, c)
          @4+50 -- [(1,'a'),(1,'b'),(2,'a'),(2,'b')]
        `}
      />
      <SyntaxBox x={96} y={660} step={4} delay={70} size={26} title="Правило bind для списку" lines={["{xs} >>= {f}  =  concat (map {f} {xs})"]} />
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        {TNODES.map((n, i) => {
          if (n.parent === undefined) {
            return null;
          }
          const p = TNODES[n.parent];
          const k = lin(n.step, n.delay, 12);
          return <line key={i} x1={p.x} y1={p.y + 22} x2={mix(p.x, n.x, k)} y2={mix(p.y + 22, n.y - 22, k)} stroke={C.line} strokeWidth={3} />;
        })}
      </svg>
      {TNODES.map((n, i) => {
        const p = s(n.step, n.delay + 8, POP);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: n.x,
              top: n.y,
              transform: `translate(-50%, -50%) scale(${0.6 + 0.4 * p})`,
              opacity: clamp01(p),
            }}
          >
            <Val color={n.color} size={26}>
              {n.label}
            </Val>
          </div>
        );
      })}
      {LEAVES.map((l, i) => {
        const p = s(4, 10 + i * 8, POP);
        const x = TX + 100 + i * 200;
        return (
          <React.Fragment key={i}>
            <Arrow x1={x} y1={630} x2={x} y2={690} step={4} delay={4 + i * 8} dur={8} color={C.dim} width={3} />
            <div style={{ position: "absolute", left: x, top: 730, transform: `translate(-50%, -50%) scale(${0.6 + 0.4 * p})`, opacity: clamp01(p) }}>
              <Val size={24}>{l}</Val>
            </div>
          </React.Fragment>
        );
      })}
      <At x={96} y={880} w={1720} step={5} size={34} weight={600}>
        Порядок елементів та повторення зберігаються: список <A>не є множиною</A>.
      </At>
    </Slide>
  );
};

/* Logged a: a value plus a log; `fresh` marks entries added by the last step. */
const LoggedBox: React.FC<{ v: React.ReactNode; log: string[]; fresh?: number; vColor?: string }> = ({ v, log, fresh = log.length, vColor = C.mint }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 14,
      padding: "10px 16px",
      borderRadius: 16,
      border: `3px solid ${C.accentHi}`,
      background: "rgba(169,148,255,0.08)",
      boxSizing: "border-box",
      whiteSpace: "nowrap",
    }}
  >
    <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 24, color: C.accentHi }}>Logged</span>
    <Val color={vColor} size={26}>
      {v}
    </Val>
    <span
      style={{
        display: "inline-flex",
        flexDirection: "column",
        gap: 4,
        minWidth: 40,
        minHeight: 34,
        padding: "6px 10px",
        borderRadius: 10,
        background: C.panel2,
        borderLeft: `4px solid ${C.amber}`,
        justifyContent: "center",
      }}
    >
      {log.length === 0 ? (
        <span style={{ fontFamily: F.mono, fontWeight: 600, fontSize: 20, color: C.faint }}>[ ]</span>
      ) : (
        log.map((l, i) => (
          <span key={i} style={{ fontFamily: F.body, fontWeight: 600, fontSize: 20, color: i >= fresh ? C.amber : C.text }}>
            {l}
          </span>
        ))
      )}
    </span>
  </span>
);

/* 32 · Власний контекст Logged */
const S32: React.FC = () => (
  <Slide title="Власний контекст Logged">
    <Lead>
      Тип <M>Logged a</M> зберігає результат обчислення разом із журналом. Наступні операції мають доповнювати журнал.
    </Lead>
    <SyntaxBox
      x={96}
      y={320}
      step={1}
      title="Тип-обгортка: значення і додаткове поле"
      lines={["data {TypeName} {a} = {Constr} {a} {FieldType}", "    deriving {Class}"]}
    />
    <Code
      x={96}
      y={540}
      size={38}
      step={2}
      code={`
        data Logged a = Logged a [String]
            deriving Show
        @3 -- Logged 3 ["початок"]
      `}
    />
    <Pop x={1100} y={530} step={3} delay={20}>
      <span style={{ display: "inline-flex", zoom: 1.5 }}>
        <LoggedBox v={3} log={["початок"]} />
      </span>
    </Pop>
    <At x={1100} y={680} w={680} step={3} delay={36} size={26} weight={600} color={C.dim}>
      значення та журнал повідомлень
    </At>
    <At x={96} y={880} w={1720} step={4} size={34} weight={600}>
      Логіка журналювання <A>не повинна повторюватися</A> в кожній прикладній функції.
    </At>
  </Slide>
);

/* 33 · Logged як Functor і Applicative */
const S33: React.FC = () => (
  <Slide title="Logged як Functor і Applicative">
    <Lead>
      <M>Functor</M> змінює значення, не змінюючи журнал; <M>Applicative</M> поєднує журнали двох контекстних обчислень.
    </Lead>
    <Code
      x={96}
      y={340}
      size={28}
      step={1}
      code={`
        instance Functor Logged where
          fmap f (Logged x logs) = Logged (f x) logs
      `}
    />
    <Code
      x={96}
      y={470}
      size={28}
      step={2}
      code={`
        instance Applicative Logged where
          pure x = Logged x [[4@10~70|[]]]
          Logged f l1 <*> Logged x l2 =
            Logged (f x) (l1 ++ l2)
      `}
    />
    <Flow
      x={1000}
      y={340}
      step={1}
      delay={30}
      gap={30}
      arrowW={140}
      items={[{ el: <LoggedBox v={3} log={["старт"]} /> }, { el: <LoggedBox v={4} log={["старт"]} />, via: "fmap (+ 1)" }]}
    />
    <div style={{ position: "absolute", left: 0, top: 0, zoom: 1.25 }}>
      <Flow
        x={77}
        y={548}
        step={3}
        gap={30}
        arrowW={100}
        items={[
          { el: <LoggedBox v="(+ 1)" vColor={C.amber} log={["лог f"]} /> },
          { el: <LoggedBox v={3} log={["лог x"]} />, via: "<*>" },
          { el: <LoggedBox v={4} log={["лог f", "лог x"]} fresh={2} />, via: "=" },
        ]}
      />
    </div>
    <At x={96} y={880} w={1720} step={4} size={34} weight={600}>
      Порожній список – <A>нейтральний елемент</A> для конкатенації: <M>pure</M> не додає повідомлень.
    </At>
  </Slide>
);

/* 34 · Монада Logged та правило bind */
const S34: React.FC = () => {
  const { s } = useSteps();
  const join = s(3, 70);
  const seg = (txt: string, color: string) => (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        height: 40,
        padding: "0 16px",
        borderRadius: 8,
        background: `${color}26`,
        border: `2px solid ${color}`,
        fontFamily: F.mono,
        fontWeight: 700,
        fontSize: 24,
        color,
      }}
    >
      {txt}
    </span>
  );
  const row = (y: number, p: number, children: React.ReactNode) => (
    <div style={{ position: "absolute", left: 1000, top: y, display: "flex", alignItems: "center", gap: 14, opacity: clamp01(p), transform: `translateY(${(1 - p) * 16}px)` }}>
      {children}
    </div>
  );
  const name = (t: string) => <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 26, color: C.accentHi, width: 110 }}>{t}</span>;
  return (
    <Slide title="Монада Logged та правило bind">
      <Lead>
        <M>Monad</M> має визначати, як накопичений журнал переходить від одного залежного кроку до наступного.
      </Lead>
      <SyntaxBox x={96} y={330} w={820} step={1} title="Локальне означення" lines={["let {pattern} = {expr}", "in {body}"]} />
      <Code
        x={96}
        y={524}
        size={32}
        step={2}
        code={`
          instance Monad Logged where
            Logged x [[3~50|l1]] >>= f =
              let Logged y [[3@24~50|l2]] = f x
              in Logged y ([[3@70~60|l1 ++ l2]])
        `}
      />
      {row(
        330,
        s(3, 0),
        <>
          {name("крок 1")}
          <Val color={C.lav} size={26}>
            x
          </Val>
          {seg("l1", C.amber)}
        </>,
      )}
      <Arrow x1={1050} y1={390} x2={1050} y2={450} step={3} delay={16} dur={10} color={C.dim} width={3} />
      <At x={1070} y={400} step={3} delay={20} size={24} weight={700} color={C.amber} font={F.mono}>
        f x
      </At>
      {row(
        470,
        s(3, 24),
        <>
          {name("крок 2")}
          <Val size={26}>y</Val>
          {seg("l2", C.mint)}
        </>,
      )}
      <Arrow x1={1050} y1={530} x2={1050} y2={590} step={3} delay={56} dur={10} color={C.dim} width={3} />
      {row(
        610,
        join,
        <>
          {name("разом")}
          <Val size={26}>y</Val>
          <span style={{ display: "inline-flex", gap: mix(40, 4, join) }}>
            {seg("l1", C.amber)}
            {seg("l2", C.mint)}
          </span>
        </>,
      )}
      <At x={96} y={880} w={1720} step={4} size={34} weight={600}>
        Правило композиції зберігає <A>порядок повідомлень</A> та об’єднує їх через асоціативну операцію <M>++</M>.
      </At>
    </Slide>
  );
};

/* 35 · Послідовність обчислень із журналом */
const S35: React.FC = () => (
  <Slide title="Послідовність обчислень із журналом">
    <Lead>
      Прикладні функції описують лише свою операцію та створюють повідомлення; накопичення виконує <M>{">>="}</M>.
    </Lead>
    <Code
      x={96}
      y={330}
      size={30}
      step={1}
      code={`
        addOne x       = Logged (x + 1) ["Додано 1"]
        doubleLogged x = Logged (2 * x) ["Помножено на 2"]
        exampleLogged =
            pure 3 >>= addOne >>= doubleLogged
        @3+60 -- Logged 8 ["Додано 1", "Помножено на 2"]
      `}
    />
    <div style={{ position: "absolute", left: 0, top: 0, zoom: 1.2 }}>
      <Flow
        x={80}
        y={540}
        step={2}
        gap={50}
        arrowW={170}
        items={[
          { el: <LoggedBox v={3} log={[]} /> },
          { el: <LoggedBox v={4} log={["Додано 1"]} fresh={0} />, via: "addOne" },
          { el: <LoggedBox v={8} log={["Додано 1", "Помножено на 2"]} fresh={1} />, via: "doubleLogged", at: [3, 10] },
        ]}
      />
    </div>
    <At x={96} y={880} w={1720} step={4} size={34} weight={600}>
      Один інтерфейс <M>Monad</M> – різна семантика: <A>припинення</A>, <A>перебір</A> або <A>журналювання</A>.
    </At>
  </Slide>
);

/* 36 · IO: взаємодія із зовнішнім світом */
const NAME = "Тарас";

const S36: React.FC = () => {
  const { s, t } = useSteps();
  const typed = Math.max(0, Math.min(NAME.length, Math.floor(t(3, 50) / 5)));
  const caret = Math.floor(t(3, 0) / 12) % 2 === 0;
  const line = (txt: React.ReactNode, p: number, color = C.text) => (
    <div style={{ fontFamily: F.mono, fontWeight: 600, fontSize: 30, color, opacity: clamp01(p), whiteSpace: "pre", height: 46 }}>{txt}</div>
  );
  return (
    <Slide title="IO: взаємодія із зовнішнім світом">
      <Lead>
        <M>IO a</M> описує дію, яка може взаємодіяти із зовнішнім середовищем і після виконання повернути значення типу <M>a</M>.
      </Lead>
      <Code
        x={96}
        y={340}
        size={30}
        step={1}
        code={`
          greeting :: String -> String
          greeting name = "Вітаю, " ++ name

          main :: IO ()
          main = do
            [[3@10~40|putStrLn "Уведіть ім’я:"]]
            [[3@50~50|name <- getLine]]
            [[3@110~50|putStrLn (greeting name)]]
        `}
      />
      <Code
        x={96}
        y={750}
        size={26}
        step={2}
        style={{ opacity: 0.85 }}
        code={`
          putStrLn :: String -> IO ()
          getLine  :: IO String
        `}
      />
      <div
        style={{
          position: "absolute",
          left: 1020,
          top: 350,
          width: 800,
          height: 330,
          borderRadius: 18,
          border: `2px solid ${C.line}`,
          background: "#11141d",
          boxSizing: "border-box",
          padding: "70px 30px 20px",
          opacity: clamp01(s(3, 0)),
        }}
      >
        <div style={{ position: "absolute", left: 0, top: 0, right: 0, height: 46, borderBottom: `1px solid ${C.line}`, display: "flex", alignItems: "center", paddingLeft: 24 }}>
          <span style={{ fontFamily: F.mono, fontSize: 20, fontWeight: 600, color: C.faint }}>runghc Main.hs</span>
        </div>
        {line("Уведіть ім’я:", s(3, 16))}
        {line(
          <>
            <span style={{ color: C.amber }}>{NAME.slice(0, typed)}</span>
            <span style={{ color: C.amber, opacity: typed < NAME.length && caret && t(3, 30) > 0 ? 1 : 0 }}>▏</span>
          </>,
          s(3, 30),
        )}
        {line("Вітаю, " + NAME, s(3, 120), C.mint)}
      </div>
      <At x={96} y={880} w={1720} step={4} size={34} weight={600}>
        <M>greeting</M> залишається <A>чистою функцією</A>, а <M>main</M> описує послідовність IO-дій.
      </At>
    </Slide>
  );
};

/* 37 · State: стан без мутації */
const S37: React.FC = () => (
  <Slide title="State: стан без мутації">
    <Lead>
      <M>State s a</M> моделює обчислення як перетворення стану <M>s</M>, яке породжує результат <M>a</M> і новий стан <M>s</M>.
    </Lead>
    <SyntaxBox x={96} y={330} w={820} step={1} title="Синонім типу" lines={["type {Name} {params} = {existingType}"]} />
    <Code
      x={96}
      y={470}
      size={30}
      step={2}
      code={`
        type StateStep s a = s -> (a, s)
        increase :: StateStep Int Int
        increase state = (state, state + 1)
        -- increase 5 = (5, 6)
      `}
    />
    <At x={1000} y={330} step={3} size={28} weight={700} color={C.accentHi}>
      Те саме з монадою State
    </At>
    <Code
      x={1000}
      y={380}
      size={30}
      step={3}
      delay={10}
      code={`
        incS :: State Int Int
        incS = do
          n <- get
          put (n + 1)
          pure n
        -- runState incS 5 = (5, 6)
      `}
    />
    <Flow
      x={96}
      y={720}
      step={4}
      gap={36}
      arrowW={190}
      items={[
        { el: <Val color={C.lav}>s = 5</Val> },
        { el: <Val color={C.lav}>s = 6</Val>, via: "incS ⇒ 5" },
        { el: <Val color={C.lav}>s = 7</Val>, via: "incS ⇒ 6" },
      ]}
    />
    <Code x={1000} y={740} size={28} step={4} delay={80} code={`runState (incS >> incS) 5  -- (6, 7)`} />
    <At x={96} y={880} w={1720} step={5} size={34} weight={600}>
      <M>get</M> і <M>put</M> дозволяють компонувати кроки зі станом, <A>не змінюючи</A> попереднього значення.
    </At>
  </Slide>
);

export const s6Slides: SlideDef[] = [
  { id: "maybe", title: "Maybe", steps: [45, 70, 60, 110, 120, 55], C: S29 },
  { id: "either", title: "Either", steps: [45, 50, 60, 110, 120, 55], C: S30 },
  { id: "list", title: "Список", steps: [55, 60, 45, 60, 130, 55], C: S31 },
  { id: "logged", title: "Logged", steps: [45, 50, 50, 70, 55], C: S32 },
  { id: "logged-ap", title: "Logged: Functor і Applicative", steps: [45, 110, 60, 130, 55], C: S33 },
  { id: "logged-bind", title: "Logged: bind", steps: [45, 50, 60, 150, 55], C: S34 },
  { id: "logged-seq", title: "Журнал обчислень", steps: [45, 60, 130, 130, 55], C: S35 },
  { id: "io", title: "IO", steps: [45, 90, 50, 180, 55], C: S36 },
  { id: "state", title: "State", steps: [45, 50, 60, 90, 120, 55], C: S37 },
];
