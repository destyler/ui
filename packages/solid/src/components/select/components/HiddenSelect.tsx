import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { createMemo, Index, Show } from 'solid-js'
import { useFieldContext } from '~/components/field'
import { ui } from '~/factory'
import { useSelectContext } from '../hooks/use-select-context'

export interface SelectHiddenSelectBaseProps extends PolymorphicProps<'select'> {}
export interface SelectHiddenSelectProps extends HTMLProps<'select'>, SelectHiddenSelectBaseProps {}

export function SelectHiddenSelect(props: SelectHiddenSelectProps) {
  const select = useSelectContext()
  const mergedProps = mergeProps(() => select().getHiddenSelectProps(), props)
  const isValueEmpty = createMemo(() => select().value.length === 0)
  const field = useFieldContext()

  return (
    <ui.select aria-describedby={field?.().ariaDescribedby} {...mergedProps}>
      <Show when={isValueEmpty()}>
        <option value="" />
      </Show>
      <Index each={select().collection.items}>
        {item => (
          <option
            value={select().collection.getItemValue(item()) ?? ''}
            disabled={select().collection.getItemDisabled(item())}
          >
            {select().collection.stringifyItem(item())}
          </option>
        )}
      </Index>
    </ui.select>
  )
}
