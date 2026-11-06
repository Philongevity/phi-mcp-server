#!/usr/bin/env node
/**
 * @phi-longevity/mcp-server — Phi Longevity over MCP (stdio), as a BRIDGE to the hosted server.
 *
 * 0.7.0 (2026-11-03, Phi D-1103-20/21 "one tool set"): outside agents hit "tool not found" because this package ran 4 tools of its own
 * while the README and the hosted server (https://philongevity.com/mcp) offer 14. Now this package lists and calls EXACTLY the hosted
 * tools (get_my_medical_records, prepare_for_my_appointment, explain_my_lab_results, check_care_gaps, …), so an agent sees the same tool
 * set wherever it connects. Older names the hosted server still accepts (analyze_biomarkers, find_my_records) keep working because calls
 * are forwarded as-is.
 * Offline fallback: if the hosted server can't be reached, three local tools still answer (quick_check, list_supported_biomarkers,
 * get_methodology) from the bundled catalog, and every other call says plainly that the hosted server is unreachable.
 *
 * 🛡️ HIPAA posture: SYNTHETIC / de-identified data only (stated in the hosted tool descriptions). This package stores nothing; telemetry
 * goes to stderr and is counts/timing only, never values or text.
 *
 * Env:
 *   PHI_HOSTED_MCP_URL  (optional) — hosted MCP endpoint, default https://philongevity.com/mcp
 *   PHI_SELFTEST=1      (Phi's own tests only) — marks calls x-phi-synthetic so they never count as real agent calls
 * Every forwarded request carries x-phi-client: npm-bridge/<version> (counts which tool calls came through this package; no user data).
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { CallToolRequestSchema, ListToolsRequestSchema, type Tool } from "@modelcontextprotocol/sdk/types.js";
import { BIOMARKER_CATALOG } from "./catalog.js";
import { buildResolver } from "./aliases.js";

export const VERSION = "0.7.1";
const HOSTED_URL = process.env.PHI_HOSTED_MCP_URL || "https://philongevity.com/mcp";
const SYNTHETIC_WARNING =
  "Made-up or de-identified data only. Do NOT submit protected health information (PHI). This package stores nothing.";

function telemetry(ev: Record<string, unknown>) {
  try { process.stderr.write(JSON.stringify({ t: new Date().toISOString(), ...ev }) + "\n"); } catch { /* noop */ }
}
const text = (t: string, isError = false) => ({ content: [{ type: "text" as const, text: t }], ...(isError ? { isError: true } : {}) });

// ── Hosted connection (lazy, reused; one reconnect on failure) ────────────────────────────────────────────────────────────────────────
type HostedLike = { listTools(): Promise<{ tools: Tool[] }>; callTool(p: { name: string; arguments?: Record<string, unknown> }): Promise<unknown> };
let hosted: HostedLike | null = null;
export async function connectHosted(url = HOSTED_URL): Promise<HostedLike> {
  const client = new Client({ name: "phi-mcp-server-npm-bridge", version: VERSION });
  const headers: Record<string, string> = { "x-phi-client": `npm-bridge/${VERSION}` };
  if (process.env.PHI_SELFTEST === "1") headers["x-phi-synthetic"] = "1";
  await client.connect(new StreamableHTTPClientTransport(new URL(url), { requestInit: { headers } }));
  return client as unknown as HostedLike;
}
async function withHosted<T>(fn: (h: HostedLike) => Promise<T>, connect: () => Promise<HostedLike>): Promise<T> {
  try {
    if (!hosted) hosted = await connect();
    return await fn(hosted);
  } catch (e) {
    hosted = null; // one fresh connection, then give up
    hosted = await connect();
    return fn(hosted);
  }
}

// ── Offline fallback: three tools that need no network ────────────────────────────────────────────────────────────────────────────────
const lookup = buildResolver(BIOMARKER_CATALOG);
const OBJ = { type: "object" as const };
export const OFFLINE_TOOLS: Tool[] = [
  { name: "quick_check", description: "Offline fallback (the hosted server is unreachable): flag a few biomarker values against PRISM's longevity-optimized reference ranges. " + SYNTHETIC_WARNING,
    inputSchema: { ...OBJ, properties: { biomarkers: { type: "object", additionalProperties: { type: "number" }, description: 'Map of name -> value, e.g. { "HbA1c": 6.1 }' } }, required: ["biomarkers"] } },
  { name: "list_supported_biomarkers", description: "Offline fallback: the biomarkers PRISM scores, with units and reference ranges.", inputSchema: { ...OBJ, properties: {} } },
  { name: "get_methodology", description: "Offline fallback: how the Phi Longevity Score works, with a link to the full methodology.", inputSchema: { ...OBJ, properties: {} } },
];
export function offlineCall(name: string, args: Record<string, unknown> = {}) {
  if (name === "list_supported_biomarkers") return text(JSON.stringify({ biomarkers: BIOMARKER_CATALOG }, null, 2));
  if (name === "get_methodology") {
    return text(JSON.stringify({ methodology_url: "https://philongevity.com/methodology",
      phi_score: "0–100 weighted composite across five clinical pillars: Metabolic (30%), Cardiovascular (25%), Hormonal (20%), Inflammation & Immunity (15%), Foundational Health (10%).",
      note: "Decision support, not a diagnosis. " + SYNTHETIC_WARNING }, null, 2));
  }
  if (name === "quick_check") {
    const flags: Array<{ name: string; value: number; unit: string; status: string }> = []; const unmatched: string[] = [];
    for (const [n, v] of Object.entries((args.biomarkers as Record<string, number>) || {})) {
      const b = lookup(n); if (!b || typeof v !== "number") { unmatched.push(n); continue; }
      const status = typeof b.refLow === "number" && v < b.refLow ? "below longevity-optimized range"
        : typeof b.refHigh === "number" && v > b.refHigh ? "above longevity-optimized range" : "within longevity-optimized range";
      flags.push({ name: b.name, value: v, unit: b.unit, status });
    }
    return text(JSON.stringify({ flags, unmatched: unmatched.length ? unmatched : undefined, note: "Offline range flags only. " + SYNTHETIC_WARNING }, null, 2));
  }
  return text(`Phi Longevity's hosted server (${HOSTED_URL}) could not be reached, so "${name}" can't run right now. Offline, only quick_check, list_supported_biomarkers and get_methodology work. Try again shortly.`, true);
}

// ── The server: list + call = the hosted tool set ─────────────────────────────────────────────────────────────────────────────────────
export function buildServer(connect: () => Promise<HostedLike> = () => connectHosted()) {
  const server = new Server({ name: "phi-longevity", version: VERSION }, {
    capabilities: { tools: {} },
    instructions: "Every doctor, your complete record. This package is a bridge to Phi Longevity's hosted server (" + HOSTED_URL + "): the same tools, " +
      "led by get_my_medical_records (where each doctor's records are and how to get them), prepare_for_my_appointment and explain_my_lab_results. " + SYNTHETIC_WARNING,
  });
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    try {
      const { tools } = await withHosted((h) => h.listTools(), connect);
      telemetry({ event: "list", source: "hosted", tools: tools.length });
      return { tools };
    } catch {
      telemetry({ event: "list", source: "offline" });
      return { tools: OFFLINE_TOOLS };
    }
  });
  server.setRequestHandler(CallToolRequestSchema, async (req) => {
    const t0 = Date.now(); const name = req.params.name; const args = (req.params.arguments || {}) as Record<string, unknown>;
    try {
      const out = await withHosted((h) => h.callTool({ name, arguments: args }), connect);
      telemetry({ tool: name, source: "hosted", elapsed_ms: Date.now() - t0 });
      return out as Record<string, unknown>;
    } catch {
      telemetry({ tool: name, source: "offline", elapsed_ms: Date.now() - t0 });
      return offlineCall(name, args);
    }
  });
  return server;
}

// Started directly OR through npm's bin symlink (npx / node_modules/.bin): compare real paths, not URLs.
const isMain = (() => { try { return !!process.argv[1] && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url)); } catch { return false; } })();
if (isMain) {
  buildServer().connect(new StdioServerTransport())
    .then(() => telemetry({ event: "phi-mcp-server started", version: VERSION, hosted: HOSTED_URL }))
    .catch((e) => { telemetry({ event: "fatal", error: (e as Error).message }); process.exit(1); });
}
