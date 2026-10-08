<script lang="ts">
  import { useCheckboxGroupContext } from '../index'
  const group = useCheckboxGroupContext()
  if (!group)
    throw new Error('Fixture requires Checkbox.Group')
  const direct = $derived(group().getItemProps({ value: 'one' }))
  const mapped = $derived([{ value: 'one' }, { value: 'two' }].map(group().getItemProps))
  const inherited = $derived(group().getItemProps({ value: 'one' }, { disabled: true, readOnly: true, invalid: true }))
</script>

<output data-testid="direct-flags">{JSON.stringify([direct.disabled, direct.readOnly, direct.invalid])}</output>
<output data-testid="inherited-flags">{JSON.stringify([inherited.disabled, inherited.readOnly, inherited.invalid])}</output>
<output data-testid="group-flags">{JSON.stringify([group().disabled, group().readOnly, group().invalid])}</output>

<output data-testid="arity">{group().getItemProps.length}</output>
<output data-testid="mapped-flags">{JSON.stringify(mapped.map(item => item.disabled))}</output>
