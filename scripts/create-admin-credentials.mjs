import {randomBytes,scryptSync} from 'node:crypto';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
const password=randomBytes(24).toString('base64url');const salt=randomBytes(16).toString('hex');const hash='scrypt:'+salt+':'+scryptSync(password,salt,64,{N:32768,r:8,p:1,maxmem:64*1024*1024}).toString('hex');
await mkdir('outputs',{recursive:true});
await writeFile('outputs/initial-admin-login.txt',`Bebin Tech administrator\nEmail: bbebinr@gmail.com\nPassword: ${password}\n\nKeep this file private. It is excluded from deployment and Git.\n`,{mode:0o600,flag:'wx'});
await writeFile('outputs/admin-password-hash.txt',hash,{mode:0o600,flag:'wx'});
let environment='';try{environment=await readFile('.env.local','utf8');}catch{}
if(!environment.includes('ADMIN_PASSWORD_HASH='))await writeFile('.env.local',environment+`\nADMIN_EMAIL=bbebinr@gmail.com\nADMIN_PASSWORD_HASH='${hash}'\n`,{mode:0o600});
console.log('Created private administrator credentials in outputs/initial-admin-login.txt. Password was not printed.');
