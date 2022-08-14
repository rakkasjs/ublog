import { Head, PageProps, HeadersFunction } from "rakkasjs";

export default function LoginPage({ url }: PageProps) {
	const error = url.searchParams.get("error");

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div>
			<Head>
				{/* Redirect immediately */}
				<meta httpEquiv="refresh" content="0; url=/" />
			</Head>
			<p>Redirecting...</p>
		</div>
	);
}

export const headers: HeadersFunction = async ({
	url,
	requestContext: ctx,
}) => {
	if (url.searchParams.get("error")) {
		return { status: 403 };
	}

	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");

	if (code && state === ctx.cookie.state) {
		const { access_token: token } = await fetch(
			"https://github.com/login/oauth/access_token" +
				`?client_id=${process.env.GITHUB_CLIENT_ID}` +
				`&client_secret=${process.env.GITHUB_CLIENT_SECRET}` +
				`&code=${code}`,
			{
				method: "POST",
				headers: {
					Accept: "application/json",
					"User-Agent": "uBlog by cyco130",
				},
			}
		).then((r) => r.json<{ access_token: string }>());

		if (token) {
			ctx.setCookie("token", token, {
				httpOnly: true,
				secure: import.meta.env.PROD,
				sameSite: "strict",
				maxAge: 60 * 60,
			});

			return {
				// We won't be setting any headers,
				// setCookie will do it for us,
				// so an empty object is fine.
			};
		}
	}

	// Login failed for some reason
	// We'll redirect to set the `error` parameter
	return {
		status: 302,
		headers: {
			Location: new URL(`/login?error=Login%20failed`, url).href,
		},
	};
};
