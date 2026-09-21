import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { privateHostDestination } from '../dev/multiplayer/hostDestination'

test('website entry accepts only explicit printed local host origins without forwarding secrets',()=>{
  for(const host of ['127.0.0.1','localhost','10.0.0.8','172.16.0.2','172.31.255.254','192.168.1.32'])
    assert.equal(privateHostDestination(`http://${host}:5192/`),`http://${host}:5192/`)
  assert.equal(privateHostDestination('  http://192.168.1.32:5193  '),'http://192.168.1.32:5193/')
  for(const value of ['', '192.168.1.32:5192','https://192.168.1.32:5192','javascript:alert(1)',
    'http://example.com:5192','http://8.8.8.8:5192','http://172.32.0.2:5192','http://169.254.169.254/',
    'http://127.0.0.1:5192/?token=private','http://127.0.0.1:5192/#code',
    'http://guest:private@127.0.0.1:5192/','http://127.0.0.1:5192/api/state',
    'http://2130706433:5192/','http://0x7f000001:5192/','http://127.1:5192/',
    'http://192.168.1.1:5192/../','http://192.168.1.1:5192\\@example.com',
    'http://192.168.1.1:5192\n/','http://[::1]:5192/'])
    assert.throws(()=>privateHostDestination(value),undefined,value)
})

test('source and shipped-view lobby expose the same inert web slot; only website styles enable it',()=>{
  const file=(path:string)=>readFileSync(new URL('../'+path,import.meta.url),'utf8')
  assert.match(file('src/App.tsx'),/href="\/dev\/multiplayer\.html"/)
  assert.match(file('src/styles.css'),/\.website-multiplayer\s*\{\s*display:\s*none/)
  assert.match(file('dev/preview.css'),/body\.poker-preview \.website-multiplayer\s*\{\s*display:\s*inline-flex/)
  assert.doesNotMatch(file('src/App.tsx'),/import.*(?:multiplayer\/|server\/)/)
  assert.match(file('dev/multiplayer.html'),/npm run lan -- --lan/)
  assert.match(file('dev/multiplayer.html'),/does not start a server/)
  assert.doesNotMatch(file('dev/multiplayer/main.ts'),/fetch\(|localStorage|sessionStorage|\/api\//)
})
