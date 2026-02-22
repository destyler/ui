import { defineConfig, presetAttributify, presetIcons, presetWind3, transformerDirectives, transformerVariantGroup } from 'unocss'

export default defineConfig({
  theme: {
    fontFamily: {
      display: '"Inter Tight", Inter, system-ui, sans-serif',
      code: '"JetBrains Mono", "Fira Code", monospace',
    },
  },
  presets: [
    presetWind3(),
    presetAttributify(),
    presetIcons({
      warn: true,
      extraProperties: {
        'width': '1.23rem',
        'height': '1.23rem',
        'display': 'inline-block',
        'vertical-align': 'text-bottom',
      },
    }),
  ],
  transformers: [
    transformerVariantGroup(),
    transformerDirectives(),
  ],
})
