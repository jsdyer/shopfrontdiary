import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {listings,addressHistory} from '../web/model.mjs';
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
