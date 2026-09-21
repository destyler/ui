import { Pagination } from '../index'

export function InitialPage() {
  return (
    <Pagination.Root count={100} pageSize={10} siblingCount={2} defaultPage={5}>
