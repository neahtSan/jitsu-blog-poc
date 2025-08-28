import { useNavigate } from "react-router-dom";
import PostForm from "../components/PostForm";
import { createPost } from "../lib/storage";
import { useJitsu } from "@jitsu/jitsu-react";

export default function NewPost() {
  const nav = useNavigate();
  const { analytics } = useJitsu();

  return (
    <div>
      <h1 className="title">New Post</h1>
      <PostForm
        onSubmit={async (data) => {
          try {
            const post = await createPost(data);
            analytics.track("BlogPostCreated", { id: post.id, title: post.title });
            nav(`/post/${post.id}`);
          } catch (err) {
            console.error(err);
            alert("Failed to publish post. Check console for details.");
          }
        }}
      />
    </div>
  );
}
