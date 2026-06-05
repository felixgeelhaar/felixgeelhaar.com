# syntax=docker/dockerfile:1.6
#
# Ships the prebuilt ./dist — `npm run build` needs the sibling
# brand repo (scripts/sync-brand.mjs), which is not part of this
# build context. Build locally first:
#   npm run build && docker build -t ghcr.io/felixgeelhaar/felixgeelhaar-com:vX.Y.Z .
#
# Static site via unprivileged nginx (listens on 8080, runs as uid 101).
FROM nginxinc/nginx-unprivileged:1.27-alpine

# try_files mapping for Astro build.format 'file' (extension-less links).
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 8080
