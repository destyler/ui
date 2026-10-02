import * as label from '@destyler/label'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Label } from '../components/label'

vi.mock('@destyler/label', { spy: true })

afterEach(() => vi.clearAllMocks())

describe('label machine props', () => {
  it('keeps ids out of native attributes while preserving label association', () => {
    const machine = vi.mocked(label.machine)
    const html = renderToStaticMarkup(<Label.Root ids={{ root: 'field-label' }} htmlFor="field">Name</Label.Root>)
    expect(html).not.toContain('ids=')
    expect(machine).toHaveBeenCalledWith(expect.objectContaining({ ids: { root: 'field-label' } }))
    expect(html).toContain('for="field"')
    expect(html).toContain('>Name</label>')
  })
})
