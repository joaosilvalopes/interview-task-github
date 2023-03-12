import { createMemoryHistory, To } from '@remix-run/router';
import { render, fireEvent, waitFor } from '@testing-library/react';

import withRouter from '~/test-utils/withRouter';

import Search from './Search';

const history = createMemoryHistory({ initialEntries: ['/search'], v5Compat: true });

const SearchWithRouter = withRouter(Search, { path: '/search/:searchQuery?', history });

describe('Search component', () => {
  it('renders correctly and redirects to /search/:searchQuery on search form submit', async () => {
    const { getByTestId, asFragment } = render(<SearchWithRouter />);

    expect(getByTestId('search-form')).toBeInTheDocument();
    expect(getByTestId('search-input')).toBeInTheDocument();
    expect(getByTestId('search-button')).toBeInTheDocument();
    expect(getByTestId('search-button')).toHaveTextContent('Search');

    const searchQuery = 'testQuery';

    fireEvent.submit(getByTestId('search-form'), { target: { username: { value: searchQuery } } });

    expect(getByTestId('search-button')).toHaveTextContent('Loading');

    await waitFor(() => {
      expect(history.location.pathname).toBe(`/search/${searchQuery}`);
      expect(getByTestId('search-button')).toHaveTextContent('Search');
    });

    expect(asFragment()).toMatchSnapshot();
  });
});

