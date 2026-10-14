import {readFile} from 'node:fs/promises';
import {spawn} from 'node:child_process';
const cli='C:/Users/bbebi/AppData/Local/npm-cache/_npx/67eb4586ca667318/node_modules/vercel/dist/index.js';
const scope='team_npek8eaeKgCQKbJcY7dXFnfr';
const passwordHash=await readFile('outputs/admin-password-hash.txt','utf8');
for(const [key,value] of [['ADMIN_EMAIL','bbebinr@gmail.com'],['ADMIN_PASSWORD_HASH',passwordHash],['NEXT_PUBLIC_SITE_URL','https://bebin-tech-projects.vercel.app']]){for(const target of ['production','preview','development']){await new Promise((resolve,reject)=>{const child=spawn(process.execPath,[cli,'--scope',scope,'env','add',key,target,'--force',...(key==='ADMIN_PASSWORD_HASH'?['--sensitive']:[])],{stdio:['pipe','inherit','inherit'],env:{...process.env,ComSpec:'C:/Windows/System32/cmd.exe'}});child.stdin.end(value);child.on('error',reject);child.on('exit',code=>code===0?resolve():reject(Error('Could not configure '+key+' for '+target)));});}}
