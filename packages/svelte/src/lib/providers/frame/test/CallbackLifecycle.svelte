<script lang="ts">
  import FrameContent from '../components/Content.svelte'
  import { Frame } from '../index'

  const { frame = false, incrementOnMount = false, onMountCall, onUnmountCall }: {
    frame?: boolean
    incrementOnMount?: boolean
    onMountCall: (name: string, value: number) => void
    onUnmountCall: (name: string) => void
  } = $props()

  let value = $state(0)
  let alternateMount = $state(false)
  let alternateUnmount = $state(false)
  let calls = 0

  function recordMount(name: string) {
    calls++
    // Bound the baseline regression so a broken effect cannot loop indefinitely.
    if (incrementOnMount && calls <= 3)
      value++
    onMountCall(name, value)
  }

  const firstMount = () => recordMount('first')
  const nextMount = () => recordMount('next')
  const firstUnmount = () => onUnmountCall('first')
  const nextUnmount = () => onUnmountCall('next')
</script>

<button onclick={() => value++}>Change observed state</button>
<button onclick={() => alternateMount = !alternateMount}>Change mount callback</button>
<button onclick={() => alternateUnmount = !alternateUnmount}>Change unmount callback</button>
<output data-testid="value">{value}</output>
{#if frame}
  <Frame title="Callback lifecycle frame" onMount={alternateMount ? nextMount : firstMount} onUnmount={alternateUnmount ? nextUnmount : firstUnmount}>
    <p data-testid="child">Frame lifecycle child</p>
  </Frame>
{:else}
  <FrameContent onMount={alternateMount ? nextMount : firstMount} onUnmount={alternateUnmount ? nextUnmount : firstUnmount}>
    <p data-testid="child">Frame lifecycle child</p>
  </FrameContent>
{/if}
