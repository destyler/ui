<script lang="ts">
  import { Clipboard, useClipboard } from '../index'

  const id = $props.id()
  const clipboard = useClipboard({ id, value: 'https://destyler.org' })
</script>

{#snippet copied()}
  <span>Copied!</span>
{/snippet}

<button type="button" onclick={() => clipboard().copy()}>Copy</button>
<Clipboard.RootProvider value={clipboard}>
  <Clipboard.Label>Copy this link</Clipboard.Label>
  <Clipboard.Control>
    <Clipboard.Input />
    <Clipboard.Trigger>
      <Clipboard.Indicator {copied}><span>Copy</span></Clipboard.Indicator>
    </Clipboard.Trigger>
  </Clipboard.Control>
</Clipboard.RootProvider>
