import type { LoaderArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import Spinner from '~/components/Spinner';
import usePagination from '~/hooks/usePagination';

import type { Repository } from '~/sdk/getRepositories';
import getRepositories from '~/sdk/getRepositories';
import type { User } from '~/sdk/getUser';
import getUser from '~/sdk/getUser';

import {
  BackLink,
  Pagination,
  PaginationButton,
  UserAvatar,
  UserHeader,
  UserName,
  UserRepositoriesCount,
  UserRepositoriesList,
  UserRepository,
  UserRepositoryDescription,
  UserRepositoryName,
  PageCount,
  UserContainer,
  PageSpinner
} from './$username.styles';

type UserLoaderArgs = LoaderArgs & {
  params: {
    username: string;
  }
};

type ServerData = {
  user: User;
  repositories: Repository[];
};

export const PAGE_SIZE = 5;

export const loader = async ({ params }: UserLoaderArgs) => {
  const { username } = params;

  try {
    const [user, repositories] = await Promise.all([
      getUser(username),
      getRepositories(username, 1, PAGE_SIZE),
    ]);

    return { user, repositories };
  } catch (e) {
    console.error(e);
  }
};

const UserPage = () => {
  const { user, repositories } = useLoaderData<ServerData>();
  const fetchPage = (page: number) => getRepositories(user.username, page, PAGE_SIZE);

  const {
    pageEntries: visibleRepos,
    isPageLoading,
    page,
    pageCount,
    nextPage,
    previousPage
  } = usePagination<Repository>({
    pageSize: PAGE_SIZE,
    firstPageEntries: repositories,
    entryCount: user.repositoriesCount,
    fetchPage
  });

  return (
    <UserContainer>
      <UserHeader>
        <UserAvatar src={user.avatarUrl} data-testid="user-avatar" />
        <UserName data-testid="user-name">{user.name}</UserName>
        <UserRepositoriesCount data-testid="user-repos-count">Found {user.repositoriesCount} repositories</UserRepositoriesCount>
      </UserHeader>
      <UserRepositoriesList>
        {isPageLoading ? <PageSpinner data-testid="loading-page-indicator" /> : visibleRepos.map(repo => (
          <UserRepository key={repo.id}>
            <UserRepositoryName data-testid={`repo-name-${repo.id}`}>{repo.name}</UserRepositoryName>
            {repo.description && <UserRepositoryDescription data-testid={`repo-description-${repo.id}`}>{repo.description}</UserRepositoryDescription>}
          </UserRepository>
        ))}
      </UserRepositoriesList>
      <Pagination>
        {page > 1 && (
          <PaginationButton data-testid="previous-page-button" onClick={previousPage}>
            Previous
          </PaginationButton>
        )}
        <PageCount data-testid="page-count">{page}/{pageCount}</PageCount>
        {page < pageCount && (
          <PaginationButton data-testid="next-page-button" disabled={isPageLoading} onClick={nextPage}>
            { isPageLoading ? <Spinner /> : 'Next' } 
          </PaginationButton>
        )}
      </Pagination>
      <BackLink data-testid="back-link" to="/">Back</BackLink>
    </UserContainer>
  );
};

export default UserPage;
