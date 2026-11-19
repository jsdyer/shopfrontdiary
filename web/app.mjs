import {$, link, node, options, table, load} from './ui.mjs';
import {listings, addressHistory, addressKey} from './model.mjs';
load(data => {
  options('city', ['Both cities', 'Halifax','Vancouver']);
  function source(r) { return link(r.page+' ↗', r.source); }
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
