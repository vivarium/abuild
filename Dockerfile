
ARG VERSION

FROM alpine:${VERSION}

COPY . .

RUN apk update && \
    apk add alpine-sdk npm && \ 
    mv abuild.conf /etc && \
    sudo addgroup root abuild && \
    npm install --production

ENTRYPOINT ["node", "/lib/main.js"]
