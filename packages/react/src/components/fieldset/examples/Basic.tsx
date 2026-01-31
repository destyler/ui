import { Fieldset } from '../index'

export interface BasicProps extends Fieldset.RootProps {}

export function Basic(props: BasicProps) {
  return (
    <Fieldset.Root {...props}>
      <Fieldset.Legend>Legend</Fieldset.Legend>
      <Fieldset.HelperText>Fieldset Helper Text</Fieldset.HelperText>
      <Fieldset.ErrorText>Fieldset Error Text</Fieldset.ErrorText>
    </Fieldset.Root>
  )
}
