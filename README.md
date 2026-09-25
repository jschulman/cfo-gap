# The CFO Gap

Tracking persistent finance job listings using aggregate public job-posting observations.

**[View the dashboard](https://jschulman.github.io/cfo-gap)**

## What this measures

How many observed, open finance listings have remained visible for more than 60 days?

```
persistent_listing_share = open eligible listings older than 60 days / open eligible listings
```

Both counts appear beside the percentage. No open listings means the share is unknown. Groups with fewer than 10 open listings show counts and a small-sample notice rather than a percentage verdict; 10 is a display threshold, not a statistical confidence guarantee. The historical field name `stall_ratio` is retained for compatibility.

A posting is open when the scanner still identifies it as open. Age follows the producer's `age_days_live` observation: whole elapsed days since the scanner first observed the listing. It does not use the employer's publication date. First observation is an imperfect proxy for when recruiting actually began. The numerator uses **strictly more than 60 days**. Hiring-velocity aggregates, where published, count jobs first observed within 7 or 30 days; they do not establish actual opening or hiring dates.

The crypto-native baseline is preserved. It is a selected employer sample, not a measure of adoption across incumbent banks, brokers or payment processors. See [Financial Rails](https://jschulman.github.io/stablecoin-signal/#financial-rails) and the separate [incumbent employer panel](https://jayschulman.com/blockchain#incumbent-panel).

See [METHODOLOGY.md](METHODOLOGY.md) for the current definitions, role coverage, historical changes and limitations. Missing percentages display as unknown; historical charts preserve gaps. Requested skills, persistent job listings and advertised pay do not by themselves establish adoption or demand for professional services.

## Architecture and refresh

- `docs/` — static HTML, JavaScript and CSS, served by GitHub Pages.
- `data/` and `docs/data/` — published aggregate snapshots from the private producer.
- `.github/workflows/` — publishing automation.
- `tests/` — renderer regression checks for measured zero, missing data and historical compatibility.

The private producer polls public Ashby, Greenhouse and Lever job-board feeds. Daily refresh is intended, but the observation date and coverage determine freshness. No individual job descriptions or private employer records are published here. The source location and scheduled publishing roots remain unchanged.

Run the renderer checks with `node --test tests/*.test.cjs`.

## The Crypto Canaries

- [CFO Gap](https://jschulman.github.io/cfo-gap) — persistent finance listings.
- [Crypto Tool Curve](https://jschulman.github.io/crypto-tool-curve) — tool and operational-skill demand.
- [Compliance Canary](https://jschulman.github.io/compliance-canary) — credential and control demand.
- [Comp Pulse](https://jschulman.github.io/comp-pulse) — advertised salary-range index.

Related: [Stablecoin Signal](https://jschulman.github.io/stablecoin-signal) · [Displacement Curve](https://jschulman.github.io/displacement-curve) · [Quantum Qanary](https://jschulman.github.io/quantum-qanary).

MIT — see [LICENSE](LICENSE).

— Jay Schulman · [jayschulman.com](https://jayschulman.com)
