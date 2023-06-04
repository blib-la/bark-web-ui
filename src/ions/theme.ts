import { experimental_extendTheme as extendTheme } from "@mui/material/styles";
import { Roboto as nextRoboto } from "next/font/google";

export const roboto = nextRoboto({
	weight: ["300", "400", "500", "700"],
	subsets: ["latin"],
	display: "swap",
	fallback: ["Helvetica", "Arial", "sans-serif"],
});

// Create a theme instance.
const theme = extendTheme({
	colorSchemes: {
		light: {
			palette: {
				primary: {
					main: "#123321",
				},
				secondary: {
					main: "#321123",
				},
			},
		},
		dark: {
			palette: {
				primary: {
					main: "#fedabc",
				},
				secondary: {
					main: "#abcfde",
				},
			},
		},
	},
	typography: {
		...roboto.style,
	},
	components: {
		MuiCssBaseline: {
			styleOverrides: {
				"html, body": {
					height: "100%",
				},
				"#__next": {
					display: "contents",
				},
			},
		},
	},
});

export default theme;
