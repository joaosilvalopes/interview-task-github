import { render } from '@testing-library/react';

import Spinner from './Spinner';

describe('Spinner component', () => {
  it('renders correctly', () => {
    const { asFragment } = render(<Spinner />);

    expect(asFragment()).toMatchSnapshot();
  });
});
