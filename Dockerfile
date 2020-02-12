
ARG ALPINE_VERSION

FROM alpine:${ALPINE_VERSION}

ARG UID
ARG GID
ARG INPUT_DIR
ARG KEY_NAME
ARG BUILD_FILE

ENV BUILD_FILE=${BUILD_FILE}

RUN apk update && \
    apk add alpine-sdk jq && \
    addgroup -g ${GID} builder && \
    adduser --disabled-password --uid ${UID} builder -G builder && \
    addgroup builder abuild

USER builder

RUN mkdir ${HOME}/.abuild && \
    echo "PACKAGER_PRIVKEY="${HOME}/.abuild/${KEY_NAME} > ${HOME}/.abuild/abuild.conf

COPY ./build.sh /usr/local/bin/build
COPY ${INPUT_DIR}/abuild.conf /etc/abuild.conf
COPY ${INPUT_DIR}/keys/${KEY_NAME}.pub /etc/apk/keys/${KEY_NAME}.pub
COPY ${INPUT_DIR}/keys/${KEY_NAME} /home/builder/.abuild/${KEY_NAME}

ENTRYPOINT build
