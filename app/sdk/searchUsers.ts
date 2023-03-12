type SearchResult = {
    usernames: string[],
    totalCount: number
};

const searchUsers = async (searchQuery: string, page: number, pageSize: number): Promise<SearchResult> => {
    const res = await fetch(`https://api.github.com/search/users?q=${searchQuery}&per_page=${pageSize}&page=${page}&sort=followers`)

    if (!res.ok) throw res;

    const data = await res.json();

    return {
        usernames: data.items.map((item: any) => item.login),
        totalCount: data.total_count
    };
};

export default searchUsers;
