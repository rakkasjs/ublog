import { LayoutProps, useServerSideQuery } from "rakkasjs";

export default function MainLayout({ children }: LayoutProps) {
	const {
		data: { clientId, state },
	} = useServerSideQuery(() => ({
		clientId: process.env.GITHUB_CLIENT_ID,
		state: "12345",
	}));

	return (
		<>
			<header>
				<strong>uBlog</strong>
				<a
					style={{ float: "right" }}
					href={
						"https://github.com/login/oauth/authorize" +
						`?client_id=${clientId}` +
						`&state=${state}`
					}
				>
					Sign in with GitGub
				</a>
				<hr />
			</header>
			{children}
		</>
	);
}
