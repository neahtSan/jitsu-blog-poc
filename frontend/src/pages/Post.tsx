import { useParams, useNavigate } from "react-router-dom";
import { getPost, deletePost } from "../lib/storage";
import { useEffect } from "react";
import { track } from "../lib/analytics";


export default function Post() {
const { id } = useParams();
const nav = useNavigate();
const post = id ? getPost(id) : undefined;


useEffect(() => {
if (post) track("BlogPostViewed", { id: post.id, title: post.title });
}, [post]);


if (!post) return <p>Post not found.</p>;


return (
<article className="post">
<h1 className="title">{post.title}</h1>
<p className="meta">by {post.author} • {new Date(post.createdAt).toLocaleString()}</p>
<div className="content" dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, "<br/>") }} />
<div className="row" style={{ marginTop: 24 }}>
<button
className="button danger"
onClick={() => {
deletePost(post.id);
track("BlogPostDeleted", { id: post.id });
nav("/");
}}
>Delete</button>
</div>
</article>
);
}
