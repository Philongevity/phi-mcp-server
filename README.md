# @phi-longevity/mcp-server

A Model Context Protocol (MCP) server that lets AI agents call **Phi Longevity's PRISM** longevity
recommendation engine on **synthetic** biomarker panels.

> 🛡️ **Synthetic / de-identified data only.** Do not submit protected health information (PHI). The
> server is stateless and stores nothing. It is a credibility / agent-discoverability surface — not a
> PHI-bearing or clinical-care surface.

## Tools
| Tool | What it does |
|---|---|
| `analyze_biomarkers` | Analyze a synthetic panel → 3-tier, evidence-cited recommendations (THIS WEEK / CONSIDER / ASK YOUR CLINICIAN). |
| `list_supported_biomarkers` | The scored biomarkers + units + reference ranges, by clinical pillar. |
| `get_methodology` | How the Phi Score works (5 pillars + weights) + link to the full methodology. |

## Install / run
```bash
npm install
npm run build
PHI_MCP_KEY="phimcp_d29179fdd8b99b70a49ae26f434843cf" node dist/index.js
```

### Claude Desktop config (`claude_desktop_config.json`)
```json
{
  "mcpServers": {
    "phi-longevity": {
      "command": "npx",
      "args": ["-y", "@phi-longevity/mcp-server"],
      "env": {
        "PHI_MCP_KEY": "phimcp_d29179fdd8b99b70a49ae26f434843cf"
      }
    }
  }
}
```

## Environment
| Var | Required | Notes |
|---|---|---|
| `PHI_MCP_KEY` | yes | Your `@phi-longevity` access key (sent as `x-phi-mcp-key`). Published + revocable + rate-limited. |
| `PHI_ENGINE_URL` | no | Override the default Phi MCP gateway URL (rarely needed). |

## Status — v0 scaffold (2026-06-10)
Built by cloud-cos. **Needs `npm install && npm run build` to validate against the live SDK** (the SDK
wasn't installed in the scaffold environment). Decisions locked: revocable key + rate-limit · npm stdio ·
no affiliate URLs by default · pkg `@phi-longevity/mcp-server` · own repo `phi-mcp-server`.

### TODO before publish
- `npm install && npm run build` → fix any SDK API drift (the `server.tool(...)` shape).
- Sync `src/catalog.ts` with the canonical `BIOMARKER_CATALOG` (45 markers).
- Gateway (`phi-mcp-gateway`) holds the engine secret server-side + validates `x-phi-mcp-key` + rate-limits. ✅
- Local test with the synthetic peri fixtures (`dossier/v2.0/scenarios/`).
- `agents.philongevity.com` landing page (separate; install snippet + 3 tools + no-PHI terms).
- `npm publish --access public` under the `@phi-longevity` org.

## HIPAA / privacy
Synthetic-only at the protocol boundary; stateless; aggregate-only telemetry (counts/timing to stderr,
never values or recommendation text); zero access to Firestore / the HIPAA datastore / user accounts.
GDPR: v0 processes no personal data (synthetic only) → minimal exposure.
