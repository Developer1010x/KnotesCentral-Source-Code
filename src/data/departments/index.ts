import type { Department } from "../types";
import { cseIseAiml } from "./cse-ise-aiml";
import { eee } from "./eee";
import { aerospace } from "./aerospace";
import { mech } from "./mech";
import { iem } from "./iem";
import { allEngineering } from "./all-engineering";
import { ece } from "./ece";
import { chemical } from "./chemical";
import { civil } from "./civil";
import { biotech } from "./biotech";
import { ei } from "./ei";
import { miscellaneous } from "./miscellaneous";
import { pyqp } from "./pyqp";
import { y1stYear } from "./1st-year";
import { maths } from "./maths";
import { megaAccess } from "./megaaccess";

export const departments: Department[] = [
  cseIseAiml,
  eee,
  aerospace,
  mech,
  iem,
  allEngineering,
  ece,
  chemical,
  civil,
  biotech,
  ei,
  miscellaneous,
  pyqp,
  y1stYear,
  maths,
  megaAccess,
];
