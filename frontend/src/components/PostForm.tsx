import { useState } from "react";


export type PostFormData = { title: string; author: string; content: string };


export default function PostForm({ onSubmit }: { onSubmit: (d: PostFormData) => void }) {
const [title, setTitle] = useState("");
const [author, setAuthor] = useState("");
const [content, setContent] = useState("");


return (
<form
className="form"
onSubmit={(e) => {
e.preventDefault();
onSubmit({ title, author, content });
}}
>
<label>
Title
<input value={title} onChange={(e) => setTitle(e.target.value)} required />
</label>
<label>
Author
<input value={author} onChange={(e) => setAuthor(e.target.value)} required />
</label>
<label>
Content
<textarea rows={8} value={content} onChange={(e) => setContent(e.target.value)} required />
</label>
<div className="row">
<button className="button" type="submit">Publish</button>
</div>
</form>
);
}
