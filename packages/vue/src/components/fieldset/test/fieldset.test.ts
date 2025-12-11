import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { Fieldset, fieldsetAnatomy } from '~/index'
import { getExports, getParts } from '../../../../../../utils/test'
import Basic from '../examples/Basic.vue'

describe('[fieldset] component', () => {
  it.each(getParts(fieldsetAnatomy))('should render part %s', async (part) => {
    render(Basic)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(fieldsetAnatomy))('should export %s', async (part) => {
    expect(Fieldset[part]).toBeDefined()
  })

  it('should set textbox as disabled', async () => {
    render(Basic, { props: { disabled: true } })
    expect(page.getByRole('textbox', { name: /label/i })).toBeDisabled()
  })

  it('should display helper text', async () => {
    render(Basic)
    expect(page.getByText('Fieldset Helper Text')).toBeInTheDocument()
  })

  it('should display error text when error is present', async () => {
    render(Basic, { props: { invalid: true } })
    expect(page.getByText('Fieldset Error Text')).toBeInTheDocument()
  })

  it('should not display error text when no error is present', async () => {
    render(Basic, { props: { invalid: false } })
    expect(page.getByText('Fieldset Error Text')).not.toBeInTheDocument()
  })
})
