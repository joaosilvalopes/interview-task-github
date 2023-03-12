import { createMemoryHistory } from '@remix-run/router';
import { render, fireEvent, waitFor, act } from '@testing-library/react';

import SearchResults, { PAGE_SIZE } from './$searchQuery';
import withRouter from '~/test-utils/withRouter';

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

describe('Search component', () => {
  const expectPageResult = async (page: number, getByTestId: (testId: string) => HTMLElement) => {
    await waitFor(() => {
      expect(getByTestId('result-count')).toHaveTextContent(`Found ${usernames.length} results for testQuery`);

      usernames.slice(0, PAGE_SIZE * page).forEach((username) => {
        expect(getByTestId(`search-result-link-${username}`)).toHaveTextContent(username);
        expect(getByTestId(`search-result-link-${username}`)).toHaveAttribute('href', `/user/${username}`);
      });
    });
  }

  it('searches for users when the form is submitted', async () => {
    const { getByTestId, asFragment } = render(<SearchWithRouter/>);

    await expectPageResult(1, getByTestId);

    expect(asFragment()).toMatchSnapshot();
  });

  it('fetches the next page of users when scrolled to the bottom of the page', async () => {
    const { getByTestId, asFragment } = render(<SearchWithRouter/>);

    // Scroll to the bottom of the page
    window.innerHeight = 500;
    document.documentElement.scrollTop = 1000;

    Object.defineProperty(document.documentElement, 'offsetHeight', {
      writable: true,
      value: 1500,
    });

    const lastPage = Math.ceil(usernames.length / PAGE_SIZE);

    for(let page = 1; page <= lastPage; page++) {
      await expectPageResult(page, getByTestId);
  
      fireEvent.scroll(document);

      page < lastPage && expect(getByTestId('loading-indicator')).toBeInTheDocument();
    }

    expect(asFragment()).toMatchSnapshot();
  });

  it('redirects to /user/:username on username link click', async () => {
    const { getByTestId, asFragment } = render(<SearchWithRouter/>);

    await expectPageResult(1, getByTestId);

    const link = getByTestId(`search-result-link-${usernames[0]}`);

    fireEvent.click(link);

    expect(link).toHaveTextContent('Loading');

    expect(asFragment()).toMatchSnapshot();

    await waitFor(() => expect(history.location.pathname).toBe(`/user/${usernames[0]}`));
  });
});
