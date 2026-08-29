<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps, RefAttribute } from '$lib/types'

  export interface NavigationMenuItemIndicatorBaseProps extends PolymorphicProps<'span'>, RefAttribute {
    value: string
  }
  export interface NavigationMenuItemIndicatorProps
    extends Assign<HTMLProps<'span'>, NavigationMenuItemIndicatorBaseProps> {}
</script>

<script lang="ts">
  import { UI } from '../../factory'

  let { value: _value, ...props }: NavigationMenuItemIndicatorProps = $props()
</script>

<UI as="span" data-scope="navigation-menu" data-part="item-indicator" {...props} />
