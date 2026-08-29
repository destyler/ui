// Generated from package-manifest.json. Do not edit by hand.
import type { Preview } from '@storybook/svelte-vite'

import '../../../utils/bootstrap.css'

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: [
          'Components',
          ['Form', 'Overlay', 'Layout', 'Navigation', 'Data', 'Utility'],
          'Providers',
          ['Runtime', 'Behavior', 'Content'],
        ],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      codePanel: true,
    },
    a11y: {
      test: 'todo',
    },
  },
}

export default preview
