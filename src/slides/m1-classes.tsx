import React from "react";
import { C, F } from "../deck/theme";
import { POP, SlideDef, useSteps } from "../deck/steps";
import { Code } from "../deck/Code";
import { A, Arrow, At, Chip, Lead, M, Slide } from "../deck/ui";
import { clamp01 } from "./common";
import { Pop, SyntaxBox, Val } from "./kit";

const Head: React.FC<{ x: number; y: number; step: number; delay?: number; color?: string; children: React.ReactNode }> = ({
  x,
  y,
  step,
  delay = 0,
  color = C.accentHi,
  children,
}) => (
  <At x={x} y={y} step={step} delay={delay} size={30} weight={700} color={color}>
    {children}
  </At>
);

/* 3 · Параметричний та обмежений поліморфізм */
const S3: React.FC = () => (
  <Slide title="Параметричний та обмежений поліморфізм">
    <Lead>
      Параметричний поліморфізм не потребує знань про конкретний тип. Для порівняння значень потрібна <A>додаткова вимога</A> до
      типу.
    </Lead>
    <Head x={96} y={340} step={1}>
      Без обмеження
    </Head>
    <Code
      x={96}
      y={396}
      size={36}
      step={1}
      delay={6}
      code={`
        id :: a -> a
        id x = x

        @1+40 id 5        -- 5
        @1+48 id "так"    -- "так"
        @1+56 id True     -- True
      `}
    />
    <Head x={980} y={340} step={2}>
      З обмеженням
    </Head>
    <SyntaxBox x={980} y={392} w={840} step={2} delay={6} lines={["{name} :: {Class} {a} => {type}"]} />
    <Code
      x={980}
      y={530}
      size={36}
      step={2}
      delay={40}
      code={`
        same :: [[2@70~70|Eq a =>]] a -> a -> Bool
        same x y = x == y

        @3 same 3 3      -- True
        @3+10 same 'a' 'b'  -- False
        @3+40 same id id    [[!3@50|-- помилка: немає Eq]]
      `}
    />
    <At x={96} y={880} w={1720} step={4} size={34} weight={600}>
      <M>Eq a</M> визначає вимогу: для типу <M>a</M> мають бути доступні операції порівняння на рівність. Функції такої операції не
      мають.
    </At>
  </Slide>
);

/* 4 · Клас типів та його екземпляри */
const S4: React.FC = () => (
  <Slide title="Клас типів та його екземпляри">
    <Lead>
      <A>Клас типів</A> (type class) – механізм визначення набору операцій, які можуть мати окремі реалізації для різних типів.
    </Lead>
    <SyntaxBox
      x={96}
      y={340}
      w={820}
      step={1}
      title="Оголошення класу"
      lines={["class {ClassName} {a} where", "    {method1} :: {type1}", "    {method2} :: {type2}"]}
    />
    <Code
      x={980}
      y={350}
      size={34}
      step={1}
      delay={30}
      code={`
        class Eq a where
            (==) :: a -> a -> Bool
            (/=) :: a -> a -> Bool
            x /= y = not (x == y)  -- типово
      `}
    />
    <SyntaxBox
      x={96}
      y={600}
      w={820}
      step={2}
      title="Оголошення екземпляра"
      lines={["instance {ClassName} {TypeName} where", "    {method1} = {implementation}"]}
    />
    <Code
      x={980}
      y={610}
      size={34}
      step={2}
      delay={30}
      code={`
        instance Eq Bool where
            True  == True  = True
            False == False = True
            _     == _     = False
      `}
    />
    <At x={96} y={870} w={1720} step={3} size={34} weight={600}>
      <M>class</M> визначає спільні операції; <M>instance</M> задає їх реалізацію для певного типу. Операція <M>/=</M> тут бере
      реалізацію за замовчуванням.
    </At>
  </Slide>
);

/* 5 · Стандартні класи типів */
const CLASSES = [
  { name: "Eq", desc: "перевірка рівності та нерівності", ops: "(==), (/=)" },
  { name: "Ord", desc: "порівняння та впорядкування", ops: "(<), compare, max" },
  { name: "Show", desc: "отримання текстового представлення", ops: "show :: a -> String" },
  { name: "Read", desc: "розбір текстового представлення", ops: "read :: String -> a" },
  { name: "Num", desc: "спільні числові операції", ops: "(+), (*), negate" },
];

const S5: React.FC = () => {
  const { s } = useSteps();
  const Y0 = 300;
  const GAP = 88;
  return (
    <Slide title="Стандартні класи типів">
      <Lead>Класи типів установлюють вимоги до поведінки значень.</Lead>
      {CLASSES.map((c, i) => {
        const p = s(1, i * 8, POP);
        const y = Y0 + i * GAP;
        const ord = c.name === "Ord" || c.name === "Eq" ? s(2, 10) : 0;
        return (
          <div
            key={c.name}
            style={{
              position: "absolute",
              left: 150,
              top: y,
              display: "flex",
              alignItems: "center",
              opacity: clamp01(p),
              transform: `translateX(${(1 - p) * -30}px)`,
            }}
          >
            <Chip size={32} color={C.lav} border={ord > 0.05 ? C.amber : C.line} style={{ width: 150, boxSizing: "border-box" }}>
              {c.name}
            </Chip>
            <div style={{ width: 760, marginLeft: 40, fontFamily: F.body, fontSize: 34, fontWeight: 600, color: C.text }}>{c.desc}</div>
            <div style={{ fontFamily: F.mono, fontSize: 30, fontWeight: 600, color: C.mint, whiteSpace: "pre", fontVariantLigatures: "none" }}>
              {c.ops}
            </div>
          </div>
        );
      })}
      <Arrow x1={140} y1={Y0 + GAP + 32} x2={140} y2={Y0 + 40} step={2} delay={14} dur={16} color={C.amber} width={4} curve={-34} />
      <SyntaxBox x={96} y={760} step={2} delay={24} title="Клас із суперкласом" lines={["class {Super} {a} => {ClassName} {a} where"]} />
      <Code x={1000} y={800} size={36} step={2} delay={50} code={`class [[2@70~60|Eq a]] => Ord a where`} />
      <At x={96} y={910} w={1720} step={3} size={32} weight={600}>
        <M>Ord</M> має <M>Eq</M> як суперклас: тип з упорядкуванням повинен також підтримувати рівність.
      </At>
    </Slide>
  );
};

/* 6 · Автоматичне виведення екземплярів */
const S6: React.FC = () => {
  const { s } = useSteps();
  const cons = ["Low", "Medium", "High"];
  return (
    <Slide title="Автоматичне виведення екземплярів">
      <Lead>
        Для багатьох алгебраїчних типів екземпляри стандартних класів отримують за допомогою <M>deriving</M>.
      </Lead>
      <SyntaxBox
        x={96}
        y={320}
        step={1}
        title="Тип-перелік і автоматичні екземпляри"
        lines={["data {TypeName} = {Constr1} | {Constr2} | …", "    deriving ({Class1}, {Class2}, …)"]}
      />
      <Code
        x={96}
        y={530}
        size={40}
        step={2}
        code={`
          data Priority = Low | Medium | High
              deriving (Eq, Ord, Show)
        `}
      />
      <At x={1180} y={470} step={2} delay={30} size={26} weight={600} color={C.dim}>
        порядок оголошення
      </At>
      <div style={{ position: "absolute", left: 1180, top: 520, display: "flex", alignItems: "center", gap: 14 }}>
        {cons.map((c, i) => {
          const p = s(2, 34 + i * 8, POP);
          const lt = s(3, 4 + i * 6);
          return (
            <React.Fragment key={c}>
              {i > 0 && (
                <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 40, color: C.amber, opacity: lt }}>{"<"}</span>
              )}
              <span style={{ opacity: clamp01(p), transform: `scale(${0.7 + 0.3 * p})`, display: "inline-flex" }}>
                <Chip size={34} color={C.lav} border={C.line}>
                  {c}
                </Chip>
              </span>
            </React.Fragment>
          );
        })}
      </div>
      <Code
        x={96}
        y={700}
        size={36}
        step={3}
        delay={20}
        stagger={10}
        code={`
          High > Medium                -- True
          maximum [Low, High, Medium]  -- High
          show Low                     -- "Low"
        `}
      />
      <At x={96} y={890} w={1720} step={4} size={34} weight={600}>
        Автоматичний <M>Ord</M> відповідає <A>порядку конструкторів</A>. Він доречний лише тоді, коли цей порядок має зміст.
      </At>
    </Slide>
  );
};

/* 7 · Власний клас типів */
const Fields: React.FC<{ x: number; y: number; step: number; delay?: number; ctor: string; fields: { v: string; cap: string }[] }> = ({
  x,
  y,
  step,
  delay = 0,
  ctor,
  fields,
}) => (
  <Pop x={x} y={y} step={step} delay={delay}>
    <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
      <div style={{ height: 48, display: "flex", alignItems: "center", fontFamily: F.mono, fontWeight: 700, fontSize: 34, color: C.lav }}>{ctor}</div>
      {fields.map((f, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <Val color={i === 0 ? C.amber : C.orange}>{f.v}</Val>
          <span style={{ fontFamily: F.body, fontSize: 22, fontWeight: 600, color: C.dim }}>{f.cap}</span>
        </div>
      ))}
    </div>
  </Pop>
);

const S7: React.FC = () => (
  <Slide title="Власний клас типів">
    <Lead>Однакова операція може мати різну реалізацію для різних предметних типів – без спільної структури полів.</Lead>
    <Code
      x={96}
      y={350}
      size={38}
      step={1}
      code={`
        class Describable a where
            describe :: a -> String
      `}
    />
    <SyntaxBox x={980} y={340} step={2} size={26} title="Тип із полями" lines={["data {TypeName} = {Constr} {FieldType1} {FieldType2} …"]} />
    <Code
      x={96}
      y={540}
      size={38}
      step={2}
      delay={30}
      code={`
        data Book  = Book String Int
        data Movie = Movie String Int
      `}
    />
    <Fields x={980} y={500} step={3} ctor="Book" fields={[{ v: '"SICP"', cap: "назва" }, { v: "657", cap: "сторінки" }]} />
    <Fields x={980} y={620} step={3} delay={14} ctor="Movie" fields={[{ v: '"Up"', cap: "назва" }, { v: "96", cap: "хвилини" }]} />
    <At x={96} y={800} w={1720} step={4} size={34} weight={600}>
      Клас <M>Describable</M> визначає лише операцію <M>describe</M>; її реалізації залежать від типу.
    </At>
    <At x={96} y={870} w={1720} step={4} delay={16} size={30} weight={400} color={C.dim}>
      Поля мають однакові типи, але різний зміст: сторінки книги та тривалість фільму.
    </At>
  </Slide>
);

/* 8 · Екземпляри користувацького класу */
const S8: React.FC = () => (
  <Slide title="Екземпляри користувацького класу">
    <Lead>
      Екземпляр конкретизує спільний інтерфейс; поліморфна функція використовує лише <A>обмеження класу</A>.
    </Lead>
    <Head x={96} y={320} step={1}>
      Для Book
    </Head>
    <Code
      x={96}
      y={372}
      size={32}
      step={1}
      delay={6}
      code={`
        instance Describable [[4@20~80|Book]] where
            describe (Book title pages) =
              title ++ ", " ++
              show pages ++ " стор."
      `}
    />
    <Head x={980} y={320} step={2}>
      Для Movie
    </Head>
    <Code
      x={980}
      y={372}
      size={32}
      step={2}
      delay={6}
      code={`
        instance Describable [[5@20~80|Movie]] where
            describe (Movie title mins) =
              title ++ ", " ++
              show mins ++ " хв."
      `}
    />
    <Code
      x={96}
      y={630}
      size={32}
      step={3}
      code={`
        describeAny :: [[3@30~60|Describable a =>]] a -> String
        describeAny x = "Опис: " ++ describe x
        @4 describeAny (Book "SICP" 657)  -- "Опис: SICP, 657 стор."
        @5 describeAny (Movie "Up" 96)    -- "Опис: Up, 96 хв."
      `}
    />
    <At x={96} y={880} w={1720} step={5} delay={50} size={32} weight={600}>
      <M>describeAny</M> не знає про поля <M>Book</M> чи <M>Movie</M>: вона спирається лише на операцію <M>describe</M>.
    </At>
  </Slide>
);

export const s1Slides: SlideDef[] = [
  { id: "poly", title: "Обмежений поліморфізм", steps: [45, 90, 120, 90, 55], C: S3 },
  { id: "class", title: "Клас типів", steps: [45, 90, 90, 55], C: S4 },
  { id: "std-classes", title: "Стандартні класи типів", steps: [40, 80, 120, 55], C: S5 },
  { id: "deriving", title: "deriving", steps: [45, 50, 80, 80, 55], C: S6 },
  { id: "describable", title: "Власний клас типів", steps: [45, 50, 80, 50, 70], C: S7 },
  { id: "instances", title: "Екземпляри класу", steps: [45, 60, 60, 80, 80, 110], C: S8 },
];
