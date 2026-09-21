type MachineProps = Record<string, unknown>

type StringKey<T> = Extract<keyof T, string>
type DefaultPropMap<T> = Partial<Record<StringKey<T>, StringKey<T>>>

/**
 * Build machine initial + reactive context from UI props.
 *
 * Destyler 0.2.7 (Phase 3 HARD): controllable state is prop-presence based.
 * Pass `open` / `defaultOpen` (etc.) through as-is — do NOT remap `default*` into
 * the live prop, and do NOT stamp `*.controlled` flags.
 *
 * Undefined values are omitted so presence detection treats omitted live props as
 * uncontrolled. The `_defaults` / `_controlled` parameters are retained for
 * call-site compatibility and are ignored.
 */
export function createMachineProps<T extends MachineProps>(
  props: T,
  _defaults: DefaultPropMap<T> = {},
  _controlled: readonly StringKey<T>[] = [],
) {
  const cleaned: MachineProps = {}
  for (const [key, value] of Object.entries(props)) {
    if (value === undefined)
      continue
    if (key.endsWith('.controlled'))
      continue
    cleaned[key] = value
  }

  return { initial: { ...cleaned }, context: { ...cleaned } }
}
