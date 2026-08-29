<script lang="ts">
  import { Clipboard } from '../index'
</script>

{#snippet copied()}
  <span>Copied!</span>
{/snippet}

<Clipboard.Root value="https://destyler.org">
  <Clipboard.Label>Copy this link</Clipboard.Label>
  <Clipboard.Control>
    <Clipboard.Input />
    <Clipboard.Trigger>
      <Clipboard.Indicator {copied}><span>Copy</span></Clipboard.Indicator>
    </Clipboard.Trigger>
  </Clipboard.Control>
</Clipboard.Root>
