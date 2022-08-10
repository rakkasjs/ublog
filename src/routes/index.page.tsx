import { useServerSideQuery } from "rakkasjs";

export default function HomePage() {
	const { data: posts } = useServerSideQuery(async (ctx) => {
		// This callback always runs on the server.
		// So we have access to the request context!

		// Get a list of the keys and metadata
		const list = await ctx.locals.postStore.list<{
			author: string;
			postedAt: string;
		}>();

		// Get individual posts and move things around
		// a little to make it easier to render
		const posts = await Promise.all(
			list.keys.map((key) =>
				ctx.locals.postStore
					.get(key.name)
					.then((data) => ({ key, content: data }))
			)
		);

		return posts;
	});

	return (
		<main>
			<h1>Posts</h1>
			<ul>
				{posts.map((post) => (
					<li key={post.key.name}>
						<div>{post.content}</div>
						<div>
							{/* post.key.metadata may not be available while testing for */}
							{/* reasons we'll cover later. That's why we need the nullish */}
							{/* checks here */}
							<i>{post.key.metadata?.author ?? "Unknown author"}</i>
							&nbsp;
							<span>
								{post.key.metadata
									? new Date(post.key.metadata.postedAt).toLocaleString()
									: "Unknown date"}
							</span>
						</div>
						<hr />
					</li>
				))}
			</ul>
		</main>
	);
}
