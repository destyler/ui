<script module lang="ts">
  import type { InputProps } from '@destyler/calendar'
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types.js'

  export interface CalendarInputBaseProps extends InputProps, PolymorphicProps<'input'> {}
  export interface CalendarInputProps extends Assign<HTMLProps<'input'>, CalendarInputBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { createSplitProps } from '../../../utils/create-split-props.js'
  import { UI } from '../../factory/index.js'
  import { useCalendarContext } from '../hooks/use-calendar-context.js'

  const props: CalendarInputProps = $props()

  const [inputProps, localProps] = $derived(createSplitProps<InputProps>()(props, ['index', 'fixOnBlur']))
  const calendar = useCalendarContext()
  const mergedProps = $derived(mergeProps(calendar().getInputProps(inputProps), localProps))
</script>

<UI as="input" {...mergedProps} />
