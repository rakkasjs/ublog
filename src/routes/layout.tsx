import "@unocss/reset/tailwind.css";
import "uno.css";
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
			<header className="px-5 py-5 b-b bg-amber flex justify-between">
				<strong className="color-amber-9">uBlog</strong>
				<span>
					{user ? (
						<div className="flex items-center">
							<img src={user.avatar_url} width={32} className="rounded-full" />
							<span className="color-amber-8 ml-3">{user.name}</span>
							<form method="POST" action="/logout" className="ml-3">
								<button type="submit" className="color-red-8 hover:color-red-6">
									Sign out
								</button>
							</form>
						</div>
					) : (
						<a
							className="color-red-8 hover:color-red-6"
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
			</header>
			{children}
		</>
	);
}
