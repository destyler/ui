<script module lang="ts">
  export interface Options {
    grouped?: boolean
    field?: { disabled?: boolean, readOnly?: boolean, invalid?: boolean, required?: boolean }
    group?: { disabled?: boolean, readOnly?: boolean, invalid?: boolean, name?: string }
    item?: { disabled?: boolean, readOnly?: boolean, invalid?: boolean, value?: string }
    fieldsetDisabled?: boolean
    visible?: boolean
  }
</script>

<script lang="ts">
  import { untrack } from 'svelte'
  import { Checkbox } from '../index'
  import { Field } from '../../field'
  import { Fieldset } from '../../fieldset'

  const { initial = {} }: { initial?: Options } = $props()
  let options = $state<Options>(untrack(() => initial))
  export function update(next: Options) {
    options = next
  }
</script>

<form>
  <Fieldset.Root id="fieldset" disabled={options.fieldsetDisabled}>
    <Field.Root id="field" {...options.field}>
      <Field.Label>Question</Field.Label>
      {#if options.visible !== false}
        {#if options.grouped !== false}
          <Checkbox.Group defaultValue={['alpha']} name="answer" {...options.group}>
            <Checkbox.Root id="choice" value="alpha" {...options.item}>
              <Checkbox.Control />
              <Checkbox.HiddenInput />
            </Checkbox.Root>
          </Checkbox.Group>
        {:else}
          <Checkbox.Root id="choice" defaultChecked name="answer" value="alpha" {...options.item}>
            <Checkbox.Control />
            <Checkbox.HiddenInput />
          </Checkbox.Root>
        {/if}
      {/if}
    </Field.Root>
  </Fieldset.Root>
</form>
