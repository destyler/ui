import { Pagination } from '@destyler-ui/solid/pagination'
import { For } from 'solid-js'

export function InitialPage() {
  return (
    <Pagination.Root count={5000} pageSize={10} siblingCount={2} defaultPage={5}>
