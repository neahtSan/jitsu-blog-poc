import { Outlet, Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useJitsu } from "@jitsu/jitsu-react";
import Header from "./components/Header";

function PageTracker() {
  const { analytics } = useJitsu();
  const location = useLocation();
  useEffect(() => {
    analytics.page(); // fires on every route change
  }, [location, analytics]);
  return null;
}

export default function App() {
  const { pathname } = useLocation();
  return (
    <div className="app">
      <PageTracker />
      <Header />
      <main className="container">
        {pathname !== "/" && (
          <Link to="/" className="back">← Back to posts</Link>
        )}
        <Outlet />
      </main>
      <footer className="footer">Blog Demo • MIT</footer>
    </div>
  );
}
