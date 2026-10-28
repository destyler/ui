import type { ValueChangeDetails } from '@destyler/tabs'
import type { RootEmits, RootProps } from '../types'

type Equal<A, B>
  = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2)
    ? (<T>() => T extends B ? 1 : 2) extends (<T>() => T extends A ? 1 : 2)
        ? true
        : false
    : false

// Public Vue selection events follow @destyler/tabs ValueChangeDetails (`string | null`).
export const nullableProps = { modelValue: null, defaultValue: null } satisfies RootProps
export const nullableModelEvent: RootEmits['update:modelValue'] = [null]
export const nullableChangeEvent: RootEmits['valueChange'] = [{ value: null }]
export const stringChangeEvent: RootEmits['valueChange'] = [{ value: 'alpha' }]
export const valueChangeMatchesCore: Equal<RootEmits['valueChange'][0], ValueChangeDetails> = true
