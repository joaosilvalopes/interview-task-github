import { createMemoryHistory } from '@remix-run/router';
import { fireEvent, render, waitFor } from '@testing-library/react';

import withRouter from '~/test-utils/withRouter';

import ThemeProvider from '~/theme';

import User, { PAGE_SIZE } from './$username';

const user = {
    username: 'testuser',
    name: 'Test User',
    avatarUrl: 'https://example.com/avatar.png',
    repositoriesCount: PAGE_SIZE * 6
};

const repositories = Array.from({ length: user.repositoriesCount }, (_, i) => ({
    id: i + 1,
    name: `Repository ${i + 1}`,
    description: `Description of Repository ${i + 1}`
}));

const repositoriesFirstPage = repositories.slice(0, PAGE_SIZE);

jest.mock('~/sdk/getRepositories', () => jest.fn((_,page) => {
    return new Promise((resolve) => setTimeout(() => resolve(repositories.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)), 100));
  }));

jest.mock('@remix-run/react', () => ({
    ...jest.requireActual('@remix-run/react'),
    useLoaderData: jest.fn(() => ({
        user,
        repositories: repositoriesFirstPage,
    })),
}));

const history = createMemoryHistory({ initialEntries: [`/user/${user.username}`], v5Compat: true });

const UserWithRouter = withRouter(User, { path: '/user/:username', history });

const renderWithRouter = () => render(<ThemeProvider><UserWithRouter /></ThemeProvider>);

describe('UserPage component', () => {
    const expectPageResult = async (page: number, getByTestId: (testId: string) => HTMLElement, getAllByTestId: (testId: RegExp) => HTMLElement[]) => {
        const pageRepositories = repositories.slice(PAGE_SIZE * (page - 1), PAGE_SIZE * page);

        await waitFor(() => expect(getAllByTestId(/^repo-name-[0-9]+/)).toHaveLength(pageRepositories.length));
        await waitFor(() => expect(getAllByTestId(/^repo-description-[0-9]+/)).toHaveLength(pageRepositories.length));

        for(const repo of pageRepositories) {
            await waitFor(() => expect(getByTestId(`repo-name-${repo.id}`)).toHaveTextContent(repo.name));
            await waitFor(() => expect(getByTestId(`repo-description-${repo.id}`)).toHaveTextContent(repo.description));
        }
    }

    it('renders user information and repositories', async () => {
        const { getByTestId, getAllByTestId, queryByTestId, asFragment } = renderWithRouter();

        expect(getByTestId('user-avatar')).toHaveAttribute("src", user.avatarUrl);
        expect(getByTestId('user-name')).toHaveTextContent(user.name);
        expect(getByTestId('user-repos-count')).toHaveTextContent(`Found ${user.repositoriesCount} repositories`);

        const lastPage = Math.ceil(user.repositoriesCount / PAGE_SIZE);

        // First page
        await expectPageResult(1, getByTestId, getAllByTestId);

        expect(queryByTestId(`loading-page-indicator`)).not.toBeInTheDocument();
        expect(queryByTestId(`previous-page-button`)).not.toBeInTheDocument();
        expect(getByTestId(`next-page-button`)).toBeInTheDocument();
        expect(getByTestId(`next-page-button`)).toBeEnabled();
        expect(getByTestId('page-count')).toHaveTextContent(`1/${lastPage}`);

        // Middle Pages
        for(let page = 2; page < lastPage; page++) {
            fireEvent.click(getByTestId('next-page-button'));

            expect(getByTestId(`loading-page-indicator`)).toBeInTheDocument();
            expect(getByTestId(`next-page-button`)).toBeDisabled();

            await expectPageResult(page, getByTestId, getAllByTestId);

            expect(queryByTestId(`loading-page-indicator`)).not.toBeInTheDocument();
            expect(getByTestId(`previous-page-button`)).toBeInTheDocument();
            expect(getByTestId(`next-page-button`)).toBeInTheDocument();
            expect(getByTestId(`next-page-button`)).toBeEnabled();
            expect(getByTestId('page-count')).toHaveTextContent(`${page}/${lastPage}`);
        }

        //Last page
        fireEvent.click(getByTestId('next-page-button'));

        expect(getByTestId(`loading-page-indicator`)).toBeInTheDocument();
        expect(queryByTestId(`next-page-button`)).not.toBeInTheDocument();

        await expectPageResult(lastPage, getByTestId, getAllByTestId);

        expect(queryByTestId(`loading-page-indicator`)).not.toBeInTheDocument();
        expect(getByTestId(`previous-page-button`)).toBeInTheDocument();
        expect(queryByTestId(`next-page-button`)).not.toBeInTheDocument();
        expect(getByTestId('page-count')).toHaveTextContent(`${lastPage}/${lastPage}`);

        expect(asFragment()).toMatchSnapshot();
    });

    it('redirects to root route on back link click', async () => {
        const { asFragment, getByTestId } = renderWithRouter();
        const backLink = getByTestId(`back-link`);

        expect(backLink).toBeInTheDocument();

        fireEvent.click(backLink);

        await waitFor(() => expect(history.location.pathname).toBe('/'));

        expect(asFragment()).toMatchSnapshot();
    });
});
