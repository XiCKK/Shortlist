import { readFile, writeFile } from 'node:fs/promises';

const base = new URL('./dist/', import.meta.url);
const html = await readFile(new URL('index.html', base), 'utf8');
const data = (await readFile(new URL('data.js', base), 'utf8')).replace(/^export /gm, '');
const app = (await readFile(new URL('app.js', base), 'utf8')).replace(/^import .*\n/, '');
const motion = await readFile(new URL('assets/motion.js', base), 'utf8');
const inline = source => source.replace(/<\/script/gi, '<\\/script');
const offline = html.replace('<script type="module" src="app.js"></script>', `<script type="module">\n${inline(data)}\n${inline(app)}\n</script>`).replace('<script type="module" src="assets/motion.js"></script>', `<script type="module">\n${inline(motion)}\n</script>`);
await writeFile(new URL('Shortlist.html', base), offline);
console.log('Created dist/Shortlist.html — opens directly without a server.');
