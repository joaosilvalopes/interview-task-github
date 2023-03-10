export type User = {
  username: string;
  name: string;
  avatarUrl: string;
  repositoriesCount: number;
};

const getUser = async (username: string): Promise<User> => {
  const response = await fetch(`https://api.github.com/users/${username}`);

  if (!response.ok) throw response;

  const data = await response.json();

  return {
    username,
    name: data.name,
    avatarUrl: data.avatar_url,
    repositoriesCount: data.public_repos
  };
}

export default getUser;