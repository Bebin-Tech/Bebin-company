import {createClient} from '@libsql/client';
import {readFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
if(!process.env.TURSO_DATABASE_URL)throw Error('Configure TURSO_DATABASE_URL before applying migrations.');
const db=createClient({url:process.env.TURSO_DATABASE_URL,authToken:process.env.TURSO_AUTH_TOKEN});
await db.execute('CREATE TABLE IF NOT EXISTS bebin_migrations (name TEXT PRIMARY KEY, checksum TEXT NOT NULL, applied_at TEXT NOT NULL)');
for(const name of (await readdir('migrations')).filter(n=>n.endsWith('.sql')).sort()){const sql=await readFile('migrations/'+name,'utf8'),checksum=createHash('sha256').update(sql).digest('hex');const existing=await db.execute({sql:'SELECT checksum FROM bebin_migrations WHERE name=?',args:[name]});if(existing.rows.length){if(existing.rows[0].checksum!==checksum)throw Error('Applied migration changed: '+name);continue;}const transaction=await db.transaction('write');try{for(const statement of sql.split(';').map(v=>v.replace(/--> statement-breakpoint/g,'').trim()).filter(Boolean))await transaction.execute(statement);await transaction.execute({sql:'INSERT INTO bebin_migrations(name,checksum,applied_at) VALUES (?,?,?)',args:[name,checksum,new Date().toISOString()]});await transaction.commit();console.log('Applied '+name);}catch(error){await transaction.rollback();throw error;}finally{transaction.close();}}
db.close();
