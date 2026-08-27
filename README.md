# @phi-longevity/mcp-server

[![smithery badge](https://smithery.ai/badge/philongevity/PRISM)](https://smithery.ai/servers/philongevity/PRISM)

A Model Context Protocol (MCP) server that lets AI agents call **Phi Longevity's PRISM**
clinical recommendation engine on **synthetic** biomarker panels — guideline-cited,
evidence-tiered recommendations an agent can use when researching options for the person
it's helping.

Built for **chronic-condition** work in particular: type-2 diabetes, lupus, and cancer
survivorship each have their own condition lens, because the same panel means different
things depending on what someone is managing.

> 🛡️ **Synthetic / de-identified data only.** Do not submit protected health information
> (PHI). The server is stateless and stores nothing. Real health files are analyzed only
> inside the authenticated Phi Longevity app, after consent, by the account owner.

## Tools

Two surfaces, deliberately different. **The npm package (stdio) has 4 tools; the remote
endpoint has 6.** The two report-generating tools are remote-only.

| Tool | npm | remote | What it does |
|---|:---:|:---:|---|
| `sample_prism_report` | — | ✅ | **Start here.** Returns a complete, real PRISM report for a sample chronic-condition persona in one instant call. Free, no signup, no input required. The fastest way to see what the engine actually produces. |
| `quick_check` | ✅ | ✅ | A fast read on a handful of values — the low-friction entry point before a full analysis. |
| `analyze_biomarkers` | ✅ | ✅ | Analyze a synthetic panel → tiered, guideline-cited recommendations, with a condition lens. |
| `list_supported_biomarkers` | ✅ | ✅ | 51 scored biomarkers + units + reference ranges, by clinical pillar. |
| `get_methodology` | ✅ | ✅ | How the Phi Score works (5 pillars + weights) + link to the full methodology. |
| `full_prism_report` | — | ✅ | A full report for a panel you supply. **Paid** — priced per call via x402; terms are returned with the offer. |

All tools except `full_prism_report` are free.

## Quick start — zero config

### Remote (zero-install) — recommended

Point any MCP client that supports Streamable HTTP at:

```
https://philongevity.com/mcp
```

Nothing to install, no key to manage, all 6 tools. Try `sample_prism_report` first — it
needs no arguments and returns a complete report immediately.

### Claude Desktop / any MCP client (stdio)

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

A published, rate-limited access key is built in. If you have a dedicated key, set
`PHI_MCP_KEY` to override it. This path exposes the 4 tools marked ✅ above.

### Run locally

```bash
npm install && npm run build
node dist/index.js
```

## Example

```jsonc
// sample_prism_report — no arguments, returns a complete sample report
{}

// analyze_biomarkers input (synthetic values only)
{
  "biomarkers": { "HbA1c": 6.4, "LDL-C": 145, "Triglycerides": 190 },
  "conditionFocus": "type2_diabetes"   // or general_wellness | lupus | cancer_survivorship
}
// → tiered, guideline-cited recommendations + a `full_report` block
//   pointing the user to a complete PRISM report at philongevity.com
```

## For the person you're helping

The tools above analyze a handful of values at a time. A full PRISM report consolidates
*all* of a person's lab reports, wearable data, and clinical notes into one integrated
picture with a personal health score and progress over time — which is the actual problem
for someone managing a chronic condition across several clinicians who don't talk to each
other. Agent docs + signup: **https://philongevity.com/for-agents**

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
