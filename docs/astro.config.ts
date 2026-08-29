import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@astrojs/react'
import starlight from '@astrojs/starlight'
import svelte from '@astrojs/svelte'
import vue from '@astrojs/vue'
import { defineConfig } from 'astro/config'
import UnoCSS from 'unocss/astro'
import { componentCategories, providerCategories } from './src/config/catalog'
import { frameworks, getFrameworkSourceAliasPath } from './src/config/frameworks'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const workspaceDirectory = path.resolve(__dirname, '..')
const frameworkSourceRoots = frameworks.map(framework => ({
  framework,
  packageRoot: path.join(workspaceDirectory, framework.packageDirectory),
  sourceRoot: path.join(workspaceDirectory, framework.sourceRoot),
}))

interface CatalogItem {
  readonly name: string
  readonly slug: string
}

function createSidebarGroups(prefix: string, categories: Record<string, readonly CatalogItem[]>) {
  return Object.entries(categories).map(([label, entries]) => ({
    label,
    items: entries.map(entry => ({
      label: entry.name,
      slug: `${prefix}/${entry.slug}`,
    })),
  }))
}

/**
 * Resolve each package's source alias from the shared framework registry.
 */
function destylerSourceAlias(): any {
  return {
    name: 'destyler-source-alias',
    async resolveId(source: string, importer: string | undefined) {
      if (!importer)
        return null

      const match = frameworkSourceRoots.find(({ framework, packageRoot }) => {
        return importer.startsWith(`${packageRoot}${path.sep}`)
          && getFrameworkSourceAliasPath(framework, source) !== null
      })
      if (!match)
        return null

      const aliasPath = getFrameworkSourceAliasPath(match.framework, source)
      if (aliasPath === null)
        return null

      const resolved = path.join(match.sourceRoot, aliasPath)
      return this.resolve(resolved, importer, { skipSelf: true })
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
    svelte(),
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
            { label: 'Installation', slug: 'overview/installation' },
            { label: 'Getting Started', slug: 'overview/getting-started' },
          ],
        },
        {
          label: 'Components',
          items: createSidebarGroups('components', componentCategories),
        },
        {
          label: 'Providers',
          items: createSidebarGroups('providers', providerCategories),
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
    plugins: [destylerSourceAlias()],
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
