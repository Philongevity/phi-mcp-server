// aliases.ts — the names agents (and the lab reports they read) actually use for each catalog marker.
//
// 2026-09-30 (Steve D-0930-02: "foundational searches… we should have a large number of these"). Before this file
// the agent server knew 51 canonical names + 12 hand aliases, so "Glucose", "Vitamin B12", "C-Reactive Protein",
// "Apolipoprotein B", "SGPT", "Platelet Count" … came back `unmatched`, and the catalog-miss telemetry ignored even
// those 12 aliases (it reported "Hemoglobin A1c" and "LDL" as misses although quick_check resolved them).
//
// Sources for the names: the engine catalog's aliases (phi-longevity-app functions/lib/biomarkerCatalog.js), common
// Quest / Labcorp / Epic MyChart display names, and LOINC short / long common names.
//
// SAFETY RULES — an alias maps a name to ONE marker's reference range, so a wrong alias is a wrong flag:
//   · EXACT match after normalization only (lowercase, non-alphanumerics removed). No substring / fuzzy matching.
//   · Never alias a different test that shares a word: T4/T3 (total) ≠ Free T4/Free T3 · Direct/Indirect bilirubin
//     ≠ Total bilirubin · 1,25-dihydroxy vitamin D ≠ 25-OH vitamin D · urine albumin / microalbumin / UACR ≠ serum
//     albumin · RBC folate / RBC magnesium ≠ serum · urine creatinine ≠ serum creatinine · DHEA ≠ DHEA-S ·
//     Non-HDL / VLDL ≠ LDL · Urea (mmol/L) ≠ BUN · Hemoglobin ≠ Hemoglobin A1c.
//   · staging/phi-mcp-remote/aliases.test.mjs (phi-chief-of-staff, the hosted server's identical table) enforces: no alias resolves to two markers, every canonical name has an entry, and the
//     look-alike tests above stay UNMATCHED.

// Kept IDENTICAL to phi-chief-of-staff staging/phi-mcp-remote/aliases.js (the hosted server) — change both together.
export const MARKER_ALIASES: Record<string, string[]> = {
  // ── Metabolic ──
  "Fasting Glucose": ["Glucose", "Glucose Fasting", "Fasting Blood Glucose", "Fasting Blood Sugar", "FBG", "FBS",
    "Fasting Plasma Glucose", "FPG", "Blood Glucose", "Blood Sugar", "Serum Glucose", "Plasma Glucose", "GLU",
    "Glucose Level", "Fasting Glucose Level", "Glucose FS"],
  "HbA1c": ["Hemoglobin A1c", "A1c", "Hb A1c", "HgbA1c", "Hgb A1c", "HbA1c NGSP", "Hemoglobin A1c NGSP",
    "Glycated Hemoglobin", "Glycosylated Hemoglobin", "Glycohemoglobin", "Glycohemoglobin A1c", "A1c Test",
    "Haemoglobin A1c", "Glycated Haemoglobin", "Hemoglobin A1c/Hemoglobin.total", "Hemoglobin A1c Percent",
    "A1c Hemoglobin", "HA1c"],
  "Fasting Insulin": ["Insulin", "Insulin Fasting", "Serum Insulin", "Fasting Serum Insulin", "Insulin Level"],
  "Triglycerides": ["Triglyceride", "TG", "TRIG", "TRIGS", "Serum Triglycerides", "Triglycerides Fasting",
    "Fasting Triglycerides", "Triacylglycerol"],
  "Uric Acid": ["Urate", "Serum Uric Acid", "Serum Urate", "Uric Acid Level"],
  // ── Cardiovascular ──
  "ApoB": ["Apolipoprotein B", "Apo B", "ApoB100", "Apo B100", "Apolipoprotein B100", "Apolipoprotein B-100",
    "Apo B-100"],
  "LDL-C": ["LDL", "LDL Cholesterol", "LDL Chol", "LDL Calc", "LDL Calculated", "LDL Cholesterol Calculated",
    "LDL Cholesterol Calc", "LDL Chol Calc", "LDL Chol Calc NIH", "LDL Chol Calc (NIH)", "LDL-C Calculated",
    "Calculated LDL", "Direct LDL", "LDL Direct", "LDL Cholesterol Direct", "LDL-Cholesterol",
    "Low Density Lipoprotein", "Low-Density Lipoprotein Cholesterol", "LDL Cholesterol (Martin-Hopkins)",
    "LDL Martin Hopkins", "LDL Cholesterol Martin-Hopkins Calc"],
  "Lp(a)": ["Lipoprotein(a)", "Lipoprotein a", "Lipoprotein (a)", "Lipoprotein Little a", "Lp-a", "LPA",
    "Lp a"],
  "HDL-C": ["HDL", "HDL Cholesterol", "HDL Chol", "HDL-Cholesterol", "High Density Lipoprotein",
    "High-Density Lipoprotein Cholesterol", "HDL Direct"],
  "Total Cholesterol": ["Cholesterol", "Cholesterol Total", "Total Chol", "Chol", "TC", "Serum Cholesterol",
    "Cholesterol Serum"],
  // ── Hormonal ──
  "TSH": ["Thyroid Stimulating Hormone", "Thyroid-Stimulating Hormone", "Thyrotropin", "TSH 3rd Generation",
    "TSH Ultrasensitive", "Ultrasensitive TSH", "Sensitive TSH", "hTSH", "TSH High Sensitivity"],
  "Total Testosterone": ["Testosterone", "Testosterone Total", "Serum Testosterone", "Testosterone (Total)",
    "Testosterone Total LC/MS", "Testosterone Total MS", "Testosterone LC/MS/MS", "Total T"],
  "Free Testosterone": ["Testosterone Free", "Free Testosterone Direct", "Testosterone Free Direct",
    "Free Testosterone Calculated", "Calculated Free Testosterone", "Testosterone Free Calculated", "cFT"],
  "DHEA-S": ["DHEAS", "DHEA Sulfate", "DHEA-Sulfate", "DHEA-SO4", "DHEA SO4", "Dehydroepiandrosterone Sulfate",
    "DHEA Sulphate"],
  "Free T3": ["FT3", "Free Triiodothyronine", "T3 Free", "Triiodothyronine Free", "Free T3 Direct"],
  "Free T4": ["FT4", "Free Thyroxine", "T4 Free", "Thyroxine Free", "Free T4 Direct", "T4 Free Direct",
    "Thyroxine (T4) Free Direct"],
  "Estradiol": ["E2", "Oestradiol", "Estradiol Serum", "Estradiol Sensitive", "Sensitive Estradiol",
    "Ultrasensitive Estradiol", "Estradiol Ultrasensitive"],
  "SHBG": ["Sex Hormone Binding Globulin", "Sex-Hormone-Binding Globulin", "Sex Hormone-Binding Globulin", "Sex Horm Binding Glob"],
  "Cortisol": ["Serum Cortisol", "Cortisol AM", "AM Cortisol", "Morning Cortisol", "Cortisol Total",
    "Cortisol Morning"],
  // ── Inflammation & Immunity ──
  "hsCRP": ["hs-CRP", "hs CRP", "High Sensitivity CRP", "High-Sensitivity CRP", "High Sensitivity C-Reactive Protein",
    "High-Sensitivity C-Reactive Protein", "CRP High Sensitivity", "C-Reactive Protein High Sensitivity",
    "Cardiac CRP", "C-Reactive Protein Cardiac", "CRP Cardiac", "CRP", "C-Reactive Protein"],
  "Homocysteine": ["Hcy", "Total Homocysteine", "Homocysteine Total", "Homocyst(e)ine", "Plasma Homocysteine"],
  "Omega-3 Index": ["Omega 3 Index", "O3 Index", "Omega-3 Index RBC", "RBC Omega-3 Index"],
  "Fibrinogen": ["Fibrinogen Activity", "Fibrinogen Antigen", "Plasma Fibrinogen", "Fibrinogen Level"],
  "IL-6": ["IL6", "Interleukin-6", "Interleukin 6"],
  "WBC": ["White Blood Cell Count", "White Blood Cells", "WBC Count", "White Cell Count", "White Count",
    "Leukocytes", "Leukocyte Count", "Total Leukocyte Count", "Total WBC"],
  "Platelets": ["Platelet Count", "Platelet", "PLT", "Thrombocytes", "Thrombocyte Count"],
  "ANA": ["Antinuclear Antibody", "Antinuclear Antibodies", "ANA Titer", "Anti-Nuclear Antibody", "ANA IFA", "Antinuclear Antibodies Direct", "ANA Direct"],
  "anti-dsDNA": ["dsDNA", "Anti-Double Stranded DNA", "Anti-Double-Stranded DNA", "dsDNA Antibody",
    "Anti-dsDNA Antibody", "DNA Double-Stranded Antibody", "dsDNA Ab", "Anti-dsDNA Ab"],
  "C3": ["Complement C3", "C3 Complement", "Complement Component 3"],
  "C4": ["Complement C4", "C4 Complement", "Complement Component 4"],
  "anti-Sm": ["Anti-Smith", "Anti-Smith Antibody", "Smith Antibody", "Sm Antibody"],
  "anti-Ro (SSA)": ["Anti-Ro", "Anti-SSA", "SSA", "SS-A", "Ro Antibody", "SSA Antibody", "Anti-Ro/SSA",
    "SSA (Ro) Antibody", "Sjogren's Antibody SS-A"],
  "anti-La (SSB)": ["Anti-La", "Anti-SSB", "SSB", "SS-B", "La Antibody", "SSB Antibody", "Anti-La/SSB",
    "SSB (La) Antibody", "Sjogren's Antibody SS-B"],
  "ESR": ["Sed Rate", "Sedimentation Rate", "Erythrocyte Sedimentation Rate", "Westergren Sed Rate",
    "Sed Rate Westergren", "ESR Westergren", "Sed Rate by Modified Westergren", "Sed Rate Modified Westergren"],
  // ── Foundational Health ──
  "eGFR": ["GFR", "Estimated GFR", "eGFR CKD-EPI", "eGFR CKD-EPI 2021", "eGFR (CKD-EPI 2021)",
    "Estimated Glomerular Filtration Rate", "Glomerular Filtration Rate Estimated", "eGFR Creatinine",
    "eGFR by Creatinine", "eGFRcr"],
  "Vitamin D": ["25-OH Vitamin D", "25-Hydroxyvitamin D", "25-Hydroxy Vitamin D", "25(OH)D", "25(OH) Vitamin D",
    "25-OH-D", "Vitamin D 25-Hydroxy", "Vitamin D, 25-Hydroxy", "Vitamin D 25 OH", "Vitamin D Total",
    "25-Hydroxyvitamin D Total", "Vitamin D 25-Hydroxy Total", "Vitamin D3", "Vit D", "VitD", "Calcidiol",
    "25OHD"],
  "Hemoglobin": ["Hgb", "Hb", "HGB", "Haemoglobin"],
  "Ferritin": ["Serum Ferritin", "Ferritin Serum", "Ferritin Level"],
  "Albumin": ["Serum Albumin", "Albumin Serum", "ALB"],
  "Magnesium": ["Mg", "Serum Magnesium", "Magnesium Serum"],
  "B12": ["Vitamin B12", "Vitamin B-12", "B-12", "Vit B12", "Cobalamin", "Cyanocobalamin", "Serum B12",
    "Vitamin B12 Level", "B12 Level"],
  "ALT": ["Alanine Aminotransferase", "Alanine Transaminase", "SGPT", "ALT (SGPT)", "ALT/SGPT", "ALAT", "GPT"],
  "MCV": ["Mean Corpuscular Volume", "Mean Cell Volume"],
  "GGT": ["Gamma-Glutamyl Transferase", "Gamma Glutamyl Transferase", "Gamma-Glutamyltransferase", "Gamma GT",
    "GGTP", "Gamma-Glutamyl Transpeptidase", "Gamma Glutamyl Transpeptidase"],
  "IGF-1": ["IGF1", "IGF-I", "Insulin-Like Growth Factor 1", "Insulin-Like Growth Factor I", "Somatomedin C"],
  "Folate": ["Folic Acid", "Serum Folate", "Folate Serum", "Vitamin B9", "Folate (Folic Acid)"],
  "Zinc": ["Zn", "Serum Zinc", "Plasma Zinc", "Zinc Plasma", "Zinc Serum"],
  "AST": ["Aspartate Aminotransferase", "Aspartate Transaminase", "SGOT", "AST (SGOT)", "AST/SGOT", "ASAT", "GOT"],
  "Bilirubin": ["Total Bilirubin", "Bilirubin Total", "Bilirubin (Total)", "T Bili", "TBili", "TBIL",
    "Bilirubin Total Serum"],
  "BUN": ["Blood Urea Nitrogen", "Urea Nitrogen", "Urea Nitrogen (BUN)", "Serum Urea Nitrogen", "BUN Level"],
  "Creatinine": ["Serum Creatinine", "Creatinine Serum", "Creat", "SCr", "Cr"],
};

export const normName = (s: string): string => String(s).toLowerCase().replace(/[^a-z0-9]/g, "");

// Specimen / filler words a lab adds around a name ("Ferritin, Serum", "Glucose in Serum or Plasma").
// Only tried AFTER an exact miss, and only when something is left — never changes what an exact name means.
const FILLER = new Set(["serum", "plasma", "blood", "whole", "ser", "plas", "bld", "in", "or", "level", "levels",
  "test", "result", "value"]);
function stripFiller(s: string): string | null {
  const toks = String(s).toLowerCase().split(/[^a-z0-9()]+/).filter(Boolean);
  const kept = toks.filter((t) => !FILLER.has(t));
  return kept.length && kept.length < toks.length ? normName(kept.join("")) : null;
}

/** Build a resolver over a catalog: name -> catalog entry | null. Throws on an alias collision (fail loud). */
export function buildResolver<T extends { name: string }>(catalog: readonly T[]): (name: string) => T | null {
  const index = new Map<string, T>();
  const put = (key: string, entry: T, from: string) => {
    const k = normName(key);
    const prev = index.get(k);
    if (prev && prev !== entry) throw new Error(`alias collision: "${from}" → ${entry.name} and ${prev.name}`);
    index.set(k, entry);
  };
  for (const b of catalog) put(b.name, b, b.name);
  for (const b of catalog) for (const a of MARKER_ALIASES[b.name] || []) put(a, b, a);
  return (name: string) => {
    const hit = index.get(normName(name));
    if (hit) return hit;
    const s = stripFiller(name);
    return (s && index.get(s)) || null;
  };
}
