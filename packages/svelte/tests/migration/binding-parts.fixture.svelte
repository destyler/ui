<script lang="ts">
  import type { BindingApi, BindingCase } from './binding-cases'
  import type { OpenFamily } from './open-cases'
  import { UI } from '$lib/components/factory'
  import OpenParts from './open-parts.fixture.svelte'

  let { api, selected }: { api: () => BindingApi; selected: BindingCase } = $props()
</script>

{#if selected.state === 'open'}
  <OpenParts api={api as any} family={selected.family as OpenFamily} />
{:else if selected.family === 'checkbox' || selected.family === 'switch'}
  <UI as="span" {...api().getControlProps()} data-testid="control" />
  <UI as="input" {...api().getHiddenInputProps()} data-testid="input" />
{:else if selected.family === 'edit'}
  <UI as="input" {...api().getInputProps()} data-testid="input" />
  <UI as="span" {...api().getPreviewProps()} data-testid="preview">{api().value}</UI>
{:else if selected.family === 'combobox'}
  <UI as="div" {...api().getControlProps()}>
    <UI as="input" {...api().getInputProps()} data-testid="input" />
    <UI as="button" {...api().getTriggerProps()}>Options</UI>
  </UI>
  <UI as="div" {...api().getPositionerProps()}>
    <UI as="div" {...api().getContentProps()}>
      <UI as="div" {...api().getListProps()}>
        {#each ['one', 'two'] as item}
          <UI as="div" {...api().getItemProps({ item })}>{item}</UI>
        {/each}
      </UI>
    </UI>
  </UI>
{:else if selected.family === 'select' || selected.family === 'calendar' || selected.family === 'color-picker'}
  <UI as="button" {...api().getTriggerProps()}>Options</UI>
  <UI as="div" {...api().getPositionerProps()}><UI as="div" {...api().getContentProps()}>Content</UI></UI>
  {#if selected.family === 'calendar'}
    <UI as="input" {...api().getInputProps()} data-testid="input" />
  {/if}
{:else if selected.family === 'dynamic' || selected.family === 'number-input'}
  <UI as="input" {...api().getInputProps()} data-testid="input" />
{:else if selected.family === 'otp-input'}
  {#each [0, 1] as index}
    <UI as="input" {...api().getInputProps({ index })} data-testid={`input-${index}`} />
  {/each}
{:else if selected.family === 'pagination'}
  <UI as="button" {...api().getItemProps({ type: 'page', value: 1 })} data-testid="page-one">1</UI>
  <UI as="button" {...api().getItemProps({ type: 'page', value: 2 })} data-testid="page-two">2</UI>
{:else if selected.family === 'splitter'}
  <UI as="div" {...api().getPanelProps({ id: 'a' })} data-testid="panel-a">A</UI>
  <UI as="div" {...api().getResizeTriggerProps({ id: 'a:b' })} />
  <UI as="div" {...api().getPanelProps({ id: 'b' })} data-testid="panel-b">B</UI>
{:else if selected.family === 'tabs'}
  <UI as="div" {...api().getListProps()}>
    {#each ['one', 'two'] as value}
      <UI as="button" {...api().getTriggerProps({ value })} data-testid={`tab-${value}`}>{value}</UI>
    {/each}
  </UI>
{:else if selected.family === 'carousel'}
  <UI as="div" {...api().getItemGroupProps()} style={`${api().getItemGroupProps().style}--slide-spacing:0px;--slide-item-size:300px;width:300px;height:80px;scroll-behavior:auto;`}>
    {#each [0, 1, 2] as index}
      <UI as="div" {...api().getItemProps({ index })}>Slide {index + 1}</UI>
    {/each}
  </UI>
{:else if selected.family === 'navigation-menu'}
  <UI as="ul" {...api().getListProps()}>
    <UI as="li" {...api().getItemProps({ value: 'one' })}>
      <UI as="button" {...api().getTriggerProps({ value: 'one' })} data-testid="navigation-trigger">One</UI>
    </UI>
  </UI>
  <UI as="div" {...api().getViewportPositionerProps()}>
    <UI as="div" {...api().getViewportProps()}>
      <UI as="div" {...api().getContentProps({ value: 'one' })}>One content</UI>
    </UI>
  </UI>
{:else if selected.family === 'tree'}
  <UI as="div" {...api().getTreeProps()}>
    {#each api().collection.rootNode.children as node, index}
      <UI as="div" {...api().getItemProps({ node, indexPath: [index] })} data-testid={`tree-${node.id}`}>{node.id}</UI>
    {/each}
  </UI>
{/if}
