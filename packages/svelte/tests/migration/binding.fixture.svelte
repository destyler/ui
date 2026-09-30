<script lang="ts">
  import type { BindingApi, BindingMode } from './binding-cases'
  import { untrack } from 'svelte'
  import { bindingCases, formatState, readState, requestState } from './binding-cases'
  import BindingParts from './binding-parts.fixture.svelte'

  let { name, mode, onChange, onWrite, unrelated = 0 }: {
    name: string
    mode: BindingMode
    onChange?: (value: unknown) => void
    onWrite?: (value: unknown) => void
    unrelated?: number
  } = $props()
  const selected = untrack(() => bindingCases.find(testCase => testCase.name === name)!)
  const Root = selected.components.Root
  const Context = selected.components.Context
  const id = $props.id()
  let parent = $state<any>(untrack(() => mode === 'bound-undefined' ? undefined : selected.initial()))
  const baseProps = untrack(() => selected.props?.() ?? {})
  const callback = selected.callback ?? `on${selected.state[0].toUpperCase()}${selected.state.slice(1)}Change`
  const defaultProp = `default${selected.state[0].toUpperCase()}${selected.state.slice(1)}`
  const rootProps = $derived({
    ...baseProps,
    ...(selected.family === 'toggle' ? { asChild: toggleContainer } : {}),
    id,
    ...(selected.hasDefault === false ? {} : { [defaultProp]: selected.initial() }),
    [callback]: (details: any) => onChange?.(selected.detail ? selected.detail(details) : details[selected.state]),
  })
  const get = () => parent
  const set = (value: unknown) => {
    onWrite?.(value)
    if (mode !== 'bound-veto')
      parent = value
  }
</script>

<output data-testid="parent-state">{formatState(selected, parent)}</output>
<button type="button" data-testid="parent-next" onclick={() => parent = selected.next()}>Parent sets next</button>
<button type="button" data-testid="parent-initial" onclick={() => parent = selected.initial()}>Parent resets</button>
<div data-unrelated={unrelated}>
  {#if mode === 'controlled'}
    <Root {...rootProps} {...{ [selected.state]: parent }} children={children} />
  {:else if mode === 'uncontrolled'}
    <Root {...rootProps} children={children} />
  {:else if selected.state === 'checked'}
    <Root {...rootProps} bind:checked={get, set} children={children} />
  {:else if selected.state === 'pressed'}
    <Root {...rootProps} bind:pressed={get, set} children={children} />
  {:else if selected.state === 'open'}
    <Root {...rootProps} bind:open={get, set} children={children} />
  {:else if selected.state === 'value'}
    <Root {...rootProps} bind:value={get, set} children={children} />
  {:else if selected.state === 'inputValue'}
    <Root {...rootProps} bind:inputValue={get, set} children={children} />
  {:else if selected.state === 'page'}
    <Root {...rootProps} bind:page={get, set} children={children} />
  {:else if selected.state === 'pageSize'}
    <Root {...rootProps} bind:pageSize={get, set} children={children} />
  {:else if selected.state === 'size'}
    <Root {...rootProps} bind:size={get, set} children={children} />
  {:else if selected.state === 'step'}
    <Root {...rootProps} bind:step={get, set} children={children} />
  {:else if selected.state === 'edit'}
    <Root {...rootProps} bind:edit={get, set} children={children} />
  {:else if selected.state === 'focusedValue'}
    <Root {...rootProps} bind:focusedValue={get, set} children={children} />
  {:else if selected.state === 'expandedValue'}
    <Root {...rootProps} bind:expandedValue={get, set} children={children} />
  {:else if selected.state === 'selectedValue'}
    <Root {...rootProps} bind:selectedValue={get, set} children={children} />
  {:else if selected.state === 'view'}
    <Root {...rootProps} bind:view={get, set} children={children} />
  {/if}
</div>

{#snippet children()}
  <Context render={parts} children={parts} api={parts} />
{/snippet}

{#snippet parts(api: () => BindingApi)}
  <output data-testid="api-state">{formatState(selected, readState(selected, api()))}</output>
  <button type="button" data-testid="request-next" onclick={event => { event.stopPropagation(); requestState(selected, api(), selected.next()) }}>Request next</button>
  <button type="button" data-testid="request-initial" onclick={event => { event.stopPropagation(); requestState(selected, api(), selected.initial()) }}>Request initial</button>
  <BindingParts {api} selected={selected} />
{/snippet}

{#snippet toggleContainer(props: any)}
  <!-- API request controls are not nested inside a native button. -->
  <div {...props()}>{@render children()}</div>
{/snippet}
