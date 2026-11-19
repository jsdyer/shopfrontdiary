export const $ = id => document.getElementById(id);
export function node(tag, text, cls) {
  const el = document.createElement(tag);
  if (text !== undefined) el.textContent = text;
  if (cls) el.className = cls;
  return el;
}
export function link(text, href) {
  const el = node('a', text);
  el.href = href;
  return el;
}
export function options(id, values, selected) {
  const select = $(id);
  select.replaceChildren(...values.map(value => new Option(value, value)));
  if (values.includes(selected)) select.value = selected;
}
export function table(id, headers, rows) {
  const grid = node('table');
  const thead = grid.createTHead().insertRow();
  for (const heading of headers) {
    const th = node('th', heading);
    th.scope = 'col';
    thead.append(th);
  }
  const body = grid.createTBody();
  for (const values of rows) {
    const row = body.insertRow();
    for (const value of values) {
      const cell = row.insertCell();
      cell.append(value instanceof Node ? value : document.createTextNode(String(value)));
    }
  }
  $(id).replaceChildren(grid);
}
export async function load(render) {
  try {
    const resp = await fetch('./data/edition.json');
    if (!resp.ok) throw new Error('missing snapshot');
    const data = await resp.json();
    $('metadata').textContent = data.coverage + ' · Data retrieved ' + data.retrieved.slice(0, 10);
    render(data);
  } catch (error) {
    $('error').textContent = 'The data could not be displayed. Reload the page or open the source and instructions above.';
    console.error(error);
  }
}
