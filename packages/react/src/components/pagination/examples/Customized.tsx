import { Pagination } from '../index'

export function Customized() {
  return (
    <Pagination.Root
      count={5000}
      pageSize={20}
      siblingCount={3}
      translations={{
        nextTriggerLabel: 'Next',
        prevTriggerLabel: 'Prev',
        itemLabel: details => `Page ${details.page}`,
      }}
    >
      <Pagination.PrevTrigger>
        Previous
        <span className="visually-hidden">Page</span>
      </Pagination.PrevTrigger>
      <Pagination.Context>
        {pagination => (
          <>
            {pagination.pages.map((page, index) => (
              page.type === 'page'
                ? (
                    <Pagination.Item key={index} value={page.value} type={page.type}>
                      {page.value}
                    </Pagination.Item>
                  )
                : (
                    <Pagination.Ellipsis key={`e${index}`} index={index}>
                      &#8230;
                    </Pagination.Ellipsis>
                  )
            ))}
          </>
        )}
      </Pagination.Context>
      <Pagination.NextTrigger>
        Next
        <span className="visually-hidden">Page</span>
      </Pagination.NextTrigger>
    </Pagination.Root>
  )
}
