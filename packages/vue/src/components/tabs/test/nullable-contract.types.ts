import type { RootEmits, RootProps } from '../types'

// Compile-only public contracts, intentionally valid before the core update ships.
export const nullableProps = { modelValue: null, defaultValue: null } satisfies RootProps
export const nullableModelEvent: RootEmits['update:modelValue'] = [null]
export const nullableChangeEvent: RootEmits['valueChange'] = [{ value: null }]
export const stringChangeEvent: RootEmits['valueChange'] = [{ value: 'alpha' }]
