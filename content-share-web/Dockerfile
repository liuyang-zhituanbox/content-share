# ---- Dependencies ----
FROM node:lts-alpine AS dependencies
WORKDIR /app
COPY ../content-share-server/package.json yarn.lock ./
RUN yarn install

# ---- Build ----
FROM dependencies AS build
WORKDIR /app
COPY ../content-share-server /app
RUN yarn build

FROM nginx:1.16-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD [ "nginx", "-g", "daemon off;" ]
