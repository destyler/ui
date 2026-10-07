<script lang="ts">
  import { Checkbox } from '../index'
  import { Field } from '../../field'
  import GroupItemPropsSnapshot from './GroupItemPropsSnapshot.svelte'
  let first = $state(true)
  let groupFlag = $state<boolean | undefined>()
  let localOverride = $state(false)
  export function update(next: { first: boolean, group?: boolean, localOverride?: boolean }) {
    first = next.first
    groupFlag = next.group
    localOverride = !!next.localOverride
  }
</script>

<form>
  <Checkbox.Group defaultValue={['one', 'two']} name="answer" disabled={groupFlag} readOnly={groupFlag} invalid={groupFlag}>
    <GroupItemPropsSnapshot />
    <Field.Root id="first" disabled={first} readOnly={first} invalid={first}>
      <Field.Label>First</Field.Label>
      <Checkbox.Root value="one" disabled={localOverride ? false : undefined} readOnly={localOverride ? false : undefined} invalid={localOverride ? false : undefined}>
        <Checkbox.Control /><Checkbox.HiddenInput />
      </Checkbox.Root>
    </Field.Root>
    <Field.Root id="second" disabled={!first} readOnly={!first} invalid={!first}>
      <Field.Label>Second</Field.Label>
      <Checkbox.Root value="two"><Checkbox.Control /><Checkbox.HiddenInput /></Checkbox.Root>
    </Field.Root>
  </Checkbox.Group>
</form>
