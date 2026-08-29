<script lang="ts">import { Collapsible } from '../index'</script>
<Collapsible.Root onExitComplete={() => console.log('on exit')}><Collapsible.Trigger>Toggle</Collapsible.Trigger><Collapsible.Content>Content</Collapsible.Content></Collapsible.Root>
