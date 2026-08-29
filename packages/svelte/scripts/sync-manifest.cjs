const process = require('node:process')
const { syncArtifacts } = require('./package-manifest.cjs')

const check = process.argv.includes('--check')
const changed = syncArtifacts({ check })

if (!check && changed.length > 0)
  process.stdout.write(`Updated ${changed.join(', ')}\n`)
