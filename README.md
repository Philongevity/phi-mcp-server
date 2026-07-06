# @phi-longevity/mcp-server

A Model Context Protocol (MCP) server that lets AI agents call **Phi Longevity's PRISM** longevity
recommendation engine on **synthetic** biomarker panels — evidence-tiered recommendations an agent can
use when researching options for a client.

> 🛡️ **Synthetic / de-identified data only.** Do not submit protected health information (PHI). The
> server is stateless and stores nothing. It is a credibility / agent-discoverability surface — not a
> PHI-bearing or clinical-care surface.

## Tools
| Tool | What it does |
|---|---|
| `analyze_biomarkers` | Analyze a synthetic panel → 3-tier, evidence-cited recommendations (THIS WEEK / CONSIDER / ASK YOUR CLINICIAN). |
| `list_supported_biomarkers` | The scored biomarkers + units + reference ranges, by clinical pillar. |
| `get_methodology` | How the Phi Score works (5 pillars + weights) + link to the full methodology. |

## Quick start

### Claude Desktop (`claude_desktop_config.json`)
```json
{
  "mcpServers": {
    "phi-longevity": {
      "command": "npx",
      "args": ["-y", "@phi-longevity/mcp-server"],
      "env": {
        "PHI_MCP_KEY": "<your-phi-mcp-key>"
      }
    }
  }
}
```

Request a key at **https://agents.philongevity.com** (free, rate-limited, revocable).

### Run locally
```bash
npm install
npm run build
PHI_MCP_KEY="<your-phi-mcp-key>" node dist/index.js
```

## Environment
| Var | Required | Notes |
|---|---|---|
| `PHI_MCP_KEY` | yes | Your `@phi-longevity` access key (sent as `x-phi-mcp-key`). Rate-limited + revocable. |
| `PHI_ENGINE_URL` | no | Override the default Phi MCP gateway URL (rarely needed). |

## Example
```jsonc
// analyze_biomarkers input (synthetic)
{ "biomarkers": [ { "name": "HbA1c", "value": 7.2, "unit": "%" },
                  { "name": "LDL-C", "value": 145, "unit": "mg/dL" } ],
  "conditionFocus": "diabetes_t2" }
// → 3-tier, evidence-cited recommendations
```

## HIPAA / privacy
Synthetic-only at the protocol boundary; stateless; aggregate-only telemetry (counts/timing to stderr,
never values or recommendation text); zero access to Firestore / the HIPAA datastore / user accounts.
GDPR: processes no personal data (synthetic only) → minimal exposure.

## Links
- Methodology: https://philongevity.com/methodology
- Phi Longevity: https://philongevity.com
