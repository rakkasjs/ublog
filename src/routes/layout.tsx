import { LayoutProps, useServerSideQuery } from "rakkasjs";

export default function MainLayout({ children }: LayoutProps) {
	const {
		data: { clientId, state, user },
	} = useServerSideQuery((ctx) => ({
		clientId: process.env.GITHUB_CLIENT_ID,
		state: ctx.cookie.state,
		user: ctx.locals.user,
	}));

	return (
		<>
			<header>
				<strong>uBlog</strong>
				<span style={{ float: "right" }}>
					{user ? (
						<span>
							<img src={user.avatar_url} width={32} />
							&nbsp;
							{user.name}
							<form method="POST" action="/logout">
								<button type="submit">Sign out</button>
							</form>
						</span>
					) : (
						<a
							href={
								"https://github.com/login/oauth/authorize" +
								`?client_id=${clientId}` +
								`&state=${state}`
							}
						>
							Sign in with GitGub
						</a>
					)}
				</span>
				<hr />
			</header>
			{children}
		</>
	);
}
