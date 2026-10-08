import { execFileSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const docsRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const repoRoot = path.resolve(docsRoot, '..')
const docsRequire = createRequire(import.meta.url)
const astroRequire = createRequire(docsRequire.resolve('astro'))
const { transform } = astroRequire('@astrojs/compiler')
const baseline = 'a87edc624aa9610e6059c690874ac247d10feaa0'

/** @returns {{ name: string, enforce: 'pre', load(id: string): Promise<{ code: string, map: null } | undefined> }} A docs-only loader compatible with the installed Vite and Vitest plugin hooks. */
export function astroClientContracts() {
  return {
    name: 'actual-astro-client-contracts',
    enforce: 'pre',
    async load(id) {
      const [file, query] = id.split('?')
      if (query !== 'client-contract' && query !== 'client-contract=baseline')
        return
      if (!file.startsWith(`${docsRoot}/src/components/`) || !file.endsWith('.astro'))
        throw new Error('Client contracts are restricted to docs Astro components')
      const source = query.endsWith('=baseline')
        ? execFileSync('git', ['show', `${baseline}:${path.relative(repoRoot, file).split(path.sep).join('/')}`], { cwd: repoRoot, encoding: 'utf8' })
        : await readFile(file, 'utf8')
      const result = await transform(source, { filename: file })
      const scripts = result.scripts.map(script => ts.transpileModule(script.code, {
        compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
      }).outputText)
      return { code: `export default ${JSON.stringify(scripts)}`, map: null }
    },
  }
}
