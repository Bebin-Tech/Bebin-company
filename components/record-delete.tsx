'use client';
import { useState } from 'react';
import { api } from '@/lib/client';
export function RecordDelete({resource,id,onDeleted}:{resource:'enquiries'|'orders';id:string;onDeleted:()=>void}){const [busy,setBusy]=useState(false),[error,setError]=useState('');async function remove(){if(!window.confirm('Permanently delete this customer record? This action cannot be undone.'))return;setBusy(true);setError('');try{await api(`/api/admin/${resource}/${id}`,'DELETE');onDeleted();}catch(err){setError((err as Error).message);}finally{setBusy(false);}}return <><button className="record-delete" onClick={remove} disabled={busy}>{busy?'Deleting…':'Delete customer record'}</button>{error&&<p className="message-error" role="alert">{error}</p>}</>;}
