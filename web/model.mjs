function searchText(value) {
  return value.toLowerCase().replace(/[–—]/g, '-');
}

export function listings(rows, city, edition, query) {
  const words = searchText(query).trim().split(/\s+/).filter(Boolean);
  return rows.filter(row => {
    const text = searchText([row.address, row.name, row.trade].join(' '));
    return (city === 'Both cities' || row.city === city) &&
      (edition === 'All editions' || row.edition === edition) && words.every(word => text.includes(word));
  });
}
export function addressKey(row) { return row.city+' · '+row.address; }
export function addressHistory(rows, key) {
  const matches = rows.filter(r => addressKey(r) === key);
  if (!matches.length) return [];
  const editions = [...new Set(rows.filter(r => r.city === matches[0].city).map(r => r.edition))].sort();
  return editions.map(edition => ({edition, entries: matches.filter(r => r.edition === edition)}));
}

export function compareEditions(rows, city, earlier, later) {
  const addresses = new Map();
  for (const row of rows) {
    if (row.city !== city || (row.edition !== earlier && row.edition !== later)) continue;
    if (!addresses.has(row.address)) addresses.set(row.address, {address: row.address, earlier: [], later: []});
    addresses.get(row.address)[row.edition === earlier ? 'earlier' : 'later'].push(row);
  }
  return [...addresses.values()].sort((a, b) => a.address.localeCompare(b.address, 'en', {numeric: true}));
}

export function matchesEvidence(pair, evidence) {
  switch (evidence) {
    case 'Both editions': return pair.earlier.length > 0 && pair.later.length > 0;
    case 'One edition only': return !pair.earlier.length || !pair.later.length;
    case 'Printed vacancy': return [...pair.earlier, ...pair.later].some(row => row.trade === 'Explicit vacancy');
    default: return true;
  }
}
