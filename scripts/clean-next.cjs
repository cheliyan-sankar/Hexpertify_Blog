const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();

function rm(relPath) {
  const fullPath = path.join(projectRoot, relPath);
  try {
    fs.rmSync(fullPath, { recursive: true, force: true });
    // eslint-disable-next-line no-console
    console.log(`[clean] removed ${relPath}`);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(`[clean] failed to remove ${relPath}:`, e?.message || e);
  }
}

rm('.next');
rm('.turbo');
