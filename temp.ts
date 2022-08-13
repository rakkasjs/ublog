import { webcrypto as crypto } from "crypto";

const key = await crypto.subtle.generateKey(
	{
		name: "HMAC",
		hash: { name: "SHA-256" },
	},
	true,
	["sign", "verify"]
);

function arrayBufferToBase64(buffer: ArrayBuffer) {
	return typeof Buffer === "function"
		? Buffer.from(buffer).toString("base64")
		: btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

async function exportKeyToBase64(key: CryptoKey) {
	const exported = await crypto.subtle.exportKey("raw", key);
	return arrayBufferToBase64(exported);
}

console.log(await exportKeyToBase64(key));

const plain = "Hello, world!";
const signature = await crypto.subtle.sign(
	{ name: "HMAC", hash: { name: "SHA-256" } },
	key,
	new TextEncoder().encode(plain)
);

console.log(arrayBufferToBase64(signature));

const verified = await crypto.subtle.verify(
	{ name: "HMAC", hash: { name: "SHA-256" } },
	key,
	signature,
	new TextEncoder().encode(plain)
);

console.log(verified);
