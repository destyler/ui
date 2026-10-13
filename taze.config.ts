import { defineConfig } from 'taze'

export default defineConfig({
  mode: 'latest',
  write: true,
  install: true,
  // Keep this updater focused on packages and pnpm catalogs.
  githubActions: false,
  nodeVersion: false,
})
