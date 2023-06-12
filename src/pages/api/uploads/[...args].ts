import { readFile } from "fs/promises";
import path from "node:path";
import process from "node:process";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
	const args = request.query.args as string[];
	const filePath = path.join(process.cwd(), "public/uploads", ...args);

	const imageBuffer = await readFile(filePath);

	response.setHeader("Content-Type", "audio/wav");
	response.status(200).send(imageBuffer);
}
