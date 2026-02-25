import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@astrojs/react'
import starlight from '@astrojs/starlight'
import vue from '@astrojs/vue'
import { defineConfig } from 'astro/config'
import UnoCSS from 'unocss/astro'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const vueSrc = path.resolve(__dirname, '../packages/vue/src')
const reactSrc = path.resolve(__dirname, '../packages/react/src')

/**
 * Vite plugin that resolves the `~/` alias based on the importing file's
 * package context, so Vue source files resolve `~/` → packages/vue/src
 * and React source files resolve `~/` → packages/react/src.
 */
function destylerTildeAlias(): any {
  return {
    name: 'destyler-tilde-alias',
    async resolveId(source: string, importer: string | undefined) {
      if (!source.startsWith('~/') || !importer)
        return null

      let root: string | null = null
      if (importer.includes('/packages/vue/'))
        root = vueSrc
      else if (importer.includes('/packages/react/'))
        root = reactSrc

      if (!root)
        return null

      const resolved = path.join(root, source.slice(2))
      return this.resolve(resolved, importer, { skipSelf: true })
    },
  }
}

/**
 * Vite plugin that gracefully handles Vue SFC compilation failures for
 * example files in the packages directory. When the SFC compiler can't
 * resolve cross-package types (namespace types, ~/ alias imports, etc.),
 * this plugin replaces the file with a valid placeholder component so
 * the build succeeds. The code-display panel still shows the real source.
 */
function tolerantPackageVueSfc() {
  return {
    name: 'tolerant-package-vue-sfc',
    enforce: 'pre' as const,
    transform(code: string, id: string) {
      if (!id.endsWith('.vue') || !id.includes('/packages/') || !id.includes('/examples/'))
        return null

      const scriptMatch = code.match(/<script[^>]*>([\s\S]*?)<\/script>/)
      if (!scriptMatch)
        return null
      const script = scriptMatch[1]

      // Detect patterns that cause SFC type-resolution failures outside
      // the original package build context:
      //   1. `extends Namespace.Type`         (cross-file type extension)
      //   2. `defineEmits<Namespace.Type>`     (unresolvable emit type)
      //   3. `from '~/'`                       (alias unavailable in SFC resolver)
      const problematic
        = /extends\s+\w+\.\w+/.test(script)
          || /define(?:Props|Emits)<\w+\.\w+>/.test(script)
          || /from\s+['"]~\//.test(script)

      if (!problematic)
        return null

      return {
        code: [
          '<script setup lang="ts">',
          '// [docs] Placeholder — original example uses types that cannot be',
          '// resolved outside the package build context.',
          '</script>',
          '<template>',
          '  <div data-docs-placeholder>Example preview unavailable</div>',
          '</template>',
        ].join('\n'),
        map: null,
      }
    },
  }
}

// https://astro.build/config
export default defineConfig({
  integrations: [
    UnoCSS({
      injectReset: true,
    }),
    vue(),
    react(),
    starlight({
      title: 'DESTYLER',
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/destyler/ui',
        },
      ],
      sidebar: [
        {
          label: 'Overview',
          items: [
            { label: 'Introduction', slug: 'overview/introduction' },
          ],
        },
        {
          label: 'Components',
          items: [
            { label: 'Avatar', slug: 'components/avatar' },
          ],
        },
      ],
      components: {
        Header: './src/components/Header.astro',
        Sidebar: './src/components/Sidebar.astro',
        TableOfContents: './src/components/TableOfContents.astro',
        MobileTableOfContents: './src/components/MobileTableOfContents.astro',
        MobileMenuToggle: './src/components/MobileMenuToggle.astro',
        Pagination: './src/components/Pagination.astro',
      },
      customCss: [
        './src/styles/bootstrap.css',
      ],
    }),
  ],
  vite: {
    plugins: [tolerantPackageVueSfc(), destylerTildeAlias()],
    server: {
      fs: {
        allow: ['..'],
      },
    },
  },
})
