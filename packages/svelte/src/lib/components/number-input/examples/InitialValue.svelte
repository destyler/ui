<script module lang="ts">
  import type { NumberInputRootProps } from '../index'

  export interface InitialProps extends NumberInputRootProps {}
</script>

<script lang="ts">
  import { NumberInput } from '../index'

  const props: InitialProps = $props()
</script>

<NumberInput.Root {...props} defaultValue="42">
