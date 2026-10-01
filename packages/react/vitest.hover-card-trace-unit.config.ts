import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, mergeConfig } from 'vitest/config'
import reactConfig from './vitest.config'

// Explicit local validation only; .probe files never join the normal suite.
export default mergeConfig(reactConfig, defineConfig({
  test: {
    root: path.dirname(fileURLToPath(import.meta.url)),
    browser: { enabled: false },
    environment: 'happy-dom',
    include: ['src/hooks/test/controllable-migration.test.tsx', 'src/hooks/test/open-state-trace.test.ts', 'src/hooks/test/diagnostics/raw-machine-capture.probe.tsx'],
    fileParallelism: false,
    retry: 0,
  },
}))
