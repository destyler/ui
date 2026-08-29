<script lang="ts">
  import { Clipboard } from '../index'
</script>

<Clipboard.Root value="https://destyler.org">
  <Clipboard.Label>Copy this link</Clipboard.Label>
  <Clipboard.Control>
    <Clipboard.Input />
    <Clipboard.Trigger>
      <Clipboard.Context>
        {#snippet render(clipboard)}
          <span>{clipboard().copied ? 'Copied' : 'Copy'}</span>
        {/snippet}
      </Clipboard.Context>
    </Clipboard.Trigger>
  </Clipboard.Control>
</Clipboard.Root>
