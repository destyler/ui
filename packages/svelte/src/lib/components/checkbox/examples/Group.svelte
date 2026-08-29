<script module lang="ts">
  import type { CheckboxGroupProps } from '../index'

  export interface GroupProps extends CheckboxGroupProps {}
</script>

<script lang="ts">
  import { Checkbox } from '../index'

  const props: GroupProps = $props()
  const items = [
    { label: 'React', value: 'react' },
    { label: 'Solid', value: 'solid' },
    { label: 'Vue', value: 'vue' },
  ]
</script>

<Checkbox.Group defaultValue={['react']} name="framework" {...props}>
  {#each items as item (item.value)}
    <Checkbox.Root value={item.value}>
      <Checkbox.Control>
        <Checkbox.Indicator>
          <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" width="12" height="12">
            <path
              d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </Checkbox.Indicator>
      </Checkbox.Control>
      <Checkbox.Label>{item.label}</Checkbox.Label>
      <Checkbox.HiddenInput />
    </Checkbox.Root>
  {/each}
</Checkbox.Group>
