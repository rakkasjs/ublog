import { createRequestHandler } from "rakkasjs";
import { cookie } from "@hattip/cookie";

interface GitHubUser {
	// Just the bits we need
	login: string;
	name: string;
	avatar_url: string;
}

declare module "rakkasjs" {
	interface ServerSideLocals {
		postStore: KVNamespace;
		user?: GitHubUser;
	}
}

export default createRequestHandler({
	middleware: {
		beforePages: [
			cookie(),
			async (ctx) => {
				if (import.meta.env.DEV) {
					const { postStore } = await import("./kv-mock");
					ctx.locals.postStore = postStore;

					// Polyfill crypto
					if (typeof crypto === "undefined") {
						const { webcrypto } = await import("crypto");
						globalThis.crypto = webcrypto as any;
					}
				} else {
					ctx.locals.postStore = (ctx.platform as any).env.KV_POSTS;
				}

				if (!ctx.cookie.state) {
					const randomToken = crypto.randomUUID();
					ctx.setCookie("state", randomToken, {
						httpOnly: true,
						secure: import.meta.env.PROD,
						sameSite: "strict",
						maxAge: 60 * 60,
					});

					// To make it immediately available,
					// We'll store it here too.
					ctx.cookie.state = randomToken;
				}

				if (ctx.cookie.token) {
					const user: GitHubUser = await fetch("https://api.github.com/user", {
						headers: {
							Authorization: `token ${ctx.cookie.token}`,
							"User-Agent": "uBlog by cyco130",
						},
					}).then((r) => r.json());

					ctx.locals.user = user;
				}
			},
		],
	},
});
