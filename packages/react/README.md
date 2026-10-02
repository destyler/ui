# @destyler-ui/react

Unstyled, compound React components built on Destyler core. Compose component parts and supply your own styles; the components wire up state and interaction behavior.

Use this package for components such as `Checkbox.Root`. The separate `@destyler/react` package is the lower-level core adapter for building your own machine-based components. See [core or UI](https://github.com/destyler/ui#choose-core-or-ui) for the distinction.

## Install

In an existing React application:

```sh
pnpm add @destyler-ui/react react react-dom
```

Use the equivalent command for your package manager. The [package manifest](https://github.com/destyler/ui/blob/main/packages/react/package.json) declares `react` and `react-dom` `>=18.0.0`; keep the two framework packages on compatible versions.

The package is beta. The peer range is a declaration, not evidence that every React version or consumer setup has been verified. Examples here describe the checked-in source API. Workspace demos and source type checks do not establish that an installed npm artifact has working runtime entry points and declarations; verify the version you install. Pending compatibility or packaging fixes are not released support.

### Evaluated source packaging caveats

Source revision [`8b83d9b`](https://github.com/destyler/ui/tree/8b83d9b13bf3db1e365407d4235c97de67187520), evaluated on 2026-09-30, has two packaging gaps: its [manifest](https://github.com/destyler/ui/blob/8b83d9b13bf3db1e365407d4235c97de67187520/packages/react/package.json) points to `dist/index.mjs`, while a clean build using its [build configuration](https://github.com/destyler/ui/blob/8b83d9b13bf3db1e365407d4235c97de67187520/packages/react/tsdown.config.ts) emits `dist/index.js`; its [Vite configuration](https://github.com/destyler/ui/blob/8b83d9b13bf3db1e365407d4235c97de67187520/packages/react/vite.config.ts) also enables React Compiler without an explicit target. The compiler's [default target is React 19](https://react.dev/reference/react-compiler/target), so that revision's declared React 18 minimum does not establish a working React 18 artifact. [PR #51](https://github.com/destyler/ui/pull/51) tracks entry-point fixes and React 18/19 consumer validation. These observations concern that source revision, not an inspection of historical npm tarballs. Check whether the fixes are included in the version you install before relying on them.

## Quick start

Import component namespaces from the package root:

```tsx
import { Checkbox } from '@destyler-ui/react'

export function NewsletterCheckbox() {
  return (
    <Checkbox.Root name="newsletter" defaultChecked>
      <Checkbox.Control>
        <Checkbox.Indicator aria-hidden="true">✓</Checkbox.Indicator>
      </Checkbox.Control>
      <Checkbox.Label>Receive the newsletter</Checkbox.Label>
      <Checkbox.HiddenInput />
    </Checkbox.Root>
  )
}
```

`defaultChecked` seeds the initial value; the component owns subsequent changes. Keep `HiddenInput` for native input behavior and form participation. No global provider or stylesheet is needed for this example.

Components are unstyled. For example, add this CSS to your application's stylesheet:

```css
[data-scope='checkbox'][data-part='control'] {
  border: 1px solid currentColor;
  border-radius: 0.25rem;
  min-width: 1rem;
  min-height: 1rem;
}
```

State attributes such as `data-state='checked'` are available for additional styling. Verify keyboard focus, labels, and contrast with your application's final styles.

## Controlled state

Use a live `checked` value and write requested changes back through `onCheckedChange`. The value type includes the indeterminate state:

```tsx
import { Checkbox } from '@destyler-ui/react'
import { useState } from 'react'

export function ControlledCheckbox() {
  const [checked, setChecked] = useState<Checkbox.CheckedState>(false)

  return (
    <Checkbox.Root
      checked={checked}
      onCheckedChange={details => setChecked(details.checked)}
    >
      <Checkbox.Control>
        <Checkbox.Indicator aria-hidden="true">✓</Checkbox.Indicator>
      </Checkbox.Control>
      <Checkbox.Label>Receive the newsletter</Checkbox.Label>
      <Checkbox.HiddenInput />
    </Checkbox.Root>
  )
}
```

Choose controlled or uncontrolled ownership on the first render and keep it stable. A defined `checked`, including `false`, takes precedence over `defaultChecked`; an omitted or `undefined` live prop starts uncontrolled. Do not use the removed `*.controlled` flags.

## Guides

- [Installation and package imports](https://github.com/destyler/ui/blob/main/docs/src/content/docs/overview/installation.mdx)
- [Checkbox examples and API](https://github.com/destyler/ui/blob/main/docs/src/content/docs/components/checkbox.mdx)
- [Controllable state and component-specific exceptions](https://github.com/destyler/ui/blob/main/docs/src/content/docs/overview/controllable-state.mdx)
- [Core adapter/consumer migration notes](https://github.com/destyler/destyler/blob/main/CONTROLLED-API.md#adapter--consumer-migration-hard)
