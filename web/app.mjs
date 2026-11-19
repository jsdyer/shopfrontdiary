import {$, link, node, options, table, load} from './ui.mjs';
import {listings, addressHistory, addressKey, compareEditions, matchesEvidence} from './model.mjs';
load(data => {
  options('city', ['Both cities', 'Halifax','Vancouver']);
  function source(r) { return link(r.page+' ↗', r.source); }
  const cities = [...new Set(data.rows.map(row => row.city))];
  options('compare-city', cities, 'Halifax');
  options('evidence', ['All addresses', 'Both editions', 'One edition only', 'Printed vacancy']);

  function printedEntries(rows) {
    if (!rows.length) return node('span', 'No entry in this extract', 'missing');
    const entries = node('div', undefined, 'entries');
    for (const row of rows) {
      const entry = node('div');
      entry.append(node('strong', row.name), node('span', row.trade), source(row));
      entries.append(entry);
    }
    return entries;
  }

  function comparison() {
    const city = $('compare-city').value;
    const earlier = $('earlier').value;
    const later = $('later').value;
    const pairs = compareEditions(data.rows, city, earlier, later);
    const shown = pairs.filter(pair => matchesEvidence(pair, $('evidence').value));
    const both = pairs.filter(pair => matchesEvidence(pair, 'Both editions')).length;
    $('pair-summary').textContent = city + ' · ' + both + ' of ' + pairs.length +
      ' exact addresses have entries in both sampled editions. Showing ' + shown.length + '.';
    if (shown.length) {
      table('pairs', ['Historic address', earlier, later],
        shown.map(pair => [pair.address, printedEntries(pair.earlier), printedEntries(pair.later)]));
    } else {
      $('pairs').replaceChildren(node('p', 'No addresses match this evidence filter in the selected pair.'));
    }
  }

  function comparisonYears() {
    return [...new Set(data.rows.filter(row => row.city === $('compare-city').value).map(row => row.edition))].sort();
  }
  function laterYears(preferred) {
    options('later', comparisonYears().filter(year => year > $('earlier').value), preferred);
    comparison();
  }
  function compareCity() {
    const years = comparisonYears();
    const vancouver = $('compare-city').value === 'Vancouver';
    options('earlier', years.slice(0, -1), vancouver ? '1901' : years[0]);
    laterYears(vancouver ? '1903' : years.at(-1));
  }
  $('compare-city').onchange = compareCity;
  $('earlier').onchange = () => laterYears($('later').value);
  $('later').onchange = comparison;
  $('evidence').onchange = comparison;
  compareCity();

  function history() {
    const key = $('address').value;
    const editions = addressHistory(data.rows, key);
    if (!editions.length) {
      $('timeline').replaceChildren();
      $('addressnote').textContent = 'Select a matching address to see its history.';
      return;
    }
    const found = editions.filter(e => e.entries.length).length;
    $('addressnote').textContent = key+' appears in '+found+' of '+editions.length+' selected editions for this city.';
    const timeline = [];
    for (const group of editions) {
      if (!group.entries.length) timeline.push([group.edition,'No listing transcribed for this address in this edition','—','—']);
      for (const row of group.entries) timeline.push([group.edition,row.name,row.trade,source(row)]);
    }
    table('timeline',['Edition','Recorded name','Trade or status','Original'],timeline);
  }
  function render() {
    const found = listings(data.rows,$('city').value,$('edition').value,$('search').value);
    const keys = [...new Set(found.map(addressKey))].sort((a,b) => a.localeCompare(b, 'en', {numeric:true}));
    const old = $('address').value || 'Halifax · 44–46 Upper Water';
    options('address', keys, old);
    $('summary').textContent = found.length+' of '+data.rows.length+' transcribed listings · '+keys.length+' matching '+(keys.length === 1 ? 'address' : 'addresses');
    if (!found.length) {
      $('matches').replaceChildren(node('p','No matches. Try a surname, street name or trade across all editions.','callout'));
    } else {
      table('matches',['Edition','Historic address','Recorded name','Trade or status','Original'],found.map(row => {
        const jump = link(row.address, '#history');
        jump.addEventListener('click', () => { $('address').value = addressKey(row); history(); });
        return [row.edition, jump, row.name, row.trade, source(row)];
      }));
    }
    history();
  }
  function editions() {
    const city = $('city').value;
    const values = [...new Set(data.rows.filter(r => city === 'Both cities' || r.city === city).map(r => r.edition))].sort();
    options('edition', ['All editions',...values]);
    render();
  }
  $('city').onchange = editions; $('edition').onchange = render; $('search').oninput = render; $('address').onchange = history;
  editions();
});
