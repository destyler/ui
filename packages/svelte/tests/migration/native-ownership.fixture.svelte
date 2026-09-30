<script lang="ts">
  import type { Component } from 'svelte'
  import { Checkbox, Combobox, Edit, Radio, Switch, createListCollection, useCheckbox, useCombobox, useEdit, useRadio, useSwitch } from '$lib'
  import { untrack } from 'svelte'

  let { family, entry = 'hook', mode = 'controlled', accepted, showInput = true, onChange }: {
    family: 'checkbox' | 'switch' | 'radio' | 'edit' | 'combobox'
    entry?: 'root' | 'provider' | 'hook'
    mode?: 'controlled' | 'accepted' | 'uncontrolled'
    accepted?: boolean | string
    showInput?: boolean
    onChange?: (value: boolean | string) => void
  } = $props()
  const selected = untrack(() => ({
    checkbox: { components: Checkbox, use: useCheckbox },
    switch: { components: Switch, use: useSwitch },
    radio: { components: Radio, use: useRadio },
    edit: { components: Edit, use: useEdit },
    combobox: { components: Combobox, use: useCombobox },
  })[family])
  const Root = selected.components.Root as Component<any>
  const RootProvider = selected.components.RootProvider as Component<any>
  const Context = selected.components.Context as Component<any>
  const checked = untrack(() => family === 'checkbox' || family === 'switch')
  const stateKey = untrack(() => checked ? 'checked' : family === 'combobox' ? 'inputValue' : 'value')
  const initial = untrack(() => checked ? true : 'one')
  let parent = $state<boolean | string>(initial)
  const id = $props.id()
  const collection = createListCollection({ items: ['one', 'two'] })
  const machineProps = $derived({
    id,
    name: 'answer',
    [stateKey]: mode === 'uncontrolled' ? undefined : accepted ?? parent,
    [checked ? 'defaultChecked' : family === 'combobox' ? 'defaultInputValue' : 'defaultValue']: initial,
    [`on${stateKey[0].toUpperCase()}${stateKey.slice(1)}Change`]: (details: any) => {
      onChange?.(details[stateKey])
      if (mode === 'accepted')
        parent = details[stateKey]
    },
    ...(family === 'edit' ? { defaultEdit: true } : {}),
    ...(family === 'combobox' ? { collection, openOnChange: false, openOnClick: false } : {}),
  })
  const hook = untrack(() => entry === 'root' ? undefined : (selected.use as any)(() => machineProps))
</script>

<form data-testid="form">
  {#if entry === 'root'}
    <Root {...machineProps}><Context render={parts} children={parts} /></Root>
  {:else if entry === 'provider'}
    <RootProvider value={hook}><Context render={parts} children={parts} /></RootProvider>
  {:else}
    {@render parts(hook)}
  {/if}
</form>

{#snippet parts(api: () => any)}
  <output data-testid="api-state">{String(api()[stateKey])}</output>
  {#if checked}
    <label {...(entry === 'hook' ? api().getRootProps() : {})}>
      <span {...api().getControlProps()} data-testid="control">Answer</span>
      {#if showInput}<input {...api().getHiddenInputProps()} data-testid="input" />{/if}
    </label>
  {:else if family === 'radio'}
    <div {...(entry === 'hook' ? api().getRootProps() : {})}>
      {#each ['one', 'two'] as value}
        <label {...api().getItemProps({ value })}>
          <span {...api().getItemControlProps({ value })} data-testid={`control-${value}`}>{value}</span>
          {#if showInput}<input {...api().getItemHiddenInputProps({ value })} data-testid={`input-${value}`} />{/if}
        </label>
      {/each}
    </div>
  {:else}
    <div {...(entry === 'hook' ? api().getRootProps() : {})}>
      {#if showInput}<input {...api().getInputProps()} data-testid="input" />{/if}
    </div>
  {/if}
{/snippet}
