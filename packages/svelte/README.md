# Destyler UI for Svelte

Unstyled, accessible Svelte 5 components powered by the `@destyler/*` state machines.

## Installation

```bash
pnpm add @destyler-ui/svelte
```

Destyler UI requires Svelte 5.29 or newer.

## Quick start

```svelte
<script lang="ts">
  import { Checkbox } from '@destyler-ui/svelte'

  let checked = $state(false)
</script>

<Checkbox.Root bind:checked>
  <Checkbox.Control>
    <Checkbox.Indicator>✓</Checkbox.Indicator>
  </Checkbox.Control>
  <Checkbox.Label>Accept terms</Checkbox.Label>
  <Checkbox.HiddenInput />
</Checkbox.Root>
```

The package exposes the same component catalog as `@destyler-ui/react` and `@destyler-ui/vue`, with Svelte bindings such as `bind:checked`, `bind:open`, and `bind:value`.

Components are unstyled. Style their stable `data-scope`, `data-part`, and state attributes, or compose your own element with the `asChild` snippet.

```css
[data-scope='checkbox'][data-part='control'] {
  border: 1px solid currentColor;
  border-radius: 0.25rem;
}

[data-scope='checkbox'][data-part='control'][data-state='checked'] {
  background: currentColor;
}
```

All component families are available from the root package or from a tree-shakable subpath:

```ts
import { Checkbox } from '@destyler-ui/svelte'
import { Checkbox as CheckboxFromSubpath } from '@destyler-ui/svelte/checkbox'
```

Runtime helpers are exported from the root package and dedicated subpaths, including `ClientOnly`, `EnvironmentProvider`, `FocusTrap`, `Format`, `Frame`, `Highlight`, and `LocaleProvider`.

See the [Destyler UI documentation](https://ui.destyler.dev/overview/getting-started/) for component examples, API tables, and provider guides.
