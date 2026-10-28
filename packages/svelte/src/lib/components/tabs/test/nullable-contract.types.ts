import type { ValueChangeDetails } from '@destyler/tabs'
import type { UseTabsProps } from '../hooks/use-tabs.svelte'

type Equal<A, B>
  = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2)
    ? (<T>() => T extends B ? 1 : 2) extends (<T>() => T extends A ? 1 : 2)
        ? true
        : false
    : false

type ChangeDetails = Parameters<NonNullable<UseTabsProps['onValueChange']>>[0]

// Svelte selection props follow Vue: controlled and initial values, and the
// change payload, are `string | null` and match @destyler/tabs ValueChangeDetails.
export const nullableProps = { id: 'tabs', value: null, defaultValue: null } satisfies UseTabsProps
export const nullableChange = { value: null } satisfies ChangeDetails
export const stringChange = { value: 'alpha' } satisfies ChangeDetails
export const valueChangeMatchesCore: Equal<ChangeDetails, ValueChangeDetails> = true
