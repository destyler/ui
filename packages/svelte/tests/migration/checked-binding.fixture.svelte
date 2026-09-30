<script lang="ts">
  import type { BindingMode } from './binding-cases'
  import { Checkbox, Radio, Switch, Toggle } from '$lib'
  import { untrack } from 'svelte'

  let { family = 'checkbox', mode, initial = false, onChange, onWrite }: {
    family?: 'checkbox' | 'switch' | 'toggle' | 'group' | 'radio'
    mode: BindingMode
    initial?: any
    onChange?: (value: any) => void
    onWrite?: (value: any) => void
  } = $props()
  let parent = $state<any>(untrack(() => mode === 'bound-undefined' ? undefined : initial))
  let unrelated = $state(0)
  const Components = untrack(() => family === 'switch' ? Switch : Checkbox)
  const get = () => parent
  const set = (next: any) => {
    onWrite?.(next)
    if (mode !== 'bound-veto')
      parent = next
  }
</script>

<output data-testid="parent-state">{parent === undefined ? 'undefined' : JSON.stringify(parent)}</output>
<button type="button" data-testid="external-set" onclick={() => parent = family === 'group' ? ['one'] : family === 'radio' ? 'two' : true}>Parent selects</button>
<button type="button" data-testid="external-reset" onclick={() => parent = family === 'group' ? [] : family === 'radio' ? 'one' : false}>Parent clears</button>
<button type="button" data-testid="unrelated" onclick={() => unrelated += 1}>Unrelated update</button>
<div data-unrelated={unrelated}>
  {#if family === 'group'}
    {#if mode === 'controlled'}
      <Checkbox.Group value={parent} onValueChange={onChange}>{@render groupItems()}</Checkbox.Group>
    {:else if mode === 'uncontrolled'}
      <Checkbox.Group defaultValue={initial} onValueChange={onChange}>{@render groupItems()}</Checkbox.Group>
    {:else if mode === 'bound-veto'}
      <Checkbox.Group bind:value={get, set} onValueChange={onChange}>{@render groupItems()}</Checkbox.Group>
    {:else}
      <Checkbox.Group bind:value={parent} onValueChange={onChange}>{@render groupItems()}</Checkbox.Group>
    {/if}
  {:else if family === 'radio'}
    {#if mode === 'controlled'}
      <Radio.Root value={parent} onValueChange={details => onChange?.(details.value)}>{@render radioItems()}</Radio.Root>
    {:else if mode === 'uncontrolled'}
      <Radio.Root defaultValue={initial} onValueChange={details => onChange?.(details.value)}>{@render radioItems()}</Radio.Root>
    {:else if mode === 'bound-veto'}
      <Radio.Root bind:value={get, set} onValueChange={details => onChange?.(details.value)}>{@render radioItems()}</Radio.Root>
    {:else}
      <Radio.Root bind:value={parent} onValueChange={details => onChange?.(details.value)}>{@render radioItems()}</Radio.Root>
    {/if}
  {:else if family === 'toggle'}
    {#if mode === 'controlled'}
      <Toggle.Root pressed={parent} onPressedChange={onChange} data-testid="toggle">{@render toggleParts()}</Toggle.Root>
    {:else if mode === 'uncontrolled'}
      <Toggle.Root defaultPressed={initial} onPressedChange={onChange} data-testid="toggle">{@render toggleParts()}</Toggle.Root>
    {:else if mode === 'bound-veto'}
      <Toggle.Root bind:pressed={get, set} onPressedChange={onChange} data-testid="toggle">{@render toggleParts()}</Toggle.Root>
    {:else}
      <Toggle.Root bind:pressed={parent} onPressedChange={onChange} data-testid="toggle">{@render toggleParts()}</Toggle.Root>
    {/if}
  {:else}
    {#if mode === 'controlled'}
      <Components.Root checked={parent} onCheckedChange={details => onChange?.(details.checked)}>{@render checkedParts()}</Components.Root>
    {:else if mode === 'uncontrolled'}
      <Components.Root defaultChecked={initial} onCheckedChange={details => onChange?.(details.checked)}>{@render checkedParts()}</Components.Root>
    {:else if mode === 'bound-veto'}
      <Components.Root bind:checked={get, set} onCheckedChange={details => onChange?.(details.checked)}>{@render checkedParts()}</Components.Root>
    {:else}
      <Components.Root bind:checked={parent} onCheckedChange={details => onChange?.(details.checked)}>{@render checkedParts()}</Components.Root>
    {/if}
  {/if}
</div>

{#snippet checkedParts()}
  <Components.Label data-testid="label">Option</Components.Label>
  <Components.Control data-testid="control" />
  <Components.HiddenInput data-testid="input" />
  <Components.Context>{#snippet render(api)}<output data-testid="api-state">{String(api().checked)}</output>{/snippet}</Components.Context>
{/snippet}

{#snippet toggleParts()}
  Option
  <Toggle.Context>{#snippet render(api)}<output data-testid="api-state">{String(api().pressed)}</output>{/snippet}</Toggle.Context>
{/snippet}

{#snippet groupItems()}
  <Checkbox.Root value="one">
    <Checkbox.Label data-testid="label">One</Checkbox.Label>
    <Checkbox.Control data-testid="control" />
    <Checkbox.HiddenInput data-testid="input" />
    <Checkbox.Context>{#snippet render(api)}<output data-testid="api-state">{String(api().checked)}</output>{/snippet}</Checkbox.Context>
  </Checkbox.Root>
  <Checkbox.Root value="two">
    <Checkbox.Label>Two</Checkbox.Label>
    <Checkbox.Control />
    <Checkbox.HiddenInput />
  </Checkbox.Root>
{/snippet}

{#snippet radioItems()}
  {#each ['one', 'two'] as value}
    <Radio.Item {value}>
      <Radio.ItemText data-testid={`label-${value}`}>{value}</Radio.ItemText>
      <Radio.ItemControl data-testid={`control-${value}`} />
      <Radio.ItemHiddenInput data-testid={`input-${value}`} />
    </Radio.Item>
  {/each}
  <Radio.Context>{#snippet children(api)}<output data-testid="api-state">{api().value}</output>{/snippet}</Radio.Context>
{/snippet}
