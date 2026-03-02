import type { HighlighterCore } from 'shiki/core'
import type { ShikiTransformer } from '@shikijs/types'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import { transformerTwoslash } from '@shikijs/twoslash'
import { createTwoslasher as createTwoslasherVue } from 'twoslash-vue'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const workspaceRoot = path.resolve(__dirname, '../../..')

/**
 * Shared TypeScript compilerOptions for Twoslash so it can resolve
 * `@destyler-ui/vue` and `@destyler-ui/react` to the actual source.
 */
const twoslashCompilerOptions: import('typescript').CompilerOptions = {
  baseUrl: workspaceRoot,
  paths: {
    '@destyler-ui/vue': ['./packages/vue/src/index.ts'],
    '@destyler-ui/react': ['./packages/react/src/index.ts'],
  },
  // Needed for TSX examples using React JSX transform
  jsx: 4 /* JsxEmit.ReactJSX */,
  strict: false,
  skipLibCheck: true,
}

let highlighterPromise: Promise<HighlighterCore> | null = null

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      engine: createJavaScriptRegexEngine(),
      themes: [
        import('shiki/themes/vitesse-dark.mjs'),
        import('shiki/themes/vitesse-light.mjs'),
      ],
      langs: [
        import('shiki/langs/vue.mjs'),
        import('shiki/langs/vue-html.mjs'),
        import('shiki/langs/tsx.mjs'),
        import('shiki/langs/typescript.mjs'),
        import('shiki/langs/shellscript.mjs'),
        import('shiki/langs/html.mjs'),
        import('shiki/langs/css.mjs'),
        import('shiki/langs/json.mjs'),
      ],
    })
  }
  return highlighterPromise
}

/**
 * Shared twoslash transformer for Vue SFC files.
 * Uses `twoslash-vue` to support `<script setup>` type extraction.
 */
const twoslashVue = transformerTwoslash({
  twoslasher: createTwoslasherVue({
    compilerOptions: twoslashCompilerOptions,
  }),
  langs: ['vue'],
  explicitTrigger: false,
  throws: false,
  onTwoslashError(error, _code, _lang, _options) {
    console.warn('[twoslash-vue] Failed to process code block, falling back to plain highlight:', (error as Error).message ?? error)
  },
})

/**
 * Shared twoslash transformer for TypeScript / TSX files.
 */
const twoslashTs = transformerTwoslash({
  twoslashOptions: {
    compilerOptions: twoslashCompilerOptions,
  },
  langs: ['ts', 'tsx', 'typescript'],
  explicitTrigger: false,
  throws: false,
  onTwoslashError(error, _code, _lang, _options) {
    console.warn('[twoslash-ts] Failed to process code block, falling back to plain highlight:', (error as Error).message ?? error)
  },
})

/**
 * Highlight code using Shiki with vitesse-dark and vitesse-light dual themes.
 * Returns pre-rendered HTML that switches between themes via CSS variable.
 *
 * - `--shiki-dark`  → dark mode colors (vitesse-dark)
 * - `--shiki-light` → light mode colors (vitesse-light)
 */
export async function highlight(code: string, lang: string): Promise<string> {
  const highlighter = await getHighlighter()
  return highlighter.codeToHtml(code, {
    lang,
    themes: {
      dark: 'vitesse-dark',
      light: 'vitesse-light',
    },
    defaultColor: false,
  })
}

/**
 * Highlight code with Shiki + Twoslash type annotations.
 *
 * For Vue SFCs (`lang === 'vue'`), uses twoslash-vue which understands
 * `<script setup>` and Vue template expressions.
 * For TypeScript / TSX, uses the standard twoslash engine.
 *
 * If twoslash processing fails (e.g. unresolvable imports), it falls
 * back to plain highlighting automatically.
 */
export async function highlightWithTwoslash(code: string, lang: string): Promise<string> {
  const highlighter = await getHighlighter()

  const transformer: ShikiTransformer = lang === 'vue' ? twoslashVue : twoslashTs

  return highlighter.codeToHtml(code, {
    lang,
    themes: {
      dark: 'vitesse-dark',
      light: 'vitesse-light',
    },
    defaultColor: false,
    transformers: [transformer],
  })
}
