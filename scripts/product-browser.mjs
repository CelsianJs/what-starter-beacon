import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync, mkdirSync } from 'node:fs';
import { join, extname } from 'node:path';
import { chromium } from 'playwright';
const name='beacon';
const routes=["/","/sessions/state-at-the-edge","/speakers/sol-rao","/agenda?session=state-at-the-edge"];
const root=join(process.cwd(),'dist/static');
const server=createServer((req,res)=>{let path=join(root,new URL(req.url,'http://local').pathname);if(!extname(path))path=join(path,'index.html');if(!existsSync(path)||statSync(path).isDirectory()){path=join(root,'404.html');res.statusCode=404;}res.setHeader('content-type',path.endsWith('.js')?'text/javascript':path.endsWith('.css')?'text/css':'text/html');res.end(readFileSync(path));});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch();mkdirSync('.screenshots',{recursive:true});
try{
for(const width of [1440,390]){
 const page=await browser.newPage({viewport:{width,height:1000},acceptDownloads:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const [index,route] of routes.entries()){await page.goto(base+route,{waitUntil:'networkidle'});assert.equal(await page.locator('h1').count(),1);assert.ok(await page.evaluate(()=>Math.max(document.body.scrollWidth,document.documentElement.scrollWidth)<=innerWidth),route+' overflow');await page.screenshot({path:'.screenshots/'+name+'-depth-'+index+'-'+width+'.png',fullPage:true});}
 await page.getByRole('button',{name:'Save selected session'}).click();await page.getByRole('button',{name:'Show saved agenda'}).click();assert.equal(await page.locator('.session').count(),1);const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'Export ICS'}).click();const download=await downloadPromise;assert.equal(download.suggestedFilename(),'beacon-agenda.ics');assert.ok((await page.locator('#ics-export').inputValue()).includes('SUMMARY:State at the edge'));await download.saveAs('.screenshots/beacon-agenda-'+width+'.ics');
 assert.deepEqual(errors,[]);await page.close();
}
const staticPage=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:1000}});
for(const route of routes){await staticPage.goto(base+route);assert.equal(await staticPage.locator('h1').count(),1);assert.ok((await staticPage.locator('main').textContent()).length>120);}
await staticPage.close();console.log('ok beacon product flow, 1440/390 geometry, errors and no-JS routes');
}finally{await browser.close();server.close();}
