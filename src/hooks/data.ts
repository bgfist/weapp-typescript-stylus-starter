import { useRef, Updater, useState, useOnce, useMemo } from "@bgfist/weact"

export function useFieldInput<T extends AnyObject>(updater: Updater<T>) {
  return (e: wx.CustomEvent) => {
    const field = e.target.dataset.field
    const value = e.detail.value
    updater(s => ({ ...s, [field]: value }))
  }
}

export function useChangeEvent<T>(updater: Updater<T>) {
  return (e: wx.CustomEvent) => {
    const value = e.detail.value
    updater(value)
  }
}

export function usePageFetcher(fetcher: (pageable: Pageable) => Promise<Pagination<any>>, condition = true) {
  const [fetching, updateFetching] = useState<"load" | "refresh" | "loadmore" | false>(false)
  const initialPageData = useMemo<any[]>(() => [], [])
  const [pageData, updatePageData] = useState(initialPageData)
  const page = useRef(1)
  const [noMoreData, updateNoMoreData] = useState(false)

  const fetchPageData = async (append = false, showLoading = true) => {
    if (fetching) {
      return
    }

    if (append && noMoreData) {
      return
    }

    if (showLoading) {
      updateFetching(append ? "loadmore" : "load")
    }

    if (!append) {
      page.current = 1
    }

    const { items: newPageData, total_count } = await fetcher({ page: page.current }).finally(() => {
      updateFetching(false)
    })

    // 查询成功后将page加一
    page.current++

    const data = append ? pageData.concat(newPageData) : newPageData
    updatePageData(data)

    if (Array.isArray(data)) {
      updateNoMoreData(data.length >= total_count)
    }
  }

  const onScrollToBottom = () => {
    fetchPageData(true)
  }

  useOnce(() => wx.nextTick(fetchPageData), condition && pageData === initialPageData)

  return {
    fetching,
    pageData,
    noMoreData,
    onScrollToBottom,
    fetchPageData
  }
}

export function useSearchPageFetcher(fetcher: (pageable: Pageable, searchParams: AnyObject) => Promise<Pagination<any>>) {
  const searchParams = useRef<AnyObject>()
  const $usePageFetcher = usePageFetcher(pageable => fetcher(pageable, searchParams.current!))
  const onDoSearch = (e: wx.CustomEvent) => {
    searchParams.current = e.detail
    $usePageFetcher.fetchPageData()
  }

  return {
    ...$usePageFetcher,
    onDoSearch
  }
}
