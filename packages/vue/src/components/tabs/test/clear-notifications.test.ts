import { userEvent } from 'vitest/browser'
import { registerClearNotificationTests } from './clear-notifications-tests'

registerClearNotificationTests({
  click: element => userEvent.click(element),
  enter: () => userEvent.keyboard('[Enter]'),
})
