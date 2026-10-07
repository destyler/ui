<script lang="ts">
  import { AspectRatio } from '$lib/components/aspect-ratio'
  import { Breadcrumbs } from '$lib/components/breadcrumbs'
  import { Label } from '$lib/components/label'
  import { Separator } from '$lib/components/separator'
  const { ratio, vertical }: { ratio: number; vertical: boolean } = $props()
  const home = { id: 'home', label: 'Home', href: '/' }
  const current = { id: 'current', label: 'Current' }
</script>

<AspectRatio.Root id="frame" {ratio}>
  <AspectRatio.Content id="caller-content">Media</AspectRatio.Content>
</AspectRatio.Root>
<Breadcrumbs.Root id="trail" items={[home, current]} aria-label="Trail">
  <Breadcrumbs.List>
    <Breadcrumbs.Item item={home}><Breadcrumbs.Link item={home}>Home</Breadcrumbs.Link><Breadcrumbs.Separator>/</Breadcrumbs.Separator></Breadcrumbs.Item>
    <Breadcrumbs.Item item={current}><Breadcrumbs.Link item={current}>Current</Breadcrumbs.Link></Breadcrumbs.Item>
  </Breadcrumbs.List>
</Breadcrumbs.Root>
<Label.Root for="control">Name</Label.Root>
<input id="control" />
<Separator.Root id="rule" orientation={vertical ? 'vertical' : 'horizontal'} />
