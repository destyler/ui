# @destyler-ui/vue

Unstyled, compound Vue components built on Destyler core. Compose component parts and supply your own styles; the components wire up state and interaction behavior.

Use this package for components such as `Checkbox.Root`. The separate `@destyler/vue` package is the lower-level core adapter for building your own machine-based components. See [core or UI](https://github.com/destyler/ui#choose-core-or-ui) for the distinction.

## Install

In an existing Vue application:

```sh
pnpm add @destyler-ui/vue vue
```

Use the equivalent command for your package manager. The [package manifest](https://github.com/destyler/ui/blob/main/packages/vue/package.json) declares `vue` `>=3.5.0`.

The package is beta. The peer range is a declaration, not evidence that every Vue version or consumer setup has been verified. Examples here describe the checked-in source API. Workspace demos and source type checks do not establish that an installed npm artifact has working runtime entry points and declarations; verify the version you install. Pending compatibility or packaging fixes are not released support.

## Quick start

Import component namespaces from the package root in a Vue single-file component:

```vue
<script setup lang="ts">
import { Checkbox } from '@destyler-ui/vue'
</script>

<template>
  <Checkbox.Root name="newsletter" default-checked>
    <Checkbox.Control>
      <Checkbox.Indicator aria-hidden="true">✓</Checkbox.Indicator>
    </Checkbox.Control>
    <Checkbox.Label>Receive the newsletter</Checkbox.Label>
    <Checkbox.HiddenInput />
  </Checkbox.Root>
</template>
```

`default-checked` seeds the initial value; the component owns subsequent changes. Keep `HiddenInput` for native input behavior and form participation. No global component registration, provider, or stylesheet is needed for this example.

Components are unstyled. For example, add this CSS to your application's global stylesheet:

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

Use `v-model:checked` when your application owns the checkbox state. The value type includes the indeterminate state:

```vue
<script setup lang="ts">
import { Checkbox } from '@destyler-ui/vue'
import { ref } from 'vue'

const checked = ref<Checkbox.CheckedState>(false)
</script>

<template>
  <Checkbox.Root v-model:checked="checked">
    <Checkbox.Control>
      <Checkbox.Indicator aria-hidden="true">✓</Checkbox.Indicator>
    </Checkbox.Control>
    <Checkbox.Label>Receive the newsletter</Checkbox.Label>
    <Checkbox.HiddenInput />
  </Checkbox.Root>
</template>
```

Choose controlled or uncontrolled ownership on the first render and keep it stable. A defined `checked`, including `false`, takes precedence over `defaultChecked`; an omitted or `undefined` live prop starts uncontrolled. Do not use the removed `*.controlled` flags. Other components may use the default `v-model` or a different named model; check the component's API.

## Guides

- [Installation and package imports](https://github.com/destyler/ui/blob/main/docs/src/content/docs/overview/installation.mdx)
- [Checkbox examples and API](https://github.com/destyler/ui/blob/main/docs/src/content/docs/components/checkbox.mdx)
- [Controllable state and component-specific exceptions](https://github.com/destyler/ui/blob/main/docs/src/content/docs/overview/controllable-state.mdx)
- [Core adapter/consumer migration notes](https://github.com/destyler/destyler/blob/main/CONTROLLED-API.md#adapter--consumer-migration-hard)
