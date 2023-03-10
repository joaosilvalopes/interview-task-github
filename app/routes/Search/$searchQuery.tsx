import { useState, useEffect, useCallback, useRef } from 'react';
import { useLoaderData, useParams } from '@remix-run/react';
import type { LoaderArgs } from '@remix-run/node';
import throttle from 'lodash.throttle';

import { SearchResultList, SearchResultListItem, SearchResultLink, InfiniteScrollSpinner } from './$searchQuery.styles';

import searchUsers from '~/sdk/searchUsers';

import usePagination from '~/hooks/usePagination';

import Spinner from '~/components/Spinner';

type SearchLoaderArgs = LoaderArgs & {
    params: {
        searchQuery: string;
    }
};

export const PAGE_SIZE = 100;

export const loader = async ({ params }: SearchLoaderArgs) => {
    const { searchQuery } = params;

    try {
        const { totalCount, usernames } = await searchUsers(searchQuery, 1, PAGE_SIZE);

        return { totalCount, usernames };
    } catch (e) {
        console.error(e);
    }
};

const SearchResults = () => {
    const { searchQuery } = useParams();
    const { totalCount, usernames: firstPageEntries } = useLoaderData();
    const [loadingUser, setLoadingUser] = useState<string>();
    const isPageLoadingRef = useRef<boolean>();

    const fetchPage = useCallback((page: number) => searchUsers(searchQuery as string, page, PAGE_SIZE).then((res) => res.usernames), [searchQuery]);

    const {
        isPageLoading,
        entries: usernames,
        nextPage
    } = usePagination<string>({
        fetchPage,
        firstPageEntries,
        pageSize: PAGE_SIZE,
        entryCount: totalCount,
    });

    isPageLoadingRef.current = isPageLoading;

    useEffect(() => {
        const handleScroll = throttle(() => {
            const isAtPageBottom = window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight;

            if (isAtPageBottom && !isPageLoadingRef.current) {
                nextPage();
            }
        }, 100);

        document.addEventListener('scroll', handleScroll);

        return () => {
            document.removeEventListener('scroll', handleScroll);
        };
    }, [nextPage]);

    return (
        <>
            {<p data-testid="result-count">Found {totalCount} results for {searchQuery}</p>}
            {usernames.length > 0 &&
                <SearchResultList>
                    {usernames.map((username) => (
                        <SearchResultListItem key={username}>
                            <SearchResultLink loading={loadingUser === username} onClick={() => setLoadingUser(username)} to={`/user/${username}`} data-testid={`search-result-link-${username}`}>{loadingUser === username ? <Spinner data-testid={`loading-indicator-${username}`} /> : username}</SearchResultLink>
                        </SearchResultListItem>
                    ))}
                </SearchResultList>}
            {isPageLoading && <InfiniteScrollSpinner data-testid="loading-indicator" />}
        </>
    );
}

export default SearchResults;

