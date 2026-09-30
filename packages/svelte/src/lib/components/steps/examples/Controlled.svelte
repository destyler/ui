<script lang="ts">
  import { Steps } from '../index'

  let step = $state(0)
  const items = [
    { value: 'first', title: 'First', description: 'Contact Info' },
    { value: 'second', title: 'Second', description: 'Date & Time' },
    { value: 'third', title: 'Third', description: 'Select Rooms' },
  ]
</script>

<output>Step {step}</output>
<Steps.Root count={items.length} bind:step>
  <Steps.List>
    {#each items as item, index (item.value)}
      <Steps.Item {index}>
        <Steps.Trigger>
          <Steps.Indicator>{index + 1}</Steps.Indicator>
          <span>{item.title}</span>
        </Steps.Trigger>
        <Steps.Separator />
      </Steps.Item>
    {/each}
  </Steps.List>

  {#each items as item, index (item.value)}
    <Steps.Content {index}>{item.title} - {item.description}</Steps.Content>
  {/each}

  <Steps.CompletedContent>Steps Complete - Thank you for filling out the form!</Steps.CompletedContent>

  <div>
    <Steps.PrevTrigger>Back</Steps.PrevTrigger>
    <Steps.NextTrigger>Next</Steps.NextTrigger>
  </div>
</Steps.Root>
