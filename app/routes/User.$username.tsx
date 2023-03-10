import { LoaderArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useState } from 'react';

import getRepositories, { Repository } from '~/sdk/getRepositories';
import getUser, { User } from '~/sdk/getUser';

import { BackLink, Pagination, PaginationButton, UserAvatar, UserHeader, UserName, UserRepositoriesCount, UserRepositoriesList, UserRepository, UserRepositoryDescription, UserRepositoryName, PageCount } from './User.styles';

type UserLoaderArgs = LoaderArgs & {
  params: {
    username: string;
  }
};

type ServerData = {
  user: User;
  repositories: Repository[];
};

export const loader = async ({ params }: UserLoaderArgs) => {
  const { username } = params;

  try {
    const [user, repositories] = await Promise.all([
      getUser(username),
      getRepositories(username, 1),
    ]);

    return { user, repositories };
  } catch (e) {
    console.error(e);
  }
};

const REPOS_PER_PAGE = 10;

const UserPage = () => {
  const { user, repositories } = useLoaderData<ServerData>();
  const [repos, setRepos] = useState<Repository[]>(repositories);
  const [currentPage, setCurrentPage] = useState(1);
  const visibleRepos = repos.slice((currentPage - 1) * REPOS_PER_PAGE, currentPage * REPOS_PER_PAGE);
  const lastPage = Math.ceil(user.repositoriesCount / REPOS_PER_PAGE);

  const nextPage = async () => {
    const isNextPageLoaded = repos.length >= (currentPage + 1) * REPOS_PER_PAGE;

    if(!isNextPageLoaded) {
      const repos = await getRepositories(user.username, currentPage + 1);

      setRepos(prevRepos => prevRepos.concat(repos));
    }

    setCurrentPage(currentPage + 1);
  }

  return (
    <>
      <UserHeader>
        <UserAvatar src={user.avatarUrl} />
        <UserName>{user.name}</UserName>
        <UserRepositoriesCount>Total number of repositories: {user.repositoriesCount}</UserRepositoriesCount>
      </UserHeader>
      <UserRepositoriesList>
        {visibleRepos.map(repo => (
          <UserRepository key={repo.id}>
            <UserRepositoryName>{repo.name}</UserRepositoryName>
            <UserRepositoryDescription>{repo.description}</UserRepositoryDescription>
          </UserRepository>
        ))}
      </UserRepositoriesList>
      <Pagination>
        <PageCount>{currentPage}/{lastPage}</PageCount>
        {currentPage > 1 && (
          <PaginationButton onClick={() => setCurrentPage(p => p - 1)}>
            Previous
          </PaginationButton>
        )}
        {currentPage < lastPage && (
          <PaginationButton onClick={nextPage}>
            Next
          </PaginationButton>
        )}
      </Pagination>
      <BackLink to="/">Go back to Root route</BackLink>
    </>
  );
};

export default UserPage;
