import { useState, useEffect } from "react";

const usePagination = <T,>(pageSize: number, value: T[], entryCount: number, fetchPage: (page: number) => Promise<T[]>) => {
    const [page, setPage] = useState<number>(1);
    const [entries, setEntries] = useState<T[]>(value);
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
