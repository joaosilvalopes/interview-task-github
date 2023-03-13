import { Link } from 'react-router-dom';
import styled from 'styled-components';

import useTheme from '~/hooks/useTheme';

const HeaderContainer = styled.header`
    display: flex;
    justify-content: space-between;
    height: ${props => props.theme.headerHeight};
    background-color: ${props => props.theme.colors.headerBackground};
    color: ${props => props.theme.colors.header};
    font-size: 2rem;
    padding: 0 2rem;
`;

const HomeLink = styled(Link)`
    text-decoration: none;
    color: currentColor;

    &:focus {
        color: currentColor;
    }

    &:hover {
        color: ${props => props.theme.colors.homeLinkOnHover};
    }
`;

const ChangeThemeButton = styled.button`
    border: 0;
    background-color: transparent;
    cursor: pointer;

    &:hover {
        color: ${props => props.theme.colors.changeThemeButtonOnHover};
    }
`;

const Header = () => {
    const [theme,setTheme] = useTheme();

    return (
        <HeaderContainer>
            <HomeLink data-testid="home-link" to="/">⌂</HomeLink>
            <ChangeThemeButton data-testid="change-theme-button" onClick={() => setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')}>{theme === 'light' ? '☀' : '☽'}</ChangeThemeButton>
        </HeaderContainer>
    )
};

export default Header;
