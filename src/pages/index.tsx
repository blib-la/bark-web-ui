import { readFile } from "fs/promises";

import {
	Avatar,
	Button,
	Card,
	CardActions,
	CardContent,
	ListItemText,
	ListSubheader,
	MenuItem,
	TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import axios from "axios";
import FormData from "form-data";
import dynamic from "next/dynamic";
import type { FormEvent } from "react";
import { useState } from "react";

import { DATA_JSON_PATH } from "@/ions/constants";
import Template from "@/templates/base";
import type { Generation } from "@/types/common";

const MusicPlayer = dynamic(async () => import("@/organisms/MusicPlayer"));

const languageNames = {
	de: "German",
	en: "English",
	es: "Spanish",
	fr: "French",
	hi: "Hindi",
	it: "Italian",
	ja: "Japanese",
	ko: "Korean",
	pl: "Polish",
	pt: "Portuguese",
	ru: "Russian",
	tr: "Turkish",
	zh: "Chinese, simplified",
};

export type LanguageKey = keyof typeof languageNames;
const languages: LanguageKey[] = [
	"de",
	"en",
	"es",
	"fr",
	"hi",
	"it",
	"ja",
	"ko",
	"pl",
	"ru",
	"tr",
	"zh",
];

export interface VoiceItem {
	name: string;
	id: string;
	isHeader?: boolean;
	value?: string | LanguageKey;
	language?: LanguageKey;
}
const voices = [
	{ name: "Announcer", value: "announcer", id: "announcer" },
	...languages.flatMap(language =>
		Array.from(
			{ length: 10 },
			(_, index) =>
				[
					index === 0 && {
						name: languageNames[language],
						id: `header_${language}`,
						isHeader: true,
						language,
					},
					{
						name: `Speaker ${index}`,
						value: `${language}_speaker_${index}`,
						id: `${language}_speaker_${index}`,
						language,
					},
				].filter(Boolean) as VoiceItem[]
		).flat()
	),
];

export default function Page({ storedGenerations }: { storedGenerations: Generation[] }) {
	const [loading, setLoading] = useState(false);
	const [voice, setVoice] = useState("announcer");
	const [generations, setGenerations] = useState<Generation[]>(storedGenerations);
	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setLoading(true);
		try {
			const formData = new FormData(event.target as HTMLFormElement) as unknown;
			const formObject = Object.fromEntries<unknown>(
				formData as Iterable<[PropertyKey, string]>
			);
			const result = await axios.post("/api/generate", { ...formObject, silent: false });
			console.log(result.data);
			setGenerations([...generations, result.data]);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	}

	return (
		<Template>
			<Box
				component="form"
				sx={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}
				onSubmit={handleSubmit}
			>
				<Grid container spacing={4} columns={{ xs: 1, md: 2, lg: 3 }} sx={{ pb: 2, px: 4 }}>
					<Grid xs={1} lg={2}>
						<TextField
							fullWidth
							multiline
							name="text"
							label="Text"
							minRows={7}
							maxRows={14}
						/>
					</Grid>
					<Grid xs={1} sx={{ display: "flex" }}>
						<Card sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
							<CardContent sx={{ flex: 1 }}>
								<TextField
									fullWidth
									select
									name="voice"
									label="Voice"
									value={voice}
									onChange={event => {
										setVoice(event.target.value);
									}}
									SelectProps={{
										renderValue(value) {
											const item = voices.find(
												voice => voice.value === value
											);
											if (item?.language) {
												return `${item.language}: ${item.name}`;
											}

											if (item) {
												return item.name;
											}
										},
									}}
								>
									{voices.map(entry =>
										entry.isHeader ? (
											<ListSubheader key={entry.id}>
												{entry.name}
											</ListSubheader>
										) : (
											<MenuItem key={entry.id} value={entry.value}>
												<Avatar
													src={`/voices/${entry.value}.png`}
													sx={{ mr: 2 }}
												>
													{entry.language}
												</Avatar>
												<ListItemText primary={entry.name} />
											</MenuItem>
										)
									)}
								</TextField>
							</CardContent>
							<CardActions>
								<Button
									fullWidth
									disabled={loading}
									type="submit"
									size="large"
									variant="contained"
								>
									Generate
								</Button>
							</CardActions>
						</Card>
					</Grid>
				</Grid>
				<Grid
					container
					spacing={4}
					columns={{ xs: 1, md: 2, lg: 3, xl: 4 }}
					sx={{
						flex: 1,
						my: 0,
						px: 4,
						overflow: "auto",
						WebkitOverflowScrolling: "touch",
					}}
				>
					{generations.reverse().map(generation => (
						<Grid xs={1} key={generation.fileName}>
							<MusicPlayer {...generation} />
						</Grid>
					))}
				</Grid>
			</Box>
		</Template>
	);
}

export async function getServerSideProps() {
	try {
		const storedGenerations = JSON.parse(
			await readFile(DATA_JSON_PATH, {
				encoding: "utf-8",
			})
		);

		return {
			props: { storedGenerations },
		};
	} catch {
		return {
			props: { storedGenerations: [] },
		};
	}
}
