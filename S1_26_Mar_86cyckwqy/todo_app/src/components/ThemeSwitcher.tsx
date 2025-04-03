import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Brightness2Outlined, LightModeOutlined } from "@mui/icons-material";

const ThemeSwitcher = () => {
    const themeContext = useContext(ThemeContext);

    if (!themeContext) return null; 
    const { theme, toggleTheme } = themeContext;

    return (
        <button onClick={toggleTheme} className="purple-bg theme-toggle">
            {theme === "light" ? <Brightness2Outlined fontSize="medium" /> : <LightModeOutlined fontSize="medium" />}
        </button>
    );
};

export default ThemeSwitcher;
