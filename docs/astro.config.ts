import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import UnoCSS from 'unocss/astro'

// https://astro.build/config
export default defineConfig({
  integrations: [
    UnoCSS({
      injectReset: true,
    }),
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
      ],
      components: {
        Header: './src/components/Header.astro',
        Sidebar: './src/components/Sidebar.astro',
        TableOfContents: './src/components/TableOfContents.astro',
        MobileTableOfContents: './src/components/MobileTableOfContents.astro',
        MobileMenuToggle: './src/components/MobileMenuToggle.astro',
      },
      customCss: [
        './src/styles/bootstrap.css',
      ],
    }),
  ],
})
