const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../docs/dashboard.js'), 'utf8');
const html = fs.readFileSync(path.join(__dirname, '../docs/index.html'), 'utf8');
const baseline = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/latest.json'), 'utf8'));
async function render(data) {
  const nodes = new Map([...html.matchAll(/id="([^"]+)"/g)].map(([,id]) => [id, {textContent:'',innerHTML:'',style:{},getContext:() => ({id})}]));
  const charts = [];
  const errors = [];
  const context = vm.createContext({
    document: {getElementById: id => { assert.ok(nodes.has(id), `Missing DOM node: ${id}`); return nodes.get(id); }},
    fetch: async () => ({ok:true,json:async() => data}),
    Chart: function(canvas, config) { charts.push({id:canvas.id, ...config}); },
    console: {error:error => errors.push(error)},
  });
  vm.runInContext(source, context);
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(errors.length, 0, errors.map(String).join(' | '));
  return {nodes, charts, get:id => nodes.get(id).textContent, context};
}

test('existing published snapshot renders without invented data', async () => {
  const page = await render(structuredClone(baseline));
  assert.ok(page.charts.length > 0);
  assert.doesNotMatch(page.get('hero-score'), /NaN|undefined/);
  for (const chart of page.charts) assert.equal(chart.data.datasets[0].spanGaps, false);
});

test('a missing calendar day remains an explicit chart gap', async () => {
  const data = structuredClone(baseline);
  data.timeseries = [{...data.timeseries.at(-1),date:'2026-09-01'}, {...data.timeseries.at(-1),date:'2026-09-03'}];
  const page = await render(data);
  assert.equal(page.charts[0].data.labels[1], '2026-09-02');
  assert.equal(page.charts[0].data.datasets[0].data[1], null);
});

test('snapshot observation date takes precedence over export date', async () => {
  const data = structuredClone(baseline);
  data.metadata.last_updated = '2099-01-01';
  data.metadata.as_of_date = '2026-08-01';
  const page = await render(data);
  assert.match(page.get('last-updated'), /Observation: 2026-08-01/);
  assert.doesNotMatch(page.get('last-updated'), /2099/);
});

test('zero denominator is unknown and small groups show counts', async () => {
  const data = structuredClone(baseline);
  data.headline = {open_total:0,stale_60_plus:0,stall_ratio:0};
  data.timeseries = [{date:'2026-09-25',open_total:0,stale_60_plus:0,stall_ratio:0}];
  data.by_sub_sector = [{sub_sector:'small',open:1,stale_60_plus:1,stall_ratio:1},{sub_sector:'empty',open:0,stale_60_plus:0,stall_ratio:0}];
  const page = await render(data);
  assert.equal(page.get('hero-score'), '—');
  assert.equal(page.charts[0].data.datasets[0].data[0], null);
  assert.match(page.nodes.get('subsector-tbody').innerHTML, /Small sample/);
  assert.doesNotMatch(page.nodes.get('subsector-tbody').innerHTML, /100%|0%/);
});

test('a measured zero remains zero and a small headline uses counts', async () => {
  const data = structuredClone(baseline);
  data.headline = {open_total:10,stale_60_plus:0,stall_ratio:0};
  assert.equal((await render(data)).get('hero-score'), '0%');
  data.headline = {open_total:2,stale_60_plus:1,stall_ratio:0.5};
  assert.equal((await render(data)).get('hero-score'), '1 / 2');
});

test('isolated known observations remain visible in sparse long history', async () => {
  const page = await render(structuredClone(baseline));
  vm.runInContext(`lineChart('timeline-chart', Array.from({length: 40}, (_, i) => ({date: String(i)})), Array.from({length: 40}, (_, i) => i === 39 ? 12 : null), 'test')`, page.context);
  const points = page.charts.at(-1).data.datasets[0].pointRadius;
  assert.equal(points[39], 3);
  assert.equal(points[38], 0);
});
