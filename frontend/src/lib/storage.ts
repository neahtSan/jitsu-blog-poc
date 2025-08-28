export type Post = {
  id: string;
  title: string;
  author: string;
  content: string;
  createdAt: number;
};

const API = import.meta.env.VITE_API_BASE || "/api";

const normId = (id: unknown): string => {
  if (!id) return "";
  if (typeof id === "string") return id;
  if (typeof id === "object" && id !== null && "$oid" in (id as Record<string, unknown>)) {
    const val = (id as Record<string, unknown>)["$oid"];
    return typeof val === "string" ? val : String(val);
  }
  return String(id);
};

type RawPost = {
  _id?: unknown;
  title?: unknown;
  author?: unknown;
  content?: unknown;
  createdAt?: unknown;
};

const normalize = (p: RawPost): Post => ({
  id: normId(p["_id"]),
  title: typeof p.title === "string" ? p.title : "",
  author: typeof p.author === "string" ? p.author : "",
  content: typeof p.content === "string" ? p.content : "",
  createdAt:
    typeof p.createdAt === "number"
      ? p.createdAt
      : Number((p.createdAt as number | string | undefined) ?? Date.now()),
});

export async function listPosts(): Promise<Post[]> {
  const r = await fetch(`${API}/posts`);
  if (!r.ok) throw new Error("Failed to fetch posts");
  const data = (await r.json()) as unknown;
  return Array.isArray(data) ? (data as RawPost[]).map(normalize) : [];
}

export async function getPost(id: string): Promise<Post | undefined> {
  const r = await fetch(`${API}/posts/${id}`);
  if (r.status === 404) return undefined;
  if (!r.ok) throw new Error("Failed to fetch post");
  const data = (await r.json()) as RawPost;
  return normalize(data);
}

export async function createPost(data: { title: string; author: string; content: string }): Promise<Post> {
  const r = await fetch(`${API}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!r.ok) {
    const msg = await r.text().catch(() => "");
    throw new Error(`Failed to create post: ${msg || r.status}`);
  }
  const created = (await r.json()) as RawPost;
  return normalize(created);
}

export async function deletePost(id: string): Promise<void> {
  const r = await fetch(`${API}/posts/${id}`, { method: "DELETE" });
  if (!r.ok) throw new Error("Failed to delete post");
}
