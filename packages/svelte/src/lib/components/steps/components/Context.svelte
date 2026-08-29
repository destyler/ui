<script module lang="ts">
  import type { Snippet } from 'svelte'
  import type { UseStepsContext } from '../hooks/use-steps-context'

  export interface StepsContextProps {
    render: Snippet<[UseStepsContext]>
  }
</script>

<script lang="ts">
  import { useStepsContext } from '../hooks/use-steps-context'

  let { render }: StepsContextProps = $props()

  const stepsContext = useStepsContext()
</script>

{@render render(stepsContext)}
