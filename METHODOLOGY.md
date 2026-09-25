# Methodology

How many observed, open finance listings have remained visible for more than 60 days?

```
persistent_listing_share = open eligible listings older than 60 days / open eligible listings
```

Both counts appear beside the percentage. No open listings means the share is unknown. Groups with fewer than 10 open listings show counts and a small-sample notice rather than a percentage verdict; 10 is a display threshold, not a statistical confidence guarantee. The historical field name `stall_ratio` is retained for compatibility.

A posting is open when the scanner still identifies it as open. Age follows the producer's `age_days_live` observation: whole elapsed days since the scanner first observed the listing. It does not use the employer's publication date. First observation is an imperfect proxy for when recruiting actually began. The numerator uses **strictly more than 60 days**. Hiring-velocity aggregates, where published, count jobs first observed within 7 or 30 days; they do not establish actual opening or hiring dates.

## Eligible finance roles

Controller and assistant-controller variants; finance leadership and CFO; strategic finance; accounting management and leads; senior, financial, staff, fund and other matched accountants; tax management; FP&A; technical accounting and financial reporting; AP/AR; treasury management; internal audit; and SOX/compliance roles. Titles are matched by ordered, case-insensitive patterns. Bookkeeper and payroll-manager capture-only roles are excluded. This includes individual contributors, so “senior finance” does not precisely describe the entire sample.

## Sources and coverage

The private producer polls public Ashby, Greenhouse and Lever job-board feeds and publishes aggregates here. The crypto-native baseline is a selected, evolving employer sample; it is not a census or a representative survey. Company additions, exclusions, title classification, job-board coverage and collection failures can change the sample. Companies without observed eligible jobs are not represented in a JD denominator.

The baseline is retained separately from any expanded panel of incumbent financial businesses. An incumbent employer must not be added to this series simply to widen market observation. Employer type, infrastructure-provider role and use case are separate attributes in the expanded research panel. A crypto-native firm can also provide financial infrastructure.

Daily refresh is the intended cadence. The date shown in the dashboard is the observation date, which can precede publication. A scheduled workflow or recent export is not proof that every employer feed was refreshed successfully. Snapshots live in `data/` and `docs/data/`; the dashboard reads `docs/data/latest.json`.

## Interpretation

Persistent listings may indicate hiring friction, evergreen recruiting, an unchanged job-board entry or revised hiring plans. They do not establish a failed talent pipeline, demand for outsourcing, time-to-fill, or the quality of candidates. A disappeared listing may have been filled, withdrawn, moved or missed by collection.

The dashboard reports sub-sector counts and the baseline history. Sub-sectors are classifications of employers, not disjoint descriptions of every business activity. Small groups are particularly sensitive to one posting.

## Material historical changes

On **2026-06-24**, the producer corrected the open-listing denominator to finance-classified roles and broadened finance title matching. Earlier observations can include a wider role population and are not directly comparable with the corrected series. The current interpretation update does not silently rewrite those observations.

## Missing data and historical comparability

An unknown numerator or a zero/unknown denominator produces an unknown percentage, displayed as `—`; it is never interpreted as 0%. Missing calendar dates and unavailable values remain gaps in charts. A measured zero requires a known, positive denominator. Material definition changes can break comparability even where a chart is continuous.

The 2026-09-25 interpretation update removes unsupported success/failure verdicts. Version 2.0 producer snapshots identify the updated methodology in metadata; older snapshots retain their original version. Original aggregate series and URLs remain available. Generated snapshots are published by the producer, not fabricated by the dashboard.

## Reproducibility

Replicate the selected employer feeds, eligibility rules, title and text patterns, and snapshot date. Keep dated counts and denominators together. Save unique-job and company counts at collection time; do not derive old coverage from today’s database. The private producer owns collection and aggregation; this repository renders the published aggregates.
