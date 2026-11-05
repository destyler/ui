import { readFileSync } from 'node:fs'

const { version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'))
const notes = 'https://github.com/destyler/ui/blob/v0.0.3/docs/releases/0.0.3.md'

// changelogithub renders this section only for conventional breaking commits.
// Preserve `!` in the 0.0.3 squash subject; do not carry these notices forward.
export default version === '0.0.3'
  ? {
      titles: {
        breakingChanges: [
          'Breaking Changes',
          '',
          `Read the [UI 0.0.3 migration notes](${notes}) before upgrading.`,
          '',
          `- Core 0.3.4 Steps: one roving tab stop, focus-only arrow navigation, and a completion summary that is no longer a tabpanel. [Steps migration](${notes}#steps-keyboard-navigation-and-completion-roles).`,
          `- Core 0.3.4 Select: Content owns focus in composite mode; the nested List no longer has a tab stop. [Select migration](${notes}#select-focus-ownership).`,
          `- Retained Vue limit: wrapper \`.once.prevent\` may run after core and cannot reliably cancel that core action. Ordinary cancellation only works where core checks \`event.defaultPrevented\`. [Listener limits](${notes}#vue-listener-and-callback-fixes).`,
          '',
        ].join('\n'),
      },
    }
  : {}
