<script setup lang="ts">
import type { RootEmits, RootProps } from '../types'
import { NavigationMenu } from '../index'

const props = defineProps<RootProps>()
const emits = defineEmits<RootEmits>()
</script>

<template>
  <main class="main">
    <NavigationMenu.Root v-bind="props" class="nav-root" @value-change="emits('valueChange', $event)" @update:model-value="emits('update:modelValue', $event)">
      <NavigationMenu.List class="nav-list">
        <NavigationMenu.Item value="getting-started">
          <NavigationMenu.Trigger value="getting-started" class="nav-trigger">
            Getting started
            <svg class="nav-chevron" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </NavigationMenu.Trigger>
        </NavigationMenu.Item>

        <NavigationMenu.Item value="components">
          <NavigationMenu.Trigger value="components" class="nav-trigger">
            Components
            <svg class="nav-chevron" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </NavigationMenu.Trigger>
        </NavigationMenu.Item>

        <NavigationMenu.Item value="docs">
          <NavigationMenu.Link value="docs" href="#" class="nav-trigger">
            Documentation
          </NavigationMenu.Link>
        </NavigationMenu.Item>

        <NavigationMenu.Indicator class="nav-indicator">
          <NavigationMenu.Arrow class="nav-arrow" />
        </NavigationMenu.Indicator>
      </NavigationMenu.List>

      <NavigationMenu.ViewportPositioner class="nav-viewport-positioner">
        <NavigationMenu.Viewport class="nav-viewport">
          <NavigationMenu.Content value="getting-started" class="nav-content">
            <ul class="nav-content-list one">
              <li>
                <NavigationMenu.Link value="intro" href="#" class="nav-link">
                  <div class="nav-link-title">Introduction</div>
                  <p class="nav-link-desc">Re-usable components built using Radix UI and Tailwind CSS.</p>
                </NavigationMenu.Link>
              </li>
              <li>
                <NavigationMenu.Link value="install" href="#" class="nav-link">
                  <div class="nav-link-title">Installation</div>
                  <p class="nav-link-desc">How to install dependencies and structure your app.</p>
                </NavigationMenu.Link>
              </li>
              <li>
                <NavigationMenu.Link value="typography" href="#" class="nav-link">
                  <div class="nav-link-title">Typography</div>
                  <p class="nav-link-desc">Styles for headings, paragraphs, lists...etc</p>
                </NavigationMenu.Link>
              </li>
            </ul>
          </NavigationMenu.Content>

          <NavigationMenu.Content value="components" class="nav-content">
            <ul class="nav-content-list two">
              <li>
                <NavigationMenu.Link value="alert-dialog" href="#" class="nav-link">
                  <div class="nav-link-title">Alert Dialog</div>
                  <p class="nav-link-desc">A modal dialog that interrupts the user with important content.</p>
                </NavigationMenu.Link>
              </li>
              <li>
                <NavigationMenu.Link value="hover-card" href="#" class="nav-link">
                  <div class="nav-link-title">Hover Card</div>
                  <p class="nav-link-desc">For sighted users to preview content available behind a link.</p>
                </NavigationMenu.Link>
              </li>
              <li>
                <NavigationMenu.Link value="progress" href="#" class="nav-link">
                  <div class="nav-link-title">Progress</div>
                  <p class="nav-link-desc">Displays an indicator showing the completion progress of a task.</p>
                </NavigationMenu.Link>
              </li>
              <li>
                <NavigationMenu.Link value="scroll-area" href="#" class="nav-link">
                  <div class="nav-link-title">Scroll-area</div>
                  <p class="nav-link-desc">Visually or semantically separates content.</p>
                </NavigationMenu.Link>
              </li>
              <li>
                <NavigationMenu.Link value="tabs" href="#" class="nav-link">
                  <div class="nav-link-title">Tabs</div>
                  <p class="nav-link-desc">A set of layered sections of content known as tab panels.</p>
                </NavigationMenu.Link>
              </li>
              <li>
                <NavigationMenu.Link value="tooltip" href="#" class="nav-link">
                  <div class="nav-link-title">Tooltip</div>
                  <p class="nav-link-desc">A popup that displays information related to an element.</p>
                </NavigationMenu.Link>
              </li>
            </ul>
          </NavigationMenu.Content>
        </NavigationMenu.Viewport>
      </NavigationMenu.ViewportPositioner>
    </NavigationMenu.Root>
  </main>
</template>

<style scoped>
/* Root */
[data-scope="navigation-menu"][data-part="root"] {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 500px;
  z-index: 10;
  margin-top: 0 !important;
}

/* List */
[data-scope="navigation-menu"][data-part="list"] {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: hsl(240 4.8% 95.9% / 0.3);
  padding: 4px;
  border-radius: 4px;
  list-style: none;
  margin: 0;
  gap: 2px;
  margin-top: 0 !important;
}

/* Item */
[data-scope="navigation-menu"][data-part="item"] {
  position: relative;
  margin-top: 0 !important;
}

/* Trigger */
[data-scope="navigation-menu"][data-part="trigger"] {
  all: unset;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1;
  border-radius: 2px;
  color: hsl(240 10% 3.9%);
  cursor: pointer;
  transition: background-color 150ms, color 150ms;
  gap: 4px;
  margin-top: 0 !important;
}

[data-scope="navigation-menu"][data-part="trigger"]:hover {
  background-color: hsl(240 4.8% 95.9%);
  color: hsl(240 10% 3.9%);
}

[data-scope="navigation-menu"][data-part="trigger"]:focus-visible {
  outline: 2px solid hsl(240 5% 64.9%);
  outline-offset: 2px;
}

[data-scope="navigation-menu"][data-part="trigger"][data-state="open"] {
  background-color: hsl(240 4.8% 95.9%);
}

/* Link in list */
[data-scope="navigation-menu"][data-part="link"] {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1;
  border-radius: 2px;
  color: hsl(240 10% 3.9%);
  cursor: pointer;
  transition: background-color 150ms, color 150ms;
  text-decoration: none;
  margin-top: 0 !important;
}

[data-scope="navigation-menu"][data-part="link"]:hover {
  background-color: hsl(240 4.8% 95.9%);
}

[data-scope="navigation-menu"][data-part="link"]:focus-visible {
  outline: 2px solid hsl(240 5% 64.9%);
  outline-offset: 2px;
}

/* Link inside content (different style from top nav links) */
[data-scope="navigation-menu"][data-part="content"] [data-part="link"] {
  display: block;
  padding: 10px;
  border-radius: 2px;
  text-decoration: none;
  transition: background-color 150ms ease;
  margin-top: 0 !important;
}

[data-scope="navigation-menu"][data-part="content"] [data-part="link"]:hover {
  background-color: hsl(240 4.8% 95.9%);
}

[data-scope="navigation-menu"][data-part="content"] [data-part="link"]:focus-visible {
  outline: 2px solid hsl(240 5% 64.9%);
  outline-offset: 2px;
}

/* Viewport Positioner */
[data-scope="navigation-menu"][data-part="viewport-positioner"] {
  position: absolute;
  top: 100%;
  left: 0;
  display: flex;
  justify-content: center;
  perspective: 2000px;
  padding-top: 6px;
  width: 100%;
  margin-top: 0 !important;
}

/* Viewport */
[data-scope="navigation-menu"][data-part="viewport"] {
  position: relative;
  overflow: hidden;
  background-color: hsl(0 0% 100%);
  border: 1px solid hsl(240 5.9% 90%);
  border-radius: 6px;
  box-shadow:
    0 10px 38px -10px rgba(22, 23, 24, 0.35),
    0 10px 20px -15px rgba(22, 23, 24, 0.2);
  transform-origin: top center;
  transition: width 200ms ease, height 200ms ease;
  display: grid;
  margin-top: 0 !important;
}

[data-scope="navigation-menu"][data-part="viewport"] > * {
  grid-area: 1 / 1;
  margin-top: 0 !important;
}

[data-scope="navigation-menu"][data-part="viewport"][data-state="open"] {
  animation: snippetViewportEnter 200ms ease;
}

[data-scope="navigation-menu"][data-part="viewport"][data-state="closed"] {
  animation: snippetViewportExit 150ms ease forwards;
}

/* Content */
[data-scope="navigation-menu"][data-part="content"] {
  padding: 12px;
  box-sizing: border-box;
  margin-top: 0 !important;
}

[data-scope="navigation-menu"][data-part="content"][data-state="open"] {
  animation: snippetEnterFromRight 200ms ease;
}

[data-scope="navigation-menu"][data-part="content"][data-state="closed"] {
  animation: snippetExitToLeft 200ms ease forwards;
}

[data-scope="navigation-menu"][data-part="content"][data-motion="from-start"] {
  animation: snippetEnterFromLeft 200ms ease;
}

[data-scope="navigation-menu"][data-part="content"][data-motion="from-end"] {
  animation: snippetEnterFromRight 200ms ease;
}

[data-scope="navigation-menu"][data-part="content"][data-motion="to-start"] {
  animation: snippetExitToLeft 200ms ease forwards;
}

[data-scope="navigation-menu"][data-part="content"][data-motion="to-end"] {
  animation: snippetExitToRight 200ms ease forwards;
}

[data-scope="navigation-menu"][data-part="content"][hidden] {
  display: none;
}

/* Keyframe Animations */
@keyframes snippetViewportEnter {
  from {
    opacity: 0;
    transform: rotateX(-10deg) scale(0.95);
  }
  to {
    opacity: 1;
    transform: rotateX(0deg) scale(1);
  }
}

@keyframes snippetViewportExit {
  from {
    opacity: 1;
    transform: rotateX(0deg) scale(1);
  }
  to {
    opacity: 0;
    transform: rotateX(-10deg) scale(0.95);
  }
}

@keyframes snippetEnterFromLeft {
  from {
    opacity: 0;
    transform: translateX(-100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes snippetEnterFromRight {
  from {
    opacity: 0;
    transform: translateX(100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes snippetExitToLeft {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(-100px);
  }
}

@keyframes snippetExitToRight {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(100px);
  }
}
</style>
