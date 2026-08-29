import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { compile } from 'svelte/compiler'
import { componentCategories, providerCategories } from '../src/config/catalog'
import { frameworks, getFrameworkSourceAliasPath } from '../src/config/frameworks'
import { rewriteExampleSourceImports } from '../src/utils/example-source'

const docsDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const workspaceDirectory = path.resolve(docsDirectory, '..')
const contentDirectory = path.join(docsDirectory, 'src/content/docs')
const componentDocsDirectory = path.join(contentDirectory, 'components')
const providerDocsDirectory = path.join(contentDirectory, 'providers')
const typeDataDirectory = path.join(docsDirectory, 'src/data/types')
const failures: string[] = []

const components = Object.values(componentCategories).flat()
const providers = Object.values(providerCategories).flat()

function check(condition: unknown, message: string): asserts condition {
  if (!condition)
    failures.push(message)
}

function read(file: string): string {
  return fs.readFileSync(file, 'utf8')
}

function count(text: string, value: string): number {
  return text.split(value).length - 1
}

function sameValues(left: readonly string[], right: readonly string[]): boolean {
  return JSON.stringify([...left].sort()) === JSON.stringify([...right].sort())
}

function hasCamelCaseDataPartSelector(selector: string): boolean {
  const values = [
    ...selector.matchAll(/\[data-part="([^"]*)"\]/g),
    ...selector.matchAll(/\[data-part='([^']*)'\]/g),
  ].map(match => match[1])
  return values.some(value => /[A-Z]/.test(value))
}

function listFiles(root: string, extension?: string): string[] {
  if (!fs.existsSync(root))
    return []

  return fs.readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(root, entry.name)
    if (entry.isDirectory())
      return listFiles(file, extension)
    if (!entry.isFile() || (extension && !entry.name.endsWith(extension)))
      return []
    return [file]
  }).sort()
}

function checkUniqueCatalog(
  name: string,
  entries: readonly { readonly name: string, readonly slug: string }[],
): void {
  const slugs = entries.map(entry => entry.slug)
  const labels = entries.map(entry => entry.name)
  check(new Set(slugs).size === slugs.length, `${name} catalog contains duplicate slugs`)
  check(new Set(labels).size === labels.length, `${name} catalog contains duplicate names`)
}

checkUniqueCatalog('Component', components)
checkUniqueCatalog('Provider', providers)

const componentSlugs = components.map(component => component.slug)
const providerSlugs = providers.map(provider => provider.slug)

for (const framework of frameworks) {
  const componentSourceDirectory = path.join(workspaceDirectory, framework.sourceDirectory)
  const providerSourceDirectory = path.join(workspaceDirectory, framework.providerSourceDirectory)
  const sourceComponents = fs.readdirSync(componentSourceDirectory, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .filter(component => fs.existsSync(path.join(componentSourceDirectory, component, 'examples')))
  const sourceProviders = fs.readdirSync(providerSourceDirectory, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)

  check(
    sameValues(sourceComponents, componentSlugs),
    `${framework.label}: component source directories differ from the catalog`,
  )
  check(
    sameValues(sourceProviders, providerSlugs),
    `${framework.label}: provider source directories differ from the catalog`,
  )

  for (const component of components) {
    const sourceDirectory = path.join(componentSourceDirectory, component.slug)
    const basicExample = path.join(sourceDirectory, 'examples', `Basic.${framework.extension}`)
    check(fs.existsSync(path.join(sourceDirectory, 'index.ts')), `${framework.label}: missing ${component.slug} public entry`)
    check(fs.existsSync(basicExample), `${framework.label}: missing ${component.slug} Basic example`)
  }

  for (const provider of providers) {
    check(
      fs.existsSync(path.join(providerSourceDirectory, provider.slug, 'index.ts')),
      `${framework.label}: missing ${provider.slug} provider entry`,
    )
  }
}

for (const component of components) {
  const page = path.join(componentDocsDirectory, `${component.slug}.mdx`)
  check(fs.existsSync(page), `Missing component page: ${component.slug}`)
  if (!fs.existsSync(page))
    continue

  const source = read(page)
  const frameworkPositions = frameworks.map((framework) => {
    const marker = `<FrameworkContent fw="${framework.id}">`
    check(count(source, marker) === 1, `${component.slug}: expected exactly one ${framework.label} usage block`)
    check(source.includes(framework.packageName), `${component.slug}: missing ${framework.packageName} import`)
    return source.indexOf(marker)
  })

  check(
    frameworkPositions.every((position, index) => index === 0 || frameworkPositions[index - 1] < position),
    `${component.slug}: usage blocks do not follow the framework registry order`,
  )
  check(source.includes(`<ComponentPreview component="${component.slug}"`), `${component.slug}: missing live preview`)
  check(source.includes(`<ComponentTypes id="${component.slug}"`), `${component.slug}: missing API table`)

  for (const framework of frameworks) {
    const typeFile = path.join(typeDataDirectory, framework.id, `${component.slug}.types.json`)
    check(fs.existsSync(typeFile), `${component.slug}: missing generated ${framework.label} type data`)
    if (fs.existsSync(typeFile)) {
      const types = JSON.parse(read(typeFile)) as Record<string, unknown>
      check(Object.keys(types).length > 0, `${component.slug}: generated ${framework.label} type data is empty`)
    }
  }
}

for (const provider of providers) {
  const page = path.join(providerDocsDirectory, `${provider.slug}.mdx`)
  check(fs.existsSync(page), `Missing provider page: ${provider.slug}`)
  if (!fs.existsSync(page))
    continue

  const source = read(page)
  for (const framework of frameworks) {
    check(
      source.includes(`<FrameworkContent fw="${framework.id}">`),
      `${provider.slug}: missing ${framework.label} content`,
    )
    check(source.includes(framework.packageName), `${provider.slug}: missing ${framework.packageName} import`)
  }
  check(source.includes('## API'), `${provider.slug}: missing API section`)
}

let exampleSourceCount = 0
for (const framework of frameworks) {
  const sourceDirectory = path.join(workspaceDirectory, framework.sourceDirectory)
  for (const component of components) {
    const examplesDirectory = path.join(sourceDirectory, component.slug, 'examples')
    for (const file of listFiles(examplesDirectory, `.${framework.extension}`)) {
      exampleSourceCount++
      const transformed = rewriteExampleSourceImports(read(file), framework, file)
      const imports = [...transformed.matchAll(/from\s+['"]([^'"]+)['"]/g)].map(match => match[1])

      check(
        imports.every(specifier => getFrameworkSourceAliasPath(framework, specifier) === null),
        `${path.relative(workspaceDirectory, file)}: displayed source keeps a private alias`,
      )
      for (const specifier of imports.filter(specifier => specifier.startsWith('.'))) {
        const resolvedImport = path.resolve(path.dirname(file), specifier)
        check(
          resolvedImport === examplesDirectory || resolvedImport.startsWith(`${examplesDirectory}${path.sep}`),
          `${path.relative(workspaceDirectory, file)}: displayed source keeps an external relative import (${specifier})`,
        )
      }
    }
  }
}

for (const file of listFiles(path.join(docsDirectory, 'src/components'), '.astro')) {
  check(
    !read(file).includes(':root[data-framework='),
    `${path.relative(docsDirectory, file)}: framework visibility must use the global ds-fw-content rule`,
  )
}

const globalStyles = read(path.join(docsDirectory, 'src/styles/components.css'))
for (const framework of frameworks) {
  check(
    globalStyles.includes(`:root[data-framework='${framework.id}'] .ds-fw-content:not([data-fw='${framework.id}'])`),
    `Global framework visibility is missing ${framework.label}`,
  )
}

for (const framework of frameworks) {
  const wrapper = framework.exampleWrapper
  const wrapperSource = read(path.join(docsDirectory, 'src/components', wrapper))
  check(
    wrapperSource.includes('ds-example-content'),
    `${wrapper}: missing the shared preview content container`,
  )
  check(
    !frameworks.some(candidate => wrapperSource.includes(`ds-${candidate.id}-example`)),
    `${wrapper}: uses a framework-specific preview class`,
  )
}

let previewContentStyleRuleCount = 0
for (const file of listFiles(path.join(docsDirectory, 'src/styles'), '.css')) {
  const source = read(file)
  for (const selectorMatch of source.matchAll(/([^{}]+)\{/g)) {
    const selector = selectorMatch[1]
    if (selector.includes('.ds-example-content'))
      previewContentStyleRuleCount++

    check(
      !frameworks.some(framework => selector.includes(`.ds-${framework.id}-example`)),
      `${path.relative(docsDirectory, file)}: framework-specific example selectors are forbidden`,
    )
    check(
      !/\.ds-example(?![\w-])/.test(selector),
      `${path.relative(docsDirectory, file)}: preview styles must use .ds-example-content`,
    )
    check(
      !hasCamelCaseDataPartSelector(selector),
      `${path.relative(docsDirectory, file)}: data-part selectors must use kebab-case`,
    )
  }
}
check(previewContentStyleRuleCount > 0, 'No shared preview content styles were checked')

let svelteSnippetCount = 0
for (const file of listFiles(contentDirectory, '.mdx')) {
  const source = read(file)
  const relativeFile = path.relative(contentDirectory, file)
  if (relativeFile !== 'index.mdx')
    check(!/^# /m.test(source), `${relativeFile}: page title is duplicated as a Markdown H1`)

  check(
    !source.includes('@destyler-ui/svelte/portal'),
    `${relativeFile}: obsolete Svelte portal subpath import is forbidden`,
  )

  for (const match of source.matchAll(/```svelte\n([\s\S]*?)\n```/g)) {
    svelteSnippetCount++
    check(
      !/<\/?Portal\b/.test(match[1]),
      `${relativeFile}: obsolete Svelte Portal component is forbidden; use the root portal action`,
    )
    try {
      compile(match[1], {
        filename: `${relativeFile}#${svelteSnippetCount}.svelte`,
        generate: 'client',
      })
    }
    catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      failures.push(`${path.relative(contentDirectory, file)}: invalid Svelte snippet: ${message}`)
    }
  }
}
check(
  svelteSnippetCount >= components.length + providers.length,
  `Expected at least ${components.length + providers.length} Svelte snippets, found ${svelteSnippetCount}`,
)

for (const root of [
  path.join(docsDirectory, 'src'),
  path.join(workspaceDirectory, 'packages/svelte/src'),
  path.join(workspaceDirectory, 'template/svelte'),
]) {
  for (const file of listFiles(root)) {
    if (/\bark(?:ui)?\b/i.test(read(file)))
      failures.push(`${path.relative(workspaceDirectory, file)}: contains obsolete Ark naming`)
  }
}

for (const pageName of ['installation', 'getting-started']) {
  const page = read(path.join(contentDirectory, 'overview', `${pageName}.mdx`))
  for (const framework of frameworks) {
    check(
      page.includes(`<FrameworkContent fw="${framework.id}">`),
      `${pageName}: missing ${framework.label} content`,
    )
    check(page.includes(framework.packageName), `${pageName}: missing ${framework.packageName}`)
  }
}

const installationPage = read(path.join(contentDirectory, 'overview/installation.mdx'))
for (const framework of frameworks) {
  const packageJson = JSON.parse(read(path.join(workspaceDirectory, framework.packageDirectory, 'package.json'))) as {
    peerDependencies?: Record<string, string>
  }
  for (const [peer, version] of Object.entries(packageJson.peerDependencies ?? {})) {
    check(
      installationPage.includes(peer) && installationPage.includes(version),
      `installation: missing ${framework.label} requirement ${peer}@${version}`,
    )
  }
}

check(
  !read(path.join(docsDirectory, 'astro.config.ts')).includes('data-docs-placeholder'),
  'Astro config must not replace broken examples with placeholders',
)

if (failures.length > 0) {
  console.error(`Documentation checks failed (${failures.length}):`)
  for (const failure of failures)
    console.error(`  - ${failure}`)
  process.exit(1)
}

console.log([
  'Documentation checks passed:',
  `${components.length} components`,
  `${providers.length} providers`,
  `${exampleSourceCount} example sources`,
  `${svelteSnippetCount} Svelte snippets`,
  `${previewContentStyleRuleCount} shared preview content rules`,
].join(' '))
