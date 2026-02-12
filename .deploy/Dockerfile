FROM node:alpine3.21 AS base
WORKDIR /app

# Install dependencies only when needed
FROM base AS builder
RUN apk add --cache --virtual .build-deps \
	python3 py3-setuptools alpine-sdk g++ make libtool autoconf automake
COPY package.json package-lock.json .npmrc ./
# run build with ci
RUN npm ci --cache .npm --prefer-offline --frozen-lockfile
# delete apk dependencies
RUN apk del .build-deps
# build production code
ENV NODE_ENV=production
COPY . .
RUN npm run build
RUN tar -czf /build.tar.gz .next public next.config.mjs package.json node_modules entrypoint.sh .env.production

# Production image, copy zip and unzip
FROM base AS runner
RUN apk update && apk add curl
# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /build.tar.gz  ./
RUN tar -xzf ./build.tar.gz && rm ./build.tar.gz
# Execute script
RUN ["chmod", "+x", "./entrypoint.sh"]
ENTRYPOINT ["sh", "./entrypoint.sh"]
ENV NEXT_TELEMETRY_DISABLED=1

# Expose
ARG PORT
ENV PORT=${PORT:-3000}
EXPOSE $PORT
CMD ["sh", "-c", "npm run serve"]