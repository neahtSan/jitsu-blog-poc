# Jitsu Blog Demo (React + Vite + TS + Docker)
A tiny, zero-backend blog that writes posts to `localStorage` and emits Jitsu analytics events (page views, custom events, and optional identify). Built with Vite and shipped as a static SPA in Nginx.


## Features
- Create / view / delete posts (client-side storage)
- Jitsu events: `PageViewed`, `BlogPostCreated`, `BlogPostViewed`, `BlogPostDeleted`, `AliasSet`
- Optional `identify()` via the header alias box
- One-container production image (Nginx) suitable for any Mac/PC/Linux host with Docker


## Prereqs
- Node 18+ (for local dev) and Docker Engine (for container build/run)
- A Jitsu project (Cloud or self-host). Grab the **Write Key**.


## 1) Configure Jitsu
Create `.env` from the example:
```bash
cp .env.example .env
# set your Jitsu key and (optionally) host
```
- **Cloud**: `VITE_JITSU_HOST=https://t.jitsu.com` (default) is fine.
- **Self-host** (on your other Mac): use your collector/script base URL, e.g. `https://analytics.myhost.local`.


## 2) Run locally (hot reload)
```bash
npm i
npm run dev
# open http://localhost:5173
```
Create a couple posts, set an alias, click around—then watch the **Live Events** stream in Jitsu.


## 3) Build and run in Docker
```bash
# Build image (env is read at *build* time by Vite)
docker build -t jitsu-blog:latest .
# Run container
docker run -d --name jitsu-blog -p 8080:80 jitsu-blog:latest
# open http://localhost:8080
```
> If you change env values, rebuild the image so Vite can embed them.


## 4) Deploy to another Mac (air-gapped friendly)
On your dev machine:
```bash
# Save image to a tar
docker save -o jitsu-blog.tar jitsu-blog:latest
```
Copy `jitsu-blog.tar` to the target Mac (Air M4), then:
```bash
docker load -i jitsu-blog.tar
docker run -d --name jitsu-blog -p 8080:80 jitsu-blog:latest
```
Alternatively, push to a registry and `docker pull` on the target.


## 5) Event Cheatsheet (what to expect in Jitsu)
- `PageViewed` — fired in each route's `useEffect`
- `BlogPostCreated` — on successful submit
- `BlogPostViewed` — when opening a post
- `BlogPostDeleted` — when deleting
- `AliasSet` — when you enter an alias in the header (also calls `identify()`)


## 6) Self-host Jitsu locally (optional)
- Install Docker Desktop on the other Mac
- Use the official `jitsucom/jitsu` compose or Cloud quickstart
- Point `VITE_JITSU_HOST` to your collector domain


## 7) Notes
- Since data is in `localStorage`, posts are per-browser. Swap to a real backend later.
