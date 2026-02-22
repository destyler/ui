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
      sidebar: [],
      customCss: [
        './src/styles/tokens.css',
        './src/styles/typography.css',
        './src/styles/layout.css',
        './src/styles/components.css',
        './src/styles/content.css',
        './src/styles/landing.css',
      ],
    }),
  ],
})
