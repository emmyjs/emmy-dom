const cp = require('child_process')
const fs = require('fs')
try {
  const result = cp.execSync('npm run precommit:check', { encoding: 'utf-8', cwd: __dirname });
  fs.writeFileSync(__dirname + '/check_result.log', 'SUCCESS\n' + result);
} catch (e) {
  fs.writeFileSync(__dirname + '/check_result.log', 'FAILED\n' + e.stdout + '\n' + e.stderr);
}