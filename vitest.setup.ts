import type { Locator } from 'vitest/browser'
import { locators } from 'vitest/browser'

locators.extend({
  getByArticle(article) {
    return `${article}`
  },
  locatoring(article) {
    return article
  },
})

declare module 'vitest/browser' {
  interface LocatorSelectors {
    getByArticle: (article: string) => Locator
    locatoring: (article: string) => Locator
  }
}
