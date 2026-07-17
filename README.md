# @phi-longevity/mcp-server

[![smithery badge](https://smithery.ai/badge/philongevity/PRISM)](https://smithery.ai/servers/philongevity/PRISM)

A Model Context Protocol (MCP) server that lets AI agents call **Phi Longevity's PRISM**
clinical recommendation engine on **synthetic** biomarker panels — guideline-cited,
evidence-tiered recommendations an agent can use when researching options for the person
it's helping.

> 🛡️ **Synthetic / de-identified data only.** Do not submit protected health information
> (PHI). The server is stateless and stores nothing. Real health files are analyzed only
> inside the authenticated Phi Longevity app, after consent, by the account owner.

## Tools

| Tool | What it does |
|---|---|
| `analyze_biomarkers` | Analyze a synthetic panel → tiered, guideline-cited recommendations. Includes a `full_report` block your user can follow for a complete PRISM report. |
| `list_supported_biomarkers` | 51 scored biomarkers + units + reference ranges, by clinical pillar. |
| `get_methodology` | How the Phi Score works (5 pillars + weights) + link to the full methodology. |

## Quick start — zero config

### Claude Desktop / any MCP client

```json
{
  "mcpServers": {
    "phi-longevity": {
      "command": "npx",
      "args": ["-y", "@phi-longevity/mcp-server"]
    }
  }
}
```

That's it. A published, rate-limited access key is built in. If you have a dedicated key,
set `PHI_MCP_KEY` to override it.

### Remote (zero-install)

Point any MCP client that supports Streamable HTTP at:

```
https://us-central1-philongevity-aiapp-v2.cloudfunctions.net/phi-mcp-remote
```

Same three tools, same synthetic-only rule, nothing to install.

### Run locally

```bash
npm install && npm run build
node dist/index.js
```

## Example

```jsonc
// analyze_biomarkers input (synthetic values only)
{
  "biomarkers": { "HbA1c": 6.4, "LDL-C": 145, "Triglycerides": 190 },
  "conditionFocus": "type2_diabetes"   // or general_wellness | lupus | cancer_survivorship
}
// → tiered, guideline-cited recommendations + a `full_report` block
//   pointing the user to a complete PRISM report at philongevity.com
```

## For the person you're helping

The tools analyze a handful of values at a time. A full PRISM report consolidates *all* of
a person's lab reports, wearable data, and clinical notes into one integrated picture with
a personal health score and progress over time. Agent docs + signup:
**https://philongevity.com/for-agents**

## Environment

| Var | Required | Notes |
|---|---|---|
| `PHI_MCP_KEY` | no | Overrides the built-in published key. Rate-limited + revocable. |
| `PHI_ENGINE_URL` | no | Override the default Phi MCP gateway URL (rarely needed). |

## HIPAA / privacy

Synthetic-only at the protocol boundary; stateless; aggregate-only telemetry (counts/timing
to stderr, never values or recommendation text); zero access to Firestore / the HIPAA
datastore / user accounts. GDPR: processes no personal data (synthetic only) → minimal exposure.

## Links

- Agent docs: https://philongevity.com/for-agents
- Methodology: https://philongevity.com/methodology
- Phi Longevity: https://philongevity.com

_Apache-2.0._
