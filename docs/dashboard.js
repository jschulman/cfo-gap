// The CFO Gap — dashboard renderer
// Reads data/latest.json (and recent snapshots) and renders three views:
//   1. Headline stall ratio + phase label
//   2. Per-sub-sector table sorted by stall ratio
//   3. Time series of corpus-wide stall ratio

'use strict';

const PHASES = [
  { max: 0.25, label: 'Fluid',    desc: 'Sector hiring at normal pace; talent is reaching companies.' },
  { max: 0.50, label: 'Tight',    desc: 'Real friction in finding qualified senior finance talent.' },
  { max: 0.75, label: 'Stalled',  desc: 'The talent pipeline is failing the sector.' },
  { max: 1.00, label: 'Drought',  desc: 'Finance org build-outs frozen; outsourcing or compliance failure looms.' },
];

function phaseFor(ratio) {
  for (const p of PHASES) {
    if (ratio <= p.max) return p;
  }
  return PHASES[PHASES.length - 1];
}

function bandClassFor(ratio) {
  if (ratio >= 0.75) return 'high';
  if (ratio >= 0.50) return 'mid';
  return 'low';
}

function formatPct(x) {
  if (x == null || !isFinite(x)) return '—';
  return (x * 100).toFixed(0) + '%';
}

async function loadLatest() {
  const res = await fetch('../data/latest.json', { cache: 'no-store' });
  if (!res.ok) throw new Error('failed to load data/latest.json');
  return res.json();
}

async function loadSnapshots() {
  // Pull the manifest of recent snapshots; if the listing isn't enumerable
  // (it's not on GitHub Pages), fall back to the timeseries embedded in latest.json.
  try {
    const res = await fetch('../data/timeseries.json', { cache: 'no-store' });
    if (res.ok) return res.json();
  } catch {}
  return null;
}

function renderHeadline(data) {
  const ratio = data.headline.stall_ratio;
  const phase = phaseFor(ratio);
  document.getElementById('hero-score').textContent = formatPct(ratio);
  document.getElementById('hero-phase').textContent = phase.label;
  document.getElementById('hero-description').textContent = phase.desc;
  document.getElementById('last-updated').textContent =
    `Last updated: ${data.metadata.last_updated} · n=${data.headline.open_total} open finance listings, ${data.headline.stale_60_plus} stale 60+`;
}

function renderSubsectorTable(data) {
  const rows = (data.by_sub_sector || [])
    .filter(s => s.sub_sector !== '_all_' && s.open > 0)
    .sort((a, b) => b.stall_ratio - a.stall_ratio);

  const tbody = document.getElementById('subsector-tbody');
  if (!rows.length) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--text-secondary);padding:1.5rem;">No data yet</td></tr>';
    return;
  }
  tbody.innerHTML = rows.map(s => {
    const pct = formatPct(s.stall_ratio);
    const cls = bandClassFor(s.stall_ratio);
    const widthPct = Math.max(2, Math.min(100, s.stall_ratio * 100));
    return `
      <tr>
        <td class="subsector-name">${escapeHtml(s.sub_sector)}</td>
        <td class="subsector-numeric">${s.open}</td>
        <td class="subsector-numeric">${s.stale_60_plus}</td>
        <td class="subsector-numeric">
          ${pct}
          <span class="ratio-bar" aria-hidden="true"><span class="ratio-bar-fill ${cls}" style="width:${widthPct}%"></span></span>
        </td>
      </tr>
    `;
  }).join('');
}

function renderTimeline(data, ts) {
  const series = (ts && ts.points) ? ts.points : (data.timeseries || []);
  const labels = series.map(p => p.date);
  const values = series.map(p => Number((p.stall_ratio * 100).toFixed(1)));

  const ctx = document.getElementById('timeline-chart').getContext('2d');
  // eslint-disable-next-line no-new
  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Stall ratio (corpus-wide)',
        data: values,
        borderColor: '#f6c440',
        backgroundColor: 'rgba(246, 196, 64, 0.12)',
        fill: true,
        tension: 0.25,
        pointRadius: series.length > 30 ? 0 : 3,
        pointHoverRadius: 5,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (item) => `${item.parsed.y.toFixed(1)}% stalled`,
          },
        },
      },
      scales: {
        x: {
          ticks: { color: '#8b949e', maxRotation: 0, autoSkip: true, maxTicksLimit: 12 },
          grid:  { color: 'rgba(139,148,158,0.08)' },
        },
        y: {
          min: 0, max: 100,
          ticks: { color: '#8b949e', callback: (v) => v + '%' },
          grid:  { color: 'rgba(139,148,158,0.08)' },
        },
      },
    },
  });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[c]);
}

(async function init() {
  try {
    const [data, ts] = await Promise.all([loadLatest(), loadSnapshots()]);
    renderHeadline(data);
    renderSubsectorTable(data);
    renderTimeline(data, ts);
  } catch (err) {
    document.getElementById('hero-score').textContent = '—';
    document.getElementById('hero-phase').textContent = 'Data unavailable';
    document.getElementById('hero-description').textContent = String(err && err.message ? err.message : err);
    console.error(err);
  }
})();
