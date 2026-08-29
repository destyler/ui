<script lang="ts">
  import { Breadcrumbs } from '../index'

  const items = [
    { id: '1', label: 'Dashboard', href: '/dashboard' },
    { id: '2', label: 'Settings', href: '/settings' },
    { id: '3', label: 'Profile' },
  ]
</script>

<main>
  <Breadcrumbs.Root {items}>
    <Breadcrumbs.List>
      <Breadcrumbs.Context>
        {#snippet render(breadcrumbs)}
          <output>
            <p>Hovered: {breadcrumbs().hoveredId || 'none'}</p>
            <p>Focused: {breadcrumbs().focusedId || 'none'}</p>
          </output>
          {#each breadcrumbs().items as item, index (item.id)}
            <Breadcrumbs.Item {item}>
              <Breadcrumbs.Link {item}>
                {#if index === 0}<span>🏠</span>{/if}
                {item.label}
              </Breadcrumbs.Link>
              {#if item.href}
                <Breadcrumbs.Separator>
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6" /></svg>
                </Breadcrumbs.Separator>
              {/if}
            </Breadcrumbs.Item>
          {/each}
        {/snippet}
      </Breadcrumbs.Context>
    </Breadcrumbs.List>
  </Breadcrumbs.Root>
</main>
