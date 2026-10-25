import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { chmodSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { delimiter, join } from 'node:path'
import process from 'node:process'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

const script = fileURLToPath(new URL('./ci-retry.sh', import.meta.url))

function fixture(t, body) {
  const dir = mkdtempSync(join(tmpdir(), 'ci-retry-'))
  t.after(() => rmSync(dir, { recursive: true, force: true }))
  const count = join(dir, 'count')
  const command = join(dir, 'install')
  writeFileSync(command, `#!/usr/bin/env bash
set -eu
count=0
if [ -f "$COUNT" ]; then count=$(cat "$COUNT"); fi
count=$((count + 1))
echo "$count" > "$COUNT"
${body}
`)
  writeFileSync(join(dir, 'sleep'), '#!/usr/bin/env bash\nprintf "%s\\n" "$*" >> "$DELAY"\n')
  chmodSync(command, 0o755)
  chmodSync(join(dir, 'sleep'), 0o755)
  return {
    command,
    count: () => Number(readFileSync(count, 'utf8')),
    delay: () => readFileSync(join(dir, 'delay'), 'utf8'),
    run: args => spawnSync('bash', [script, ...args], {
      encoding: 'utf8',
      timeout: 5000,
      env: { ...process.env, COUNT: count, DELAY: join(dir, 'delay'), PATH: `${dir}${delimiter}${process.env.PATH}` },
    }),
  }
}

test('successful install runs once and preserves quoted arguments', (t) => {
  const f = fixture(t, '[ "$#" -eq 2 ] && [ "$1" = "two words" ] && [ "$2" = "*" ]')
  const result = f.run([f.command, 'two words', '*'])
  assert.equal(result.status, 0, result.stderr)
  assert.equal(f.count(), 1)
})

test('transient installation failure retries once after a delay', (t) => {
  const f = fixture(t, '[ "$count" -eq 2 ]')
  const result = f.run([f.command])
  assert.equal(result.status, 0, result.stderr)
  assert.equal(f.count(), 2)
  assert.equal(f.delay(), '10\n')
  assert.match(result.stderr, /attempt 1\/2 failed/)
})

test('exhausted installation retries propagate the last failure', (t) => {
  const f = fixture(t, 'exit "$((40 + count))"')
  const result = f.run([f.command])
  assert.equal(result.status, 42)
  assert.equal(f.count(), 2)
  assert.match(result.stderr, /refusing to continue/)
})

test('real timeout terminates a stalled command and remains a failure after retry', (t) => {
  const f = fixture(t, 'exec /bin/sleep 30')
  const result = f.run(['timeout', '--kill-after=0.1s', '0.1s', f.command])
  assert.equal(result.status, 124, result.stderr)
  assert.equal(f.count(), 2)
})

test('kill-after bounds a command that ignores graceful termination', (t) => {
  const f = fixture(t, 'trap \'\' TERM; exec /bin/sleep 30')
  const result = f.run(['timeout', '--kill-after=0.1s', '0.1s', f.command])
  assert.equal(result.status, 137, result.stderr)
  assert.equal(f.count(), 2)
})

test('missing command fails closed', (t) => {
  const f = fixture(t, 'exit 0')
  assert.equal(f.run([]).status, 2)
  assert.equal(f.run(['/nonexistent-ci-install-command']).status, 127)
})

test('CI bounds installation without retrying or suppressing tests', () => {
  const workflow = readFileSync(new URL('../.github/workflows/ci.yml', import.meta.url), 'utf8')
  assert.match(workflow, /node: \[22\.22\.3, '24'\]/)
  assert.match(workflow, /sudo timeout --kill-after=15s 5m.*install-deps/)
  assert.match(workflow, /timeout --kill-after=15s 5m pnpm playwright install\n/)
  assert.equal((workflow.match(/timeout-minutes: 12/g) || []).length, 2)
  assert.equal((workflow.match(/bash scripts\/ci-retry.sh/g) || []).length, 2)
  assert.match(workflow, /- name: Test\n {8}run: pnpm run test:ci/)
  assert.doesNotMatch(workflow, /continue-on-error/)
})
