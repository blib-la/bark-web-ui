import type { EmotionCache } from "@emotion/react";
import { CacheProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
import type { AppProps } from "next/app";
import Head from "next/head";

import createEmotionCache from "@/ions/createEmotionCache";
import theme from "@/ions/theme";

const clientSideEmotionCache = createEmotionCache();

export interface MyAppProps extends AppProps {
	emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
	const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
	return (
		<CacheProvider value={emotionCache}>
			<Head>
				<meta name="viewport" content="initial-scale=1, width=device-width" />
			</Head>
			<CssVarsProvider defaultMode="system" theme={theme}>
				<CssBaseline />
				<Component {...pageProps} />
			</CssVarsProvider>
		</CacheProvider>
	);
}
