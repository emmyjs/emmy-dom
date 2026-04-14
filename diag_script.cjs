const { execSync } = require('child_process');
const fs = require('fs');
try {
  const out = execSync('npm run build && npm run precommit:check', { cwd: __dirname }).toString();
  fs.writeFileSync(__dirname + '/diag.log', 'SUCCESS\n' + out);
} catch(e) {
  const out = (e.stdout ? e.stdout.toString() : '') + '\n' + (e.stderr ? e.stderr.toString() : '');
  fs.writeFileSync(__dirname + '/diag.log', 'FAILED\n' + out);
}
