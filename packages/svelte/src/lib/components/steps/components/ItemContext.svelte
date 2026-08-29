<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { UseStepsItemContext } from '../hooks/use-steps-item-context.js'

  export interface StepsItemContextProps {
    render: Snippet<[UseStepsItemContext]>
  }
</script>

<script lang="ts">
  import { useStepsItemContext } from '../hooks/use-steps-item-context.js'

  let { render }: StepsItemContextProps = $props()

  const context = useStepsItemContext()
</script>

{@render render(context)}
