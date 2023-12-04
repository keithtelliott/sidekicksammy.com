ARG BASE_IMAGE=node:16.13.0-alpine
FROM ${BASE_IMAGE} as base

RUN mkdir /app
WORKDIR /app

# Required for building the api and web distributions
ENV NODE_ENV development

FROM base as dependencies

COPY .yarn .yarn
COPY .yarnrc.yml .yarnrc.yml
COPY package.json package.json
COPY web/package.json web/package.json
COPY api/package.json api/package.json
COPY yarn.lock yarn.lock

RUN --mount=type=cache,target=/root/.yarn/berry/cache \
    --mount=type=cache,target=/root/.cache yarn install --immutable

COPY redwood.toml .
COPY graphql.config.js .

FROM dependencies as web_build

COPY web web
RUN yarn rw build web

FROM dependencies as api_build

COPY api api
RUN yarn rw build api

FROM dependencies

ENV NODE_ENV production

COPY --from=web_build /app/web/dist /app/web/dist
COPY --from=api_build /app/api /app/api
COPY --from=api_build /app/node_modules/.prisma /app/node_modules/.prisma

COPY .fly .fly

## Crontab scheduled jobs

# install curl
RUN apk add --no-cache curl

# Latest releases available at https://github.com/aptible/supercronic/releases
ENV SUPERCRONIC_URL=https://github.com/aptible/supercronic/releases/download/v0.2.28/supercronic-linux-amd64 \
    SUPERCRONIC=supercronic-linux-amd64 \
    SUPERCRONIC_SHA1SUM=fe1a81a8a5809deebebbd7a209a3b97e542e2bcd

RUN curl -fsSLO "$SUPERCRONIC_URL" \
 && echo "${SUPERCRONIC_SHA1SUM}  ${SUPERCRONIC}" | sha1sum -c - \
 && chmod +x "$SUPERCRONIC" \
 && mv "$SUPERCRONIC" "/usr/local/bin/${SUPERCRONIC}" \
 && ln -s "/usr/local/bin/${SUPERCRONIC}" /usr/local/bin/supercronic

COPY crontab crontab

ENTRYPOINT ["sh"]
CMD [".fly/start.sh"]
