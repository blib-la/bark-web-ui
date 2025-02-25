import { mkdir, readFile, writeFile } from "fs/promises";

import { execa } from "execa";
import { nanoid } from "nanoid";
import type { NextApiRequest, NextApiResponse } from "next";

import { DATA_JSON_PATH, UPLOADS_PATH } from "@/ions/constants";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
	const {
		text,
		voice = "announcer",
		fileName = `${nanoid()}.wav`,
		textTemperature = 0.7,
		silent = true,
		waveformTemperature = 0.7,
	} = request.body;

	if (!silent) {
		console.log("INPUT");
		console.log(request.body);
	}

	const args = [
		"-m",
		"bark",
		"--text",
		text,
		"--output_filename",
		fileName,
		"--output_dir",
		"public/uploads/wav",
		"--history_prompt",
		voice,
		"--text_temp",
		textTemperature,
		"--waveform_temp",
		waveformTemperature,
	];
	if (silent) {
		args.push("--silent", true);
	}

	try {
		await execa("python", args, { stdio: "inherit" });

		const data = {
			download: `/api/uploads/wav/${fileName}`,
			text,
			voice,
			img: `/api/voices/${voice}.png`,
			fileName,
			textTemperature,
			waveformTemperature,
		};

		if (!silent) {
			console.log("OUTPUT");
			console.log(data);
		}

		try {
			const dataJson = JSON.parse(
				await readFile(DATA_JSON_PATH, {
					encoding: "utf-8",
				})
			);
			dataJson.push(data);
			await writeFile(DATA_JSON_PATH, JSON.stringify(dataJson, null, 2));
			response.status(200).json(data);
		} catch {
			const dataJson = [];
			dataJson.push(data);
			await mkdir(UPLOADS_PATH, { recursive: true });
			await writeFile(DATA_JSON_PATH, JSON.stringify(dataJson, null, 2));
			response.status(200).json(data);
		}
	} catch (error) {
		response.status(500).json({ message: (error as Error).message });
	}
}
