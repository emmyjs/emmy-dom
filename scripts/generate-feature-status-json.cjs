const fs = require('fs')
const path = require('path')

const ROADMAP_PATH = path.resolve(__dirname, '..', 'ROADMAP.md')
const OUTPUT_PATH = path.resolve(__dirname, '..', 'docs', 'feature-status.json')

const ICON_STATUS_MAP = {
  '✅': 'stable',
  '❌': 'unstable',
  '⚠️': 'experimental',
  '⏳': 'in-progress'
}

function extractSnapshotBlock(markdown) {
  const marker = '## Estado de Features (Snapshot)'
  const start = markdown.indexOf(marker)
  if (start === -1) throw new Error('No se encontro la seccion de snapshot en ROADMAP.md')

  const remainder = markdown.slice(start + marker.length)
  const nextHeadingIndex = remainder.search(/\n##\s+/)
  const block = nextHeadingIndex === -1 ? remainder : remainder.slice(0, nextHeadingIndex)
  return block
}

function parseFeaturesFromRoadmap(markdown) {
  const block = extractSnapshotBlock(markdown)
  const lines = block
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))

  const features = lines.map((line) => {
    const match = line.match(/^-\s+(✅|❌|⚠️|⏳)\s+(.+?):\s+(.+)$/)
    if (!match) {
      throw new Error(`Linea de feature invalida en snapshot: ${line}`)
    }

    const [, icon, name, label] = match
    return {
      name,
      label,
      status: ICON_STATUS_MAP[icon] || 'unknown',
      icon
    }
  })

  return features
}

function buildFeatureStatusJson() {
  const roadmap = fs.readFileSync(ROADMAP_PATH, 'utf8')
  const features = parseFeaturesFromRoadmap(roadmap)

  const summary = features.reduce(
    (acc, feature) => {
      acc.total += 1
      if (feature.status === 'stable') acc.stable += 1
      if (feature.status === 'unstable') acc.unstable += 1
      if (feature.status === 'experimental') acc.experimental += 1
      if (feature.status === 'in-progress') acc.inProgress += 1
      return acc
    },
    { total: 0, stable: 0, unstable: 0, experimental: 0, inProgress: 0 }
  )

  return {
    source: 'ROADMAP.md',
    updatedAt: new Date().toISOString(),
    features,
    summary
  }
}

function generateFeatureStatusJson() {
  const payload = buildFeatureStatusJson()
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(payload, null, 2) + '\n', 'utf8')
  return payload
}

if (require.main === module) {
  const payload = generateFeatureStatusJson()
  console.log(`Feature status JSON generado: ${OUTPUT_PATH}`)
  console.log(`Features: ${payload.summary.total}, Stable: ${payload.summary.stable}`)
}

module.exports = {
  buildFeatureStatusJson,
  generateFeatureStatusJson,
  OUTPUT_PATH
}
