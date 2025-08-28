import { Elysia, t } from "elysia";
import { MongoClient, ObjectId } from "mongodb";

const PORT = Number(process.env.PORT || 3080);
const MONGO_URI = process.env.MONGO_URI || "mongodb://mongo:27017/blog";

const client = new MongoClient(MONGO_URI);
await client.connect();
const db = client.db();
const posts = db.collection("posts");

const PostSchema = t.Object({
  title: t.String(),
  author: t.String(),
  content: t.String()
});

const toPublic = (doc: { _id: unknown; title: string; author: string; content: string; createdAt: number }) => ({
  _id: typeof doc._id === "string" ? doc._id : (doc._id as any)?.toString(),
  title: doc.title,
  author: doc.author,
  content: doc.content,
  createdAt: doc.createdAt,
});

const app = new Elysia();

app
  .get("/healthz", () => "ok")
  .get("/posts", async () => {
    const list = await posts.find({}).sort({ createdAt: -1 }).toArray();
    return list.map(doc => toPublic(doc as any));
  })
  .get("/posts/:id", async ({ params, set }) => {
    try {
      const doc = await posts.findOne({ _id: new ObjectId(params.id) });
      if (!doc) { set.status = 404; return { error: "not found" }; }
      return toPublic(doc as any);
    } catch {
      set.status = 400; return { error: "invalid id" };
    }
  })
  .post("/posts", async ({ body }) => {
    const doc = { ...(body as { title: string; author: string; content: string }), createdAt: Date.now() };
    const r = await posts.insertOne(doc);
    return toPublic({ _id: r.insertedId, ...doc });
  }, { body: PostSchema })
  .delete("/posts/:id", async ({ params, set }) => {
    try {
      const r = await posts.deleteOne({ _id: new ObjectId(params.id) });
      if (!r.deletedCount) { set.status = 404; return { error: "not found" }; }
      return { ok: true };
    } catch {
      set.status = 400; return { error: "invalid id" };
    }
  });

// IMPORTANT: bind to 0.0.0.0 so other containers can reach it
app.listen({ port: PORT, hostname: "0.0.0.0" }, ({ hostname, port }) => {
  console.log(`API listening on http://${hostname}:${port}`);
});
