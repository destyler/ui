import type {
  UseCheckboxContext,
  useCheckboxContext,
  UseCheckboxGroupContext,
  useCheckboxGroupContext,
} from '$lib/components/checkbox'
import type { UseFieldContext, useFieldContext } from '$lib/components/field'
import type { UseFieldsetContext, useFieldsetContext } from '$lib/components/fieldset'
import type { UseMenuContext, useMenuContext } from '$lib/components/menu'
import type {
  UseMenuMachineContext,
  useMenuMachineContext,
} from '$lib/components/menu/hooks/use-menu-machine-context'
import type {
  UseMenuTriggerItemContext,
  useMenuTriggerItemContext,
} from '$lib/components/menu/hooks/use-menu-trigger-item-context'
import type {
  UseNavigationMenuItemPropsContext,
  useNavigationMenuItemPropsContext,
} from '$lib/components/navigation-menu/hooks/use-navigation-menu-item-props-context'
import type { UseLocaleContext, useLocaleContext } from '$lib/providers/locale'
import { createContext } from '$lib/utils/create-context'

interface TestContext {
  value: string
}

type Equal<Left, Right> = [Left, Right] extends [Right, Left] ? true : false

type Assert<Value extends true> = Value

function _inferCreateContextResults() {
  const [, useImplicitStrictContext] = createContext<TestContext>({})
  const [, useStrictContext] = createContext<TestContext>({ strict: true })
  const [, useOptionalContext] = createContext<TestContext>({ strict: false })
  const [, useDefaultContext] = createContext<TestContext>({
    strict: false,
    defaultValue: { value: 'default' },
  })
  const fallback = { value: 'fallback' }

  return {
    implicitStrict: useImplicitStrictContext(),
    strict: useStrictContext(),
    strictFallback: useStrictContext(fallback),
    optional: useOptionalContext(),
    optionalFallback: useOptionalContext(fallback),
    withDefault: useDefaultContext(),
    withDefaultFallback: useDefaultContext(fallback),
  }
}

type CreateContextResults = ReturnType<typeof _inferCreateContextResults>

export type CreateContextTypeContract = [
  Assert<Equal<CreateContextResults['implicitStrict'], TestContext>>,
  Assert<Equal<CreateContextResults['strict'], TestContext>>,
  Assert<Equal<CreateContextResults['strictFallback'], TestContext>>,
  Assert<Equal<CreateContextResults['optional'], TestContext | undefined>>,
  Assert<Equal<CreateContextResults['optionalFallback'], TestContext>>,
  Assert<Equal<CreateContextResults['withDefault'], TestContext>>,
  Assert<Equal<CreateContextResults['withDefaultFallback'], TestContext>>,
]

export type ComponentContextTypeContract = [
  Assert<Equal<ReturnType<typeof useCheckboxContext>, UseCheckboxContext>>,
  Assert<Equal<ReturnType<typeof useCheckboxGroupContext>, UseCheckboxGroupContext | undefined>>,
  Assert<Equal<ReturnType<typeof useFieldContext>, UseFieldContext | undefined>>,
  Assert<Equal<ReturnType<typeof useFieldsetContext>, UseFieldsetContext | undefined>>,
  Assert<Equal<ReturnType<typeof useMenuContext>, UseMenuContext | undefined>>,
  Assert<Equal<ReturnType<typeof useMenuMachineContext>, UseMenuMachineContext | undefined>>,
  Assert<Equal<ReturnType<typeof useMenuTriggerItemContext>, UseMenuTriggerItemContext | undefined>>,
  Assert<Equal<
    ReturnType<typeof useNavigationMenuItemPropsContext>,
    UseNavigationMenuItemPropsContext | undefined
  >>,
  Assert<Equal<ReturnType<typeof useLocaleContext>, UseLocaleContext>>,
]
