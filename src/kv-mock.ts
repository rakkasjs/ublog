import { KVNamespace } from "@miniflare/kv";
import { MemoryStorage } from "@miniflare/storage-memory";

export const postStore = new KVNamespace(new MemoryStorage());

const MOCK_POSTS = [
	{
		key: "1",
		content: "Hello, world!",
		author: "Jane Doe",
		postedAt: "2022-08-10T14:34:00.000Z",
	},
	{
		key: "2",
		content: "Hello ublog!",
		author: "Cody Reimer",
		postedAt: "2022-08-10T13:27:00.000Z",
	},
	{
		key: "3",
		content: "Wow, this is pretty cool!",
		author: "Zoey Washington",
		postedAt: "2022-08-10T12:00:00.000Z",
	},
];

// We'll add some mock posts
// Rakkas supports top level await
await Promise.all(
	// We'll do this in parallel with Promise.all,
	// just to be cool.
	MOCK_POSTS.map((post) =>
		postStore.put(post.key, post.content, {
			metadata: {
				author: post.author,
				postedAt: post.postedAt,
			},
		})
	)
);
