import { useParams, useNavigate } from "react-router-dom";
import { getPost, deletePost, type Post } from "../lib/storage";
import { useEffect, useState } from "react";
import { useJitsu } from "@jitsu/jitsu-react";

export default function Post() {
  const { id } = useParams();
  const nav = useNavigate();
  const { analytics } = useJitsu();
  const [post, setPost] = useState<Post | undefined>();

  useEffect(() => {
    let cancelled = false;
    if (!id) return;

    (async () => {
      try {
        const p = await getPost(id);
        if (cancelled) return;
        setPost(p);
        if (p) analytics.track("BlogPostViewed", { id: p.id, title: p.title });
      } catch (e) {
        console.error(e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id, analytics]);

  if (!post) return <p>Post not found.</p>;

  return (
    <article className="post">
      <h1 className="title">{post.title}</h1>
      <p className="meta">
        by {post.author} • {new Date(post.createdAt).toLocaleString()}
      </p>
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, "<br/>") }}
      />
      <div className="row" style={{ marginTop: 24 }}>
        <button
          className="button danger"
          onClick={async () => {
            try {
              await deletePost(post.id);
              analytics.track("BlogPostDeleted", { id: post.id });
              nav("/");
            } catch (e) {
              console.error(e);
              alert("Failed to delete post.");
            }
          }}
        >
          Delete
        </button>
      </div>
    </article>
  );
}
