/**
 * Biomarker catalog the server advertises via `list_supported_biomarkers`.
 * Reference ranges only — NO patient data. Curated from the PRISM clinical pillars
 * (functions/scoring/wellnessScore.js) + the public methodology page.
 *
 * TODO before GA: sync exactly with the canonical `BIOMARKER_CATALOG` in the app
 * (45 markers per the synthetic-lab harness). This v0 ships a representative core set.
 */
export interface CatalogEntry {
  name: string;
  unit: string;
  pillar: "Metabolic" | "Cardiovascular" | "Hormonal" | "Inflammation & Immunity" | "Foundational Health";
  refLow?: number;
  refHigh?: number;
}

export const BIOMARKER_CATALOG: CatalogEntry[] = [
  // Metabolic
  { name: "Hemoglobin A1c", unit: "%", pillar: "Metabolic", refLow: 4.0, refHigh: 5.6 },
  { name: "Fasting Glucose", unit: "mg/dL", pillar: "Metabolic", refLow: 70, refHigh: 99 },
  { name: "Fasting Insulin", unit: "uIU/mL", pillar: "Metabolic", refLow: 2.6, refHigh: 24.9 },
  { name: "Triglycerides", unit: "mg/dL", pillar: "Metabolic", refLow: 0, refHigh: 150 },
  // Cardiovascular
  { name: "ApoB", unit: "mg/dL", pillar: "Cardiovascular", refLow: 0, refHigh: 90 },
  { name: "Lp(a)", unit: "nmol/L", pillar: "Cardiovascular", refLow: 0, refHigh: 75 },
  { name: "LDL Cholesterol", unit: "mg/dL", pillar: "Cardiovascular", refLow: 0, refHigh: 100 },
  { name: "HDL Cholesterol", unit: "mg/dL", pillar: "Cardiovascular", refLow: 40, refHigh: 60 },
  { name: "Total Cholesterol", unit: "mg/dL", pillar: "Cardiovascular", refLow: 125, refHigh: 200 },
  // Hormonal
  { name: "TSH", unit: "uIU/mL", pillar: "Hormonal", refLow: 0.4, refHigh: 4.5 },
  { name: "Free T4", unit: "ng/dL", pillar: "Hormonal", refLow: 0.8, refHigh: 1.8 },
  { name: "Free T3", unit: "pg/mL", pillar: "Hormonal", refLow: 2.3, refHigh: 4.2 },
  { name: "Testosterone", unit: "ng/dL", pillar: "Hormonal" },
  { name: "Estradiol", unit: "pg/mL", pillar: "Hormonal" },
  { name: "DHEA-S", unit: "ug/dL", pillar: "Hormonal" },
  { name: "Cortisol", unit: "ug/dL", pillar: "Hormonal", refLow: 5, refHigh: 23 },
  // Inflammation & Immunity
  { name: "hs-CRP", unit: "mg/L", pillar: "Inflammation & Immunity", refLow: 0, refHigh: 3.0 },
  { name: "Homocysteine", unit: "umol/L", pillar: "Inflammation & Immunity", refLow: 0, refHigh: 15 },
  { name: "ESR", unit: "mm/hr", pillar: "Inflammation & Immunity", refLow: 0, refHigh: 20 },
  { name: "Omega-3 Index", unit: "%", pillar: "Inflammation & Immunity", refLow: 8, refHigh: 12 },
  // Foundational Health
  { name: "eGFR", unit: "mL/min", pillar: "Foundational Health", refLow: 60, refHigh: 120 },
  { name: "Creatinine", unit: "mg/dL", pillar: "Foundational Health", refLow: 0.6, refHigh: 1.3 },
  { name: "ALT", unit: "U/L", pillar: "Foundational Health", refLow: 0, refHigh: 44 },
  { name: "AST", unit: "U/L", pillar: "Foundational Health", refLow: 0, refHigh: 40 },
  { name: "Vitamin D 25-OH", unit: "ng/mL", pillar: "Foundational Health", refLow: 30, refHigh: 100 },
  { name: "Vitamin B12", unit: "pg/mL", pillar: "Foundational Health", refLow: 200, refHigh: 900 },
  { name: "Ferritin", unit: "ng/mL", pillar: "Foundational Health", refLow: 30, refHigh: 400 },
  { name: "Hemoglobin", unit: "g/dL", pillar: "Foundational Health", refLow: 13.5, refHigh: 17.5 },
];
