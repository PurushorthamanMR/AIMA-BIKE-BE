/**
 * Converts docs/MODELS_TABLES.md to docs/MODELS_TABLES.docx with table formatting.
 * Run: node scripts/md-to-docx.mjs
 */
import { convertMarkdownToDocx } from '@mohtasham/md-to-docx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const mdPath = path.join(rootDir, 'docs', 'MODELS_TABLES.md');
const outPath = path.join(rootDir, 'docs', 'MODELS_TABLES.docx');

const markdown = fs.readFileSync(mdPath, 'utf8');
const blob = await convertMarkdownToDocx(markdown);
const buffer = Buffer.from(await blob.arrayBuffer());
fs.writeFileSync(outPath, buffer);
console.log('Created docs/MODELS_TABLES.docx');
