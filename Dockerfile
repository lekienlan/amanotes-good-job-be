FROM node:20-bookworm-slim

WORKDIR /app

# Reason: Prisma (and some dependencies) may require OpenSSL and CA certs.
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Use Yarn (classic) consistently.
RUN corepack enable && corepack prepare yarn@1.22.22 --activate

# Install dependencies first for better layer caching.
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy the rest (compose bind-mount will override in dev, but keeps the image runnable).
COPY . .

EXPOSE 3000

# Default command is overridden by docker-compose.yml
CMD ["yarn", "dev"]

FROM node:20-bookworm-slim

WORKDIR /app

# Reason: Prisma (and some dependencies) may require OpenSSL and CA certs.
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Use Yarn (classic) consistently.
RUN corepack enable && corepack prepare yarn@1.22.22 --activate

# Install dependencies first for better layer caching.
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy the rest (compose bind-mount will override in dev, but keeps the image runnable).
COPY . .

EXPOSE 3000

# Default command is overridden by docker-compose.yml
CMD ["yarn", "dev"]

