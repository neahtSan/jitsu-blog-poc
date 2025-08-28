import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import { listPosts, type Post } from "../lib/storage";
import { useJitsu } from "@jitsu/jitsu-react";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const { analytics } = useJitsu();

  useEffect(() => {
    // Track page view (safe even if you also have a global PageTracker)
    analytics.page({ name: "Home" });

    let cancelled = false;
    (async () => {
      try {
        const data = await listPosts(); // HTTP -> backend
        if (!cancelled) setPosts(data);
      } catch (err) {
        console.error("Failed to load posts", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [analytics]);

  return (
    <div>
      <div className="row">
        <h1 className="title">My Tiny Blog</h1>
        <Link to="/new" className="button">New Post</Link>
      </div>

      {posts.length === 0 ? (
        <p>
          No posts yet. Click <Link to="/new">New Post</Link> to create one.
        </p>
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
