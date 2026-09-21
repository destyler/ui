<script module lang="ts">
  import type { CheckboxRootProps } from '../index'

  export interface InitialProps extends CheckboxRootProps {}
</script>

<script lang="ts">
  import { Checkbox } from '../index'

  const props: InitialProps = $props()
</script>

<Checkbox.Root {...props} defaultChecked>
