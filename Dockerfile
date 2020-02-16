
ARG ALPINE_VERSION

FROM alpine:${ALPINE_VERSION}

ARG ALPINE_VERSION
ARG UID
ARG GID
ARG KEY_NAME
ARG WORKDIR

ENV WORKDIR=$WORKDIR
ENV ALPINE_VERSION=$ALPINE_VERSION

RUN apk update && \
    apk add alpine-sdk jq && \
    addgroup -g ${GID} builder && \
    adduser --disabled-password --uid ${UID} builder -G builder && \
    addgroup builder abuild

USER builder

RUN mkdir ${HOME}/.abuild && \
    echo "PACKAGER_PRIVKEY="${HOME}/.abuild/${KEY_NAME} > ${HOME}/.abuild/abuild.conf

COPY ./build.sh /usr/local/bin/build
COPY data/abuild.conf /etc/abuild.conf
COPY data/keys/${KEY_NAME}.pub /etc/apk/keys/${KEY_NAME}.pub
COPY data/keys/${KEY_NAME} /home/builder/.abuild/${KEY_NAME}

ENTRYPOINT build
