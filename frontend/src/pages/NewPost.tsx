import { useNavigate } from "react-router-dom";
import PostForm from "../components/PostForm";
import { createPost } from "../lib/storage";
import { track } from "../lib/analytics";


export default function NewPost() {
const nav = useNavigate();
return (
<div>
<h1 className="title">New Post</h1>
<PostForm
onSubmit={(data) => {
const post = createPost(data);
track("BlogPostCreated", { id: post.id, title: post.title });
nav(`/post/${post.id}`);
}}
/>
</div>
);
}
