const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const process = require('node:process')
const { PACKAGE_ROOT_ENV } = require('./package-manifest.cjs')

const packageRoot = path.resolve(__dirname, '..')
const repositoryRoot = path.resolve(packageRoot, '../..')
const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'destyler-svelte-generator-'))
const fixtureComponents = path.join(fixtureRoot, 'src/lib/components')

function copy(relativePath) {
  const source = path.join(packageRoot, relativePath)
  const destination = path.join(fixtureRoot, relativePath)
  fs.mkdirSync(path.dirname(destination), { recursive: true })
  fs.copyFileSync(source, destination)
}

function runGenerator({
  category = 'Utility',
  displayName = 'Fixture Widget',
  namespace = 'FixtureWidget',
  slug = 'fixture-widget',
} = {}) {
  const plopPackage = require.resolve('plop/package.json')
  const plopCli = path.resolve(path.dirname(plopPackage), require(plopPackage).bin)
  return spawnSync(process.execPath, [
    plopCli,
    'svelte',
    slug,
    displayName,
    namespace,
    category,
  ], {
    cwd: repositoryRoot,
    encoding: 'utf8',
    env: {
      ...process.env,
      [PACKAGE_ROOT_ENV]: fixtureRoot,
      NODE_ENV: 'test',
    },
  })
}

try {
  copy('package.json')
  copy('package-manifest.json')
  copy('src/lib/components/component-categories.ts')
  copy('src/lib/components/index.ts')
  copy('src/lib/providers/provider-categories.ts')
  copy('src/lib/providers/index.ts')
  copy('.storybook/preview.ts')

  const firstRun = runGenerator()
  assert.equal(firstRun.status, 0, firstRun.stderr || firstRun.stdout)

  const componentRoot = path.join(fixtureComponents, 'fixture-widget')
  const generatedFiles = [
    'components/Root.svelte',
    'examples/Basic.svelte',
    'index.ts',
    'namespace.ts',
    'stories/fixture-widget.stories.ts',
    'test/fixture-widget.test.ts',
  ]
  for (const file of generatedFiles)
    assert.equal(fs.existsSync(path.join(componentRoot, file)), true, `Missing generated file: ${file}`)
  assert.equal(fs.existsSync(path.join(componentRoot, 'anatomy.ts')), false)
  assert.equal(fs.existsSync(path.join(componentRoot, 'hooks')), false)

  const generatedRoot = fs.readFileSync(path.join(componentRoot, 'components/Root.svelte'), 'utf8')
  assert.match(generatedRoot, /interface FixtureWidgetRootBaseProps extends PolymorphicProps<'div'>/)
  assert.match(generatedRoot, /Assign<HTMLProps<'div'>, FixtureWidgetRootBaseProps>/)
  assert.match(fs.readFileSync(path.join(componentRoot, 'index.ts'), 'utf8'), /FixtureWidgetRootBaseProps/)
  assert.match(fs.readFileSync(path.join(componentRoot, 'namespace.ts'), 'utf8'), /RootBaseProps/)

  const manifest = JSON.parse(fs.readFileSync(path.join(fixtureRoot, 'package-manifest.json'), 'utf8'))
  assert.deepEqual(manifest.components.at(-1), {
    name: 'Fixture Widget',
    namespace: 'FixtureWidget',
    slug: 'fixture-widget',
    category: 'Utility',
    anatomy: null,
  })

  const barrel = fs.readFileSync(path.join(fixtureComponents, 'index.ts'), 'utf8')
  assert.match(barrel, /export \* from '\.\/fixture-widget\/index\.js'/)
  const categories = fs.readFileSync(path.join(fixtureComponents, 'component-categories.ts'), 'utf8')
  assert.match(categories, /\{ name: 'Fixture Widget', slug: 'fixture-widget' \}/)
  const packageJson = JSON.parse(fs.readFileSync(path.join(fixtureRoot, 'package.json'), 'utf8'))
  assert.deepEqual(packageJson.exports['./fixture-widget'], {
    types: './dist/components/fixture-widget/index.d.ts',
    svelte: './dist/components/fixture-widget/index.js',
    default: './dist/components/fixture-widget/index.js',
  })
  assert.equal(packageJson.exports['./*'], undefined)
  assert.equal(packageJson.exports['./factory'], undefined)

  const snapshot = JSON.stringify({ manifest, barrel, categories, exports: packageJson.exports })
  const secondRun = runGenerator()
  assert.notEqual(secondRun.status, 0, 'A duplicate component generation unexpectedly succeeded')
  const providerCollision = runGenerator({
    slug: 'frame',
    displayName: 'Frame Component',
    namespace: 'FrameComponent',
  })
  assert.notEqual(providerCollision.status, 0, 'A provider subpath collision unexpectedly succeeded')
  const unchanged = JSON.stringify({
    manifest: JSON.parse(fs.readFileSync(path.join(fixtureRoot, 'package-manifest.json'), 'utf8')),
    barrel: fs.readFileSync(path.join(fixtureComponents, 'index.ts'), 'utf8'),
    categories: fs.readFileSync(path.join(fixtureComponents, 'component-categories.ts'), 'utf8'),
    exports: JSON.parse(fs.readFileSync(path.join(fixtureRoot, 'package.json'), 'utf8')).exports,
  })
  assert.equal(unchanged, snapshot)
}
finally {
  fs.rmSync(fixtureRoot, { recursive: true, force: true })
}
