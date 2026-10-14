import {createClient} from '@libsql/client';
import {get,del} from '@vercel/blob';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
const db=createClient({url:process.env.TURSO_DATABASE_URL,authToken:process.env.TURSO_AUTH_TOKEN});
const checksum=bytes=>createHash('sha256').update(bytes).digest('hex');
const logoChecksum=checksum(await readFile('public/bebin-logo.png'));
const records=await db.execute('SELECT id,blob_url FROM media');
const company=await db.execute("SELECT value FROM settings WHERE key='company'");
const founder=company.rows.length?JSON.parse(company.rows[0].value).founderImage:'';
for(const record of records.rows){const path='/api/media/'+record.id;const references=await db.execute({sql:'SELECT id FROM content WHERE image=?',args:[path]});if(references.rows.length||founder===path)continue;const file=await get(record.blob_url,{access:'private'});if(!file||file.statusCode!==200)continue;const bytes=Buffer.from(await new Response(file.stream).arrayBuffer());if(checksum(bytes)!==logoChecksum)continue;await del(record.blob_url);await db.execute({sql:'DELETE FROM media WHERE id=?',args:[record.id]});console.log('Removed unreferenced integration-test logo upload.');}
db.close();
