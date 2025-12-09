# --- STAGE 1: Build ---
FROM node:22.17.0 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# --- STAGE 2: Production ---
FROM node:22.17.0

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

# copiar o build da stage anterior
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]
