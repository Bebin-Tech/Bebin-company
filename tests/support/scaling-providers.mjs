// Opt-in provider doubles for isolated capacity/regression tests only.
// This file is never imported by application code or deployed as a route.
import {readFile, appendFile} from 'node:fs/promises';
import nodemailer from 'nodemailer';

if (process.env.SCALING_TEST_MODE !== 'isolated' || !process.env.TURSO_DATABASE_URL?.startsWith('file:') || process.env.VERCEL === '1') {
  throw Error('Scaling provider doubles require an isolated local database.');
}
const originalFetch = globalThis.fetch;
globalThis.fetch = async (input, init) => {
  const url = new URL(typeof input === 'string' || input instanceof URL ? input : input.url);
  if (url.hostname === process.env.SHOPIFY_STORE_DOMAIN) {
    await appendFile(process.env.SCALING_TEST_CALLS, 'catalogue\n');
    const projects = JSON.parse(await readFile(process.env.SCALING_TEST_CATALOGUE, 'utf8'));
    return Response.json({data: {products: {nodes: projects}}});
  }
  return originalFetch(input, init);
};
nodemailer.createTransport = () => ({
  async sendMail(message) {
    if (!message.to.endsWith('@example.test')) throw Error('Only isolated test recipients are allowed.');
    await appendFile(process.env.SCALING_TEST_EMAILS, 'delivery\n');
    await new Promise(resolve => setTimeout(resolve, 75));
    return {messageId: 'isolated-test'};
  },
});
