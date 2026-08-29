<script lang="ts">
  import type { CheckboxCheckedState } from '../index'
  import { Checkbox } from '../index'

  const items = [
    { label: 'React', value: 'react' },
    { label: 'Solid', value: 'solid' },
    { label: 'Vue', value: 'vue' },
  ]
  let value = $state<string[]>([])
  const allSelected = $derived(value.length === items.length)
  const indeterminate = $derived(value.length > 0 && value.length < items.length)
  const selectAllState = $derived<CheckboxCheckedState>(indeterminate ? 'indeterminate' : allSelected)
</script>

<div style="display: flex; flex-direction: column; gap: 10px;">
  <Checkbox.Root
    value="all"
    checked={selectAllState}
    onCheckedChange={(details) => value = details.checked ? items.map((item) => item.value) : []}
  >
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
      <Checkbox.Indicator indeterminate>
        <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" width="12" height="12">
          <path d="M3 7H11" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
      </Checkbox.Indicator>
    </Checkbox.Control>
    <Checkbox.Label>Select All</Checkbox.Label>
    <Checkbox.HiddenInput />
  </Checkbox.Root>

  <Checkbox.Group {value} name="framework" onValueChange={(nextValue) => value = nextValue}>
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

  <pre>Selected: {JSON.stringify(value)}</pre>
</div>
