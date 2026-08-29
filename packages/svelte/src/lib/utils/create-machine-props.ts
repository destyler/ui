type MachineProps = Record<string, unknown>

type StringKey<T> = Extract<keyof T, string>
type DefaultPropMap<T> = Partial<Record<StringKey<T>, StringKey<T>>>

/**
 * Separates one-time default values from the reactive machine context.
 *
 * Destyler machines read defaults when they are created, while controlled
 * values continue to flow through `setContext`. Keeping those two objects
 * separate prevents a later prop update from resetting uncontrolled state.
 */
export function createMachineProps<T extends MachineProps>(
  props: T,
  defaults: DefaultPropMap<T> = {},
  controlled: readonly StringKey<T>[] = [],
) {
  const initial = { ...props } as MachineProps
  const context = { ...props } as MachineProps

  for (const [prop, defaultProp] of Object.entries(defaults) as [StringKey<T>, StringKey<T>][]) {
    initial[prop] = props[prop] !== undefined ? props[prop] : props[defaultProp]
    delete initial[defaultProp]
    delete context[defaultProp]
  }

  for (const prop of controlled) {
    const key = `${prop}.controlled`
    const isControlled = props[prop] !== undefined
    initial[key] = isControlled
    context[key] = isControlled
  }

  return { initial, context }
}
