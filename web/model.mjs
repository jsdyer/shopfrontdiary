export function listings(rows, city, edition, query) {
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return rows.filter(row => {
    const text = [row.address, row.name, row.trade].join(' ').toLowerCase();
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
