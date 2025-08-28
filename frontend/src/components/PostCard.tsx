import { Link } from "react-router-dom";
import type { Post } from "../lib/storage";


export default function PostCard({ post }: { post: Post }) {
return (
<Link to={`/post/${post.id}`} className="card">
<h3>{post.title}</h3>
<p className="meta">by {post.author} • {new Date(post.createdAt).toLocaleDateString()}</p>
<p className="excerpt">{post.content.slice(0, 140)}{post.content.length > 140 ? "…" : ""}</p>
</Link>
);
}
