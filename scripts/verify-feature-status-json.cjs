const fs = require('fs')
const { buildFeatureStatusJson, OUTPUT_PATH } = require('./generate-feature-status-json.cjs')

function verifyFeatureStatusJson() {
  if (!fs.existsSync(OUTPUT_PATH)) {
    throw new Error('No existe docs/feature-status.json. Ejecuta: npm run status:generate')
  }

  const expected = buildFeatureStatusJson()
  const actual = JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf8'))

  const expectedWithoutTime = { ...expected, updatedAt: 'IGNORED' }
  const actualWithoutTime = { ...actual, updatedAt: 'IGNORED' }

  if (JSON.stringify(expectedWithoutTime) !== JSON.stringify(actualWithoutTime)) {
    throw new Error('docs/feature-status.json desactualizado. Ejecuta: npm run status:generate')
  }

  console.log('Feature status JSON verificado correctamente')
}

try {
  verifyFeatureStatusJson()
}
catch (error) {
  console.error(error.message)
  process.exit(1)
}
