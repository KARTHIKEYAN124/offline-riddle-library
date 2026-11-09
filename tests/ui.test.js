const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const G=require('../static/engine.js');
function page(storage=new Map()){
 const elements=new Map();
 const element=()=>({style:{},children:[],value:'',replaceChildren(){this.children=[];},append(...items){this.children.push(...items);},setAttribute(){}});
 const get=id=>{if(!elements.has(id))elements.set(id,element());return elements.get(id);};
 const context={Game:G,document:{getElementById:get,createElement:element,documentElement:{}},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},confirm:()=>true};
 vm.createContext(context);vm.runInContext(fs.readFileSync(require.resolve('../static/ui.js'),'utf8'),context);
 return {get,storage,state:()=>JSON.parse(storage.get('riddle-library'))};
}
test('UI saves initial selection, restores on refresh and rotates on restart',()=>{
 const a=page(),first=a.state();assert(G.valid(first));
 const b=page(a.storage);assert.deepEqual(b.state().selection,first.selection);
 assert.equal(b.get('question').textContent,G.selected(first,'desk').en.q);
 b.get('hintButton').onclick();assert.equal(b.state().hints.desk,1);
 b.get('language').onchange({target:{value:'de'}});assert.equal(b.get('question').textContent,G.selected(first,'desk').de.q);
 b.get('restart').onclick();const next=b.state();assert.equal(next.lang,'de');assert.equal(next.hints.desk,0);
 assert(Object.values(next.selection).every(x=>!Object.values(first.selection).includes(x)));
});
test('UI import keeps selection and remaining pool',async()=>{
 const a=page(),saved=G.fresh();await a.get('file').onchange({target:{files:[{size:1000,text:async()=>JSON.stringify(saved)}],value:'save.json'}});
 assert.deepEqual(a.state(),saved);
});
