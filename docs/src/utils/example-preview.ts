export type ExamplePreviewStatus = 'loading' | 'missing' | 'error'

export function getExamplePreviewMessage(
  frameworkLabel: string,
  status: ExamplePreviewStatus,
): string {
  if (status === 'loading')
    return 'Loading…'
  return `${frameworkLabel} example ${status === 'missing' ? 'not found' : 'failed to load'}`
}
