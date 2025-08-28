import { Link } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { listPosts } from "../lib/storage";
import PostCard from "../components/PostCard";
import { track } from "../lib/analytics";


export default function Home() {
const posts = useMemo(() => listPosts(), []);


useEffect(() => {
track("PageViewed", { page: "Home" });
}, []);


return (
<div>
<div className="row">
<h1 className="title">My Tiny Blog</h1>
<Link to="/new" className="button">New Post</Link>
</div>
{posts.length === 0 ? (
<p>No posts yet. Click <Link to="/new">New Post</Link> to create one.</p>
) : (
<div className="grid">
{posts.map((p) => (
<PostCard key={p.id} post={p} />
))}
</div>
)}
</div>
);
}
