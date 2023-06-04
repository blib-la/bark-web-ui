import type { EmotionCache } from "@emotion/react/dist/emotion-react.cjs";
import type { AppProps } from "next/app";

export interface MyAppProps extends AppProps {
	emotionCache?: EmotionCache;
}
