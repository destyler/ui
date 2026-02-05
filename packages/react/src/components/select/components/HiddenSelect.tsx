import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { useFieldContext } from '~/components/field'
import { ui } from '~/factory'
import { useSelectContext } from '../hooks/use-select-context'

export interface SelectHiddenSelectBaseProps extends PolymorphicProps {}
export interface SelectHiddenSelectProps extends HTMLProps<'select'>, SelectHiddenSelectBaseProps {}

export const SelectHiddenSelect = forwardRef<HTMLSelectElement, SelectHiddenSelectProps>((props, ref) => {
  const select = useSelectContext()
  const mergedProps = mergeProps(select.getHiddenSelectProps(), props)
  const isValueEmpty = select.value.length === 0
  const field = useFieldContext()

  return (
    <ui.select aria-describedby={field?.ariaDescribedby} {...mergedProps} ref={ref}>
      {isValueEmpty && <option value="" />}
      {select.collection.items.map((item, index) => (
        <option
          key={index}
          value={select.collection.getItemValue(item) ?? ''}
          disabled={select.collection.getItemDisabled(item)}
        >
          {select.collection.stringifyItem(item)}
        </option>
      ))}
    </ui.select>
  )
})

SelectHiddenSelect.displayName = 'SelectHiddenSelect'
