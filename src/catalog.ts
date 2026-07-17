/**
 * Biomarker catalog the server advertises via `list_supported_biomarkers`.
 * Reference ranges only — NO patient data.
 *
 * SOURCE OF TRUTH: synced from the app's canonical BIOMARKER_DEFS in
 * functions/scoring/wellnessScore.js (2026-07-17). Reference ranges = the clinical
 * (standard-lab-normal) range from that file; NO values are invented here.
 * Specialized NutrEval organic-acid urine metabolites (mmol/mol creatinine) and
 * derived markers (e.g., HOMA-IR) are intentionally excluded — they are not useful
 * for agent-side quick analysis. 51 standard blood/serum markers.
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
  { name: "Fasting Glucose", unit: "mg/dL", pillar: "Metabolic", refLow: 70, refHigh: 99 },
  { name: "HbA1c", unit: "%", pillar: "Metabolic", refHigh: 5.7 },
  { name: "Fasting Insulin", unit: "\u00b5IU/mL", pillar: "Metabolic", refHigh: 15 },
  { name: "Triglycerides", unit: "mg/dL", pillar: "Metabolic", refHigh: 150 },
  { name: "Uric Acid", unit: "mg/dL", pillar: "Metabolic", refLow: 2.5, refHigh: 7 },
  // Cardiovascular
  { name: "ApoB", unit: "mg/dL", pillar: "Cardiovascular", refHigh: 100 },
  { name: "LDL-C", unit: "mg/dL", pillar: "Cardiovascular", refHigh: 130 },
  { name: "Lp(a)", unit: "nmol/L", pillar: "Cardiovascular", refHigh: 75 },
  { name: "HDL-C", unit: "mg/dL", pillar: "Cardiovascular", refLow: 40 },
  { name: "Total Cholesterol", unit: "mg/dL", pillar: "Cardiovascular", refLow: 150, refHigh: 240 },
  // Hormonal
  { name: "TSH", unit: "mIU/L", pillar: "Hormonal", refLow: 0.4, refHigh: 4.5 },
  { name: "Total Testosterone", unit: "ng/dL", pillar: "Hormonal", refLow: 300 },
  { name: "Free Testosterone", unit: "ng/dL", pillar: "Hormonal", refLow: 9 },
  { name: "DHEA-S", unit: "\u00b5g/dL", pillar: "Hormonal", refLow: 80 },
  { name: "Free T3", unit: "pg/mL", pillar: "Hormonal", refLow: 2.3, refHigh: 4.2 },
  { name: "Free T4", unit: "ng/dL", pillar: "Hormonal", refLow: 0.8, refHigh: 1.8 },
  { name: "Estradiol", unit: "pg/mL", pillar: "Hormonal", refLow: 10, refHigh: 50 },
  { name: "SHBG", unit: "nmol/L", pillar: "Hormonal", refLow: 10, refHigh: 57 },
  { name: "Cortisol", unit: "\u00b5g/dL", pillar: "Hormonal", refLow: 6, refHigh: 23 },
  // Inflammation & Immunity
  { name: "hsCRP", unit: "mg/L", pillar: "Inflammation & Immunity", refHigh: 3 },
  { name: "Homocysteine", unit: "\u00b5mol/L", pillar: "Inflammation & Immunity", refHigh: 15 },
  { name: "Omega-3 Index", unit: "%", pillar: "Inflammation & Immunity", refLow: 4 },
  { name: "Fibrinogen", unit: "mg/dL", pillar: "Inflammation & Immunity", refHigh: 400 },
  { name: "IL-6", unit: "pg/mL", pillar: "Inflammation & Immunity", refHigh: 3.5 },
  { name: "WBC", unit: "\u00d710\u00b3/\u00b5L", pillar: "Inflammation & Immunity", refLow: 3.5, refHigh: 11 },
  { name: "Platelets", unit: "\u00d710\u00b3/\u00b5L", pillar: "Inflammation & Immunity", refLow: 150, refHigh: 400 },
  { name: "ANA", unit: "titer", pillar: "Inflammation & Immunity", refHigh: 80 },
  { name: "anti-dsDNA", unit: "IU/mL", pillar: "Inflammation & Immunity", refHigh: 30 },
  { name: "C3", unit: "mg/dL", pillar: "Inflammation & Immunity", refLow: 75 },
  { name: "C4", unit: "mg/dL", pillar: "Inflammation & Immunity", refLow: 8 },
  { name: "anti-Sm", unit: "AU/mL", pillar: "Inflammation & Immunity", refHigh: 40 },
  { name: "anti-Ro (SSA)", unit: "AU/mL", pillar: "Inflammation & Immunity", refHigh: 40 },
  { name: "anti-La (SSB)", unit: "AU/mL", pillar: "Inflammation & Immunity", refHigh: 40 },
  { name: "ESR", unit: "mm/hr", pillar: "Inflammation & Immunity", refHigh: 40 },
  // Foundational Health
  { name: "eGFR", unit: "mL/min/1.73m\u00b2", pillar: "Foundational Health", refLow: 60 },
  { name: "Vitamin D", unit: "ng/mL", pillar: "Foundational Health", refLow: 30, refHigh: 100 },
  { name: "Hemoglobin", unit: "g/dL", pillar: "Foundational Health", refLow: 13.5, refHigh: 17.5 },
  { name: "Ferritin", unit: "ng/mL", pillar: "Foundational Health", refLow: 18, refHigh: 270 },
  { name: "Albumin", unit: "g/dL", pillar: "Foundational Health", refLow: 3.5 },
  { name: "Magnesium", unit: "mg/dL", pillar: "Foundational Health", refLow: 1.7 },
  { name: "B12", unit: "pg/mL", pillar: "Foundational Health", refLow: 200 },
  { name: "ALT", unit: "U/L", pillar: "Foundational Health", refHigh: 56 },
  { name: "MCV", unit: "fL", pillar: "Foundational Health", refLow: 80, refHigh: 100 },
  { name: "GGT", unit: "U/L", pillar: "Foundational Health", refHigh: 48 },
  { name: "IGF-1", unit: "ng/mL", pillar: "Foundational Health", refLow: 80, refHigh: 300 },
  { name: "Folate", unit: "ng/mL", pillar: "Foundational Health", refLow: 3 },
  { name: "Zinc", unit: "\u00b5g/dL", pillar: "Foundational Health", refLow: 70 },
  { name: "AST", unit: "U/L", pillar: "Foundational Health", refHigh: 40 },
  { name: "Bilirubin", unit: "mg/dL", pillar: "Foundational Health", refLow: 0.2, refHigh: 1.2 },
  { name: "BUN", unit: "mg/dL", pillar: "Foundational Health", refLow: 7, refHigh: 25 },
  { name: "Creatinine", unit: "mg/dL", pillar: "Foundational Health", refLow: 0.6, refHigh: 1.35 },
];
