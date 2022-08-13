import { PageProps, useServerSideQuery } from "rakkasjs";

export default function LoginPage({ url }: PageProps) {
	const error = url.searchParams.get("error");
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");

	const { data: userData } = useServerSideQuery(async () => {
		if (code && state === "12345") {
			const { access_token: token } = await fetch(
				"https://github.com/login/oauth/access_token" +
					`?client_id=${process.env.GITHUB_CLIENT_ID}` +
					`&client_secret=${process.env.GITHUB_CLIENT_SECRET}` +
					`&code=${code}`,
				{
					method: "POST",
					headers: { Accept: "application/json" },
				}
			).then((r) => r.json<{ access_token: string }>());

			if (token) {
				const userData = fetch("https://api.github.com/user", {
					headers: {
						Authorization: `token ${token}`,
					},
				}).then((r) => r.json());

				return userData;
			}
		}
	});

	if (error) {
		return <div>Error: {error}</div>;
	}

	return <pre>{JSON.stringify(userData, null, 2)}</pre>;
}
