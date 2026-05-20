# Methodology

How The CFO Gap is computed, what its limits are, and how to read its numbers honestly.

## One question

Can crypto-native middle-market companies staff their senior finance roles?

## The metric

**Senior Finance Stall Ratio**, defined per sub-sector and corpus-wide:

```
stall_ratio = (open finance listings older than 60 days) / (open finance listings)
```

Where:
- **"Open"** means the listing was present in the most recent scan of the company's public job-board feed.
- **"Older than 60 days"** is measured from the listing's `publishedAt` timestamp (where the ATS exposes one — Ashby and Lever do; Greenhouse via `first_published`) OR from the date the scanner first observed the listing (whichever is earlier).
- **"Finance listings"** are job postings matching a fixed taxonomy of accounting and finance roles: Controller, Assistant Controller, Corporate Controller, VP Finance, Head of Finance, CFO, Accounting Manager, Senior Accounting Manager, Accounting Lead, Senior Accountant, Tax Manager, Tax Director, FP&A Manager, FP&A Director, Technical Accounting Manager, Revenue Accountant, Staff Accountant, AP/AR Specialist, Treasury Manager, Internal Audit Manager, SOX/Compliance Manager. Bookkeeper and Payroll roles are captured for completeness but excluded from the stall metric.

## Data source

The scanner queries public job-board APIs:
- **Ashby:** `https://api.ashbyhq.com/posting-api/job-board/{slug}`
- **Greenhouse:** `https://boards-api.greenhouse.io/v1/boards/{slug}/jobs?content=true`
- **Lever:** `https://api.lever.co/v0/postings/{slug}?mode=json`

For each company in the curated target list, the scanner pulls all open postings, classifies titles into the finance taxonomy, computes per-listing age from the `publishedAt` / `first_published` / `createdAt` field, and writes a daily snapshot.

All data is **public**. No portal logins. No robots.txt bypass. Per-domain rate limiting. User-Agent identifies the project.

## Target universe

The curated target list covers crypto-native middle-market companies meeting these criteria:
- Primary business is crypto-native (not "crypto-curious" fintech)
- Last priced round: Series B, C, or D (or equivalent token raise scale)
- Headcount: roughly 50–500
- Last funding event within 36 months
- US or US-adjacent operations

Hard exclusions:
- Too small (seed / pre-seed / Series A under $10M raised)
- Too big (Coinbase, Binance, Kraken, Block, Robinhood Crypto, Tether, Circle, public crypto companies)
- Dead or distressed (active bankruptcy, last raise >36 months ago with no revenue signal)

The target list is maintained privately and refreshed quarterly.

## Sub-sector taxonomy

Each company is tagged with one primary sub-sector:
- `stablecoin-issuer` — USD-backed stablecoin issuers
- `custody-wallet` — institutional and consumer custody, wallets
- `l1-l2-foundation` — Layer 1 and Layer 2 blockchain protocol companies
- `defi-protocol` — DeFi protocol teams
- `infra-rpc-data` — RPC, indexing, data infrastructure
- `defi-trading` — institutional crypto trading infrastructure
- `rwa-tokenization` — real-world asset tokenization
- `fintech-crypto-hybrid` — fintech / payments / exchanges with crypto exposure

## Update cadence

The dashboard refreshes daily. Each snapshot includes:
- A timestamp
- Headline stall ratio (corpus-wide)
- Per-sub-sector stall ratio + denominator
- Hiring velocity (listings opened in trailing 7d and 30d)
- Average finance role age, per sub-sector

Snapshots are versioned under `data/snapshots/YYYY-MM-DD.json`. The dashboard reads `data/latest.json`.

## Caveats and limits

- **"Open" means "present in the most recent scan."** When a listing disappears from the feed, we mark it closed — but this can mean "filled" OR "withdrawn" OR "the company switched ATS providers." We don't claim to measure time-to-fill.
- **Listings older than 60 days is a strong stall signal but not a perfect one.** Some companies leave roles permanently posted as evergreen. The metric works best in aggregate, not per individual listing.
- **The target list is curated.** We are intentionally focused on a defined buyer-profile, not the entire crypto universe. Larger companies (Series E+) and smaller ones (pre-Series A) are excluded by design.
- **Sub-sectors are author-assigned.** A company like "Anchorage Digital" is `custody-wallet` here; you might argue `defi-trading` is equally valid. We commit to one primary tag and document secondary tags privately.
- **First-pass classifier.** Job titles are matched against regex patterns. Real-world title variation ("Global Markets Accounting Lead", "Member of Accounting, Portugal Center of Excellence") is captured but not perfectly.

## What this cannot tell you

- Whether a specific role is "filled" (only that we stopped seeing it)
- Which companies are about to staff up (no LinkedIn signal layer)
- Whether the talent is good (only that it's not being hired)
- Anything about private hiring (we only see public postings)

## Versioning

Methodology versions are tracked in this file. Material changes will bump the `version` field in `data/latest.json` and be noted here.

Current version: **1.0** (2026-05-19).

## Reproducibility

You can replicate The CFO Gap if you:
1. Curate your own list of crypto-native middle-market companies and their ATS slugs.
2. Poll their public job-board APIs daily.
3. Apply the role taxonomy above.
4. Compute the stall ratio per the formula above.

The target list and scanner code are maintained privately (the source repository contains operational exclusions and rubric weights that are not appropriate for public release). The methodology above is the canonical specification.
