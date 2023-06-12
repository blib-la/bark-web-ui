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
	const [parameters, setParameters] = useState({
		text: "",
		voice: "announcer",
		waveformTemperature: 0.7,
		textTemperature: 0.7,
	});
	const [loading, setLoading] = useState(false);
	const [generations, setGenerations] = useState<Generation[]>(storedGenerations);
	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setLoading(true);
		try {
			const formData = new FormData(event.target as HTMLFormElement) as unknown as Iterable<
				[PropertyKey, string]
			>;
			const formObject = Object.fromEntries<unknown>(formData);
			const result = await axios.post("/api/generate", { ...formObject, silent: false });
			console.log(result.data);
			setGenerations([result.data, ...generations]);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	}

	return (
		<Template>
			<Box component="form" onSubmit={handleSubmit}>
				<Grid container spacing={4} columns={{ xs: 1, md: 2, lg: 3 }} sx={{ m: 0 }}>
					<Grid xs={1} lg={2}>
						<TextField
							fullWidth
							multiline
							name="text"
							label="Text"
							variant="filled"
							minRows={7}
							maxRows={14}
							value={parameters.text}
							onChange={event => {
								setParameters(previousState => ({
									...previousState,
									text: event.target.value,
								}));
							}}
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
									variant="filled"
									value={parameters.voice}
									onChange={event => {
										setParameters(previousState => ({
											...previousState,
											voice: event.target.value,
										}));
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
													src={`/api/voices/${entry.value}.png`}
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
				<Grid container spacing={4} columns={{ xs: 1, md: 2, lg: 3, xl: 4 }} sx={{ m: 0 }}>
					{generations.map(generation => (
						<Grid xs={1} key={generation.fileName}>
							<MusicPlayer
								{...generation}
								onUse={parameters_ => {
									setParameters(parameters_);
								}}
							/>
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
		).reverse();

		return {
			props: { storedGenerations },
		};
	} catch {
		return {
			props: { storedGenerations: [] },
		};
	}
}
