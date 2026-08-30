import { render, screen } from '@solidjs/testing-library'
import { Fieldset } from '../'
import { Field } from '../..'
import { getExports, getParts } from '../../../setup-test'
import { fieldsetAnatomy } from '../anatomy'

function ComponentUnderTest(props: Fieldset.RootProps) {
  return (
    <Fieldset.Root {...props}>
      <Fieldset.Legend>Legend</Fieldset.Legend>
      <Fieldset.HelperText>Fieldset Helper Text</Fieldset.HelperText>
      <Fieldset.ErrorText>Fieldset Error Text</Fieldset.ErrorText>
      <Field.Root>
        <Field.Label>Label</Field.Label>
        <Field.Input />
        <Field.HelperText>Field Helper Text</Field.HelperText>
        <Field.ErrorText>Field Error Text</Field.ErrorText>
      </Field.Root>
    </Fieldset.Root>
  )
}

describe('fieldset / Parts & Exports', () => {
  it.each(
    getParts(fieldsetAnatomy).filter(
      part => !part.includes('select') && !part.includes('textarea'),
    ),
  )('should render part %s', async (part) => {
    render(() => <ComponentUnderTest invalid />)

    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(fieldsetAnatomy))('should export %s', async (part) => {
    expect(Fieldset[part]).toBeDefined()
  })
})

describe('fieldset', () => {
  it('should set textbox as disabled', async () => {
    render(() => <ComponentUnderTest disabled />)
    expect(screen.getByRole('textbox', { name: /label/i })).toBeDisabled()
  })

  it('should display helper text', async () => {
    render(() => <ComponentUnderTest />)
    expect(screen.getByText('Fieldset Helper Text')).toBeInTheDocument()
  })

  it('should display error text when error is present', async () => {
    render(() => <ComponentUnderTest invalid />)
    expect(screen.getByText('Fieldset Error Text')).toBeInTheDocument()
  })

  it('should not display error text when no error is present', async () => {
    render(() => <ComponentUnderTest />)
    expect(screen.queryByText('Error Info')).not.toBeInTheDocument()
  })
})
