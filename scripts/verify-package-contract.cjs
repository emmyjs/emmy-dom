/* eslint no-console:0 */

const fs = require('fs')
const path = require('path')
const {execSync} = require('child_process')

const ROOT = process.cwd()
const PACKAGE_JSON_PATH = path.join(ROOT, 'package.json')

const fail = message => {
  console.error(`[package-contract] ${message}`)
  process.exit(1)
}

const ensureFileExists = (relativePath, label) => {
  const fullPath = path.join(ROOT, relativePath)
  if (!fs.existsSync(fullPath)) {
    fail(`${label} does not exist: ${relativePath}`)
  }
}

const toPackPath = relativePath => relativePath.replace(/^\.\//, '')

const readPackageJson = () => JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'))

const normalizeExportTarget = target => {
  if (typeof target === 'string') return [target]
  if (!target || typeof target !== 'object') return []

  const values = []
  for (const value of Object.values(target)) {
    values.push(...normalizeExportTarget(value))
  }
  return values
}

const getPackedFiles = () => {
  const output = execSync('npm pack --json --dry-run', {encoding: 'utf8'})
  const parsed = JSON.parse(output)
  const packInfo = Array.isArray(parsed) ? parsed[0] : parsed

  if (!packInfo || !Array.isArray(packInfo.files)) {
    fail('Could not inspect npm pack output')
  }

  return new Set(packInfo.files.map(file => file.path))
}

const main = () => {
  const pkg = readPackageJson()

  if (!pkg.exports || typeof pkg.exports !== 'object') {
    fail('package.json must define an exports map')
  }

  if (!Array.isArray(pkg.files) || !pkg.files.includes('dist/')) {
    fail('package.json files must include dist/')
  }

  if (!pkg.main || !pkg.main.startsWith('dist/')) {
    fail('package.json main must point to dist/')
  }

  ensureFileExists(pkg.main, 'main entrypoint')

  const exportTargets = normalizeExportTarget(pkg.exports)
  if (exportTargets.length === 0) {
    fail('No export targets found in package.json exports')
  }

  exportTargets.forEach(target => {
    if (!target.startsWith('./dist/')) {
      fail(`Export target must point to ./dist/: ${target}`)
    }
    ensureFileExists(target, 'export target')
  })

  const packedFiles = getPackedFiles()

  exportTargets.forEach(target => {
    const packPath = toPackPath(target)
    if (!packedFiles.has(packPath)) {
      fail(`Export target missing from npm package: ${packPath}`)
    }
  })

  const mainPackPath = toPackPath(`./${pkg.main}`)
  if (!packedFiles.has(mainPackPath)) {
    fail(`Main entrypoint missing from npm package: ${mainPackPath}`)
  }

  const hasSourceLeak = [...packedFiles].some(file => file.startsWith('src/'))
  if (hasSourceLeak) {
    fail('npm package should not include source files under src/')
  }

  const hasTestLeak = [...packedFiles].some(file => file.startsWith('test/'))
  if (hasTestLeak) {
    fail('npm package should not include tests under test/')
  }

  console.log('[package-contract] OK: exports/files/dist contract is valid')
}

main()
