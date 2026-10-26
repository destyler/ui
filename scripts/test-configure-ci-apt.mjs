import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

const script = fileURLToPath(new URL('./configure-ci-apt.sh', import.meta.url))
const limits = 'Acquire::http::Timeout "30";\nAcquire::https::Timeout "30";\nAcquire::Retries "2";\n'

function fixture(t, mirrors) {
  const dir = mkdtempSync(join(tmpdir(), 'ci apt-'))
  t.after(() => rmSync(dir, { recursive: true, force: true }))
  mkdirSync(join(dir, 'apt.conf.d'))
  const mirrorList = join(dir, 'apt-mirrors.txt')
  if (mirrors !== undefined)
    writeFileSync(mirrorList, mirrors)
  return {
    mirrorList,
    run() {
      const result = spawnSync('bash', [script, dir], { encoding: 'utf8', timeout: 5000 })
      assert.equal(result.status, 0, result.stderr)
      assert.equal(readFileSync(join(dir, 'apt.conf.d/99-ci-downloads'), 'utf8'), limits)
      assert.ok(result.stdout.includes(limits))
      return result
    },
  }
}

test('apt setup replaces HTTP and HTTPS Azure mirrors and logs the effective list', (t) => {
  const f = fixture(t, 'http://azure.archive.ubuntu.com/ubuntu/\nhttps://azure.archive.ubuntu.com/ubuntu\nhttps://security.ubuntu.com/ubuntu/\n')
  const expected = 'https://archive.ubuntu.com/ubuntu/\nhttps://archive.ubuntu.com/ubuntu\nhttps://security.ubuntu.com/ubuntu/\n'
  const result = f.run()
  assert.equal(readFileSync(f.mirrorList, 'utf8'), expected)
  assert.match(result.stdout, /Replaced Azure Ubuntu mirror/)
  assert.ok(result.stdout.includes(expected))
})

test('apt setup reports missing mirror lists while retaining download limits', (t) => {
  const f = fixture(t)
  assert.match(f.run().stdout, /No apt mirror list.*leaving runner sources unchanged/)
  assert.equal(existsSync(f.mirrorList), false)
})

test('apt setup reports unmatched mirror layouts without rewriting them', (t) => {
  const mirrors = '# Custom runner layout\nhttps://archive.ubuntu.com/ubuntu/\nhttps://azure.archive.ubuntu.com/ubuntu-other/\n'
  const f = fixture(t, mirrors)
  const result = f.run()
  assert.equal(readFileSync(f.mirrorList, 'utf8'), mirrors)
  assert.match(result.stdout, /No matching Azure Ubuntu mirror/)
  assert.ok(result.stdout.includes(mirrors))
})

test('apt setup is idempotent and logs an already configured mirror list', (t) => {
  const f = fixture(t, 'http://azure.archive.ubuntu.com/ubuntu/\n')
  f.run()
  const result = f.run()
  assert.match(result.stdout, /No matching Azure Ubuntu mirror/)
  assert.equal(readFileSync(f.mirrorList, 'utf8'), 'https://archive.ubuntu.com/ubuntu/\n')
})
