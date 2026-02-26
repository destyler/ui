import type { HighlighterCore } from 'shiki/core'
import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

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
