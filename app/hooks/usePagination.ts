import { useState, useEffect } from "react";

/**
 * Custom React hook for handling pagination logic.
 * 
 * @typeParam T The type of entries being paginated.
 * @param pageSize The number of entries to display on each page.
 * @param firstPageEntries The entries to display on the first page.
 * @param entryCount The total number of entries.
 * @param fetchPage The function to fetch a page of entries.
 * @returns An object containing pagination state and functions.
 */
const usePagination = <T,>({
    pageSize,
    firstPageEntries,
    entryCount,
    fetchPage
}: {
    pageSize: number,
    firstPageEntries: T[],
    entryCount: number,
    fetchPage: (page: number) => Promise<T[]>
}) => {
    const [page, setPage] = useState<number>(1);
    const [entries, setEntries] = useState<T[]>(firstPageEntries);
    const hasMoreEntries = entryCount > entries.length;
    const hasPageEntries = entries.length > (page - 1) * pageSize;
    const isPageLoading = hasMoreEntries && !hasPageEntries;

    useEffect(() => {
        (async () => {
            if (isPageLoading) {
                const entries = await fetchPage(page);

                setEntries(previousEntries => previousEntries.concat(entries));
            }
        })();
    }, [page, isPageLoading, fetchPage, setEntries]);

    return {
        entries,
        isPageLoading,
        isFirstPage: page === 1,
        pageCount: Math.ceil(entryCount / pageSize),
        isLastPage: page === Math.ceil(entryCount / pageSize),
        page,
        nextPage: () => setPage(p => p + 1),
        previousPage: () => setPage(p => p - 1),
        pageEntries: entries.slice((page - 1) * pageSize, page * pageSize)
    };
}

export default usePagination;
