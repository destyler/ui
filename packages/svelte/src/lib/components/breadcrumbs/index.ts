export { breadcrumbsAnatomy } from './anatomy'
export { default as BreadcrumbsContext, type BreadcrumbsContextProps } from './components/Context.svelte'
export { default as BreadcrumbsItem, type BreadcrumbsItemBaseProps, type BreadcrumbsItemProps } from './components/Item.svelte'
export { default as BreadcrumbsLink, type BreadcrumbsLinkBaseProps, type BreadcrumbsLinkProps } from './components/Link.svelte'
export { default as BreadcrumbsList, type BreadcrumbsListBaseProps, type BreadcrumbsListProps } from './components/List.svelte'
export { default as BreadcrumbsRoot, type BreadcrumbsRootBaseProps, type BreadcrumbsRootProps } from './components/Root.svelte'
export {
  default as BreadcrumbsRootProvider,
  type BreadcrumbsRootProviderBaseProps,
  type BreadcrumbsRootProviderProps,
} from './components/RootProvider.svelte'
export {
  default as BreadcrumbsSeparator,
  type BreadcrumbsSeparatorBaseProps,
  type BreadcrumbsSeparatorProps,
} from './components/Separator.svelte'
export { useBreadcrumbsContext, type UseBreadcrumbsContext } from './hooks/use-breadcrumbs-context'
export { useBreadcrumbs, type UseBreadcrumbsProps, type UseBreadcrumbsReturn } from './hooks/use-breadcrumbs.svelte'
export * as Breadcrumbs from './namespace'

export type { BreadcrumbItem } from '@destyler/breadcrumbs'
