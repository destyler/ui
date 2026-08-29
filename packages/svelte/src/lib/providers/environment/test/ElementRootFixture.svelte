<script lang="ts">
  import { Field } from '../../../components/field'
  import { Fieldset } from '../../../components/fieldset'
  import { EnvironmentProvider } from '../index'

  let environmentRoot = $state<HTMLElement>()
</script>

<div bind:this={environmentRoot}>
  {#if environmentRoot}
    <EnvironmentProvider value={environmentRoot}>
      <Field.Root>
        <Field.Label>Email</Field.Label>
        <Field.Input />
        <Field.HelperText>Use a work address</Field.HelperText>
      </Field.Root>

      <Fieldset.Root>
        <Fieldset.Legend>Profile</Fieldset.Legend>
        <Fieldset.HelperText>Public information</Fieldset.HelperText>
      </Fieldset.Root>
    </EnvironmentProvider>
  {/if}
</div>
