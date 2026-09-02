import type { Preview } from 'storybook-solidjs-vite'
import '../../../utils/bootstrap.css'

const preview: Preview = {
  parameters: {
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
