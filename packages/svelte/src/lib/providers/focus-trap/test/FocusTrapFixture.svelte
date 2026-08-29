<script lang="ts">
  import type { FocusTrapProps } from '../index'
  import { FocusTrap } from '../index'

  const props: FocusTrapProps = $props()
</script>

<FocusTrap {...props}>
  <button type="button">Test Button</button>
</FocusTrap>
