import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { compile } from 'svelte/compiler'
import ts from 'typescript'
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

function findTypeScriptEntry(root: string): string | null {
  for (const fileName of ['index.ts', 'index.tsx']) {
    const candidate = path.join(root, fileName)
    if (fs.existsSync(candidate))
      return candidate
  }
  return null
}

function getPublicExportNames(framework: typeof frameworks[number]): Set<string> | null {
  const entry = findTypeScriptEntry(path.join(workspaceDirectory, framework.sourceRoot))
  if (!entry) {
    failures.push(`${framework.label}: unable to find public package entry`)
    return null
  }
  const program = ts.createProgram([entry], {
    allowJs: true,
    jsx: ts.JsxEmit.Preserve,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    skipLibCheck: true,
    target: ts.ScriptTarget.ESNext,
  })
  const sourceFile = program.getSourceFile(entry)
  const moduleSymbol = sourceFile && program.getTypeChecker().getSymbolAtLocation(sourceFile)

  if (!moduleSymbol) {
    failures.push(`${framework.label}: unable to inspect public package exports`)
    return null
  }

  return new Set(program.getTypeChecker().getExportsOfModule(moduleSymbol).map(symbol => symbol.name))
}

function getScriptSource(source: string, framework: typeof frameworks[number]): string {
  if (framework.extension === 'tsx')
    return source

  return [...source.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)]
    .map(match => match[1])
    .join('\n')
}

interface TypeScriptSnippet {
  fileName: string
  label: string
  source: string
}

function checkTypeScriptSnippets(snippets: TypeScriptSnippet[]): void {
  const configFileName = path.join(workspaceDirectory, 'packages/solid/tsconfig.json')
  const configFile = ts.readConfigFile(configFileName, ts.sys.readFile)
  if (configFile.error) {
    failures.push(ts.flattenDiagnosticMessageText(configFile.error.messageText, '\n'))
    return
  }

  const parsedConfig = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    path.dirname(configFileName),
    {
      declaration: false,
      noEmit: true,
      noUnusedLocals: false,
      noUnusedParameters: false,
    },
    configFileName,
  )
  for (const diagnostic of parsedConfig.errors) {
    failures.push(`Solid snippet compiler config: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`)
  }

  const snippetSources = new Map(snippets.map(snippet => [path.resolve(snippet.fileName), snippet.source]))
  const defaultHost = ts.createCompilerHost(parsedConfig.options)
  const host: ts.CompilerHost = {
    ...defaultHost,
    fileExists: fileName => snippetSources.has(path.resolve(fileName)) || defaultHost.fileExists(fileName),
    readFile: fileName => snippetSources.get(path.resolve(fileName)) ?? defaultHost.readFile(fileName),
    getSourceFile(fileName, languageVersionOrOptions, onError, shouldCreateNewSourceFile) {
      const source = snippetSources.get(path.resolve(fileName))
      if (source !== undefined)
        return ts.createSourceFile(fileName, source, languageVersionOrOptions, true, ts.ScriptKind.TSX)
      return defaultHost.getSourceFile(fileName, languageVersionOrOptions, onError, shouldCreateNewSourceFile)
    },
  }
  const program = ts.createProgram([...snippetSources.keys()], parsedConfig.options, host)
  const snippetByFileName = new Map(snippets.map(snippet => [path.resolve(snippet.fileName), snippet]))

  for (const diagnostic of ts.getPreEmitDiagnostics(program)) {
    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
    if (!diagnostic.file) {
      failures.push(`Solid snippet compiler: ${message}`)
      continue
    }
    const snippet = snippetByFileName.get(path.resolve(diagnostic.file.fileName))
    if (!snippet)
      continue

    const start = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start ?? 0)
    failures.push(`${snippet.label}:${start.line + 1}:${start.character + 1}: invalid Solid TSX snippet: ${message}`)
  }
}

function getNamedImports(source: string, moduleSpecifier: string): string[] {
  const sourceFile = ts.createSourceFile('displayed-example.tsx', source, ts.ScriptTarget.ESNext, true, ts.ScriptKind.TSX)
  const names: string[] = []

  for (const statement of sourceFile.statements) {
    if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier))
      continue
    if (statement.moduleSpecifier.text !== moduleSpecifier || !statement.importClause)
      continue

    if (statement.importClause.name)
      names.push('default')

    const bindings = statement.importClause.namedBindings
    if (bindings && ts.isNamedImports(bindings)) {
      for (const element of bindings.elements)
        names.push((element.propertyName ?? element.name).text)
    }
  }

  return names
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
    check(!!findTypeScriptEntry(sourceDirectory), `${framework.label}: missing ${component.slug} public entry`)
    check(fs.existsSync(basicExample), `${framework.label}: missing ${component.slug} Basic example`)
  }

  for (const provider of providers) {
    check(
      !!findTypeScriptEntry(path.join(providerSourceDirectory, provider.slug)),
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

for (const pageName of ['format', 'locale']) {
  const source = read(path.join(providerDocsDirectory, `${pageName}.mdx`))
  const vueContent = [...source.matchAll(/<FrameworkContent fw="vue">([\s\S]*?)<\/FrameworkContent>/g)]
    .map(match => match[1])
    .join('\n')
  check(vueContent, `${pageName}: missing Vue content`)
  if (vueContent) {
    check(
      !/<Format\.Number\b[^>]*\s(?:v-bind:|:)?style=/.test(vueContent),
      `${pageName}: Vue Format.Number must use format-style instead of the native style attribute`,
    )
    check(
      /<Format\.Number\b[^>]*\sformat-style=/.test(vueContent),
      `${pageName}: missing Vue Format.Number format-style example`,
    )
  }
}

let exampleSourceCount = 0
for (const framework of frameworks) {
  const sourceDirectory = path.join(workspaceDirectory, framework.sourceDirectory)
  const publicExportNames = getPublicExportNames(framework)
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

      if (publicExportNames) {
        const publicImports = getNamedImports(getScriptSource(transformed, framework), framework.packageName)
        for (const importedName of publicImports) {
          check(
            publicExportNames.has(importedName),
            `${path.relative(workspaceDirectory, file)}: displayed source imports non-public ${importedName} from ${framework.packageName}`,
          )
        }
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
  check(
    !wrapperSource.includes('observeVisibility'),
    `${wrapper}: must rely on ComponentPreview client:visible instead of adding a second visibility gate`,
  )
}

const componentPreviewSource = read(path.join(docsDirectory, 'src/components/ComponentPreview.astro'))
check(
  count(componentPreviewSource, 'client:visible') === frameworks.length,
  'ComponentPreview must hydrate each framework preview with client:visible',
)

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

let solidSnippetCount = 0
let svelteSnippetCount = 0
const solidSnippets: TypeScriptSnippet[] = []
for (const file of listFiles(contentDirectory, '.mdx')) {
  const source = read(file)
  const relativeFile = path.relative(contentDirectory, file)
  if (relativeFile !== 'index.mdx')
    check(!/^# /m.test(source), `${relativeFile}: page title is duplicated as a Markdown H1`)

  check(
    !source.includes('@destyler-ui/svelte/portal'),
    `${relativeFile}: obsolete Svelte portal subpath import is forbidden`,
  )

  for (const frameworkMatch of source.matchAll(/<FrameworkContent fw="solid">([\s\S]*?)<\/FrameworkContent>/g)) {
    const solidContent = frameworkMatch[1]
    const snippetMatches = [
      ...solidContent.matchAll(/^```tsx\b[^\r\n]*\r?\n([\s\S]*?)\r?\n```[ \t]*\r?$/gm),
    ]
    const tsxFenceCount = [...solidContent.matchAll(/^```tsx\b[^\r\n]*\r?$/gm)].length
    check(
      snippetMatches.length === tsxFenceCount,
      `${relativeFile}: Solid usage block contains an unrecognized TSX fence`,
    )
    if (relativeFile.startsWith('components/') || relativeFile.startsWith('providers/')) {
      check(snippetMatches.length > 0, `${relativeFile}: Solid usage block is missing a TSX snippet`)
    }

    for (const snippetMatch of snippetMatches) {
      solidSnippetCount++
      solidSnippets.push({
        fileName: path.join(workspaceDirectory, 'packages/solid/.docs-snippets', `snippet-${solidSnippetCount}.tsx`),
        label: `${relativeFile}#${solidSnippetCount}`,
        source: snippetMatch[1],
      })
    }
  }

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
checkTypeScriptSnippets(solidSnippets)
check(
  solidSnippetCount >= components.length + providers.length,
  `Expected at least ${components.length + providers.length} Solid snippets, found ${solidSnippetCount}`,
)
check(
  svelteSnippetCount >= components.length + providers.length,
  `Expected at least ${components.length + providers.length} Svelte snippets, found ${svelteSnippetCount}`,
)

for (const root of [
  path.join(docsDirectory, 'src'),
  path.join(workspaceDirectory, 'packages/solid/src'),
  path.join(workspaceDirectory, 'packages/svelte/src'),
  path.join(workspaceDirectory, 'template/solid'),
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
  `${solidSnippetCount} Solid snippets`,
  `${svelteSnippetCount} Svelte snippets`,
  `${previewContentStyleRuleCount} shared preview content rules`,
].join(' '))
