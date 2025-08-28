import { Elysia, t } from "elysia";
import { MongoClient, ObjectId } from "mongodb";

const PORT = Number(process.env.PORT || 3080);
const MONGO_URI = process.env.MONGO_URI!;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

const client = new MongoClient(MONGO_URI);
const app = new Elysia();

const PostSchema = t.Object({
  title: t.String({ minLength: 1 }),
  author: t.String({ minLength: 1 }),
  content: t.String({ minLength: 1 })
});

await client.connect();
const db = client.db(); // resolves from URI
const posts = db.collection("posts");

app
  .get("/healthz", () => "ok")
  .get("/posts", async () => {
    return await posts.find({}).sort({ createdAt: -1 }).toArray();
  })
  .get("/posts/:id", async ({ params, set }) => {
    try {
      const doc = await posts.findOne({ _id: new ObjectId(params.id) });
      if (!doc) { set.status = 404; return { error: "not found" }; }
      return doc;
    } catch {
      set.status = 400; return { error: "invalid id" };
    }
  })
  .post("/posts", async ({ body }) => {
    const doc = { ...body, createdAt: Date.now() };
    const r = await posts.insertOne(doc);
    return { _id: r.insertedId, ...doc };
  }, { body: PostSchema })
  .delete("/posts/:id", async ({ params, set }) => {
    try {
      const r = await posts.deleteOne({ _id: new ObjectId(params.id) });
      if (!r.deletedCount) { set.status = 404; return { error: "not found" }; }
      return { ok: true };
    } catch {
      set.status = 400; return { error: "invalid id" };
    }
  })
  .onStart(() => console.log(`API up on :${PORT}`))
  .listen(PORT, ({ port }) => console.log(`Listening on :${port}`));

// Basic CORS (you can swap to Elysia CORS plugin if you prefer)
app.onRequest((ctx) => {
  ctx.set.headers["Access-Control-Allow-Origin"] = CORS_ORIGIN;
  ctx.set.headers["Access-Control-Allow-Methods"] = "GET,POST,DELETE,OPTIONS";
  ctx.set.headers["Access-Control-Allow-Headers"] = "Content-Type";
});
