<script lang="ts">
  import { useFilter } from '../index'

  interface Props {
    locale?: string
    testId: string
  }

  let { locale, testId }: Props = $props()

  const filter = useFilter(() => ({ locale, sensitivity: 'base' }))
</script>

<output data-testid={testId}>{filter().startsWith('Istanbul', 'ı')}</output>
