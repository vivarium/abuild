
ARG VERSION=edge

FROM alpine:${VERSION}

COPY . .

RUN apk update && \
    apk add alpine-sdk npm && \ 
    mv abuild.conf /etc && \
    addgroup root abuild && \
    npm install --production

ENTRYPOINT ["node", "/dist/main.js"]
