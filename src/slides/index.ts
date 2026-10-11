import type { SlideDef } from "../deck/steps";
import { agendaSlide, introSlides } from "./intro";
import { s1Slides } from "./m1-classes";
import { s2Slides } from "./m2-functors";
import { s3Slides } from "./m3-category";
import { s4Slides } from "./m4-applicative";
import { s5Slides } from "./m5-monad";
import { s6Slides } from "./m6-examples";
import { questionsSlide, s7Slides } from "./m7-practice";
import { outroSlide } from "./outro";

export const SLIDES: SlideDef[] = [
  ...introSlides,
  ...s1Slides,
  agendaSlide(1),
  ...s2Slides,
  agendaSlide(2),
  ...s3Slides,
  agendaSlide(3),
  ...s4Slides,
  agendaSlide(4),
  ...s5Slides,
  agendaSlide(5),
  ...s6Slides,
  agendaSlide(6),
  ...s7Slides,
  questionsSlide,
  outroSlide,
];
