import { createRequestHandler } from "rakkasjs";

declare module "rakkasjs" {
	interface ServerSideLocals {
		postStore: KVNamespace;
	}
}

export default createRequestHandler({
	middleware: {
		beforePages: [
			async (ctx) => {
				if (import.meta.env.DEV) {
					const { postStore } = await import("./kv-mock");
					ctx.locals.postStore = postStore;
				} else {
					ctx.locals.postStore = (ctx.platform as any).env.KV_POSTS;
				}
			},
		],
	},
});
