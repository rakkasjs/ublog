import {
	ActionHandler,
	useServerSideQuery,
	PageProps,
	ClientOnly,
} from "rakkasjs";

export default function HomePage({ actionData }: PageProps) {
	const {
		data: { posts, user },
	} = useServerSideQuery(async (ctx) => {
		const list = await ctx.locals.postStore.list<{
			author: string;
			postedAt: string;
		}>();

		const posts = await Promise.all(
			list.keys.map((key) =>
				ctx.locals.postStore
					.get(key.name)
					.then((data) => ({ key, content: data }))
			)
		);

		return { posts, user: ctx.locals.user };
	});

	return (
		<main>
			<h1>Posts</h1>
			<ul>
				{posts.map((post) => (
					<li key={post.key.name}>
						<div>{post.content}</div>
						<div>
							<i>{post.key.metadata?.author ?? "Unknown author"}</i>
							&nbsp;
							<span>
								{post.key.metadata?.postedAt ? (
									<ClientOnly fallback={null}>
										{new Date(post.key.metadata.postedAt).toLocaleString()}
									</ClientOnly>
								) : (
									"Unknown date"
								)}
							</span>
						</div>
						<hr />
					</li>
				))}
			</ul>

			{user && (
				<form method="POST">
					<p>
						<textarea
							name="content"
							rows={4}
							defaultValue={actionData?.content}
						/>
					</p>

					{actionData?.error && <p>{actionData.error}</p>}

					<button type="submit">Submit</button>
				</form>
			)}
		</main>
	);
}

export const action: ActionHandler = async (ctx) => {
	if (!ctx.requestContext.locals.user) {
		return { data: { error: "You must be signed in to post." } };
	}

	// Retrieve the form data
	const data = await ctx.requestContext.request.formData();
	const content = data.get("content");

	// Do some validation
	if (!content) {
		return { data: { error: "Content is required" } };
	} else if (typeof content !== "string") {
		// It could be a file upload!
		return { data: { error: "Content must be a string" } };
	} else if (content.length > 280) {
		return {
			data: {
				error: "Content must be less than 280 characters",
				content, // Echo back the content to refill the form
			},
		};
	}

	await ctx.requestContext.locals.postStore.put(generateKey(), content, {
		metadata: {
			// We don't have login/signup yet,
			// so we'll just make up a user name
			author: ctx.requestContext.locals.user.login,
			postedAt: new Date().toISOString(),
		},
	});

	return { data: { error: null } };
};

function generateKey() {
	// This is will generate keys in reverse alphabetical order so that the most
	// recent posts are at the top of the list.
	return (
		(9_999_999_999_999 - new Date().getTime()).toString(36).padStart(9, "0") +
		Math.random().toString(36).slice(2).padStart(6, "0")
	);
}
