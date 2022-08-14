import { RequestContext } from "rakkasjs";

export function post(ctx: RequestContext) {
	ctx.deleteCookie("token");
	return new Response(null, {
		status: 302,
		headers: {
			Location: new URL("/", ctx.request.url).href,
		},
	});
}
