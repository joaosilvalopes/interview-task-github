import { useState, useEffect, useCallback } from 'react';
import { useLoaderData, useParams } from '@remix-run/react';
import { LoaderArgs } from '@remix-run/node';
import throttle from 'lodash.throttle';

import { SearchResultList, SearchResultListItem, SearchResultLink } from './$searchQuery.styles';

import searchUsers from '~/sdk/searchUsers';

import usePagination from '~/hooks/usePagination';

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

    useEffect(() => {
        const handleScroll = throttle(() => {
            const isAtPageBottom = window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight;

            if (isAtPageBottom) {
                nextPage();
            }
        }, 100);

        document.addEventListener('scroll', handleScroll);

        return () => {
            document.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            {<p data-testid="result-count">Found {totalCount} results for {searchQuery}</p>}
            {usernames.length > 0 &&
                <SearchResultList>
                    {usernames.map((username) => (
                        <SearchResultListItem key={username}>
                            <SearchResultLink onClick={() => setLoadingUser(username)} to={`/user/${username}`} data-testid={`search-result-link-${username}`}>{loadingUser === username ? 'Loading' : username}</SearchResultLink>
                        </SearchResultListItem>
                    ))}
                </SearchResultList>}
            {isPageLoading && <p data-testid="loading-indicator">Loading...</p>}
        </>
    );
}

export default SearchResults;

