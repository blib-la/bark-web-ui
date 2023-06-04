import path from "node:path";
import process from "node:process";

export const UPLOADS_PATH = path.join(process.cwd(), "public/uploads");
export const DATA_JSON_PATH = path.join(process.cwd(), "public/uploads/data.json");
