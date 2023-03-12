import { useContext } from "react";

import { ThemeContext } from "~/theme";

const useTheme = () => useContext(ThemeContext);

export default useTheme;
