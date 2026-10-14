import {readFile,writeFile} from 'node:fs/promises';
const hash=await readFile('outputs/admin-password-hash.txt','utf8');
const config=await readFile('.env.local','utf8');
await writeFile('.env.local',config.replace(/^ADMIN_PASSWORD_HASH=.*$/m,`ADMIN_PASSWORD_HASH='${hash}'`),{mode:0o600});
console.log('Local admin hash restored from the private credential file.');
