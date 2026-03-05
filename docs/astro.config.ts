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
      //
      // NOTE: `from '~/'` imports are NOT flagged here because the
      // `destylerTildeAlias` Vite plugin resolves them correctly at
      // module-resolution time. Only type-level patterns that the SFC
      // compiler must resolve at compile time are truly problematic.
      const problematic
        = /extends\s+\w+\.\w+/.test(script)
          || /define(?:Props|Emits)<\w+\.\w+>/.test(script)

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
  site: 'https://ui.destyler.dev',
  integrations: [
    UnoCSS({
      injectReset: true,
    }),
    vue(),
    react(),
    starlight({
      expressiveCode: {
        themes: ['vitesse-dark', 'vitesse-light'],
        styleOverrides: {
          borderRadius: '0.75rem',
        },
      },
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
            { label: 'Aspect Ratio', slug: 'components/aspect-ratio' },
            { label: 'Avatar', slug: 'components/avatar' },
            { label: 'Breadcrumbs', slug: 'components/breadcrumbs' },
            { label: 'Calendar', slug: 'components/calendar' },
            { label: 'Carousel', slug: 'components/carousel' },
            { label: 'Checkbox', slug: 'components/checkbox' },
            { label: 'Clipboard', slug: 'components/clipboard' },
            { label: 'Collapse', slug: 'components/collapse' },
            { label: 'Collapsible', slug: 'components/collapsible' },
            { label: 'Color Picker', slug: 'components/color-picker' },
            { label: 'Combobox', slug: 'components/combobox' },
            { label: 'Dialog', slug: 'components/dialog' },
            { label: 'Dynamic', slug: 'components/dynamic' },
            { label: 'Edit', slug: 'components/edit' },
            { label: 'Field', slug: 'components/field' },
            { label: 'Fieldset', slug: 'components/fieldset' },
            { label: 'File Upload', slug: 'components/file-upload' },
            { label: 'Floating Panel', slug: 'components/floating-panel' },
            { label: 'Hover Card', slug: 'components/hover-card' },
            { label: 'Label', slug: 'components/label' },
            { label: 'Menu', slug: 'components/menu' },
            { label: 'Navigation Menu', slug: 'components/navigation-menu' },
            { label: 'Number Input', slug: 'components/number-input' },
            { label: 'OTP Input', slug: 'components/otp-input' },
            { label: 'Pagination', slug: 'components/pagination' },
            { label: 'Popover', slug: 'components/popover' },
            { label: 'Presence', slug: 'components/presence' },
            { label: 'Progress', slug: 'components/progress' },
            { label: 'QR Code', slug: 'components/qr-code' },
            { label: 'Radio', slug: 'components/radio' },
            { label: 'Scroll Area', slug: 'components/scroll-area' },
            { label: 'Select', slug: 'components/select' },
            { label: 'Separator', slug: 'components/separator' },
            { label: 'Signature', slug: 'components/signature' },
            { label: 'Slider', slug: 'components/slider' },
            { label: 'Splitter', slug: 'components/splitter' },
            { label: 'Steps', slug: 'components/steps' },
            { label: 'Switch', slug: 'components/switch' },
            { label: 'Tabs', slug: 'components/tabs' },
            { label: 'Timer', slug: 'components/timer' },
            { label: 'Toast', slug: 'components/toast' },
            { label: 'Toggle', slug: 'components/toggle' },
            { label: 'Toggle Group', slug: 'components/toggle-group' },
            { label: 'Tooltip', slug: 'components/tooltip' },
            { label: 'Tour', slug: 'components/tour' },
            { label: 'Tree', slug: 'components/tree' },
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
    optimizeDeps: {
      // Vite 8 beta / esbuild evaluates process.env.NODE_ENV during dep
      // pre-bundling. Without an explicit define the condition resolves to
      // "production", which causes React to export `jsxDEV = void 0` from
      // its CJS production build → "jsxDEV is not a function" at runtime.
      esbuildOptions: {
        define: {
          'process.env.NODE_ENV': '"development"',
        },
      },
    },
    server: {
      fs: {
        allow: ['..'],
      },
    },
  },
})
