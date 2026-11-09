const test=require('node:test'), assert=require('node:assert/strict');
const G=require('../static/engine.js');
const solution=s=>G.selected(s,s.active)[s.lang].answers[0];
test('validates current, legacy and damaged saves',()=>{
 const s=G.fresh();assert(G.valid(s));
 for(const bad of [null,{}, {...s,solved:['desk','desk']},{...s,escaped:true},{...s,selection:{desk:'missing'}},{...s,remaining:[s.selection.desk]}])assert.equal(G.valid(bad),false);
 const old={version:1,lang:'de',active:'desk',solved:['desk'],hints:{desk:2,bookshelf:0,painting:0},attempts:2,escaped:false};
 const migrated=G.restore(old);assert(G.valid(migrated));assert.equal(migrated.selection.desk,'desk');assert.deepEqual(migrated.solved,['desk']);assert.equal(migrated.hints.desk,2);
});
test('answer normalization, empty answers and duplicate rewards',()=>{
 const s=G.fresh();assert.equal(G.answer(s,'  '),'empty');assert.equal(s.attempts,0);assert.equal(G.answer(s,'unlock the door'),'wrong');
 assert.equal(G.answer(s,`  ${solution(s).toUpperCase()}!  `),'correct');assert.equal(G.answer(s,solution(s)),'already');assert.equal(s.attempts,2);
});
test('hint limits and stable selection on language changes/save restore',()=>{
 const s=G.fresh(),selection=JSON.stringify(s.selection);for(let i=0;i<3;i++)assert(G.hint(s));assert.equal(G.hint(s),false);s.lang='de';
 assert.equal(JSON.stringify(s.selection),selection);assert.deepEqual(G.restore(s),s);assert.equal(s.hints.desk,3);
});
test('every bank entry is solvable in both languages',()=>{
 for(const key of G.bank)for(const lang of ['en','de']){const s=G.fresh();s.lang=lang;s.selection.desk=key;const p=G.selected(s,'desk')[lang];assert.equal(p.hints.length,3);assert.equal(G.answer(s,p.answers[0]),'correct');}
});
test('full game in both languages prevents early unlock',()=>{
 for(const lang of ['en','de']){const s=G.fresh();s.lang=lang;assert.equal(G.unlock(s,'472'),'locked');for(const obj of G.ids){s.active=obj;assert.equal(G.answer(s,solution(s)),'correct');}assert.equal(G.unlock(s,'111'),'wrongCode');assert.equal(G.unlock(s,'472'),'escaped');assert(G.valid(G.restore(s)));}
});
test('12 distinct riddles each cycle, no repeats across restart boundary',()=>{
 let s=null;for(let cycle=0;cycle<8;cycle++){const seen=new Set();for(let round=0;round<4;round++){const prior=s&&Object.values(s.selection);s=G.fresh(s);assert(G.valid(s));const chosen=Object.values(s.selection);assert.equal(chosen.length,3);if(prior)assert(chosen.every(x=>!prior.includes(x)));for(const x of chosen){assert(!seen.has(x));seen.add(x);}}assert.equal(seen.size,12);}
});
