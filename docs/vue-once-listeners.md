# Vue Once listeners and custom buttons (unreleased)

This guide describes the source change in this branch. The new
`useNativeEventProps` export is not included in the published 0.0.3 package.

Steps click controls and the Select Trigger, Content, Item, ClearTrigger and
Label compose ordinary consumer listeners before their internal action. On their
native elements, an ordinary `@click.once.prevent` (or corresponding keydown
listener) can cancel the first action without disabling later actions.

```vue
<script setup lang="ts">
import { Steps } from '@destyler-ui/vue'

function onFirstClick() {
  console.log('The first click is canceled')
}
</script>

<template>
  <Steps.Root :count="3">
    <Steps.NextTrigger @click.once.prevent="onFirstClick">
      Next
    </Steps.NextTrigger>
  </Steps.Root>
</template>
```

The first click runs the consumer and prevents advancing. The second click can
advance normally. Replacing an already-consumed Once callback does not restart
it.

## A custom component used with asChild

The library does not guess whether an arbitrary component forwards DOM attrs,
emits a custom event, or accepts a callback prop. Add `useNativeEventProps` where
your component binds those attrs to its **actual native element**.

`ForwardedButton.vue`:

```vue
<script setup lang="ts">
import { useAttrs } from 'vue'
import { useForwardExpose, useNativeEventProps } from '@destyler-ui/vue'

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()
const nativeProps = useNativeEventProps()
const { forwardRef } = useForwardExpose()
</script>

<template>
  <div class="button-shell">
    <button v-bind="nativeProps(attrs)" :ref="forwardRef">
      <slot />
    </button>
  </div>
</template>
```

Use it as the child of a control:

```vue
<script setup lang="ts">
import { Steps } from '@destyler-ui/vue'
import ForwardedButton from './ForwardedButton.vue'

function onFirstClick() {
  console.log('The first click is canceled')
}
</script>

<template>
  <Steps.Root :count="3">
    <Steps.NextTrigger as-child @click.once.prevent="onFirstClick">
      <ForwardedButton>Next</ForwardedButton>
    </Steps.NextTrigger>
  </Steps.Root>
</template>
```

Create the helper once in setup, then call it during every render. Do not compute
`nativeProps(attrs)` only once in setup: that would freeze forwarded props.
`inheritAttrs: false` prevents a second automatic binding to the outer container.
The ref forwards the actual button, not the shell. The same pattern works when
the receiving element is inside a Fragment or Teleport.

### Adding a local listener

Preserve the original callback references with Vue's `mergeProps`, then pass the
complete set to the helper:

```ts
import { useNativeEventProps } from '@destyler-ui/vue'
import { mergeProps, useAttrs } from 'vue'

const attrs = useAttrs()
const nativeProps = useNativeEventProps()

function localClick(event: MouseEvent) {
  // A local stopImmediatePropagation can prevent later listeners, including Once.
}

const buttonProps = () => nativeProps(mergeProps({ onClick: localClick }, attrs))
```

Bind `buttonProps()` to the native button. Do not hide the forwarded callback
inside a new arrow function, manually call `attrs.onClick`, or append another
`@click` after the helper: those change or obscure the listener composition.

## Lifecycle and limits

- One helper instance belongs to one receiving native element. For two buttons,
  create two helpers; for repeated items, put the helper in each item component.
- A Once callback runs once per actual native node. Replacing its callback alone
  does not rearm an already-consumed listener.
- Remove the Once prop and complete a render, then add it back to rearm it. If a
  child filters attrs conditionally, call the helper *after* that filtering.
- A new native node gets a fresh opportunity. Moving or preserving the same node
  does not rearm it. Remounting the component creates a new helper lifecycle.
- A Once callback is consumed even if a `.self` modifier rejects the event or the
  callback throws. A preceding ordinary `stopImmediatePropagation` can prevent
  it from being reached and consumed.
- `Capture` and `Passive` option combinations keep their native registration
  semantics. Passive listeners cannot cancel a default action.
- The helper is for native DOM bindings, not component `emit` payloads or general
  callback props. Undeclared emits are legal Vue behavior and are not inferred.
- An unadapted custom component keeps its original Vue behavior. Its separate
  Once listener may still run after the control's internal handler, so a veto
  cannot be guaranteed. Use the explicit native binding above when needed.

## Validation

The example's executable fixture uses the package's source entry alias in place
of the installed package import. Tests cover its attrs, exposed button ref,
Once cancellation and hydration diagnostics, plus callback replacement,
removal/readdition, node replacement, arrays, errors and propagation.

Real browser input tests are provided separately. They have not been executed
in the current restricted environment after Chromium's socket EPERM failure;
DOM-emulated tests are not a substitute for that browser verification.

Vue's timestamp protection still applies to synthetic events dispatched in the
same clock tick as listener attachment. The helper does not override that
protection or promise to reconstruct a native Once registration that Vue skipped
before a later, newly introduced core handler. The standard controls already
provide their core handlers when mounted.
