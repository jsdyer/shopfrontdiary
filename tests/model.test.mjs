import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {listings,addressHistory,compareEditions,matchesEvidence} from '../web/model.mjs';
const {rows}=JSON.parse(readFileSync(new URL('../web/data/edition.json',import.meta.url)));
test('An oyster query finds the Rialto; its address history includes both publications',()=>{
  const found=listings(rows,'Halifax','All editions','oySter');
  assert.equal(found.length,1); assert.match(found[0].name,/Rialto/);
  assert.deepEqual(addressHistory(rows,'Halifax · 44–46 Upper Water').map(e=>e.entries.length),[1,1]);
});
test('Transcription gaps are distinct from explicit vacancies',()=>{
  const editions=addressHistory(rows,'Vancouver · 608 Granville');
  assert.equal(editions.find(e=>e.edition==='1903').entries.length,0);
  assert.equal(editions.find(e=>e.edition==='1908').entries[0].trade,'Delicatessen');
  assert.equal(listings(rows,'Halifax','1899–1900','vacancy')[0].address,'80 Upper Water');
});

test('Comparison preserves ranges, multiple entries, explicit vacancies and original links', () => {
  const pairs = compareEditions(rows, 'Halifax', '1890–91', '1899–1900');
  assert.equal(pairs.find(pair => pair.address === '54 Upper Water').later.length, 2);
  assert.equal(pairs.find(pair => pair.address === '54–56 Upper Water').later.length, 0);
  assert.deepEqual(pairs.filter(pair => matchesEvidence(pair, 'Printed vacancy')).map(pair => pair.address),
    ['80 Upper Water', '100–102 Upper Water']);
  assert.ok(listings(rows, 'Halifax', 'All editions', '44-46 upper').length);
  const shops = compareEditions(rows, 'Vancouver', '1901', '1903');
  assert.deepEqual(shops.filter(pair => matchesEvidence(pair, 'Both editions')).map(pair => pair.address), ['413 Hastings W']);
  assert.ok(shops.find(pair => pair.address === '4 Arcade').earlier[0].source.endsWith('751.jpg'));
});
