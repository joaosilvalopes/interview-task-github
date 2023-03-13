import { createMemoryHistory } from '@remix-run/router';
import { render, fireEvent, waitFor } from '@testing-library/react';
import withRouter from '~/test-utils/withRouter';

import ThemeProvider from "~/theme";

import Header from './Header';

const history = createMemoryHistory({ v5Compat: true });

const HeaderWithRouter = withRouter(Header, { path: '/', history });

describe('Header component', () => {
  it('renders correctly and changes theme on change theme button click', async () => {
    const { getByTestId, asFragment } = render(<ThemeProvider><HeaderWithRouter /></ThemeProvider>);

    expect(getByTestId('change-theme-button')).toBeInTheDocument();
    expect(getByTestId('home-link')).toBeInTheDocument();
    expect(getByTestId('change-theme-button')).toHaveTextContent('☀');

    fireEvent.click(getByTestId('change-theme-button'));

    expect(getByTestId('change-theme-button')).toHaveTextContent('☽');
    expect(asFragment()).toMatchSnapshot();
  });

  it('Redirects to / on home link click', async () => {
    const { getByTestId, asFragment } = render(<ThemeProvider><HeaderWithRouter /></ThemeProvider>);

    expect(getByTestId('change-theme-button')).toBeInTheDocument();
    expect(getByTestId('home-link')).toBeInTheDocument();

    fireEvent.click(getByTestId('home-link'));

    await waitFor(() => {
      expect(history.location.pathname).toBe(`/`);
    });

    expect(asFragment()).toMatchSnapshot();
  });
});

