import { Fieldset } from '@destyler-ui/solid/fieldset'

export function Basic(props: Fieldset.RootProps) {
  return (
    <Fieldset.Root {...props}>
      <Fieldset.Legend>Legend</Fieldset.Legend>
      <Fieldset.HelperText>Helper text</Fieldset.HelperText>
      <Fieldset.ErrorText>Error text</Fieldset.ErrorText>
    </Fieldset.Root>
  )
}
