import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import NewPost from "./pages/NewPost";
import Post from "./pages/Post";
import "./index.css";
import { JitsuProvider } from "@jitsu/jitsu-react";

// Read from env (baked at build time by Vite)
const jitsuOptions = {
  host: import.meta.env.VITE_JITSU_HOST as string,       // e.g. https://t.jitsu.com
  key:  import.meta.env.VITE_JITSU_WRITE_KEY as string,  // your write key
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "post/:id", element: <Post /> },
      { path: "new", element: <NewPost /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <JitsuProvider options={jitsuOptions}>
      <RouterProvider router={router} />
    </JitsuProvider>
  </React.StrictMode>
);
