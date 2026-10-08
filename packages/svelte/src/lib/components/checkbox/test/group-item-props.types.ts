import type { UseCheckboxGroupReturn } from '../index'

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false
type Assert<T extends true> = T
type Group = ReturnType<UseCheckboxGroupReturn>
type Item = ReturnType<Group['getItemProps']>

// Existing callers still receive required normalized booleans. Wrappers may
// supply inherited Field defaults through the optional second argument.
export type ItemDisabled = Assert<Equal<Item['disabled'], boolean>>
export type ItemReadOnly = Assert<Equal<Item['readOnly'], boolean>>
export type ItemInvalid = Assert<Equal<Item['invalid'], boolean>>
export type GroupDisabled = Assert<Equal<Group['disabled'], boolean>>
export type GroupReadOnly = Assert<Equal<Group['readOnly'], boolean>>
export type GroupInvalid = Assert<Equal<Group['invalid'], boolean>>
export type RequiredItemFlags = Assert<Equal<Pick<Item, 'disabled' | 'readOnly' | 'invalid'>, { disabled: boolean, readOnly: boolean, invalid: boolean }>>
export type OriginalParameters = Assert<Equal<Parameters<Group['getItemProps']>, [{ value: string | undefined }]>>

export function preservePublicCallbacks(group: Group) {
  const mapped = [{ value: 'one' }].map(group.getItemProps)
  const inherited = group.getItemProps({ value: 'one' }, { disabled: true })
  return [mapped[0].disabled, inherited.disabled] satisfies boolean[]
}
