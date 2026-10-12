import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import test from 'node:test'
import { captureDocsScriptResponse } from './docs-script-response.mjs'

function fixture(status, body, url = 'http://127.0.0.1/_astro/check.js') {
  let bodyReads = 0
  const result = { scriptResponses: [], assetErrors: [] }
  const response = {
    url: () => url,
    status: () => status,
    body: async () => {
      bodyReads++
      return body()
    },
  }
  return { response, result, reads: () => bodyReads }
}

test('records 302 and 304 script responses without trying to read their bodies', async () => {
  for (const status of [302, 304]) {
    const sample = fixture(status, () => assert.fail('A non-2xx body must not be read'))
    await captureDocsScriptResponse(sample.response, sample.result, () => assert.fail('No body should be captured'))
    assert.equal(sample.reads(), 0)
    assert.deepEqual(sample.result.scriptResponses, [{ url: sample.response.url(), status, body: 'skipped-non-2xx' }])
    assert.deepEqual(sample.result.assetErrors, [])
  }
})

test('captures successful script bytes and records the actual response status', async () => {
  for (const status of [200, 206]) {
    const bytes = Buffer.from('Check icon bundle')
    const sample = fixture(status, () => bytes)
    const captured = []
    await captureDocsScriptResponse(sample.response, sample.result, body => captured.push(body))
    assert.equal(sample.reads(), 1)
    assert.deepEqual(captured, [bytes])
    assert.deepEqual(sample.result.scriptResponses, [{ url: sample.response.url(), status, body: 'read' }])
    assert.deepEqual(sample.result.assetErrors, [])
  }
})

test('retains failed successful-response body reads as fatal asset errors', async () => {
  const error = new Error('Body unavailable')
  const sample = fixture(200, () => {
    throw error
  })
  await captureDocsScriptResponse(sample.response, sample.result, () => assert.fail('No body should be captured'))
  assert.equal(sample.reads(), 1)
  assert.deepEqual(sample.result.assetErrors, [{ url: sample.response.url(), status: 200, captureError: String(error) }])
  assert.equal(sample.result.scriptResponses[0].body, 'failed')
})

test('retains capture persistence failures as fatal asset errors', async () => {
  const error = new Error('Could not save bundle')
  const sample = fixture(200, () => Buffer.from('bundle'))
  await captureDocsScriptResponse(sample.response, sample.result, async () => {
    throw error
  })
  assert.deepEqual(sample.result.assetErrors, [{ url: sample.response.url(), status: 200, captureError: String(error) }])
  assert.equal(sample.result.scriptResponses[0].body, 'failed')
})

test('HTTP errors remain fatal for scripts and other assets without reading bodies', async () => {
  for (const url of ['http://127.0.0.1/missing.js', 'http://127.0.0.1/missing.css']) {
    const sample = fixture(404, () => assert.fail('An error body must not be read'), url)
    await captureDocsScriptResponse(sample.response, sample.result, () => assert.fail('No body should be captured'))
    assert.equal(sample.reads(), 0)
    assert.deepEqual(sample.result.assetErrors, [{ url, status: 404 }])
  }
})
