import type { Dispatch, ReactNode, SetStateAction} from "react";
import { createContext, useState } from "react";
import { ThemeProvider as StyledComponentsThemeProvider } from "styled-components";

import dark from './dark';
import common from './common';
import light from './light';

const themes = {
    dark: {
        ...common,
        ...dark
    },
    light: {
        ...common,
        ...light
    },
};

export type Theme = 'dark' | 'light';

export const ThemeContext = createContext<[Theme, Dispatch<SetStateAction<Theme>>]>(['light', () => {}]);

const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<Theme>('light');
    
    return (
        <ThemeContext.Provider value={[theme, setTheme]}>
            <StyledComponentsThemeProvider children={children} theme={themes[theme]} />
        </ThemeContext.Provider>
    );
}

export default ThemeProvider;
