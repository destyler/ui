# @destyler-ui/solid

Unstyled, accessible Solid components for building design systems.

```bash
pnpm add @destyler-ui/solid solid-js
```

```tsx
import { Checkbox } from '@destyler-ui/solid/checkbox'

export function Example() {
  return (
    <Checkbox.Root>
      <Checkbox.Label>Checkbox</Checkbox.Label>
      <Checkbox.Control>
        <Checkbox.Indicator>✓</Checkbox.Indicator>
      </Checkbox.Control>
      <Checkbox.HiddenInput />
    </Checkbox.Root>
  )
}
```
