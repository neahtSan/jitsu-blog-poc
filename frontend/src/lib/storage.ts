export type Post = {
  _id: string;
  title: string;
  author: string;
  content: string;
  createdAt: number;
};

const API = import.meta.env.VITE_API_BASE || "/api";

export async function listPosts(): Promise<Post[]> {
  const r = await fetch(`${API}/posts`);
  if (!r.ok) throw new Error("Failed to fetch posts");
  return r.json();
}

export async function getPost(id: string): Promise<Post | undefined> {
  const r = await fetch(`${API}/posts/${id}`);
  if (r.status === 404) return undefined;
  if (!r.ok) throw new Error("Failed to fetch post");
  return r.json();
}

export async function createPost(data: { title: string; author: string; content: string; }): Promise<Post> {
  const r = await fetch(`${API}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!r.ok) throw new Error("Failed to create post");
  return r.json();
}

export async function deletePost(id: string): Promise<void> {
  const r = await fetch(`${API}/posts/${id}`, { method: "DELETE" });
  if (!r.ok) throw new Error("Failed to delete post");
}
