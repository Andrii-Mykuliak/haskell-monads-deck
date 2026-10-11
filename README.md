# Лекція 7 – Класи типів, функтори та монади (motion deck)

A step-by-step presentation built with Remotion. Each slide is a Remotion composition;
the browser app plays each step's animation and pauses until you click.

Live: https://andrii-mykuliak.github.io/haskell-monads-deck/

## Run

```bash
npm install
npm run dev        # open the printed URL, press f for fullscreen
```

## Controls

| Key | Action |
|---|---|
| → / Space / PgDn / Enter / click | next step (the first press finishes a step that is still animating) |
| ← / PgUp / right-click | previous step (jumps, no reverse animation) |
| number + Enter | go to slide N |
| Home / End | first / last slide |
| r | replay the current step |
| f | fullscreen (inside an iframe without fullscreen rights it opens the deck in a new tab) |
| h | slide / step counter |
| ? | help |
| l | laser pointer (red dot with a fading trail) |
| s | spotlight: dims everything except a circle around the cursor (mouse wheel changes its size) |
| d | pen: clicks draw instead of advancing; move with the keyboard or a clicker |
| m | highlighter: a thick stroke that fades after ~2 s |
| 1–4 | ink colour while the pen or highlighter is on (red, yellow, mint, white) |
| c | clear drawings (they also clear when the slide changes) |
| b / w | black / white screen |
| Esc | turn off every tool and screen |

The same tools are on the toolbar at the bottom of the screen (hover a button to see its shortcut).
The progress bar at the very bottom can be dragged; it previews the slide you are about to jump to.
A fullscreen button appears when the pointer is near the bottom-right corner.

The URL hash (`#12`) holds the current slide, so a reload returns to it.

## Editing

- `src/slides/*.tsx`: one file per lecture section. Each slide is a `SlideDef` with
  `steps: number[]`, the frame length of each step (30 fps). Step 0 plays automatically.
- Inside a slide, `useSteps()` returns `s(step, delay)` (a spring from 0 to 1) and `t(step)` (frames elapsed).
- `<Code>` highlights Haskell. Lines can reveal on their own step with `@n` / `@n+delay`, and inline
  markers exist: `[[n|x]]` highlight, `[[+n|x]]` grow in, `[[-n|x]]` strike, `[[.n|x]]` dim,
  `[[!n|x]]` error; add `@d` for a delay and `~d` to set how long a highlight lasts.
- `src/slides/kit.tsx`:
  - `<SyntaxBox>` shows the general form of a construct before its first concrete use; in its
    lines `{Name}` marks a metavariable (amber italic) and `--` starts a comment;
  - `<Ctx>` draws a value in a context (`Just 5`, dashed for `Nothing`), `<Val>` a plain value;
  - `<Flow>` chains values with labelled arrows (`skip` draws a step that is not executed).
- `npm run studio`: open every slide in Remotion Studio to scrub its frames.
- `npm run shots`: render a PNG of every step to `out/shots` (quick visual check).

## Source

Built from `Лекція_7.pptx` (42 slides) and `Лекція_7_2026.docx`. Added on top of the PPTX: the epigraph
(Saunders Mac Lane, «Categories for the Working Mathematician», 1971) with a monoid next to η and μ, a
general-syntax box for every new construct (`class`, `instance`, `deriving`, parameterised and recursive
`data`, constraints, kinds, `<$>`, `<*>`, `>>=`, `>>`, `do`, guards, `let … in`, `type`), animated value
flows for `Maybe`, `Either`, the list monad, `Logged`, `IO` and `State`, and a closing slide where `Maybe`
runs as a two-track railway.
