import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    'index': './src/index.ts',
    'avatar': './src/components/avatar/index.ts',
    'calendar': './src/components/calendar/index.ts',
    'carousel': './src/components/carousel/index.ts',
    'checkbox': './src/components/checkbox/index.ts',
    'clipboard': './src/components/clipboard/index.ts',
    'collapse': './src/components/collapse/index.ts',
    'collapsible': './src/components/collapsible/index.ts',
    'color-picker': './src/components/color-picker/index.ts',
    'combobox': './src/components/combobox/index.ts',
    'dialog': './src/components/dialog/index.ts',
    'edit': './src/components/edit/index.ts',
    'field': './src/components/field/index.ts',
    'fieldset': './src/components/fieldset/index.ts',
    'file-upload': './src/components/file-upload/index.ts',
    'hover-card': './src/components/hover-card/index.ts',
    'menu': './src/components/menu/index.ts',
    'presence': './src/components/presence/index.ts',
  },
  platform: 'neutral',
  fromVite: true,
  dts: {
    vue: true,
  },
})
