<script lang="ts">
  import type { Component } from 'svelte'
  import { untrack } from 'svelte'
  import { ColorPicker, Combobox, Edit, NumberInput, OtpInput, createListCollection, parseColor } from '$lib'

  let { family, mode, onChange, formatOptions }: {
    family: 'number-input' | 'combobox' | 'edit' | 'otp-input' | 'color-picker'
    mode: 'controlled' | 'bound' | 'uncontrolled'
    onChange?: (value: string) => void
    formatOptions?: Intl.NumberFormatOptions
  } = $props()
  const components = untrack(() => ({ 'number-input': NumberInput, combobox: Combobox, edit: Edit, 'otp-input': OtpInput, 'color-picker': ColorPicker })[family])
  const Root = components.Root as Component<any>
  const Context = components.Context as Component<any>
  const initial = untrack(() => family === 'number-input' ? '10' : family === 'otp-input' ? ['1', '2'] : family === 'color-picker' ? parseColor('#ff0000') : 'one')
  let parent = $state<any>(initial)
  const format = (value: any) => family === 'color-picker' ? value.toString('hex').toLowerCase() : family === 'otp-input' ? JSON.stringify(value) : String(value)
  const stateKey = untrack(() => family === 'combobox' ? 'inputValue' : 'value')
  const callback = untrack(() => family === 'combobox' ? 'onInputValueChange' : 'onValueChange')
  const rootProps = untrack(() => ({
    [stateKey === 'value' ? 'defaultValue' : 'defaultInputValue']: initial,
    [callback]: (details: any) => onChange?.(format(details[stateKey])),
    ...(family === 'number-input' ? { formatOptions } : {}),
    ...(family === 'edit' ? { defaultEdit: true } : {}),
    ...(family === 'combobox' ? { collection: createListCollection({ items: ['one', 'two'] }), openOnChange: false, openOnClick: false } : {}),
  }))
</script>

<output data-testid="parent-state">{format(parent)}</output>
<button type="button" data-testid="blur">Blur</button>
{#if mode === 'controlled'}
  <Root {...rootProps} {...{ [stateKey]: parent }} children={parts} />
{:else if mode === 'bound' && family === 'combobox'}
  <Root {...rootProps} bind:inputValue={parent} children={parts} />
{:else if mode === 'bound'}
  <Root {...rootProps} bind:value={parent} children={parts} />
{:else}
  <Root {...rootProps} children={parts} />
{/if}

{#snippet parts()}
  <Context>
    {#snippet render(api: () => any)}
      <output data-testid="api-state">{format(api()[stateKey])}</output>
    {/snippet}
  </Context>
  {#if family === 'number-input'}
    <NumberInput.Input data-testid="input" />
  {:else if family === 'edit'}
    <Edit.Input data-testid="input" />
    <Edit.Preview />
  {:else if family === 'combobox'}
    <Combobox.Control><Combobox.Input data-testid="input" /><Combobox.Trigger>Options</Combobox.Trigger></Combobox.Control>
    <Combobox.Positioner><Combobox.Content><Combobox.List /></Combobox.Content></Combobox.Positioner>
  {:else if family === 'otp-input'}
    <OtpInput.Input index={0} data-testid="input" />
    <OtpInput.Input index={1} data-testid="second-input" />
    <OtpInput.HiddenInput />
  {:else}
    <ColorPicker.ChannelInput channel="hex" data-testid="input" />
    <ColorPicker.HiddenInput />
  {/if}
{/snippet}
