FROM oven/bun:1.1-alpine
WORKDIR /app
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile || bun install
COPY tsconfig.json ./
COPY src ./src
ENV NODE_ENV=production
RUN bun build src/index.ts --target bun --outfile server.js
EXPOSE 3080
CMD ["bun", "server.js"]
