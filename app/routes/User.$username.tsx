import { LoaderArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useEffect, useState } from 'react';

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
  const isPageLoaded = repos.length > (currentPage - 1) * REPOS_PER_PAGE;

  const nextPage = async () => {
    setCurrentPage(currentPage + 1);
  }

  useEffect(() => {
    (async () => {
      if (!isPageLoaded) {
        const repos = await getRepositories(user.username, currentPage);

        setRepos(prevRepos => prevRepos.concat(repos));
      }
    })()
  }, [currentPage])

  return (
    <>
      <UserHeader>
        <UserAvatar src={user.avatarUrl} data-testid="user-avatar" />
        <UserName data-testid="user-name">{user.name}</UserName>
        <UserRepositoriesCount data-testid="user-repos-count">Total number of repositories: {user.repositoriesCount}</UserRepositoriesCount>
      </UserHeader>
      <UserRepositoriesList>
        {!isPageLoaded ? <p data-testid="loading-page-indicator">Loading</p> : visibleRepos.map(repo => (
          <UserRepository key={repo.id}>
            <UserRepositoryName data-testid={`repo-name-${repo.id}`}>{repo.name}</UserRepositoryName>
            <UserRepositoryDescription data-testid={`repo-description-${repo.id}`}>{repo.description}</UserRepositoryDescription>
          </UserRepository>
        ))}
      </UserRepositoriesList>
      <Pagination>
        {currentPage > 1 && (
          <PaginationButton data-testid="previous-page-button" onClick={() => setCurrentPage(p => p - 1)}>
            Previous
          </PaginationButton>
        )}
        <PageCount data-testid="page-count">{currentPage}/{lastPage}</PageCount>
        {currentPage < lastPage && (
          <PaginationButton data-testid="next-page-button" disabled={!isPageLoaded} onClick={nextPage}>
            Next
          </PaginationButton>
        )}
      </Pagination>
      <BackLink to="/">Go back to Root route</BackLink>
    </>
  );
};

export default UserPage;
