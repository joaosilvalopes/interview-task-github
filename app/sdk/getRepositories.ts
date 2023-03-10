export type Repository = {
    id: number;
    name: string;
    description: string;
};

const getRepositories = async (username: string, page: number): Promise<Repository[]> => {
    const response = await fetch(`https://api.github.com/users/${username}/repos?page=${page}&per_page=10`);

    if (!response.ok) throw response;

    const data = await response.json();

    return data.map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
    }));
}

export default getRepositories;
