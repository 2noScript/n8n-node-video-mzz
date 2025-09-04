FROM docker.n8n.io/n8nio/n8n

USER root

RUN apk add --no-cache docker-cli ffmpeg

RUN addgroup -S docker || true
RUN addgroup node docker

USER node