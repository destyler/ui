<script setup lang="ts">
import { NavigationMenu } from '../index'
</script>

<template>
  <main class="main">
    <NavigationMenu.Root class="nav-root">
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
              <li class="row-span-3">
                <NavigationMenu.Link value="radix" href="#" class="nav-link-callout">
                  <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                  </svg>
                  <div class="nav-link-callout-title">shadcn/ui</div>
                  <p class="nav-link-callout-desc">
                    Beautifully designed components built with Radix UI and Tailwind CSS.
                  </p>
                </NavigationMenu.Link>
              </li>
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
.main {
  display: flex;
  justify-content: center;
  padding: 40px 24px;
  min-height: 400px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.nav-root {
  position: relative;
  display: flex;
  justify-content: center;
  z-index: 10;
}

.nav-list {
  display: flex;
  justify-content: center;
  list-style: none;
  padding: 4px;
  margin: 0;
  background-color: hsl(0 0% 100%);
  border-radius: 6px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.nav-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
  color: hsl(240 10% 3.9%);
  background-color: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  outline: none;
  text-decoration: none;
  transition: color 0.15s, background-color 0.15s;
}

.nav-trigger:hover {
  background-color: hsl(240 4.8% 95.9%);
  color: hsl(240 5.9% 10%);
}

.nav-trigger:focus-visible {
  outline: 2px solid hsl(240 5% 64.9%);
  outline-offset: 2px;
}

.nav-trigger[data-state="open"] {
  background-color: hsl(240 4.8% 95.9%);
}

.nav-chevron {
  position: relative;
  top: 1px;
  color: hsl(240 3.8% 46.1%);
  transition: transform 0.2s ease;
}

.nav-trigger[data-state="open"] .nav-chevron {
  transform: rotate(180deg);
}

.nav-indicator {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 10px;
  top: 100%;
  overflow: hidden;
  z-index: 1;
}

.nav-arrow {
  position: relative;
  top: 70%;
  background-color: white;
  width: 10px;
  height: 10px;
  transform: rotate(45deg);
  border-top-left-radius: 2px;
}

.nav-viewport-positioner {
  position: absolute;
  display: flex;
  justify-content: center;
  width: 100%;
  top: 100%;
  left: 0;
  perspective: 2000px;
}

.nav-viewport {
  position: relative;
  margin-top: 10px;
  background-color: hsl(0 0% 100%);
  border-radius: 6px;
  border: 1px solid hsl(240 5.9% 90%);
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  transform-origin: top center;
}

.nav-viewport[data-state="open"] {
  animation: scaleIn 0.2s ease;
}

.nav-viewport[data-state="closed"] {
  animation: scaleOut 0.15s ease;
}

.nav-content {
  width: max-content;
}

.nav-content[hidden] {
  display: none;
}

.nav-content[data-motion="from-start"] {
  animation: enterFromLeft 0.2s ease;
}

.nav-content[data-motion="from-end"] {
  animation: enterFromRight 0.2s ease;
}

.nav-content[data-motion="to-start"] {
  animation: exitToLeft 0.2s ease;
}

.nav-content[data-motion="to-end"] {
  animation: exitToRight 0.2s ease;
}

.nav-content-list {
  display: grid;
  padding: 22px;
  margin: 0;
  list-style: none;
  gap: 10px;
}

.nav-content-list.one {
  width: 500px;
  grid-template-columns: 0.75fr 1fr;
}

.nav-content-list.two {
  width: 600px;
  grid-template-columns: repeat(2, 1fr);
}

.row-span-3 {
  grid-row: span 3;
}

.nav-link {
  display: block;
  padding: 12px;
  border-radius: 6px;
  text-decoration: none;
  outline: none;
  user-select: none;
  transition: background-color 0.15s;
}

.nav-link:hover {
  background-color: hsl(240 4.8% 95.9%);
}

.nav-link:focus-visible {
  outline: 2px solid hsl(240 5% 64.9%);
  outline-offset: 2px;
}

.nav-link-callout {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 100%;
  height: 100%;
  padding: 24px;
  border-radius: 6px;
  text-decoration: none;
  outline: none;
  user-select: none;
  background: linear-gradient(135deg, hsl(240 5.9% 10%) 0%, hsl(240 3.7% 15.9%) 100%);
  transition: transform 0.15s;
}

.nav-link-callout:hover {
  transform: scale(1.02);
}

.nav-link-callout:focus-visible {
  outline: 2px solid hsl(240 5% 64.9%);
  outline-offset: 2px;
}

.nav-link-callout svg {
  color: hsl(0 0% 98%);
  margin-bottom: 8px;
}

.nav-link-callout-title {
  font-size: 18px;
  font-weight: 500;
  color: hsl(0 0% 98%);
  margin-bottom: 8px;
}

.nav-link-callout-desc {
  font-size: 14px;
  line-height: 1.4;
  color: hsl(240 5% 64.9%);
  margin: 0;
}

.nav-link-title {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.2;
  color: hsl(240 10% 3.9%);
  margin-bottom: 4px;
}

.nav-link-desc {
  font-size: 13px;
  line-height: 1.4;
  color: hsl(240 3.8% 46.1%);
  margin: 0;
}

@keyframes enterFromLeft {
  from {
    opacity: 0;
    transform: translateX(-200px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes enterFromRight {
  from {
    opacity: 0;
    transform: translateX(200px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes exitToLeft {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(-200px);
  }
}

@keyframes exitToRight {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(200px);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: rotateX(-10deg) scale(0.96);
  }
  to {
    opacity: 1;
    transform: rotateX(0deg) scale(1);
  }
}

@keyframes scaleOut {
  from {
    opacity: 1;
    transform: rotateX(0deg) scale(1);
  }
  to {
    opacity: 0;
    transform: rotateX(-10deg) scale(0.96);
  }
}
</style>
