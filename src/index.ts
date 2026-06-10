#!/usr/bin/env node
/**
 * @philongevity/mcp-server — Phi Longevity PRISM engine over MCP.
 *
 * Lets AI agents call Phi's longevity recommendation engine on SYNTHETIC biomarker panels
 * and get back the structured 3-tier output (THIS WEEK / CONSIDER / ASK YOUR CLINICIAN) with
 * evidence tiers + citations. A credibility / agent-discoverability surface — NOT a PHI surface.
 *
 * 🛡️ HIPAA posture (designed-in):
 *  - SYNTHETIC / de-identified data only at the protocol boundary (stated in every tool description).
 *  - STATELESS: proxies to the engine and returns; writes nothing, persists nothing.
 *  - Aggregate-only telemetry to stderr: counts/timing, NEVER biomarker values or recommendation text.
 *  - The x-migration-secret is injected server-side and NEVER exposed to the agent.
 *  - Zero access to Firestore / the HIPAA datastore / user accounts. One upstream URL only.
 *
 * Env:
 *   PHI_ENGINE_URL        (required) — runRecommendationsForBiomarkers Cloud Function URL
 *   PHI_MIGRATION_SECRET  (required) — x-migration-secret header value (server-side only)
 *   PHI_MCP_KEY           (optional) — published-but-revocable access key (sent to the engine for
 *                                      rate-limit/validation; enforcement lives server-side)
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { BIOMARKER_CATALOG } from "./catalog.js";

const ENGINE_URL = process.env.PHI_ENGINE_URL ?? "";
const MIGRATION_SECRET = process.env.PHI_MIGRATION_SECRET ?? "";
const MCP_KEY = process.env.PHI_MCP_KEY ?? "";

const SYNTHETIC_WARNING =
  "For research/education with SYNTHETIC or de-identified data only. Do NOT submit protected health " +
  "information (PHI). This endpoint is stateless and does not store inputs.";

// ── Local courtesy rate-limit (defense in depth; real enforcement is server-side) ─────────────
const RATE = { capacity: 20, refillPerSec: 0.5, tokens: 20, last: Date.now() };
function allow(): boolean {
  const now = Date.now();
  RATE.tokens = Math.min(RATE.capacity, RATE.tokens + ((now - RATE.last) / 1000) * RATE.refillPerSec);
  RATE.last = now;
  if (RATE.tokens < 1) return false;
  RATE.tokens -= 1;
  return true;
}

// ── Aggregate-only telemetry (stderr; NEVER values) ───────────────────────────────────────────
function telemetry(ev: Record<string, unknown>) {
  try { process.stderr.write(JSON.stringify({ t: new Date().toISOString(), ...ev }) + "\n"); } catch { /* noop */ }
}

function textResult(text: string) {
  return { content: [{ type: "text" as const, text }] };
}

async function callEngine(body: Record<string, unknown>) {
  if (!ENGINE_URL || !MIGRATION_SECRET) {
    throw new Error("Server not configured: set PHI_ENGINE_URL and PHI_MIGRATION_SECRET.");
  }
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-migration-secret": MIGRATION_SECRET,
  };
  if (MCP_KEY) headers["x-phi-mcp-key"] = MCP_KEY;
  const res = await fetch(ENGINE_URL, { method: "POST", headers, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`Engine returned ${res.status}.`);
  return res.json() as Promise<any>;
}

const server = new McpServer(
  { name: "phi-longevity", version: "0.1.0" },
  {
    instructions:
      "Phi Longevity PRISM — longevity-optimized analysis of biomarker panels. " + SYNTHETIC_WARNING,
  }
);

// ── Tool 1: analyze_biomarkers (the core) ─────────────────────────────────────────────────────
server.tool(
  "analyze_biomarkers",
  "Analyze a SYNTHETIC biomarker panel with Phi Longevity's PRISM engine. Returns 3-tier, " +
    "evidence-cited recommendations (THIS WEEK / CONSIDER / ASK YOUR CLINICIAN). " + SYNTHETIC_WARNING,
  {
    biomarkers: z
      .record(z.string(), z.number())
      .describe("Map of biomarker name -> numeric value, e.g. { \"Hemoglobin A1c\": 5.4 }. SYNTHETIC ONLY."),
    conditionFocus: z
      .enum(["general_wellness", "type2_diabetes", "lupus", "cancer_survivorship"]) 
      .optional()
      .describe("Optional condition track. Default general_wellness."),
    age: z.number().int().min(0).max(120).optional(),
    biologicalSex: z.enum(["male", "female"]).optional(),
    include_partner_options: z
      .boolean()
      .optional()
      .describe("If true, include partner/product options. Default false (clean clinical output)."),
  },
  async (args) => {
    const t0 = Date.now();
    if (!allow()) return textResult("Rate limit reached. Please retry in a moment.");
    try {
      const out = await callEngine({
        biomarkers: args.biomarkers,
        conditionFocus: args.conditionFocus ?? "general_wellness",
        age: args.age,
        biologicalSex: args.biologicalSex,
      });
      const recs = args.include_partner_options
        ? out.recommendations_v2_with_partners ?? out.recommendations_v2
        : out.recommendations_v2;
      telemetry({
        tool: "analyze_biomarkers",
        n_biomarkers: Object.keys(args.biomarkers || {}).length,
        conditionFocus: args.conditionFocus ?? "general_wellness",
        issues_count: Array.isArray(out.issues) ? out.issues.length : 0,
        elapsed_ms: Date.now() - t0,
      });
      return textResult(JSON.stringify({ recommendations: recs, meta: out.meta, issues: out.issues }, null, 2));
    } catch (e) {
      telemetry({ tool: "analyze_biomarkers", error: (e as Error).message, elapsed_ms: Date.now() - t0 });
      return textResult(`Could not analyze: ${(e as Error).message}`);
    }
  }
);

// ── Tool 2: list_supported_biomarkers ─────────────────────────────────────────────────────────
server.tool(
  "list_supported_biomarkers",
  "List the biomarkers PRISM scores, with units and reference ranges, grouped by clinical pillar. " +
    "Reference data only — no patient data.",
  {},
  async () => {
    telemetry({ tool: "list_supported_biomarkers", count: BIOMARKER_CATALOG.length });
    return textResult(JSON.stringify({ biomarkers: BIOMARKER_CATALOG }, null, 2));
  }
);

// ── Tool 3: get_methodology ───────────────────────────────────────────────────────────────────
server.tool(
  "get_methodology",
  "Summarize how the Phi Score works (5 clinical pillars + weights) and link to the full methodology.",
  {},
  async () => {
    telemetry({ tool: "get_methodology" });
    return textResult(
      JSON.stringify(
        {
          phi_score:
            "0–100 weighted composite across five clinical pillars: Metabolic (30%), Cardiovascular (25%), " +
            "Hormonal (20%), Inflammation & Immunity (15%), Foundational Health (10%). Compared against " +
            "longevity-optimized reference ranges, not just standard lab normals.",
          methodology_url: "https://philongevity.com/methodology",
          note: "Decision support, not a diagnosis. Recommendations are evidence-tiered with citations. " + SYNTHETIC_WARNING,
          source: "Phi Longevity (philongevity.com)",
        },
        null,
        2
      )
    );
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  telemetry({ event: "phi-mcp-server started", tools: 3 });
}

main().catch((e) => {
  telemetry({ event: "fatal", error: (e as Error).message });
  process.exit(1);
});
