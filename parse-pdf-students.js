const fs = require('fs');
const path = process.argv[2] || 'pdf2-students.txt';
let text;
try {
  text = fs.readFileSync(path, 'utf8');
} catch (e) {
  console.error('File not found:', path);
  process.exit(1);
}
const lines = text.split(/\r?\n/);
const out = [];
for (const line of lines) {
  let trimmed = line.replace(/^\s*\d+\|/, '').trim();
  if (!trimmed || trimmed.startsWith('--') || /^(STU\s|password)/i.test(trimmed)) continue;
  const tabIdx = trimmed.lastIndexOf('\t');
  if (tabIdx === -1) continue;
  const password = trimmed.slice(tabIdx + 1).trim();
  const left = trimmed.slice(0, tabIdx).trim();
  const stuMatch = left.match(/(STU\d+)/);
  if (!stuMatch || !/^[A-Za-z0-9]{6,12}$/.test(password)) continue;
  const code = stuMatch[1];
  const name = left.replace(stuMatch[1], '').replace(/\s+/g, ' ').trim();
  if (name) out.push({ name, code, password });
}
console.log(JSON.stringify(out, null, 0));
