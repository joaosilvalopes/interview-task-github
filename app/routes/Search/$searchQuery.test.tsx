import { createMemoryHistory } from '@remix-run/router';
import { render, fireEvent, waitFor } from '@testing-library/react';

import SearchResults, { PAGE_SIZE } from './$searchQuery';
import withRouter from '~/test-utils/withRouter';

import ThemeProvider from '~/theme';

const usernames = Array.from({ length: PAGE_SIZE * 3 }, (_, i) => `user${i+1}`);
const usernamesFirstPage = usernames.slice(0, PAGE_SIZE);

jest.mock('~/sdk/searchUsers', () => jest.fn((_,page) => {
  return new Promise((resolve) => setTimeout(() => resolve({ totalCount: usernames.length, usernames: usernames.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) }), 100));
}));

jest.mock('@remix-run/react', () => ({
  ...jest.requireActual('@remix-run/react'),
  useLoaderData: jest.fn(() => ({
      totalCount: usernames.length,
      usernames: usernamesFirstPage,
  })),
}));

const history = createMemoryHistory({ initialEntries: ['/search/testQuery'], v5Compat: true });

const SearchWithRouter = withRouter(SearchResults, { path: '/search/:searchQuery', history });

const renderWithProviders = () =>  render(<ThemeProvider><SearchWithRouter /></ThemeProvider>);

describe('Search component', () => {
  const expectPageResult = async (page: number, getByTestId: (testId: string) => HTMLElement, getAllByTestId: (testId: RegExp) => HTMLElement[]) => {
      const visibleUsernames = usernames.slice(0, PAGE_SIZE * page);

      await waitFor(() => expect(getAllByTestId(/^search-result-link-user[0-9]+/)).toHaveLength(visibleUsernames.length));
      await waitFor(() => expect(getAllByTestId(/^search-result-link-user[0-9]+/)).toHaveLength(visibleUsernames.length));

      for(const username of visibleUsernames) {
          await waitFor(() => expect(getByTestId(`search-result-link-${username}`)).toHaveTextContent(username));
          await waitFor(() => expect(getByTestId(`search-result-link-${username}`)).toHaveAttribute('href', `/user/${username}`));
      }
  }

  it('searches for users when the form is submitted', async () => {
    const { getAllByTestId, getByTestId, asFragment } = renderWithProviders();

    expect(getByTestId('result-count')).toHaveTextContent(`Found ${usernames.length} results for testQuery`);

    await expectPageResult(1, getByTestId, getAllByTestId);

    expect(asFragment()).toMatchSnapshot();
  });

  it('fetches the next page of users when scrolled to the bottom of the page', async () => {
    const { getByTestId, asFragment, queryByTestId, getAllByTestId } = renderWithProviders();

    expect(getByTestId('result-count')).toHaveTextContent(`Found ${usernames.length} results for testQuery`);

    // Scroll to the bottom of the page
    window.innerHeight = 500;
    document.documentElement.scrollTop = 1000;

    Object.defineProperty(document.documentElement, 'offsetHeight', {
      writable: true,
      value: 1500,
    });

    const lastPage = Math.ceil(usernames.length / PAGE_SIZE);

    for(let page = 1; page < lastPage; page++) {
      await expectPageResult(page, getByTestId, getAllByTestId);
  
      fireEvent.scroll(document);

      expect(getByTestId('loading-indicator')).toBeInTheDocument();
    }

    await expectPageResult(lastPage, getByTestId, getAllByTestId);

    fireEvent.scroll(document);

    expect(queryByTestId('loading-indicator')).not.toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });

  it('redirects to /user/:username on username link click', async () => {
    const { getByTestId, asFragment, getAllByTestId } = renderWithProviders();

    expect(getByTestId('result-count')).toHaveTextContent(`Found ${usernames.length} results for testQuery`);

    await expectPageResult(1, getByTestId, getAllByTestId);

    const link = getByTestId(`search-result-link-${usernames[0]}`);

    fireEvent.click(link);

    expect(getByTestId(`loading-indicator-${usernames[0]}`)).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();

    await waitFor(() => expect(history.location.pathname).toBe(`/user/${usernames[0]}`));
  });
});
