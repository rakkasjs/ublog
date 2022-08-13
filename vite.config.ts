import { defineConfig } from "vite";
import rakkas from "rakkasjs/vite-plugin";
import tsconfigPaths from "vite-tsconfig-paths";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
	envDir: ".",
	plugins: [
		tsconfigPaths(),
		rakkas({
			adapter: "cloudflare-workers",
		}),
	],
});
