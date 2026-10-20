// Run from the repository root: node tests/local-release.mjs
// DOM stubs exercise data paths; this does not replace real browser/device checks.
import { readFile } from 'node:fs/promises';
const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
async function check(html) {

const assert = (ok, message) => { if (!ok) throw Error(message); };
const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]).filter(Boolean);
assert(scripts.length === 1, 'one app script');
assert(!/accounts\.google|googleapis\.com|drive\.google|connectCoreDrive|uploadToCoreDrive/.test(html), 'no active Google path');
const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
for (const match of scripts[0].matchAll(/getElementById\(["']([^"']+)["']\)/g)) assert(ids.has(match[1]), 'missing DOM id: '+match[1]);
const elements = new Map();
const element = id => {
  if (!elements.has(id)) elements.set(id, {value:'', style:{display:'none'}, classList:{add(){},remove(){}}, addEventListener(){}, scrollIntoView(){}});
  return elements.get(id);
};
const document = {getElementById:element, addEventListener(){}, querySelectorAll(){return [];}};
const saved = new Map();
let failStorage = false;
const storage = {getItem:key=>saved.get(key)||null, setItem:(key,value)=>{if(failStorage)throw Error('quota');saved.set(key,value);}};
const captured = {downloads:[],toasts:[],approve:true};
const api = new Function('document','localStorage','confirm','requestAnimationFrame','captured', scripts[0]+
  '\nfunction renderCategories() {}\nfunction renderItems() {}\nfunction toast(message) {captured.toasts.push(message);}\nfunction download(...args) {captured.downloads.push(args);}\nreturn {state,load,save,addItem,exportData,exportText,exportItem,collectionPayload,collectionStatusOf,setCollectionStatus,exportCollectionFolder,importCollectionBackup};'
)(document,storage,()=>captured.approve,fn=>fn(),captured);
api.addItem('Original https://example.org', 'text', 'Notizen', ['test'], true);
assert(saved.has('sammelapp_v2'), 'existing storage key');
const original = JSON.parse(saved.get('sammelapp_v2')).items[0];
api.state.items=[]; api.load();
assert(api.state.items[0].content===original.content, 'reload preserves content');
assert(api.collectionStatusOf(original)==='01_EINGANG', 'missing status is quarantine inbox');
element('collectionStatus').value='02_PRUEFUNG'; api.setCollectionStatus();
assert(api.state.items[0].coreDriveStatus==='02_PRUEFUNG', 'status transition');
api.exportData();
const backup=JSON.parse(captured.downloads.at(-1)[1]);
assert(backup.format==='core-sammler-local' && backup.items[0].coreDriveStatus==='02_PRUEFUNG','local JSON retains status');
api.exportText(); assert(captured.downloads.at(-1)[1].includes(original.content), 'text export retains content');
api.exportItem(original.id); assert(JSON.parse(captured.downloads.at(-1)[1]).items.length===1, 'single item export');
element('collectionStatus').value='04_ARCHIV'; api.exportCollectionFolder();
assert(JSON.parse(captured.downloads.at(-1)[1]).items.length===0, 'status export filter');
const importData=async data=>api.importCollectionBackup({target:{files:[{size:100,text:async()=>JSON.stringify(data)}],value:'x'}});
await importData({...backup, items:[backup.items[0], {...original,id:'new-id'}, {...original,id:'new-id'}]});
assert(api.state.items.length===2, 'ID dedup against collection and within import');
assert(api.state.items[1].content===original.content, 'same content with different ID retained');
await importData({...backup,format:'core-sammler-drive',items:[{...original,id:'legacy',coreDriveStatus:'04_ARCHIV',driveFileId:'history'}]});
assert(api.state.items.at(-1).driveFileId==='history' && api.collectionStatusOf(api.state.items.at(-1))==='04_ARCHIV','legacy metadata preserved');
await importData({items:[{...original,id:'plain'}],categories:[],rules:[]});
assert(api.state.items.some(i=>i.id==='plain'), 'old unversioned JSON import');
const count=api.state.items.length;
await importData({...backup,items:[{id:'bad',content:'bad'}]});
assert(api.state.items.length===count && captured.toasts.at(-1).startsWith('Import fehlgeschlagen'), 'malformed backup leaves state unchanged');
captured.approve=false; await importData({...backup,items:[{...original,id:'cancelled'}]});
assert(api.state.items.length===count,'cancelled import unchanged');
captured.approve=true; failStorage=true; await importData({...backup,items:[{...original,id:'quota'}]});
assert(api.state.items.length===count && captured.toasts.at(-1).includes('quota'),'storage failure leaves state unchanged');
return 'PASS: syntax/startup with DOM stubs, DOM references, no Google path, persistence, status, JSON/text/item/status exports, legacy/plain import, ID dedup, content duplicates, validation/cancel/quota';

}
console.log(await check(html));
