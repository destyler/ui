<script setup lang="ts">
import type { RootEmits, RootProps } from '../types'
import { NavigationMenu } from '../index'

const props = defineProps<RootProps>()
const emits = defineEmits<RootEmits>()
</script>

<template>
  <main>
    <NavigationMenu.Root v-bind="props" @value-change="emits('valueChange', $event)" @update:model-value="emits('update:modelValue', $event)">
      <NavigationMenu.List>
        <NavigationMenu.Item value="getting-started">
          <NavigationMenu.Trigger value="getting-started">
            Getting started
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </NavigationMenu.Trigger>
        </NavigationMenu.Item>

        <NavigationMenu.Item value="components">
          <NavigationMenu.Trigger value="components">
            Components
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </NavigationMenu.Trigger>
        </NavigationMenu.Item>

        <NavigationMenu.Item value="docs">
          <NavigationMenu.Link value="docs" href="#">
            Documentation
          </NavigationMenu.Link>
        </NavigationMenu.Item>

        <NavigationMenu.Indicator>
          <NavigationMenu.Arrow />
        </NavigationMenu.Indicator>
      </NavigationMenu.List>

      <NavigationMenu.ViewportPositioner>
        <NavigationMenu.Viewport>
          <NavigationMenu.Content value="getting-started">
            <ul>
              <li>
                <NavigationMenu.Link value="intro" href="#">
                  <div>Introduction</div>
                  <p>Re-usable components built using Radix UI and Tailwind CSS.</p>
                </NavigationMenu.Link>
              </li>
              <li>
                <NavigationMenu.Link value="install" href="#">
                  <div>Installation</div>
                  <p>How to install dependencies and structure your app.</p>
                </NavigationMenu.Link>
              </li>
              <li>
                <NavigationMenu.Link value="typography" href="#">
                  <div>Typography</div>
                  <p>Styles for headings, paragraphs, lists...etc</p>
                </NavigationMenu.Link>
              </li>
            </ul>
          </NavigationMenu.Content>

          <NavigationMenu.Content value="components">
            <ul>
              <li>
                <NavigationMenu.Link value="alert-dialog" href="#">
                  <div>Alert Dialog</div>
                  <p>A modal dialog that interrupts the user with important content.</p>
                </NavigationMenu.Link>
              </li>
              <li>
                <NavigationMenu.Link value="hover-card" href="#">
                  <div>Hover Card</div>
                  <p>For sighted users to preview content available behind a link.</p>
                </NavigationMenu.Link>
              </li>
              <li>
                <NavigationMenu.Link value="progress" href="#">
                  <div>Progress</div>
                  <p>Displays an indicator showing the completion progress of a task.</p>
                </NavigationMenu.Link>
              </li>
              <li>
                <NavigationMenu.Link value="scroll-area" href="#">
                  <div>Scroll-area</div>
                  <p>Visually or semantically separates content.</p>
                </NavigationMenu.Link>
              </li>
              <li>
                <NavigationMenu.Link value="tabs" href="#">
                  <div>Tabs</div>
                  <p>A set of layered sections of content known as tab panels.</p>
                </NavigationMenu.Link>
              </li>
              <li>
                <NavigationMenu.Link value="tooltip" href="#">
                  <div>Tooltip</div>
                  <p>A popup that displays information related to an element.</p>
                </NavigationMenu.Link>
              </li>
            </ul>
          </NavigationMenu.Content>
        </NavigationMenu.Viewport>
      </NavigationMenu.ViewportPositioner>
    </NavigationMenu.Root>
  </main>
</template>
