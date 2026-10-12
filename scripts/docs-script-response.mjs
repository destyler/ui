export async function captureDocsScriptResponse(response, result, captureBody) {
  const url = response.url()
  const status = response.status()
  if (status >= 400)
    result.assetErrors.push({ url, status })
  if (!url.endsWith('.js'))
    return

  const record = { url, status, body: 'skipped-non-2xx' }
  result.scriptResponses.push(record)
  // Redirects and cache-validation responses do not provide a readable body.
  // Keep their actual status rather than inferring why a previous read failed.
  if (status < 200 || status >= 300)
    return

  record.body = 'pending'
  try {
    await captureBody(await response.body())
    record.body = 'read'
  }
  catch (error) {
    record.body = 'failed'
    record.captureError = String(error)
    result.assetErrors.push({ url, status, captureError: record.captureError })
  }
}
